"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  QuizQuestion,
  Position,
  AnswerSpot,
  AnimationStep,
} from "@/types/quiz";

interface TacticalBoardProps {
  question: QuizQuestion;
  phase: "animating" | "answering" | "feedback";
  selectedAnswer: AnswerSpot | null;
  onSelectAnswer: (spot: AnswerSpot) => void;
  onAnimationComplete: () => void;
}

function CourtLines() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="none"
    >
      {/* Court outline */}
      <rect
        x="5"
        y="5"
        width="90"
        height="90"
        fill="none"
        stroke="#5a3e28"
        strokeWidth="0.5"
        rx="1"
      />
      {/* Three point arc */}
      <path
        d="M 15 85 L 15 55 Q 15 20 50 15 Q 85 20 85 55 L 85 85"
        fill="none"
        stroke="#5a3e28"
        strokeWidth="0.4"
        strokeDasharray="1.5,0.8"
      />
      {/* Paint / key area */}
      <rect
        x="32"
        y="55"
        width="36"
        height="40"
        fill="none"
        stroke="#5a3e28"
        strokeWidth="0.4"
      />
      {/* Free throw circle */}
      <circle
        cx="50"
        cy="55"
        r="12"
        fill="none"
        stroke="#5a3e28"
        strokeWidth="0.3"
        strokeDasharray="1.5,0.8"
      />
      {/* Basket */}
      <circle
        cx="50"
        cy="88"
        r="1.5"
        fill="none"
        stroke="#5a3e28"
        strokeWidth="0.4"
      />
      <line
        x1="45"
        y1="90"
        x2="55"
        y2="90"
        stroke="#5a3e28"
        strokeWidth="0.4"
      />
      {/* Restricted area */}
      <path
        d="M 42 90 Q 42 78 50 75 Q 58 78 58 90"
        fill="none"
        stroke="#5a3e28"
        strokeWidth="0.3"
      />
      {/* Center line indicator at top */}
      <line
        x1="5"
        y1="5"
        x2="95"
        y2="5"
        stroke="#5a3e28"
        strokeWidth="0.5"
      />
    </svg>
  );
}

function PassArrow({
  from,
  to,
  style,
}: {
  from: Position;
  to: Position;
  style?: string;
}) {
  const dashArray = style === "dashed" ? "2,2" : undefined;
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      preserveAspectRatio="none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="6"
          markerHeight="4"
          refX="5"
          refY="2"
          orient="auto"
        >
          <polygon points="0 0, 6 2, 0 4" fill="#FFD700" />
        </marker>
      </defs>
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke="#FFD700"
        strokeWidth="0.6"
        strokeDasharray={dashArray}
        markerEnd="url(#arrowhead)"
      />
    </motion.svg>
  );
}

