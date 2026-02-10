"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UserProgress } from "@/types/quiz";
import { possessions } from "@/data/questions";
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
  const [sessionScores, setSessionScores] = useState<number[]>([]);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const handleStartSession = useCallback(() => {
    setSessionScores([]);
    setScreen("quiz");
  }, []);

  const handleSessionComplete = useCallback(
    (possessionScores: number[]) => {
      if (!progress) return;

      setSessionScores(possessionScores);
      const totalScore = possessionScores.reduce((a, b) => a + b, 0);

      // Update progress
      const card = progress.cards["session"] || createNewCard("session");
      const quality = totalScore >= 70 ? 100 : totalScore >= 40 ? 50 : 0;
      const updatedCard = calculateNextReview(card, quality);

      let updatedProgress: UserProgress = {
        ...progress,
        totalAnswered: progress.totalAnswered + possessionScores.length,
        totalCorrect: progress.totalCorrect + possessionScores.filter((s) => s >= 7).length,
        cards: { ...progress.cards, session: updatedCard },
      };
      updatedProgress = updateStreak(updatedProgress);

      setProgress(updatedProgress);
      saveProgress(updatedProgress);
      setScreen("result");
    },
    [progress]
  );

  const handleGoHome = useCallback(() => {
    setScreen("home");
  }, []);

  const handleRetry = useCallback(() => {
    setSessionScores([]);
    setScreen("quiz");
  }, []);

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
        <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <HomeScreen progress={progress} onStartSession={handleStartSession} />
        </motion.div>
      )}

      {screen === "quiz" && (
        <motion.div key="quiz" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
          <QuizScreen
            possessions={possessions}
            onSessionComplete={handleSessionComplete}
            onGoHome={handleGoHome}
          />
        </motion.div>
      )}

      {screen === "result" && (
        <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <ResultScreen
            possessionScores={sessionScores}
            onGoHome={handleGoHome}
            onRetry={handleRetry}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
