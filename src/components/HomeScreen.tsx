"use client";

import { motion } from "framer-motion";
import { UserProgress } from "@/types/quiz";

interface HomeScreenProps {
  progress: UserProgress;
  onStartSession: () => void;
}

export default function HomeScreen({ progress, onStartSession }: HomeScreenProps) {
  const accuracy =
    progress.totalAnswered > 0
      ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100)
      : 0;

  const bestScore = progress.cards["session"]?.lastScore;

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white safe-area-inset">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-amber-800 to-gray-950 px-6 pt-12 pb-8">
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 100 50" className="w-full h-full">
            <circle cx="50" cy="25" r="15" fill="none" stroke="white" strokeWidth="0.5" />
            <line x1="0" y1="25" x2="100" y2="25" stroke="white" strokeWidth="0.3" />
          </svg>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-2xl font-black tracking-tight">
            バスケIQ
            <br />
            <span className="text-amber-400">診断クイズ</span>
          </h1>
          <p className="text-sm text-gray-300 mt-2">
            10ポゼッション・100点満点のバスケIQ診断
          </p>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="px-4 -mt-3">
        <motion.div
          className="grid grid-cols-3 gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-gray-900 rounded-xl p-3 text-center border border-gray-800">
            <p className="text-xl font-bold text-blue-400">{progress.totalAnswered}</p>
            <p className="text-[10px] text-gray-500">回答数</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-3 text-center border border-gray-800">
            <p className="text-xl font-bold text-green-400">{accuracy}%</p>
            <p className="text-[10px] text-gray-500">正答率</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-3 text-center border border-gray-800">
            <p className="text-xl font-bold text-orange-400">{progress.streakDays}</p>
            <p className="text-[10px] text-gray-500">連続日数</p>
          </div>
        </motion.div>
      </div>

      {/* Main CTA */}
      <div className="px-4 mt-8 flex-1 flex flex-col items-center justify-center gap-6">
        {bestScore !== undefined && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-xs text-gray-500 mb-1">前回のスコア</p>
            <p className="text-3xl font-black text-amber-400">{bestScore}<span className="text-lg text-gray-500">/100</span></p>
          </motion.div>
        )}

        <motion.div
          className="w-full space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Session description */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h3 className="text-sm font-bold mb-2">セッション内容</h3>
            <div className="space-y-1.5 text-xs text-gray-400">
              <p>• 10ポゼッション（10シュート）</p>
              <p>• 各ポゼッション最大10点 = 合計100点</p>
              <p>• カット・スクリーン・ドリブル・パスの判断</p>
              <p>• シュートセレクションも評価</p>
            </div>
          </div>

          <motion.button
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 active:from-amber-700 active:to-orange-700 text-white font-bold py-5 rounded-2xl text-lg shadow-lg shadow-amber-600/20 transition-all"
            onClick={onStartSession}
            whileTap={{ scale: 0.97 }}
          >
            {progress.totalAnswered > 0 ? "もう一度チャレンジ" : "セッション開始"}
          </motion.button>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="px-4 py-4 text-center">
        <p className="text-[10px] text-gray-700">忘却曲線アルゴリズムで効率的に学習</p>
      </div>
    </div>
  );
}
