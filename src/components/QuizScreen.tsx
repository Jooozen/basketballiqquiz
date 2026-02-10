"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Possession, DecisionStep, AnswerSpot, Position, Action } from "@/types/quiz";
import TacticalBoard from "./TacticalBoard";
import FeedbackPanel from "./FeedbackPanel";

interface QuizScreenProps {
  possessions: Possession[];
  onSessionComplete: (possessionScores: number[]) => void;
  onGoHome: () => void;
}

function computeCanonicalState(
  initialPositions: Record<string, Position>,
  initialBallHolder: string,
  steps: DecisionStep[],
  upToStep: number
): { positions: Record<string, Position>; ballHolder: string } {
  let positions = { ...initialPositions };
  let ballHolder = initialBallHolder;

  for (let i = 0; i < upToStep; i++) {
    const step = steps[i];
    for (const action of step.preAnimations) {
      for (const s of action.steps) positions[s.playerId] = s.to;
      if (action.ballPass) ballHolder = action.ballPass.to;
      else {
        const bs = action.steps.find((s) => s.hasBall && (s.type === "dribble" || s.type === "cut"));
        if (bs) ballHolder = bs.playerId;
      }
    }
    const correct = step.answerSpots.find((a) => a.score === 100);
    if (correct && step.postAnswerActions?.[correct.id]) {
      for (const action of step.postAnswerActions[correct.id]) {
        for (const s of action.steps) positions[s.playerId] = s.to;
        if (action.ballPass) ballHolder = action.ballPass.to;
        else {
          const bs = action.steps.find((s) => s.hasBall && (s.type === "dribble" || s.type === "cut"));
          if (bs) ballHolder = bs.playerId;
        }
      }
    }
  }
  return { positions, ballHolder };
}

// Calculate possession score: decisions (60%) + shot quality (40%)
function calcPossessionScore(decisionScores: number[], shootQuality: number): number {
  const avgDecision = decisionScores.length > 0
    ? decisionScores.reduce((a, b) => a + b, 0) / decisionScores.length / 100
    : 0;
  const shotFactor = shootQuality / 10;
  return Math.round(avgDecision * 6 + shotFactor * 4);
}

