"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QuizSequence, UserProgress } from "@/types/quiz";
import { quizSequences } from "@/data/questions";
import {
  loadProgress,
  saveProgress,
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
  const [currentSequence, setCurrentSequence] = useState<QuizSequence | null>(null);
  const [sessionScores, setSessionScores] = useState<number[]>([]);

  // Load progress on mount
  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const startSequence = useCallback(
    (sequenceId: string) => {
      const seq = quizSequences.find((s) => s.id === sequenceId);
      if (!seq) return;
      setCurrentSequence(seq);
      setSessionScores([]);
      setScreen("quiz");
    },
    []
  );

  const handleStepAnswer = useCallback(
    (sequenceId: string, stepIndex: number, score: number) => {
      if (!progress) return;

      // Track per-step answer for overall stats
      let updatedProgress: UserProgress = {
        ...progress,
        totalAnswered: progress.totalAnswered + 1,
        totalCorrect:
          score === 100 ? progress.totalCorrect + 1 : progress.totalCorrect,
      };

      updatedProgress = updateStreak(updatedProgress);
      setProgress(updatedProgress);
      saveProgress(updatedProgress);
    },
    [progress]
  );

  const handleComplete = useCallback(
    (scores: number[]) => {
      if (!progress || !currentSequence) return;

      setSessionScores(scores);

      // Save sequence-level score using spaced repetition
      const totalScore = scores.reduce((a, b) => a + b, 0);
      const card = progress.cards[currentSequence.id] || createNewCard(currentSequence.id);
      const updatedCard = calculateNextReview(card, totalScore >= scores.length * 70 ? 100 : totalScore >= scores.length * 40 ? 50 : 0);

      const updatedProgress: UserProgress = {
        ...progress,
        cards: {
          ...progress.cards,
          [currentSequence.id]: updatedCard,
        },
      };

      setProgress(updatedProgress);
      saveProgress(updatedProgress);
      setScreen("result");
    },
    [progress, currentSequence]
  );

  const handleGoHome = useCallback(() => {
    setScreen("home");
    setCurrentSequence(null);
  }, []);

  const handleRetry = useCallback(() => {
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
            sequences={quizSequences}
            onStartSequence={startSequence}
          />
        </motion.div>
      )}

      {screen === "quiz" && currentSequence && (
        <motion.div
          key={`quiz-${currentSequence.id}`}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <QuizScreen
            sequence={currentSequence}
            onStepAnswer={handleStepAnswer}
            onComplete={handleComplete}
            onGoHome={handleGoHome}
          />
        </motion.div>
      )}

      {screen === "result" && currentSequence && (
        <motion.div
          key="result"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ResultScreen
            totalScore={sessionScores.reduce((a, b) => a + b, 0)}
            maxScore={currentSequence.steps.length * 100}
            questionCount={currentSequence.steps.length}
            correctCount={sessionScores.filter((s) => s === 100).length}
            onGoHome={handleGoHome}
            onRetry={handleRetry}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