function PlayerMarker({
  label,
  position,
  isOffense,
  isTarget,
  hasBall,
  isHighlighted,
  animating,
}: {
  label: string;
  position: Position;
  isOffense: boolean;
  isTarget: boolean;
  hasBall: boolean;
  isHighlighted: boolean;
  animating: boolean;
}) {
  const size = isOffense ? "w-9 h-9" : "w-8 h-8";
  const bgColor = isOffense
    ? isTarget
      ? "bg-yellow-400 border-yellow-600"
      : "bg-blue-500 border-blue-700"
    : "bg-red-400 border-red-600";
  const textColor = isOffense
    ? isTarget
      ? "text-gray-900"
      : "text-white"
    : "text-white";

  return (
    <motion.div
      className={`absolute ${size} rounded-full ${bgColor} border-2 flex items-center justify-center font-bold text-sm ${textColor} shadow-lg`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: "translate(-50%, -50%)",
        zIndex: isTarget ? 20 : 10,
      }}
      animate={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        scale: isHighlighted ? [1, 1.15, 1] : 1,
      }}
      transition={{
        left: { duration: animating ? 0.8 : 0, ease: "easeInOut" },
        top: { duration: animating ? 0.8 : 0, ease: "easeInOut" },
        scale: {
          duration: 0.8,
          repeat: isHighlighted ? Infinity : 0,
          ease: "easeInOut",
        },
      }}
    >
      {label}
      {hasBall && (
        <motion.div
          className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-orange-500 rounded-full border border-orange-700"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}

function AnswerSpotMarker({
  spot,
  phase,
  isSelected,
  onTap,
}: {
  spot: AnswerSpot;
  phase: "answering" | "feedback";
  isSelected: boolean;
  onTap: () => void;
}) {
  const getColor = () => {
    if (phase === "feedback") {
      if (spot.score === 100) return "bg-green-500 border-green-300";
      if (spot.score === 50) return "bg-yellow-500 border-yellow-300";
      return "bg-red-500 border-red-300";
    }
    if (isSelected) return "bg-white border-white";
    return "bg-white/40 border-white/70";
  };

  const getScale = () => {
    if (phase === "feedback" && spot.score === 100) return [1, 1.3, 1];
    if (isSelected) return 1.2;
    return 1;
  };

  return (
    <motion.button
      className={`absolute w-10 h-10 rounded-full ${getColor()} border-2 flex items-center justify-center shadow-lg cursor-pointer z-30`}
      style={{
        left: `${spot.position.x}%`,
        top: `${spot.position.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: getScale(),
        opacity: 1,
      }}
      transition={{
        scale: {
          duration: phase === "feedback" && spot.score === 100 ? 0.6 : 0.3,
          repeat: phase === "feedback" && spot.score === 100 ? 2 : 0,
        },
        opacity: { duration: 0.3 },
      }}
      whileTap={{ scale: 0.9 }}
      onClick={onTap}
      disabled={phase === "feedback"}
      aria-label={`回答スポット`}
    >
      {phase === "feedback" ? (
        <span className="text-white text-xs font-bold">{spot.score}</span>
      ) : (
        <motion.div
          className="w-3 h-3 rounded-full bg-white"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}

export default function TacticalBoard({
  question,
  phase,
  selectedAnswer,
  onSelectAnswer,
  onAnimationComplete,
}: TacticalBoardProps) {
  const [positions, setPositions] = useState<Record<string, Position>>(
    () => question.initialPositions
  );
  const [currentAction, setCurrentAction] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [ballHolder, setBallHolder] = useState<string | null>(null);
  const [activeArrows, setActiveArrows] = useState<
    { from: Position; to: Position; style?: string }[]
  >([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Find initial ball holder
  useEffect(() => {
    for (const action of question.actions) {
      for (const step of action.steps) {
        if (step.hasBall) {
          setBallHolder(step.playerId);
          return;
        }
      }
    }
  }, [question]);

  // Run animation sequence
  useEffect(() => {
    if (phase !== "animating") return;

    const runAction = (actionIndex: number) => {
      if (actionIndex >= question.actions.length) {
        onAnimationComplete();
        return;
      }

      const action = question.actions[actionIndex];
      setAnimating(true);

      // Collect arrows
      const arrows: { from: Position; to: Position; style?: string }[] = [];
      action.steps.forEach((step) => {
        if (step.showArrow && step.type === "pass") {
          const targetStep = action.steps.find(
            (s) => s.playerId !== step.playerId && !s.hasBall
          );
          if (targetStep) {
            arrows.push({
              from: step.from,
              to: targetStep.from,
              style: step.arrowStyle,
            });
          }
        }
        if (step.showArrow && step.type === "dribble") {
          arrows.push({
            from: step.from,
            to: step.to,
            style: step.arrowStyle,
          });
        }
      });
      setActiveArrows(arrows);

      // Update positions
      const newPositions = { ...positions };
      action.steps.forEach((step: AnimationStep) => {
        newPositions[step.playerId] = step.to;
        if (step.hasBall) {
          setBallHolder(step.playerId);
        }
      });
      setPositions(newPositions);

      // Wait for animation + pause, then next action
      const maxDuration = Math.max(...action.steps.map((s) => s.duration));
      const pauseTime = action.pauseAfter || 0;

      timeoutRef.current = setTimeout(() => {
        setAnimating(false);
        setActiveArrows([]);
        setCurrentAction(actionIndex + 1);
        timeoutRef.current = setTimeout(() => {
          runAction(actionIndex + 1);
        }, pauseTime * 1000);
      }, maxDuration * 1000);
    };

    // Small delay before starting
    timeoutRef.current = setTimeout(() => {
      runAction(0);
    }, 800);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  return (
    <div className="relative w-full aspect-square max-w-[400px] mx-auto">
      {/* Court background */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-700 to-amber-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOGI3MzVhIiBzdHJva2Utd2lkdGg9IjAuMyIvPgo8L3N2Zz4=')]" />
        <CourtLines />

        {/* Arrows */}
        <AnimatePresence>
          {activeArrows.map((arrow, i) => (
            <PassArrow
              key={`arrow-${i}`}
              from={arrow.from}
              to={arrow.to}
              style={arrow.style}
            />
          ))}
        </AnimatePresence>

        {/* Player markers */}
        {question.players.map((player) => {
          const pos = positions[player.id] || { x: 0, y: 0 };
          return (
            <PlayerMarker
              key={player.id}
              label={player.label}
              position={pos}
              isOffense={player.isOffense}
              isTarget={player.id === question.targetPlayerId}
              hasBall={ballHolder === player.id}
              isHighlighted={
                phase === "answering" && player.id === question.targetPlayerId
              }
              animating={animating}
            />
          );
        })}

        {/* Answer spots */}
        <AnimatePresence>
          {(phase === "answering" || phase === "feedback") &&
            question.answerSpots.map((spot) => (
              <AnswerSpotMarker
                key={spot.id}
                spot={spot}
                phase={phase}
                isSelected={selectedAnswer?.id === spot.id}
                onTap={() => onSelectAnswer(spot)}
              />
            ))}
        </AnimatePresence>

        {/* Phase indicator */}
        {phase === "animating" && (
          <motion.div
            className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            アニメーション再生中...
          </motion.div>
        )}
        {phase === "answering" && (
          <motion.div
            className="absolute top-2 left-1/2 -translate-x-1/2 bg-yellow-500/80 text-gray-900 text-xs px-3 py-1 rounded-full font-bold"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {question.targetPlayerLabel}番はどこに動く？タップ！
          </motion.div>
        )}
      </div>
    </div>
  );
}
