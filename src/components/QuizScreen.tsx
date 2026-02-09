"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QuizQuestion, AnswerSpot } from "@/types/quiz";
import TacticalBoard from "./TacticalBoard";
import FeedbackPanel from "./FeedbackPanel";

interface QuizScreenProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (questionId: string, score: number) => void;
  onNext: () => void;
}

const categoryLabels: Record<string, string> = {
  spacing: "スペーシング",
  cutting: "カッティング",
  "drive-kick": "ドライブ合わせ",
};

const categoryColors: Record<string, string> = {
  spacing: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
  cutting: "bg-purple-500/20 text-purple-400 border-purple-500/40",
  "drive-kick": "bg-orange-500/20 text-orange-400 border-orange-500/40",
};

export default function QuizScreen({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onNext,
}: QuizScreenProps) {
  const [phase, setPhase] = useState<
    "animating" | "answering" | "feedback" | "postAnswer"
  >("animating");
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerSpot | null>(null);

  const handleAnimationComplete = useCallback(() => {
    setPhase("answering");
  }, []);

  const handleSelectAnswer = useCallback(
    (spot: AnswerSpot) => {
      if (phase !== "answering") return;
      setSelectedAnswer(spot);
      setPhase("postAnswer");
      onAnswer(question.id, spot.score);
    },
    [phase, onAnswer, question.id]
  );

  const handlePostAnswerComplete = useCallback(() => {
    setPhase("feedback");
  }, []);

  const handleNext = useCallback(() => {
    setPhase("animating");
    setSelectedAnswer(null);
    onNext();
  }, [onNext]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white safe-area-inset">
      {/* Header */}
      <div className="px-4 pt-3 pb-2">
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-gray-500">
            {questionNumber}/{totalQuestions}
          </span>
          <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${(questionNumber / totalQuestions) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Category & Title */}
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full border ${categoryColors[question.category]}`}
          >
            {categoryLabels[question.category]}
          </span>
          <span className="text-[10px] text-gray-500">
            Lv.{question.difficulty}
          </span>
        </div>
        <h2 className="text-base font-bold leading-tight">{question.title}</h2>
      </div>

      {/* Situation description */}
      <div className="px-4 pb-2">
        <p className="text-xs text-gray-400 leading-relaxed bg-gray-900/50 rounded-lg p-2.5">
          {question.description}
        </p>
      </div>

      {/* Tactical Board */}
      <div className="px-3 flex-shrink-0">
        <TacticalBoard
          question={question}
          phase={phase}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={handleSelectAnswer}
          onAnimationComplete={handleAnimationComplete}
          onPostAnswerComplete={handlePostAnswerComplete}
        />
      </div>

      {/* Feedback Panel */}
      <div className="flex-1 px-4 py-3 overflow-y-auto">
        <AnimatePresence mode="wait">
          {phase === "feedback" && selectedAnswer && (
            <FeedbackPanel
              key="feedback"
              question={question}
              selectedAnswer={selectedAnswer}
              onNext={handleNext}
            />
          )}
          {phase === "postAnswer" && selectedAnswer && (
            <motion.div
              key="post-answer"
              className="text-center py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-sm text-blue-400 font-bold mb-1">
                {selectedAnswer.score === 100
                  ? question.correctFeedback
                  : selectedAnswer.score === 50
                  ? "惜しい！"
                  : "残念..."}
              </p>
              <p className="text-xs text-gray-400">
                その後の展開を見てみましょう...
              </p>
            </motion.div>
          )}
          {phase === "answering" && (
            <motion.div
              key="hint"
              className="text-center py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-sm text-gray-400">
                ボード上の
                <span className="text-yellow-400 font-bold">白い丸</span>
                をタップして回答してください
              </p>
            </motion.div>
          )}
          {phase === "animating" && (
            <motion.div
              key="watching"
              className="text-center py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-sm text-gray-400">
                戦術ボードのアニメーションを見てください...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
