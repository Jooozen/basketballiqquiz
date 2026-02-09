"use client";

import { motion } from "framer-motion";
import { UserProgress, QuizSequence } from "@/types/quiz";

interface HomeScreenProps {
  progress: UserProgress;
  sequences: QuizSequence[];
  onStartSequence: (sequenceId: string) => void;
}

const difficultyLabels: Record<number, { label: string; color: string }> = {
  1: { label: "初級", color: "bg-green-500/20 text-green-400 border-green-500/40" },
  2: { label: "中級", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40" },
  3: { label: "上級", color: "bg-red-500/20 text-red-400 border-red-500/40" },
};

export default function HomeScreen({
  progress,
  sequences,
  onStartSequence,
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

      {/* Sequence cards */}
      <div className="px-4 mt-6 flex-1">
        <h2 className="text-sm font-bold text-gray-400 mb-3">
          プレーを選んで挑戦
        </h2>
        <div className="space-y-3">
          {sequences.map((seq, i) => {
            const diff = difficultyLabels[seq.difficulty] || difficultyLabels[1];
            const bestScore = progress.cards[seq.id]?.lastScore;
            return (
              <motion.button
                key={seq.id}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-left transition-transform active:scale-[0.98]"
                onClick={() => onStartSequence(seq.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border ${diff.color}`}
                      >
                        {diff.label}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {seq.steps.length}ステップ
                      </span>
                    </div>
                    <p className="font-bold text-sm">{seq.title}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {seq.subtitle}
                    </p>
                  </div>
                  {bestScore !== undefined && (
                    <div className="text-right ml-3">
                      <p className="text-lg font-bold text-blue-400">
                        {bestScore}
                      </p>
                      <p className="text-[9px] text-gray-500">最高点</p>
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
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
