"use client";

import { motion } from "framer-motion";

interface ResultScreenProps {
  possessionScores: number[];
  onGoHome: () => void;
  onRetry: () => void;
}

function getRank(total: number): { label: string; color: string; message: string } {
  if (total >= 90) return { label: "S", color: "text-yellow-400", message: "プロ級のバスケIQ！素晴らしい判断力です。" };
  if (total >= 70) return { label: "A", color: "text-green-400", message: "優秀！基本をしっかり理解しています。" };
  if (total >= 50) return { label: "B", color: "text-blue-400", message: "良い線いっています。復習で定着させましょう。" };
  if (total >= 30) return { label: "C", color: "text-orange-400", message: "基礎から復習しましょう。繰り返しが大事です。" };
  return { label: "D", color: "text-red-400", message: "まだまだこれから！一つずつ覚えていきましょう。" };
}

export default function ResultScreen({ possessionScores, onGoHome, onRetry }: ResultScreenProps) {
  const totalScore = possessionScores.reduce((a, b) => a + b, 0);
  const rank = getRank(totalScore);

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

        {/* Total score */}
        <motion.div
          className="bg-gray-900 rounded-2xl p-5 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">合計スコア</span>
            <span className="text-2xl font-bold text-amber-400">
              {totalScore} <span className="text-sm text-gray-500">/ 100</span>
            </span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${totalScore}%` }}
              transition={{ duration: 1, delay: 0.7 }}
            />
          </div>

          {/* Per-possession breakdown */}
          <div className="grid grid-cols-5 gap-1.5">
            {possessionScores.map((score, i) => (
              <motion.div
                key={i}
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.05 }}
              >
                <div className={`text-lg font-bold ${score >= 7 ? "text-green-400" : score >= 4 ? "text-yellow-400" : "text-red-400"}`}>
                  {score}
                </div>
                <div className="text-[8px] text-gray-600">#{i + 1}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Message */}
        <motion.p
          className="text-sm text-gray-300 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {rank.message}
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          <button
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-4 rounded-xl text-base shadow-lg transition-colors"
            onClick={onRetry}
          >
            もう一度チャレンジ
          </button>
          <button
            className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-3 rounded-xl text-sm transition-colors"
            onClick={onGoHome}
          >
            ホームに戻る
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
