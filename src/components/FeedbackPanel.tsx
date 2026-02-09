"use client";

import { motion } from "framer-motion";
import { AnswerSpot, QuizQuestion } from "@/types/quiz";

interface FeedbackPanelProps {
  question: QuizQuestion;
  selectedAnswer: AnswerSpot;
  onNext: () => void;
}

function ScoreBadge({ score }: { score: number }) {
  const config = {
    100: {
      bg: "bg-green-500",
      text: "100点",
      emoji: "🎯",
      label: "パーフェクト！",
    },
    50: {
      bg: "bg-yellow-500",
      text: "50点",
      emoji: "🤔",
      label: "惜しい！",
    },
    0: { bg: "bg-red-500", text: "0点", emoji: "💪", label: "次は正解！" },
  }[score] || { bg: "bg-gray-500", text: `${score}点`, emoji: "📝", label: "" };

  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
    >
      <div
        className={`${config.bg} text-white text-2xl font-bold px-4 py-2 rounded-xl shadow-lg`}
      >
        {config.text}
      </div>
      <div className="text-center">
        <span className="text-2xl">{config.emoji}</span>
        <p className="text-sm font-bold text-gray-200">{config.label}</p>
      </div>
    </motion.div>
  );
}

export default function FeedbackPanel({
  question,
  selectedAnswer,
  onNext,
}: FeedbackPanelProps) {
  const isCorrect = selectedAnswer.score === 100;

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Correct feedback banner */}
      {isCorrect && (
        <motion.div
          className="bg-green-500/20 border border-green-500/50 rounded-xl p-3 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-green-400 font-bold text-lg">
            {question.correctFeedback}
          </p>
        </motion.div>
      )}

      {/* Score */}
      <div className="flex justify-center">
        <ScoreBadge score={selectedAnswer.score} />
      </div>

      {/* Explanation for selected answer */}
      <motion.div
        className="bg-gray-800/80 rounded-xl p-4 space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-sm font-bold text-gray-300 flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full" />
          あなたの回答の解説
        </h3>
        <p className="text-sm text-gray-200 leading-relaxed">
          {selectedAnswer.explanation}
        </p>
      </motion.div>

      {/* Concept explanation */}
      <motion.div
        className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-4 space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-sm font-bold text-blue-300">
          📖 この問題のポイント
        </h3>
        <p className="text-sm text-gray-300 leading-relaxed">
          {question.conceptExplanation}
        </p>
      </motion.div>

      {/* Next button */}
      <motion.button
        className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-4 rounded-xl text-lg shadow-lg transition-colors"
        onClick={onNext}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        whileTap={{ scale: 0.97 }}
      >
        次の問題へ
      </motion.button>
    </motion.div>
  );
}