export default function QuizScreen({ possessions, onSessionComplete, onGoHome }: QuizScreenProps) {
  const [possessionIndex, setPossessionIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState<"animating" | "answering" | "feedback" | "postAnswer" | "shootResult">("animating");
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerSpot | null>(null);
  const [decisionScores, setDecisionScores] = useState<number[]>([]);
  const [possessionScores, setPossessionScores] = useState<number[]>([]);
  const [shootScore, setShootScore] = useState<number>(0);

  const possession = possessions[possessionIndex];
  const step = possession.steps[stepIndex];
  const totalPossessions = possessions.length;

  const { positions: startPositions, ballHolder: startBallHolder } = useMemo(
    () => computeCanonicalState(possession.initialPositions, possession.initialBallHolder, possession.steps, stepIndex),
    [possession, stepIndex]
  );

  const cumulativeTotal = possessionScores.reduce((a, b) => a + b, 0);

  const handleAnimationComplete = useCallback(() => setPhase("answering"), []);

  const handleSelectAnswer = useCallback((spot: AnswerSpot) => {
    if (phase !== "answering") return;
    setSelectedAnswer(spot);
    setPhase("postAnswer");
    setDecisionScores((prev) => [...prev, spot.score]);
  }, [phase]);

  const handlePostAnswerComplete = useCallback(() => setPhase("feedback"), []);

  // Move to next step within same possession
  const handleNextStep = useCallback(() => {
    if (stepIndex + 1 >= possession.steps.length) {
      // No more steps - auto shoot at last step quality
      const score = calcPossessionScore(decisionScores, step.shootQuality);
      setShootScore(score);
      setPhase("shootResult");
    } else {
      setStepIndex((prev) => prev + 1);
      setPhase("animating");
      setSelectedAnswer(null);
    }
  }, [stepIndex, possession.steps.length, decisionScores, step.shootQuality]);

  // User presses SHOOT
  const handleShoot = useCallback(() => {
    const score = calcPossessionScore(decisionScores, step.shootQuality);
    setShootScore(score);
    setPhase("shootResult");
  }, [decisionScores, step.shootQuality]);

  // Move to next possession
  const handleNextPossession = useCallback(() => {
    const newPossessionScores = [...possessionScores, shootScore];
    setPossessionScores(newPossessionScores);

    if (possessionIndex + 1 >= totalPossessions) {
      onSessionComplete(newPossessionScores);
    } else {
      setPossessionIndex((prev) => prev + 1);
      setStepIndex(0);
      setDecisionScores([]);
      setSelectedAnswer(null);
      setShootScore(0);
      setPhase("animating");
    }
  }, [possessionIndex, totalPossessions, possessionScores, shootScore, onSessionComplete]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white safe-area-inset">
      {/* Header */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-gray-500">
            {possessionIndex + 1}/{totalPossessions}
          </span>
          <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500 rounded-full"
              animate={{ width: `${((possessionIndex + 1) / totalPossessions) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-xs font-bold text-amber-400">
            {cumulativeTotal}pt
          </span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] px-2 py-0.5 rounded-full border bg-amber-500/20 text-amber-400 border-amber-500/40">
            Shot {possessionIndex + 1}
          </span>
          {phase !== "shootResult" && (
            <span className="text-[10px] text-gray-500">
              Step {stepIndex + 1}/{possession.steps.length}
            </span>
          )}
        </div>
        <h2 className="text-sm font-bold leading-tight">{possession.title}</h2>
      </div>

      {/* Step description */}
      {phase !== "shootResult" && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-400 leading-relaxed bg-gray-900/50 rounded-lg p-2.5">
            {step.description}
          </p>
        </div>
      )}

      {/* Tactical Board */}
      <div className="px-3 flex-shrink-0">
        <TacticalBoard
          key={`p${possessionIndex}-s${stepIndex}`}
          players={possession.players}
          startPositions={startPositions}
          startBallHolder={startBallHolder}
          step={step}
          phase={phase}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={handleSelectAnswer}
          onAnimationComplete={handleAnimationComplete}
          onPostAnswerComplete={handlePostAnswerComplete}
        />
      </div>

      {/* Shoot button - always visible during answering */}
      <AnimatePresence>
        {phase === "answering" && (
          <motion.div
            className="px-4 mt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <button
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 active:from-red-700 active:to-orange-700 text-white font-bold py-3 rounded-xl text-base shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 transition-all"
              onClick={handleShoot}
            >
              <span className="text-lg">🏀</span> シュート！
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom section */}
      <div className="flex-1 px-4 py-3 overflow-y-auto">
        <AnimatePresence mode="wait">
          {phase === "shootResult" && (
            <motion.div
              key="shoot-result"
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-1">このポゼッションのスコア</p>
                <motion.p
                  className="text-5xl font-black text-amber-400"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                >
                  {shootScore}<span className="text-2xl text-gray-500">/10</span>
                </motion.p>
              </div>

              <motion.div
                className="bg-gray-800/80 rounded-xl p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-sm font-bold text-gray-300 mb-1">シュートセレクション</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {step.shootExplanation}
                </p>
                {shootScore >= 7 && (
                  <p className="text-xs text-green-400 mt-2 font-bold">ナイスショットセレクション！</p>
                )}
                {shootScore >= 4 && shootScore < 7 && (
                  <p className="text-xs text-yellow-400 mt-2 font-bold">悪くないが、もっと良いシュートチャンスを作れたかも。</p>
                )}
                {shootScore < 4 && (
                  <p className="text-xs text-red-400 mt-2 font-bold">もっとパスを回して良いシュートを作ろう！</p>
                )}
              </motion.div>

              <motion.button
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl text-lg shadow-lg transition-colors"
                onClick={handleNextPossession}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileTap={{ scale: 0.97 }}
              >
                {possessionIndex + 1 >= totalPossessions ? "結果を見る" : "次のポゼッションへ"}
              </motion.button>
            </motion.div>
          )}

          {phase === "feedback" && selectedAnswer && (
            <FeedbackPanel
              key="feedback"
              step={step}
              selectedAnswer={selectedAnswer}
              onNext={handleNextStep}
              isLastStep={stepIndex + 1 >= possession.steps.length}
            />
          )}

          {phase === "postAnswer" && selectedAnswer && (
            <motion.div key="post" className="text-center py-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-sm text-blue-400 font-bold mb-1">
                {selectedAnswer.score === 100 ? step.feedback : selectedAnswer.score === 50 ? "惜しい！" : "残念..."}
              </p>
              <p className="text-xs text-gray-400">その後の展開を見てみましょう...</p>
            </motion.div>
          )}

          {phase === "answering" && (
            <motion.div key="hint" className="text-center py-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-xs text-gray-500">
                移動先をタップするか、
                <span className="text-red-400 font-bold">シュート</span>
                を選択
              </p>
            </motion.div>
          )}

          {phase === "animating" && (
            <motion.div key="watching" className="text-center py-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-sm text-gray-400">プレーを見てください...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        className="absolute top-3 right-3 text-xs text-gray-600 hover:text-gray-400 transition-colors z-50"
        onClick={onGoHome}
      >
        戻る
      </button>
    </div>
  );
}
