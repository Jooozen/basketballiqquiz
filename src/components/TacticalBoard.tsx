"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  QuizQuestion,
  Position,
  AnswerSpot,
  Action,
} from "@/types/quiz";

interface TacticalBoardProps {
  question: QuizQuestion;
  phase: "animating" | "answering" | "feedback" | "postAnswer";
  selectedAnswer: AnswerSpot | null;
  onSelectAnswer: (spot: AnswerSpot) => void;
  onAnimationComplete: () => void;
  onPostAnswerComplete: () => void;
}

// Court lines with RIM AT TOP
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
      {/* Basket at TOP */}
      <circle
        cx="50"
        cy="12"
        r="1.5"
        fill="none"
        stroke="#5a3e28"
        strokeWidth="0.4"
      />
      <line
        x1="45"
        y1="10"
        x2="55"
        y2="10"
        stroke="#5a3e28"
        strokeWidth="0.5"
      />
      {/* Backboard */}
      <line
        x1="43"
        y1="8"
        x2="57"
        y2="8"
        stroke="#5a3e28"
        strokeWidth="0.6"
      />
      {/* Restricted area at top */}
      <path
        d="M 42 10 Q 42 22 50 25 Q 58 22 58 10"
        fill="none"
        stroke="#5a3e28"
        strokeWidth="0.3"
      />
      {/* Paint / key area at top */}
      <rect
        x="32"
        y="5"
        width="36"
        height="40"
        fill="none"
        stroke="#5a3e28"
        strokeWidth="0.4"
      />
      {/* Free throw circle */}
      <circle
        cx="50"
        cy="45"
        r="12"
        fill="none"
        stroke="#5a3e28"
        strokeWidth="0.3"
        strokeDasharray="1.5,0.8"
      />
      {/* Three point arc - opens downward */}
      <path
        d="M 15 15 L 15 45 Q 15 80 50 85 Q 85 80 85 45 L 85 15"
        fill="none"
        stroke="#5a3e28"
        strokeWidth="0.4"
        strokeDasharray="1.5,0.8"
      />
      {/* Half-court line at bottom */}
      <line
        x1="5"
        y1="95"
        x2="95"
        y2="95"
        stroke="#5a3e28"
        strokeWidth="0.5"
      />
    </svg>
  );
}

