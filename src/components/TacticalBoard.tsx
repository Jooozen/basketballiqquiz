"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Player,
  Position,
  AnswerSpot,
  Action,
  DecisionStep,
  MoveType,
} from "@/types/quiz";

interface TacticalBoardProps {
  players: Player[];
  startPositions: Record<string, Position>;
  startBallHolder: string;
  step: DecisionStep;
  phase: "animating" | "answering" | "feedback" | "postAnswer" | "shootResult";
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
      <rect x="5" y="5" width="90" height="90" fill="none" stroke="#5a3e28" strokeWidth="0.5" rx="1" />
      <circle cx="50" cy="12" r="1.5" fill="none" stroke="#5a3e28" strokeWidth="0.4" />
      <line x1="45" y1="10" x2="55" y2="10" stroke="#5a3e28" strokeWidth="0.5" />
      <line x1="43" y1="8" x2="57" y2="8" stroke="#5a3e28" strokeWidth="0.6" />
      <path d="M 42 10 Q 42 22 50 25 Q 58 22 58 10" fill="none" stroke="#5a3e28" strokeWidth="0.3" />
      <rect x="32" y="5" width="36" height="40" fill="none" stroke="#5a3e28" strokeWidth="0.4" />
      <circle cx="50" cy="45" r="12" fill="none" stroke="#5a3e28" strokeWidth="0.3" strokeDasharray="1.5,0.8" />
      <path d="M 15 15 L 15 45 Q 15 80 50 85 Q 85 80 85 45 L 85 15" fill="none" stroke="#5a3e28" strokeWidth="0.4" strokeDasharray="1.5,0.8" />
      <line x1="5" y1="95" x2="95" y2="95" stroke="#5a3e28" strokeWidth="0.5" />
    </svg>
  );
}

// --- Movement Line SVG Components ---
// Thin lines matching professional basketball tactical diagrams

const LINE_COLOR = "#3d2b1a";
const LINE_WIDTH = 0.45;
const LINE_OPACITY = 0.9;

// Cut arrow: straight or curved depending on curveDirection
function CutArrow({ from, to, curveDir }: { from: Position; to: Position; curveDir?: "left" | "right" | "straight" }) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 0.1) return null;

  let path: string;
  if (!curveDir || curveDir === "straight") {
    // Straight cut - direct line
    path = `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  } else {
    // Curved cut - realistic basketball arc
    // Use different curve intensities based on distance
    const curveFactor = Math.min(len * 0.3, 15);
    const offset = curveDir === "left" ? -curveFactor : curveFactor;
    const perpX = (-dy / len) * offset;
    const perpY = (dx / len) * offset;
    const cx = (from.x + to.x) / 2 + perpX;
    const cy = (from.y + to.y) / 2 + perpY;
    path = `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
  }
  return (
    <path d={path} fill="none" stroke={LINE_COLOR} strokeWidth={LINE_WIDTH}
      opacity={LINE_OPACITY} markerEnd="url(#arrowHead)" />
  );
}

// Screen line: line to position + perpendicular bar showing screen orientation
function ScreenLine({ from, to, angle }: { from: Position; to: Position; angle?: number }) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 0.1) return null;

  const barLen = 3.0;

  // Bar orientation: use screenAngle if provided, otherwise perpendicular to movement
  let barDx: number, barDy: number;
  if (angle !== undefined) {
    const rad = (angle * Math.PI) / 180;
    barDx = Math.cos(rad) * barLen;
    barDy = -Math.sin(rad) * barLen; // SVG y is inverted
  } else {
    // Default: perpendicular to movement direction
    barDx = (-dy / len) * barLen;
    barDy = (dx / len) * barLen;
  }

  return (
    <>
      <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
        stroke={LINE_COLOR} strokeWidth={LINE_WIDTH} opacity={LINE_OPACITY} />
      <line
        x1={to.x + barDx} y1={to.y + barDy}
        x2={to.x - barDx} y2={to.y - barDy}
        stroke={LINE_COLOR} strokeWidth={LINE_WIDTH * 2.5} opacity={LINE_OPACITY}
        strokeLinecap="round"
      />
    </>
  );
}

