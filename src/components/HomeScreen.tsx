"use client";

import { motion } from "framer-motion";
import { UserProgress } from "@/types/quiz";

interface HomeScreenProps {
  progress: UserProgress;
  dueCount: number;
  totalQuestions: number;
  onStartQuiz: () => void;
  onStartCategory: (category: string) => void;
}

const categories = [
  {
    id: "spacing",
    label: "スペーシング",
    icon: "↔️",
    desc: "選手間の距離を保つ",
    color: "from-emerald-600 to-emerald-800",
  },
  {
    id: "cutting",
    label: "カッティング",
    icon: "✂️",
    desc: "ゴールへのカット動作",
    color: "from-purple-600 to-purple-800",
  },
  {
    id: "drive-kick",
    label: "ドライブ合わせ",
    icon: "🏀",
    desc: "ドライブ時の味方の動き",
    color: "from-orange-600 to-orange-800",
  },
];

export default function HomeScreen({
  progress,
  dueCount,
  totalQuestions,
  onStartQuiz,
  onStartCategory,
}: HomeScreenProps) {
  const accuracy =
    progress.totalAnswered > 0
      ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100)
      : 0;

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white safe-area-inset">
      {/* Header with basketball court gradient */}
      <div className="relative overflow-hidden bg-gradient-to-b from-amber-800 to-gray-950 px-6 pt-12 pb-8">
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 100 50" className="w-full h-full">
            <circle
              cx="50"
              cy="25"
              r="15"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
            />
            <line
              x1="0"
              y1="25"
              x2="100"
              y2="25"
              stroke="white"
              strokeWidth="0.3"
            />
          </svg>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl font-black tracking-tight">
            バスケIQ
            <br />
            <span className="text-amber-400">診断クイズ</span>
          </h1>
          <p className="text-sm text-gray-300 mt-2">
            戦術ボードで学ぶバスケの動き方
          </p>
        </motion.div>
      </div>

      {/* Stats cards */}
      <div className="px-4 -mt-3">
        <motion.div
          className="grid grid-cols-3 gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-gray-900 rounded-xl p-3 text-center border border-gray-800">
            <p className="text-xl font-bold text-blue-400">
              {progress.totalAnswered}
            </p>
            <p className="text-[10px] text-gray-500">回答数</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-3 text-center border border-gray-800">
            <p className="text-xl font-bold text-green-400">{accuracy}%</p>
            <p className="text-[10px] text-gray-500">正答率</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-3 text-center border border-gray-800">
            <p className="text-xl font-bold text-orange-400">
              {progress.streakDays}
            </p>
            <p className="text-[10px] text-gray-500">連続日数</p>
          </div>
        </motion.div>
      </div>

      {/* Start quiz button */}
      <div className="px-4 mt-5">
        <motion.button
          className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-4 rounded-2xl text-lg shadow-lg shadow-blue-600/20 transition-colors"
          onClick={onStartQuiz}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {dueCount > 0 ? (
            <>
              復習する
              <span className="ml-2 bg-blue-500 px-2 py-0.5 rounded-full text-sm">
                {dueCount}問
              </span>
            </>
          ) : progress.totalAnswered > 0 ? (
            "もう一度チャレンジ"
          ) : (
            "クイズを始める"
          )}
        </motion.button>
        <p className="text-center text-xs text-gray-600 mt-2">
          全{totalQuestions}問から出題
        </p>
      </div>

      {/* Category selection */}
      <div className="px-4 mt-6 flex-1">
        <h2 className="text-sm font-bold text-gray-400 mb-3">
          カテゴリ別に学習
        </h2>
        <div className="space-y-2">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.id}
              className={`w-full flex items-center gap-3 bg-gradient-to-r ${cat.color} rounded-xl p-4 text-left transition-transform active:scale-[0.98]`}
              onClick={() => onStartCategory(cat.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="text-2xl">{cat.icon}</span>
              <div>
                <p className="font-bold text-sm">{cat.label}</p>
                <p className="text-[10px] text-gray-300">{cat.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-4 text-center">
        <p className="text-[10px] text-gray-700">
          忘却曲線アルゴリズムで効率的に学習
        </p>
      </div>
    </div>
  );
}
