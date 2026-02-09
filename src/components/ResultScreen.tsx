"use client";

import { motion } from "framer-motion";

interface ResultScreenProps {
  totalScore: number;
  maxScore: number;
  questionCount: number;
  correctCount: number;
  onGoHome: () => void;
  onRetry: () => void;
}

function getRank(
  percentage: number
): { label: string; color: string; message: string } {
  if (percentage >= 90)
    return {
      label: "S",
      color: "text-yellow-400",
      message: "素晴らしい！プロ級のバスケIQです！",
    };
  if (percentage >= 70)
    return {
      label: "A",
      color: "text-green-400",
      message: "優秀！基本をしっかり理解しています。",
    };
  if (percentage >= 50)
    return {
      label: "B",
      color: "text-blue-400",
      message: "良い線いっています。復習で定着させましょう。",
    };
  if (percentage >= 30)
    return {
      label: "C",
      color: "text-orange-400",
      message: "基礎から復習しましょう。繰り返しが大事です。",
    };
  return {
    label: "D",
    color: "text-red-400",
    message: "まだまだこれから！一つずつ覚えていきましょう。",
  };
}

export default function ResultScreen({
  totalScore,
  maxScore,
  questionCount,
  correctCount,
  onGoHome,
  onRetry,
}: ResultScreenProps) {
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  const rank = getRank(percentage);

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white safe-area-inset items-center justify-center px-6">
      <motion.div
        className="text-center space-y-6 w-full max-w-sm"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Rank */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
        >
          <p className="text-sm text-gray-400 mb-1">あなたのバスケIQ</p>
          <p className={`text-8xl font-black ${rank.color}`}>{rank.label}</p>
        </motion.div>

        {/* Score details */}
        <motion.div
          className="bg-gray-900 rounded-2xl p-5 space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">スコア</span>
            <span className="text-xl font-bold">
              {totalScore} / {maxScore}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, delay: 0.7 }}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">
                {correctCount}
              </p>
              <p className="text-[10px] text-gray-500">正解ステップ</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">
                {questionCount}
              </p>
              <p className="text-[10px] text-gray-500">全ステップ</p>
            </div>
          </div>
        </motion.div>

        {/* Message */}
        <motion.p
          className="text-sm text-gray-300 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {rank.message}
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <button
            className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-4 rounded-xl text-base shadow-lg transition-colors"
            onClick={onRetry}
          >
            もう一度チャレンジ
          </button>
          <button
            className="w-full bg-gray-800 hover:bg-gray-700 active:bg-gray-900 text-gray-300 font-bold py-3 rounded-xl text-sm transition-colors"
            onClick={onGoHome}
          >
            ホームに戻る
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