// Dribble zigzag: wavy line for ball handler movement
function DribbleZigzag({ from, to, curveDir }: { from: Position; to: Position; curveDir?: "left" | "right" | "straight" }) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 0.1) return null;

  // Zigzag parameters - tight consistent waves
  const numZags = Math.max(3, Math.round(len / 5));
  const zagSize = 1.5;
  const nx = dx / len;
  const ny = dy / len;
  const px = -ny;
  const py = nx;

  // If curved, apply a gentle overall curve to the zigzag path
  let path = `M ${from.x} ${from.y}`;
  for (let i = 1; i <= numZags; i++) {
    const t = i / numZags;
    let bx = from.x + dx * t;
    let by = from.y + dy * t;

    // Apply curve offset if specified
    if (curveDir && curveDir !== "straight") {
      const curveFactor = Math.sin(t * Math.PI) * len * 0.15;
      const curveOffset = curveDir === "left" ? -curveFactor : curveFactor;
      bx += px * curveOffset;
      by += py * curveOffset;
    }

    if (i < numZags) {
      const sign = i % 2 === 0 ? 1 : -1;
      path += ` L ${bx + px * zagSize * sign} ${by + py * zagSize * sign}`;
    } else {
      path += ` L ${bx} ${by}`;
    }
  }
  return <path d={path} fill="none" stroke={LINE_COLOR} strokeWidth={LINE_WIDTH}
    opacity={LINE_OPACITY} />;
}

// Pass dotted line: dashed line with arrow for passing
function PassDotted({ from, to }: { from: Position; to: Position }) {
  return (
    <line
      x1={from.x} y1={from.y} x2={to.x} y2={to.y}
      stroke={LINE_COLOR} strokeWidth={LINE_WIDTH} strokeDasharray="1.5,1.2"
      opacity={LINE_OPACITY} markerEnd="url(#arrowHead)"
    />
  );
}

function MovementLine({ from, to, moveType, curveDirection, screenAngle }: {
  from: Position; to: Position; moveType: MoveType;
  curveDirection?: "left" | "right" | "straight"; screenAngle?: number;
}) {
  switch (moveType) {
    case "cut": return <CutArrow from={from} to={to} curveDir={curveDirection} />;
    case "screen": return <ScreenLine from={from} to={to} angle={screenAngle} />;
    case "dribble": return <DribbleZigzag from={from} to={to} curveDir={curveDirection} />;
    case "pass": return <PassDotted from={from} to={to} />;
  }
}

// SVG overlay for movement lines
function MovementLinesOverlay({ spots, targetPos }: { spots: AnswerSpot[]; targetPos: Position }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
      style={{ zIndex: 18 }}
    >
      <defs>
        <marker id="arrowHead" markerWidth="4" markerHeight="3" refX="3.5" refY="1.5" orient="auto">
          <polygon points="0 0, 4 1.5, 0 3" fill={LINE_COLOR} opacity={LINE_OPACITY} />
        </marker>
      </defs>
      {spots.map((spot) => (
        <MovementLine
          key={spot.id}
          from={targetPos}
          to={spot.position}
          moveType={spot.moveType}
          curveDirection={spot.curveDirection}
          screenAngle={spot.screenAngle}
        />
      ))}
    </svg>
  );
}

// Animated ball
function BallMarker({ position, animDuration }: { position: Position; animDuration: number }) {
  return (
    <motion.div
      className="absolute z-25 pointer-events-none"
      animate={{ left: `${position.x}%`, top: `${position.y}%` }}
      transition={{ duration: animDuration, ease: "easeInOut" }}
      style={{ transform: "translate(-50%, -50%)", marginLeft: "14px", marginTop: "-12px" }}
    >
      <div className="w-5 h-5 bg-orange-500 rounded-full border-2 border-orange-700 shadow-lg shadow-orange-500/50" />
    </motion.div>
  );
}

