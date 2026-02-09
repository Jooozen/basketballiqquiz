"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QuizQuestion } from "@/types/quiz";
import { sampleQuestions } from "@/data/questions";
import { UserProgress } from "@/types/quiz";
import {
  loadProgress,
  saveProgress,
  getDueQuestions,
  createNewCard,
  calculateNextReview,
  updateStreak,
} from "@/lib/spacedRepetition";
import HomeScreen from "@/components/HomeScreen";
import QuizScreen from "@/components/QuizScreen";
import ResultScreen from "@/components/ResultScreen";

type Screen = "home" | "quiz" | "result";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("home");
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [quizQueue, setQuizQueue] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionScores, setSessionScores] = useState<number[]>([]);

  // Load progress on mount
  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const allQuestionIds = sampleQuestions.map((q) => q.id);

  const startQuiz = useCallback(
    (categoryFilter?: string) => {
      if (!progress) return;

      let questions: QuizQuestion[];

      if (categoryFilter) {
        questions = sampleQuestions.filter(
          (q) => q.category === categoryFilter
        );
      } else {
        // Use spaced repetition to determine order
        const dueIds = getDueQuestions(progress, allQuestionIds);
        if (dueIds.length > 0) {
          questions = dueIds
            .map((id) => sampleQuestions.find((q) => q.id === id)!)
            .filter(Boolean);
        } else {
          // All reviewed, show all
          questions = [...sampleQuestions];
        }
      }

      setQuizQueue(questions);
      setCurrentIndex(0);
      setSessionScores([]);
      setScreen("quiz");
    },
    [progress, allQuestionIds]
  );

  const handleAnswer = useCallback(
    (questionId: string, score: number) => {
      if (!progress) return;

      const card = progress.cards[questionId] || createNewCard(questionId);
      const updatedCard = calculateNextReview(card, score);

      let updatedProgress: UserProgress = {
        ...progress,
        cards: {
          ...progress.cards,
          [questionId]: updatedCard,
        },
        totalAnswered: progress.totalAnswered + 1,
        totalCorrect:
          score === 100 ? progress.totalCorrect + 1 : progress.totalCorrect,
      };

      updatedProgress = updateStreak(updatedProgress);
      setProgress(updatedProgress);
      saveProgress(updatedProgress);
      setSessionScores((prev) => [...prev, score]);
    },
    [progress]
  );

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= quizQueue.length) {
      setScreen("result");
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, quizQueue.length]);

  const handleGoHome = useCallback(() => {
    setScreen("home");
  }, []);

  const handleRetry = useCallback(() => {
    setCurrentIndex(0);
    setSessionScores([]);
    setScreen("quiz");
  }, []);

  // Loading state
  if (!progress) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <motion.div
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  const dueCount = getDueQuestions(progress, allQuestionIds).length;

  return (
    <AnimatePresence mode="wait">
      {screen === "home" && (
        <motion.div
          key="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <HomeScreen
            progress={progress}
            dueCount={dueCount}
            totalQuestions={sampleQuestions.length}
            onStartQuiz={() => startQuiz()}
            onStartCategory={(cat) => startQuiz(cat)}
          />
        </motion.div>
      )}

      {screen === "quiz" && quizQueue[currentIndex] && (
        <motion.div
          key={`quiz-${quizQueue[currentIndex].id}`}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <QuizScreen
            question={quizQueue[currentIndex]}
            questionNumber={currentIndex + 1}
            totalQuestions={quizQueue.length}
            onAnswer={handleAnswer}
            onNext={handleNext}
          />
        </motion.div>
      )}

      {screen === "result" && (
        <motion.div
          key="result"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ResultScreen
            totalScore={sessionScores.reduce((a, b) => a + b, 0)}
            maxScore={quizQueue.length * 100}
            questionCount={quizQueue.length}
            correctCount={sessionScores.filter((s) => s === 100).length}
            onGoHome={handleGoHome}
            onRetry={handleRetry}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