// Animated ball that moves smoothly between holders
function BallMarker({
  position,
  animDuration,
}: {
  position: Position;
  animDuration: number;
}) {
  return (
    <motion.div
      className="absolute z-25 pointer-events-none"
      animate={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
      transition={{
        duration: animDuration,
        ease: "easeInOut",
      }}
      style={{
        transform: "translate(-50%, -50%)",
        marginLeft: "14px",
        marginTop: "-10px",
      }}
    >
      <div className="w-4 h-4 bg-orange-500 rounded-full border-2 border-orange-700 shadow-lg shadow-orange-500/50" />
    </motion.div>
  );
}

// Pass line animation (ball traveling from A to B)
function PassLine({
  from,
  to,
  active,
}: {
  from: Position;
  to: Position;
  active: boolean;
}) {
  if (!active) return null;
  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 w-full h-full pointer-events-none z-15"
      preserveAspectRatio="none"
    >
      <defs>
        <marker
          id="passArrow"
          markerWidth="5"
          markerHeight="4"
          refX="4"
          refY="2"
          orient="auto"
        >
          <polygon points="0 0, 5 2, 0 4" fill="#FFD700" opacity="0.8" />
        </marker>
      </defs>
      <motion.line
        x1={from.x}
        y1={from.y}
        x2={from.x}
        y2={from.y}
        animate={{ x2: to.x, y2: to.y }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        stroke="#FFD700"
        strokeWidth="0.5"
        strokeDasharray="2,1"
        markerEnd="url(#passArrow)"
        opacity="0.7"
      />
    </svg>
  );
}

function PlayerMarker({
  label,
  position,
  isOffense,
  isTarget,
  isHighlighted,
  animDuration,
}: {
  label: string;
  position: Position;
  isOffense: boolean;
  isTarget: boolean;
  isHighlighted: boolean;
  animDuration: number;
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
      animate={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        scale: isHighlighted ? [1, 1.15, 1] : 1,
      }}
      transition={{
        left: { duration: animDuration, ease: "easeInOut" },
        top: { duration: animDuration, ease: "easeInOut" },
        scale: {
          duration: 0.8,
          repeat: isHighlighted ? Infinity : 0,
          ease: "easeInOut",
        },
      }}
      style={{
        transform: "translate(-50%, -50%)",
        zIndex: isTarget ? 20 : 10,
      }}
    >
      {label}
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
  phase: "answering" | "feedback" | "postAnswer";
  isSelected: boolean;
  onTap: () => void;
}) {
  const getColor = () => {
    if (phase === "feedback" || phase === "postAnswer") {
      if (spot.score === 100) return "bg-green-500 border-green-300";
      if (spot.score === 50) return "bg-yellow-500 border-yellow-300";
      return "bg-red-500 border-red-300";
    }
    if (isSelected) return "bg-white border-white";
    return "bg-white/40 border-white/70";
  };

  const getScale = () => {
    if ((phase === "feedback" || phase === "postAnswer") && spot.score === 100) return [1, 1.3, 1];
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
        opacity: phase === "postAnswer" && !isSelected ? 0 : 1,
      }}
      transition={{
        scale: {
          duration: (phase === "feedback" || phase === "postAnswer") && spot.score === 100 ? 0.6 : 0.3,
          repeat: phase === "feedback" && spot.score === 100 ? 2 : 0,
        },
        opacity: { duration: 0.3 },
      }}
      whileTap={{ scale: 0.9 }}
      onClick={onTap}
      disabled={phase !== "answering"}
      aria-label={`回答スポット`}
    >
      {phase === "feedback" || phase === "postAnswer" ? (
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
  onPostAnswerComplete,
}: TacticalBoardProps) {
  const [positions, setPositions] = useState<Record<string, Position>>(
    () => ({ ...question.initialPositions })
  );
  const [ballPosition, setBallPosition] = useState<Position>(
    () => question.initialPositions[question.initialBallHolder]
  );
  const [ballAnimDuration, setBallAnimDuration] = useState(0);
  const [playerAnimDuration, setPlayerAnimDuration] = useState(0);
  const [passLine, setPassLine] = useState<{ from: Position; to: Position } | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const loopRef = useRef(true);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const addTimeout = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timeoutsRef.current.push(t);
    return t;
  }, []);

  // Reset state when question changes
  useEffect(() => {
    return () => {
      clearAllTimeouts();
      loopRef.current = false;
    };
  }, [question.id, clearAllTimeouts]);

  // Run a sequence of actions and return a promise
  const runActions = useCallback(
    (
      actions: Action[],
      startPositions: Record<string, Position>,
      startBallHolder: string,
      onDone: () => void
    ) => {
      let currentPositions = { ...startPositions };
      let currentBallHolder = startBallHolder;
      let totalDelay = 0;

      actions.forEach((action) => {
        const stepDuration = Math.max(...action.steps.map((s) => s.duration));

        // Schedule player movements
        const capturedPositions = { ...currentPositions };
        const capturedBallHolder = currentBallHolder;

        addTimeout(() => {
          setPlayerAnimDuration(stepDuration);
          const newPositions = { ...capturedPositions };
          action.steps.forEach((step) => {
            newPositions[step.playerId] = step.to;
          });
          setPositions(newPositions);

          // Handle ball: dribble moves with player
          const dribbleStep = action.steps.find(
            (s) => s.hasBall && (s.type === "dribble" || s.type === "cut")
          );
          if (dribbleStep) {
            setBallAnimDuration(stepDuration);
            setBallPosition(dribbleStep.to);
          }

          // Handle ball pass
          if (action.ballPass) {
            const toPos = newPositions[action.ballPass.to];
            const fromPos = capturedPositions[action.ballPass.from] || capturedPositions[capturedBallHolder];
            setPassLine({ from: fromPos, to: toPos });
            // Ball travels slightly faster than the step
            const passDelay = Math.min(stepDuration * 0.6, 0.4) * 1000;
            addTimeout(() => {
              setBallAnimDuration(0.35);
              setBallPosition(toPos);
            }, passDelay);
            addTimeout(() => {
              setPassLine(null);
            }, stepDuration * 1000);
          }
        }, totalDelay);

        // Update tracking vars for next action
        action.steps.forEach((step) => {
          currentPositions[step.playerId] = step.to;
        });
        if (action.ballPass) {
          currentBallHolder = action.ballPass.to;
        } else {
          const ballStep = action.steps.find(
            (s) => s.hasBall && (s.type === "dribble" || s.type === "cut")
          );
          if (ballStep) {
            currentBallHolder = ballStep.playerId;
          }
        }

        totalDelay += stepDuration * 1000 + (action.pauseAfter || 0) * 1000;
      });

      addTimeout(onDone, totalDelay);
      return { finalPositions: currentPositions, finalBallHolder: currentBallHolder, totalDuration: totalDelay };
    },
    [addTimeout]
  );

  // Looping animation for the pre-question phase
  useEffect(() => {
    if (phase !== "animating") {
      loopRef.current = false;
      return;
    }

    loopRef.current = true;

    const runLoop = () => {
      if (!loopRef.current) return;

      // Reset to initial state
      setPositions({ ...question.initialPositions });
      setBallPosition(question.initialPositions[question.initialBallHolder]);
      setBallAnimDuration(0);
      setPlayerAnimDuration(0);
      setPassLine(null);

      // Small delay before starting
      addTimeout(() => {
        if (!loopRef.current) return;

        runActions(
          question.actions,
          question.initialPositions,
          question.initialBallHolder,
          () => {
            onAnimationComplete();
            // After showing, wait 1.5s then loop if still animating
            // (onAnimationComplete switches to "answering" which will loop again)
          }
        );
      }, 600);
    };

    runLoop();

    return () => {
      loopRef.current = false;
      clearAllTimeouts();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, question.id]);

  // Answering phase: keep looping the animation in background
  useEffect(() => {
    if (phase !== "answering") return;

    loopRef.current = true;
    let loopTimeout: ReturnType<typeof setTimeout>;

    const runAnswerLoop = () => {
      if (!loopRef.current) return;

      // Reset to initial state
      setPositions({ ...question.initialPositions });
      setBallPosition(question.initialPositions[question.initialBallHolder]);
      setBallAnimDuration(0);
      setPlayerAnimDuration(0);
      setPassLine(null);

      loopTimeout = setTimeout(() => {
        if (!loopRef.current) return;

        const { totalDuration } = runActions(
          question.actions,
          question.initialPositions,
          question.initialBallHolder,
          () => {
            // Wait 1.5s at the end state, then restart
            loopTimeout = setTimeout(() => {
              if (loopRef.current) runAnswerLoop();
            }, 1500);
          }
        );
      }, 400);
      timeoutsRef.current.push(loopTimeout);
    };

    runAnswerLoop();

    return () => {
      loopRef.current = false;
      clearAllTimeouts();
      if (loopTimeout) clearTimeout(loopTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, question.id]);

  // Post-answer animation
  useEffect(() => {
    if (phase !== "postAnswer" || !selectedAnswer) return;

    const postActions = question.postAnswerActions?.[selectedAnswer.id];
    if (!postActions || postActions.length === 0) {
      onPostAnswerComplete();
      return;
    }

    // Figure out current ball holder from end of main animation
    let endBallHolder = question.initialBallHolder;
    for (const action of question.actions) {
      if (action.ballPass) {
        endBallHolder = action.ballPass.to;
      } else {
        const ballStep = action.steps.find(
          (s) => s.hasBall && (s.type === "dribble" || s.type === "cut")
        );
        if (ballStep) endBallHolder = ballStep.playerId;
      }
    }

    // Get end positions after main animation
    const endPositions = { ...question.initialPositions };
    for (const action of question.actions) {
      action.steps.forEach((step) => {
        endPositions[step.playerId] = step.to;
      });
    }

    // Set to end state of main animation first
    setPositions(endPositions);
    setBallPosition(endPositions[endBallHolder]);
    setBallAnimDuration(0);
    setPlayerAnimDuration(0);

    addTimeout(() => {
      runActions(postActions, endPositions, endBallHolder, () => {
        onPostAnswerComplete();
      });
    }, 300);

    return () => clearAllTimeouts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, selectedAnswer?.id]);

  const showSpots = phase === "answering" || phase === "feedback" || phase === "postAnswer";

  return (
    <div className="relative w-full aspect-square max-w-[400px] mx-auto">
      {/* Court background */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-800 to-amber-700 rounded-2xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOGI3MzVhIiBzdHJva2Utd2lkdGg9IjAuMyIvPgo8L3N2Zz4=')]" />
        <CourtLines />

        {/* Pass line */}
        {passLine && (
          <PassLine from={passLine.from} to={passLine.to} active={true} />
        )}

        {/* Ball marker (separate from players, moves smoothly) */}
        <BallMarker position={ballPosition} animDuration={ballAnimDuration} />

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
              isHighlighted={
                phase === "answering" && player.id === question.targetPlayerId
              }
              animDuration={playerAnimDuration}
            />
          );
        })}

        {/* Answer spots */}
        <AnimatePresence>
          {showSpots &&
            question.answerSpots.map((spot) => (
              <AnswerSpotMarker
                key={spot.id}
                spot={spot}
                phase={phase as "answering" | "feedback" | "postAnswer"}
                isSelected={selectedAnswer?.id === spot.id}
                onTap={() => onSelectAnswer(spot)}
              />
            ))}
        </AnimatePresence>

        {/* Phase indicator */}
        <AnimatePresence>
          {phase === "animating" && (
            <motion.div
              key="anim-indicator"
              className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              再生中...
            </motion.div>
          )}
          {phase === "answering" && (
            <motion.div
              key="answer-indicator"
              className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-yellow-500/90 text-gray-900 text-xs px-3 py-1.5 rounded-full font-bold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {question.targetPlayerLabel}番はどこに動く？タップ！
            </motion.div>
          )}
          {phase === "postAnswer" && (
            <motion.div
              key="post-indicator"
              className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-blue-500/80 text-white text-xs px-3 py-1 rounded-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              その後の展開...
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