// Pass line animation
function PassLineAnim({ from, to, active }: { from: Position; to: Position; active: boolean }) {
  if (!active) return null;
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none z-15" preserveAspectRatio="none">
      <defs>
        <marker id="passArrow" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
          <polygon points="0 0, 5 2, 0 4" fill="#FFD700" opacity="0.8" />
        </marker>
      </defs>
      <motion.line
        x1={from.x} y1={from.y} x2={from.x} y2={from.y}
        animate={{ x2: to.x, y2: to.y }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        stroke="#FFD700" strokeWidth="0.5" strokeDasharray="2,1" markerEnd="url(#passArrow)" opacity="0.7"
      />
    </svg>
  );
}

function PlayerMarker({ label, position, isOffense, isTarget, isHighlighted, animDuration }: {
  label: string; position: Position; isOffense: boolean; isTarget: boolean; isHighlighted: boolean; animDuration: number;
}) {
  // Offense: dark black circles like reference images. Defense: subtle gray
  const size = isOffense ? "w-10 h-10" : "w-7 h-7";
  const bgColor = isOffense
    ? isTarget
      ? "bg-yellow-400 border-yellow-600"
      : "bg-gray-900 border-gray-600"
    : "bg-gray-500 border-gray-400";
  const textColor = isOffense
    ? isTarget ? "text-gray-900" : "text-white"
    : "text-white";
  const fontSize = isOffense ? "text-[10px] font-bold" : "text-xs font-bold";

  return (
    <motion.div
      className={`absolute ${size} rounded-full ${bgColor} border-2 flex items-center justify-center ${fontSize} ${textColor} shadow-lg`}
      animate={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        scale: isHighlighted ? [1, 1.15, 1] : 1,
      }}
      transition={{
        left: { duration: animDuration, ease: "easeInOut" },
        top: { duration: animDuration, ease: "easeInOut" },
        scale: { duration: 0.8, repeat: isHighlighted ? Infinity : 0, ease: "easeInOut" },
      }}
      style={{ transform: "translate(-50%, -50%)", zIndex: isTarget ? 20 : 10 }}
    >
      {label}
    </motion.div>
  );
}

// Move type label for answer spots
const moveTypeLabels: Record<MoveType, string> = {
  cut: "カット",
  screen: "スクリーン",
  dribble: "ドリブル",
  pass: "パス",
};

