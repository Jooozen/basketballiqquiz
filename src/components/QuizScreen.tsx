"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QuizSequence, QuizStep, AnswerSpot, Position, Action } from "@/types/quiz";
import TacticalBoard from "./TacticalBoard";
import FeedbackPanel from "./FeedbackPanel";

interface QuizScreenProps {
  sequence: QuizSequence;
  onStepAnswer: (sequenceId: string, stepIndex: number, score: number) => void;
  onComplete: (scores: number[]) => void;
  onGoHome: () => void;
}

// Compute canonical positions after N steps (assuming correct answers)
function computeCanonicalState(
  initialPositions: Record<string, Position>,
  initialBallHolder: string,
  steps: QuizStep[],
  upToStep: number
): { positions: Record<string, Position>; ballHolder: string } {
  let positions = { ...initialPositions };
  let ballHolder = initialBallHolder;

  for (let i = 0; i < upToStep; i++) {
    const step = steps[i];

    // Apply preAnimations
    for (const action of step.preAnimations) {
      positions = applyAction(positions, action);
      ballHolder = applyBallChange(ballHolder, action);
    }

    // Apply correct answer's postAnswerActions
    const correctAnswer = step.answerSpots.find((a) => a.score === 100);
    if (correctAnswer && step.postAnswerActions?.[correctAnswer.id]) {
      for (const action of step.postAnswerActions[correctAnswer.id]) {
        positions = applyAction(positions, action);
        ballHolder = applyBallChange(ballHolder, action);
      }
    }
  }

  return { positions, ballHolder };
}

function applyAction(
  positions: Record<string, Position>,
  action: Action
): Record<string, Position> {
  const newPositions = { ...positions };
  for (const s of action.steps) {
    newPositions[s.playerId] = s.to;
  }
  return newPositions;
}

function applyBallChange(ballHolder: string, action: Action): string {
  if (action.ballPass) {
    return action.ballPass.to;
  }
  const ballStep = action.steps.find(
    (s) => s.hasBall && (s.type === "dribble" || s.type === "cut")
  );
  if (ballStep) return ballStep.playerId;
  return ballHolder;
}

export default function QuizScreen({
  sequence,
  onStepAnswer,
  onComplete,
  onGoHome,
}: QuizScreenProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState<
    "animating" | "answering" | "feedback" | "postAnswer"
  >("animating");
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerSpot | null>(null);
  const [scores, setScores] = useState<number[]>([]);

  const step = sequence.steps[stepIndex];
  const totalSteps = sequence.steps.length;

  // Compute canonical positions for current step
  const { positions: startPositions, ballHolder: startBallHolder } = useMemo(
    () =>
      computeCanonicalState(
        sequence.initialPositions,
        sequence.initialBallHolder,
        sequence.steps,
        stepIndex
      ),
    [sequence, stepIndex]
  );

  const cumulativeScore = scores.reduce((a, b) => a + b, 0);

  const handleAnimationComplete = useCallback(() => {
    setPhase("answering");
  }, []);

  const handleSelectAnswer = useCallback(
    (spot: AnswerSpot) => {
      if (phase !== "answering") return;
      setSelectedAnswer(spot);
      setPhase("postAnswer");
      setScores((prev) => [...prev, spot.score]);
      onStepAnswer(sequence.id, stepIndex, spot.score);
    },
    [phase, onStepAnswer, sequence.id, stepIndex]
  );

  const handlePostAnswerComplete = useCallback(() => {
    setPhase("feedback");
  }, []);

  const handleNext = useCallback(() => {
    const newScores = [...scores];
    if (stepIndex + 1 >= totalSteps) {
      onComplete(newScores);
    } else {
      setStepIndex((prev) => prev + 1);
      setPhase("animating");
      setSelectedAnswer(null);
    }
  }, [stepIndex, totalSteps, onComplete, scores]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white safe-area-inset">
      {/* Header */}
      <div className="px-4 pt-3 pb-2">
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-gray-500">
            {stepIndex + 1}/{totalSteps}
          </span>
          <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${((stepIndex + 1) / totalSteps) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-xs text-gray-500">
            {cumulativeScore}pt
          </span>
        </div>

        {/* Title */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] px-2 py-0.5 rounded-full border bg-blue-500/20 text-blue-400 border-blue-500/40">
            Lv.{sequence.difficulty}
          </span>
          <span className="text-[10px] text-gray-500">
            Step {stepIndex + 1}
          </span>
        </div>
        <h2 className="text-base font-bold leading-tight">
          {sequence.title}
        </h2>
      </div>

      {/* Step description */}
      <div className="px-4 pb-2">
        <p className="text-xs text-gray-400 leading-relaxed bg-gray-900/50 rounded-lg p-2.5">
          {step.description}
        </p>
      </div>

      {/* Tactical Board - key forces remount on step change */}
      <div className="px-3 flex-shrink-0">
        <TacticalBoard
          key={`step-${stepIndex}`}
          players={sequence.players}
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

      {/* Feedback Panel */}
      <div className="flex-1 px-4 py-3 overflow-y-auto">
        <AnimatePresence mode="wait">
          {phase === "feedback" && selectedAnswer && (
            <FeedbackPanel
              key="feedback"
              step={step}
              selectedAnswer={selectedAnswer}
              onNext={handleNext}
              isLastStep={stepIndex + 1 >= totalSteps}
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
                  ? step.feedback
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

      {/* Home button (small, top right) */}
      <button
        className="absolute top-3 right-3 text-xs text-gray-600 hover:text-gray-400 transition-colors z-50"
        onClick={onGoHome}
      >
        戻る
      </button>
    </div>
  );
}