function AnswerSpotMarker({ spot, phase, isSelected, onTap }: {
  spot: AnswerSpot;
  phase: "answering" | "feedback" | "postAnswer" | "shootResult";
  isSelected: boolean;
  onTap: () => void;
}) {
  const getColor = () => {
    if (phase === "feedback" || phase === "postAnswer" || phase === "shootResult") {
      if (spot.score === 100) return "bg-green-500 border-green-300";
      if (spot.score === 50) return "bg-yellow-500 border-yellow-300";
      return "bg-red-500 border-red-300";
    }
    if (isSelected) return "bg-white border-white";
    return "bg-white/50 border-white/80";
  };

  const getScale = () => {
    if ((phase === "feedback" || phase === "postAnswer") && spot.score === 100) return [1, 1.3, 1];
    if (isSelected) return 1.2;
    return 1;
  };

  const showLabel = phase === "answering" && !isSelected;

  return (
    <motion.button
      className={`absolute w-10 h-10 rounded-full ${getColor()} border-2 flex flex-col items-center justify-center shadow-lg cursor-pointer z-30`}
      style={{ left: `${spot.position.x}%`, top: `${spot.position.y}%`, transform: "translate(-50%, -50%)" }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: getScale(),
        opacity: (phase === "postAnswer" || phase === "shootResult") && !isSelected ? 0.3 : 1,
      }}
      transition={{
        scale: { duration: (phase === "feedback" || phase === "postAnswer") && spot.score === 100 ? 0.6 : 0.3, repeat: phase === "feedback" && spot.score === 100 ? 2 : 0 },
        opacity: { duration: 0.3 },
      }}
      whileTap={{ scale: 0.9 }}
      onClick={onTap}
      disabled={phase !== "answering"}
      aria-label={moveTypeLabels[spot.moveType]}
    >
      {(phase === "feedback" || phase === "postAnswer" || phase === "shootResult") ? (
        <span className="text-white text-xs font-bold">{spot.score}</span>
      ) : showLabel ? (
        <span className="text-gray-800 text-[7px] font-bold leading-none">
          {moveTypeLabels[spot.moveType]}
        </span>
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
  players, startPositions, startBallHolder, step, phase, selectedAnswer, onSelectAnswer, onAnimationComplete, onPostAnswerComplete,
}: TacticalBoardProps) {
  const [positions, setPositions] = useState<Record<string, Position>>(() => ({ ...startPositions }));
  const [ballPosition, setBallPosition] = useState<Position>(() => startPositions[startBallHolder] || { x: 50, y: 50 });
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

  useEffect(() => {
    return () => { clearAllTimeouts(); loopRef.current = false; };
  }, [clearAllTimeouts]);

  const runActions = useCallback(
    (actions: Action[], actionStartPositions: Record<string, Position>, actionStartBallHolder: string, onDone: () => void) => {
      let currentPositions = { ...actionStartPositions };
      let currentBallHolder = actionStartBallHolder;
      let totalDelay = 0;

      actions.forEach((action) => {
        const stepDuration = action.steps.length > 0 ? Math.max(...action.steps.map((s) => s.duration)) : 0.5;
        const capturedPositions = { ...currentPositions };
        const capturedBallHolder = currentBallHolder;

        addTimeout(() => {
          setPlayerAnimDuration(stepDuration);
          const newPositions = { ...capturedPositions };
          action.steps.forEach((s) => { newPositions[s.playerId] = s.to; });
          setPositions(newPositions);

          const dribbleStep = action.steps.find((s) => s.hasBall && (s.type === "dribble" || s.type === "cut"));
          if (dribbleStep) { setBallAnimDuration(stepDuration); setBallPosition(dribbleStep.to); }

          if (action.ballPass) {
            const toPos = newPositions[action.ballPass.to];
            const fromPos = capturedPositions[action.ballPass.from] || capturedPositions[capturedBallHolder];
            setPassLine({ from: fromPos, to: toPos });
            const passDelay = Math.min(stepDuration * 0.6, 0.4) * 1000;
            addTimeout(() => { setBallAnimDuration(0.35); setBallPosition(toPos); }, passDelay);
            addTimeout(() => { setPassLine(null); }, stepDuration * 1000);
          }
        }, totalDelay);

        action.steps.forEach((s) => { currentPositions[s.playerId] = s.to; });
        if (action.ballPass) { currentBallHolder = action.ballPass.to; }
        else {
          const ballStep = action.steps.find((s) => s.hasBall && (s.type === "dribble" || s.type === "cut"));
          if (ballStep) currentBallHolder = ballStep.playerId;
        }
        totalDelay += stepDuration * 1000 + (action.pauseAfter || 0) * 1000;
      });

      addTimeout(onDone, totalDelay);
      return { finalPositions: currentPositions, finalBallHolder: currentBallHolder, totalDuration: totalDelay };
    },
    [addTimeout]
  );

  // Animating phase
  useEffect(() => {
    if (phase !== "animating") { loopRef.current = false; return; }
    loopRef.current = true;

    const runLoop = () => {
      if (!loopRef.current) return;
      setPositions({ ...startPositions });
      setBallPosition(startPositions[startBallHolder] || { x: 50, y: 50 });
      setBallAnimDuration(0); setPlayerAnimDuration(0); setPassLine(null);

      if (step.preAnimations.length === 0) {
        addTimeout(() => { onAnimationComplete(); }, 600);
        return;
      }
      addTimeout(() => {
        if (!loopRef.current) return;
        runActions(step.preAnimations, startPositions, startBallHolder, () => { onAnimationComplete(); });
      }, 600);
    };
    runLoop();
    return () => { loopRef.current = false; clearAllTimeouts(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Answering phase: loop animation
  useEffect(() => {
    if (phase !== "answering") return;
    loopRef.current = true;
    let loopTimeout: ReturnType<typeof setTimeout>;

    const runAnswerLoop = () => {
      if (!loopRef.current) return;
      setPositions({ ...startPositions });
      setBallPosition(startPositions[startBallHolder] || { x: 50, y: 50 });
      setBallAnimDuration(0); setPlayerAnimDuration(0); setPassLine(null);

      if (step.preAnimations.length === 0) {
        loopTimeout = setTimeout(() => { if (loopRef.current) runAnswerLoop(); }, 3000);
        timeoutsRef.current.push(loopTimeout);
        return;
      }
      loopTimeout = setTimeout(() => {
        if (!loopRef.current) return;
        runActions(step.preAnimations, startPositions, startBallHolder, () => {
          loopTimeout = setTimeout(() => { if (loopRef.current) runAnswerLoop(); }, 1500);
          timeoutsRef.current.push(loopTimeout);
        });
      }, 400);
      timeoutsRef.current.push(loopTimeout);
    };
    runAnswerLoop();
    return () => { loopRef.current = false; clearAllTimeouts(); if (loopTimeout) clearTimeout(loopTimeout); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Post-answer animation
  useEffect(() => {
    if (phase !== "postAnswer" || !selectedAnswer) return;
    const postActions = step.postAnswerActions?.[selectedAnswer.id];
    if (!postActions || postActions.length === 0) { onPostAnswerComplete(); return; }

    let endBallHolder = startBallHolder;
    const endPositions = { ...startPositions };
    for (const action of step.preAnimations) {
      action.steps.forEach((s) => { endPositions[s.playerId] = s.to; });
      if (action.ballPass) { endBallHolder = action.ballPass.to; }
      else {
        const bs = action.steps.find((s) => s.hasBall && (s.type === "dribble" || s.type === "cut"));
        if (bs) endBallHolder = bs.playerId;
      }
    }

    setPositions(endPositions);
    setBallPosition(endPositions[endBallHolder] || { x: 50, y: 50 });
    setBallAnimDuration(0); setPlayerAnimDuration(0);

    addTimeout(() => {
      runActions(postActions, endPositions, endBallHolder, () => { onPostAnswerComplete(); });
    }, 300);
    return () => clearAllTimeouts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, selectedAnswer?.id]);

  const showSpots = phase === "answering" || phase === "feedback" || phase === "postAnswer" || phase === "shootResult";
  const showMoveLines = phase === "answering";
  const targetPos = positions[step.targetPlayerId] || { x: 50, y: 50 };

  return (
    <div className="relative w-full aspect-square max-w-[400px] mx-auto">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-800 to-amber-700 rounded-2xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOGI3MzVhIiBzdHJva2Utd2lkdGg9IjAuMyIvPgo8L3N2Zz4=')]" />
        <CourtLines />

        {passLine && <PassLineAnim from={passLine.from} to={passLine.to} active={true} />}

        {/* Movement type lines during answering */}
        {showMoveLines && <MovementLinesOverlay spots={step.answerSpots} targetPos={targetPos} />}

        <BallMarker position={ballPosition} animDuration={ballAnimDuration} />

        {players.map((player) => {
          const pos = positions[player.id] || { x: 0, y: 0 };
          return (
            <PlayerMarker
              key={player.id}
              label={player.label}
              position={pos}
              isOffense={player.isOffense}
              isTarget={player.id === step.targetPlayerId}
              isHighlighted={phase === "answering" && player.id === step.targetPlayerId}
              animDuration={playerAnimDuration}
            />
          );
        })}

        <AnimatePresence>
          {showSpots && step.answerSpots.map((spot) => (
            <AnswerSpotMarker
              key={spot.id}
              spot={spot}
              phase={phase as "answering" | "feedback" | "postAnswer" | "shootResult"}
              isSelected={selectedAnswer?.id === spot.id}
              onTap={() => onSelectAnswer(spot)}
            />
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {phase === "animating" && (
            <motion.div key="anim" className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              再生中...
            </motion.div>
          )}
          {phase === "answering" && (
            <motion.div key="answer" className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-yellow-500/90 text-gray-900 text-xs px-3 py-1.5 rounded-full font-bold"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {step.targetPlayerLabel}はどう動く？
            </motion.div>
          )}
          {phase === "postAnswer" && (
            <motion.div key="post" className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-blue-500/80 text-white text-xs px-3 py-1 rounded-full"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              その後の展開...
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
