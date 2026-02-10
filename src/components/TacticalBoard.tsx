"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
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

// ─── Constants ───
const LINE_COLOR = "#3d2b1a";
const LINE_WIDTH = 0.5;
const LINE_OPACITY = 0.85;

// ─── SVG Path Builders ───

function buildCutPath(from: Position, to: Position, curveDir?: "left" | "right" | "straight"): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 0.1) return `M ${from.x} ${from.y}`;
  if (!curveDir || curveDir === "straight") {
    return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  }
  const curveFactor = Math.min(len * 0.35, 18);
  const offset = curveDir === "left" ? -curveFactor : curveFactor;
  const perpX = (-dy / len) * offset;
  const perpY = (dx / len) * offset;
  const cx = (from.x + to.x) / 2 + perpX;
  const cy = (from.y + to.y) / 2 + perpY;
  return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
}

function buildScreenPath(from: Position, to: Position): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 0.1) return `M ${from.x} ${from.y}`;
  const curveFactor = Math.min(len * 0.3, 12);
  const perpX = (-dy / len) * curveFactor;
  const perpY = (dx / len) * curveFactor;
  const cx = (from.x + to.x) / 2 + perpX;
  const cy = (from.y + to.y) / 2 + perpY;
  return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
}

function buildDribblePath(from: Position, to: Position, curveDir?: "left" | "right" | "straight"): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 0.1) return `M ${from.x} ${from.y}`;
  const numZags = Math.max(4, Math.round(len / 4));
  const zagSize = 1.2;
  const px = -dy / len;
  const py = dx / len;
  let path = `M ${from.x} ${from.y}`;
  for (let i = 1; i <= numZags; i++) {
    const t = i / numZags;
    let bx = from.x + dx * t;
    let by = from.y + dy * t;
    if (curveDir && curveDir !== "straight") {
      const curveFac = Math.sin(t * Math.PI) * len * 0.15;
      const curveOff = curveDir === "left" ? -curveFac : curveFac;
      bx += px * curveOff;
      by += py * curveOff;
    }
    if (i < numZags) {
      const sign = i % 2 === 0 ? 1 : -1;
      path += ` L ${bx + px * zagSize * sign} ${by + py * zagSize * sign}`;
    } else {
      path += ` L ${bx} ${by}`;
    }
  }
  return path;
}

function buildPathForMoveType(from: Position, to: Position, moveType: MoveType, curveDir?: "left" | "right" | "straight"): string {
  switch (moveType) {
    case "cut": return buildCutPath(from, to, curveDir);
    case "screen": return buildScreenPath(from, to);
    case "dribble": return buildDribblePath(from, to, curveDir);
    case "pass": return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  }
}

// ─── Court Lines (SVG) ───
// Official NBA half-court: 47ft × 50ft
// SVG mapping: x:5-95 (90 units = 50ft), y:5-95 (90 units = 47ft)
// x-scale: 1.8 units/ft, y-scale: 1.914 units/ft
// Rim at TOP, y=5 is baseline, y=95 is half-court line
function CourtLines() {
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
      {/* Court boundary */}
      <rect x="5" y="5" width="90" height="90" fill="none" stroke="#5a3e28" strokeWidth="0.5" rx="1" />

      {/* Backboard (6ft wide, 4ft from baseline) */}
      {/* y = 5 + 4×1.914 = 12.66, x: 50 ± 3×1.8 = 44.6 to 55.4 */}
      <line x1="44.6" y1="12.7" x2="55.4" y2="12.7" stroke="#5a3e28" strokeWidth="0.6" />

      {/* Rim (4.75ft from baseline) */}
      {/* y = 5 + 4.75×1.914 = 14.1 */}
      <circle cx="50" cy="14.1" r="1.35" fill="none" stroke="#5a3e28" strokeWidth="0.4" />

      {/* Restricted area (4ft radius semicircle from basket center) */}
      {/* rx=4×1.8=7.2, ry=4×1.914=7.66 */}
      <path d="M 42.8 14.1 A 7.2 7.66 0 0 1 57.2 14.1" fill="none" stroke="#5a3e28" strokeWidth="0.3" />

      {/* Key / Paint area (16ft wide, 19ft from baseline) */}
      {/* x: 50 ± 8×1.8 = 35.6 to 64.4, y: 5 to 5+19×1.914 = 41.4 */}
      <rect x="35.6" y="5" width="28.8" height="36.4" fill="none" stroke="#5a3e28" strokeWidth="0.4" />

      {/* Free throw circle (6ft radius, at free throw line y=41.4) */}
      {/* Top half only (dashed), bottom half inside key */}
      <circle cx="50" cy="41.4" r="10.8" fill="none" stroke="#5a3e28" strokeWidth="0.3" strokeDasharray="1.5,0.8" />

      {/* 3-point line */}
      {/* Corner straight lines: 3ft from sideline = x: 5+5.4=10.4 and 95-5.4=89.6 */}
      {/* Arc: ellipse rx=23.75×1.8=42.75, ry=23.75×1.914=45.46, center (50, 14.1) */}
      {/* Corner-to-arc transition at y ≈ 31 */}
      <path
        d="M 10.4 5 L 10.4 31 A 42.75 45.46 0 0 1 89.6 31 L 89.6 5"
        fill="none" stroke="#5a3e28" strokeWidth="0.4" strokeDasharray="1.5,0.8"
      />

      {/* Half-court line */}
      <line x1="5" y1="95" x2="95" y2="95" stroke="#5a3e28" strokeWidth="0.5" />

      {/* Center circle (6ft radius, top half only) */}
      {/* r ≈ 6×1.8 = 10.8 */}
      <path d="M 39.2 95 A 10.8 11.5 0 0 1 60.8 95" fill="none" stroke="#5a3e28" strokeWidth="0.3" strokeDasharray="1.5,0.8" />
    </svg>
  );
}

// ─── SVG Movement Lines Overlay ───
function ScreenTBar({ x, y, angle = 0 }: { x: number; y: number; angle?: number }) {
  const barLen = 2.8;
  const rad = (angle * Math.PI) / 180;
  const dx = Math.cos(rad) * barLen;
  const dy = -Math.sin(rad) * barLen;
  return (
    <line
      x1={x + dx} y1={y + dy}
      x2={x - dx} y2={y - dy}
      stroke={LINE_COLOR} strokeWidth={LINE_WIDTH * 2.5} strokeLinecap="round" opacity={LINE_OPACITY}
    />
  );
}

function MovementLinesOverlay({ spots, targetPos, onSelectSpot }: {
  spots: AnswerSpot[];
  targetPos: Position;
  onSelectSpot: (spot: AnswerSpot) => void;
}) {
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none" style={{ zIndex: 28 }}>
      <defs>
        <marker id="arrowHead" markerWidth="4" markerHeight="3" refX="3.5" refY="1.5" orient="auto">
          <polygon points="0 0, 4 1.5, 0 3" fill={LINE_COLOR} opacity={LINE_OPACITY} />
        </marker>
      </defs>
      {spots.map((spot) => (
        <g key={spot.id} style={{ cursor: "pointer" }} onClick={() => onSelectSpot(spot)}>
          {/* Invisible fat hit area for tapping */}
          <path
            d={buildPathForMoveType(targetPos, spot.position, spot.moveType, spot.curveDirection)}
            fill="none"
            stroke="transparent"
            strokeWidth="5"
          />
          {/* Visible thin line */}
          <path
            d={buildPathForMoveType(targetPos, spot.position, spot.moveType, spot.curveDirection)}
            fill="none"
            stroke={LINE_COLOR}
            strokeWidth={LINE_WIDTH}
            opacity={0.7}
            strokeDasharray={spot.moveType === "pass" ? "1.5,1.2" : undefined}
            markerEnd={spot.moveType === "cut" || spot.moveType === "pass" ? "url(#arrowHead)" : undefined}
          />
          {spot.moveType === "screen" && (
            <ScreenTBar x={spot.position.x} y={spot.position.y} angle={spot.screenAngle} />
          )}
          {/* Small endpoint dot */}
          <circle
            cx={spot.position.x}
            cy={spot.position.y}
            r="1.2"
            fill="rgba(255,255,255,0.6)"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth="0.3"
          />
          {/* Invisible large hit area at endpoint */}
          <circle
            cx={spot.position.x}
            cy={spot.position.y}
            r="4"
            fill="transparent"
          />
        </g>
      ))}
    </svg>
  );
}

// ─── Feedback overlay: show scored spots after answer ───
function FeedbackLinesOverlay({ spots, targetPos, selectedId }: {
  spots: AnswerSpot[];
  targetPos: Position;
  selectedId: string | null;
}) {
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" style={{ zIndex: 28 }}>
      <defs>
        <marker id="arrowHeadFb" markerWidth="4" markerHeight="3" refX="3.5" refY="1.5" orient="auto">
          <polygon points="0 0, 4 1.5, 0 3" fill={LINE_COLOR} opacity={0.4} />
        </marker>
      </defs>
      {spots.map((spot) => {
        const isSelected = spot.id === selectedId;
        const dotColor = spot.score === 100 ? "#22c55e" : spot.score === 50 ? "#eab308" : "#ef4444";
        const lineOpacity = isSelected ? 0.7 : 0.25;
        const dotR = isSelected ? 2.0 : 1.2;
        return (
          <g key={spot.id} opacity={isSelected ? 1 : 0.4}>
            <path
              d={buildPathForMoveType(targetPos, spot.position, spot.moveType, spot.curveDirection)}
              fill="none"
              stroke={LINE_COLOR}
              strokeWidth={LINE_WIDTH * 0.7}
              opacity={lineOpacity}
              strokeDasharray={spot.moveType === "pass" ? "1.5,1.2" : undefined}
              markerEnd="url(#arrowHeadFb)"
            />
            {spot.moveType === "screen" && (
              <ScreenTBar x={spot.position.x} y={spot.position.y} angle={spot.screenAngle} />
            )}
            <circle cx={spot.position.x} cy={spot.position.y} r={dotR} fill={dotColor} stroke="#fff" strokeWidth="0.3" />
          </g>
        );
      })}
    </svg>
  );
}

// ─── Pass Line SVG ───
function PassLineAnim({ from, to }: { from: Position; to: Position }) {
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" style={{ zIndex: 15 }}>
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

// ─── Player Marker (HTML div + Framer Motion) ───
function PlayerMarker({ player, position, isTarget, isHighlighted, animDuration, facingAngle }: {
  player: Player; position: Position; isTarget: boolean; isHighlighted: boolean; animDuration: number; facingAngle?: number;
}) {
  if (player.isOffense) {
    const bg = isTarget ? "bg-yellow-400 border-yellow-600" : "bg-gray-900 border-gray-700";
    const text = isTarget ? "text-gray-900" : "text-white";
    return (
      <motion.div
        className={`absolute w-8 h-8 rounded-full ${bg} border-2 flex items-center justify-center shadow-md`}
        animate={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          scale: isHighlighted ? [1, 1.1, 1] : 1,
        }}
        transition={{
          left: { duration: animDuration, ease: "easeInOut" },
          top: { duration: animDuration, ease: "easeInOut" },
          scale: { duration: 1, repeat: isHighlighted ? Infinity : 0, ease: "easeInOut" },
        }}
        style={{ transform: "translate(-50%, -50%)", zIndex: isTarget ? 22 : 20 }}
      >
        <span className={`text-[9px] font-bold ${text} leading-none`}>{player.label}</span>
      </motion.div>
    );
  } else {
    // Defense: wide flat triangle showing defensive stance
    // Tip = face direction, wide base = arms spread
    const rotation = facingAngle !== undefined ? facingAngle : 0;
    return (
      <motion.div
        className="absolute flex items-center justify-center"
        animate={{
          left: `${position.x}%`,
          top: `${position.y}%`,
        }}
        transition={{
          left: { duration: animDuration, ease: "easeInOut" },
          top: { duration: animDuration, ease: "easeInOut" },
        }}
        style={{ transform: "translate(-50%, -50%)", zIndex: 10, width: 22, height: 14 }}
      >
        <svg
          viewBox="-11 -7 22 14"
          width="22" height="14"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* Wide flat triangle: tip(face) at top, wide base at bottom */}
          <polygon
            points="0,-5 9,5 -9,5"
            fill="#78716c"
            stroke="#a8a29e"
            strokeWidth="0.6"
            strokeLinejoin="round"
          />
          {/* Small dot for "head" direction */}
          <circle cx="0" cy="-4" r="1" fill="#a8a29e" />
        </svg>
      </motion.div>
    );
  }
}

// ─── Ball Marker ───
function BallMarker({ position, animDuration }: { position: Position; animDuration: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      animate={{ left: `${position.x}%`, top: `${position.y}%` }}
      transition={{ duration: animDuration, ease: "easeInOut" }}
      style={{ transform: "translate(-50%, -50%)", marginLeft: "12px", marginTop: "-10px", zIndex: 25 }}
    >
      <div className="w-4 h-4 bg-orange-500 rounded-full border-2 border-orange-700 shadow-md shadow-orange-500/40" />
    </motion.div>
  );
}

// ─── Move type labels ───
const moveTypeLabels: Record<MoveType, string> = {
  cut: "カット",
  screen: "スクリーン",
  dribble: "ドリブル",
  pass: "パス",
};

// ─── Main Component ───
export default function TacticalBoard({
  players, startPositions, startBallHolder, step, phase,
  selectedAnswer, onSelectAnswer, onAnimationComplete, onPostAnswerComplete,
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

  // Compute defense facing angles (toward nearest offense player)
  const defenseFacingAngles = useMemo(() => {
    const angles: Record<string, number> = {};
    const defPlayers = players.filter(p => !p.isOffense);
    const offPlayers = players.filter(p => p.isOffense);
    for (const def of defPlayers) {
      const defPos = positions[def.id] || { x: 50, y: 50 };
      let nearestAngle = 0;
      let nearestDist = Infinity;
      for (const off of offPlayers) {
        const offPos = positions[off.id] || { x: 50, y: 50 };
        const dx = offPos.x - defPos.x;
        const dy = offPos.y - defPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < nearestDist) {
          nearestDist = dist;
          // atan2(dy, dx): 0=right, 90=down in SVG coords
          // Triangle tip points UP by default (0deg), so +90 offset
          nearestAngle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
        }
      }
      angles[def.id] = nearestAngle;
    }
    return angles;
  }, [players, positions]);

  const runActions = useCallback(
    (actions: Action[], actionStartPositions: Record<string, Position>, actionStartBallHolder: string, onDone: () => void) => {
      let currentPositions = { ...actionStartPositions };
      let currentBallHolder = actionStartBallHolder;
      let totalDelay = 0;

      actions.forEach((action) => {
        const stepDuration = action.steps.length > 0 ? Math.max(...action.steps.map(s => s.duration)) : 0.5;
        const capturedPositions = { ...currentPositions };
        const capturedBallHolder = currentBallHolder;

        addTimeout(() => {
          setPlayerAnimDuration(stepDuration);
          const newPositions = { ...capturedPositions };
          action.steps.forEach(s => { newPositions[s.playerId] = s.to; });
          setPositions(newPositions);

          const dribbleStep = action.steps.find(s => s.hasBall && (s.type === "dribble" || s.type === "cut"));
          if (dribbleStep) {
            setBallAnimDuration(stepDuration);
            setBallPosition(dribbleStep.to);
          }

          if (action.ballPass) {
            const toPos = newPositions[action.ballPass.to];
            const fromPos = capturedPositions[action.ballPass.from] || capturedPositions[capturedBallHolder];
            setPassLine({ from: fromPos, to: toPos });
            const passDelay = Math.min(stepDuration * 0.6, 0.4) * 1000;
            addTimeout(() => { setBallAnimDuration(0.35); setBallPosition(toPos); }, passDelay);
            addTimeout(() => setPassLine(null), stepDuration * 1000);
          }
        }, totalDelay);

        action.steps.forEach(s => { currentPositions[s.playerId] = s.to; });
        if (action.ballPass) currentBallHolder = action.ballPass.to;
        else {
          const bs = action.steps.find(s => s.hasBall && (s.type === "dribble" || s.type === "cut"));
          if (bs) currentBallHolder = bs.playerId;
        }
        totalDelay += stepDuration * 1000 + (action.pauseAfter || 0) * 1000;
      });

      addTimeout(onDone, totalDelay);
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
      setBallAnimDuration(0);
      setPlayerAnimDuration(0);
      setPassLine(null);

      if (step.preAnimations.length === 0) {
        addTimeout(() => onAnimationComplete(), 600);
        return;
      }
      addTimeout(() => {
        if (!loopRef.current) return;
        runActions(step.preAnimations, startPositions, startBallHolder, () => onAnimationComplete());
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
      setBallAnimDuration(0);
      setPlayerAnimDuration(0);
      setPassLine(null);

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
    return () => { loopRef.current = false; clearAllTimeouts(); };
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
      action.steps.forEach(s => { endPositions[s.playerId] = s.to; });
      if (action.ballPass) endBallHolder = action.ballPass.to;
      else {
        const bs = action.steps.find(s => s.hasBall && (s.type === "dribble" || s.type === "cut"));
        if (bs) endBallHolder = bs.playerId;
      }
    }

    setPositions(endPositions);
    setBallPosition(endPositions[endBallHolder] || { x: 50, y: 50 });
    setBallAnimDuration(0);
    setPlayerAnimDuration(0);

    addTimeout(() => {
      runActions(postActions, endPositions, endBallHolder, () => onPostAnswerComplete());
    }, 300);
    return () => clearAllTimeouts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, selectedAnswer?.id]);

  const showAnswerLines = phase === "answering";
  const showFeedbackLines = phase === "feedback" || phase === "postAnswer" || phase === "shootResult";
  const targetPos = positions[step.targetPlayerId] || { x: 50, y: 50 };

  return (
    <div className="relative w-full aspect-square max-w-[400px] mx-auto">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-800 to-amber-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Wood grain */}
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOGI3MzVhIiBzdHJva2Utd2lkdGg9IjAuMyIvPgo8L3N2Zz4=')]" />

        {/* Court lines (correct NBA proportions) */}
        <CourtLines />

        {/* Pass animation */}
        {passLine && <PassLineAnim from={passLine.from} to={passLine.to} />}

        {/* Movement lines during answering (clickable) */}
        {showAnswerLines && (
          <MovementLinesOverlay
            spots={step.answerSpots}
            targetPos={targetPos}
            onSelectSpot={onSelectAnswer}
          />
        )}

        {/* Feedback lines after answer */}
        {showFeedbackLines && (
          <FeedbackLinesOverlay
            spots={step.answerSpots}
            targetPos={targetPos}
            selectedId={selectedAnswer?.id || null}
          />
        )}

        {/* Ball */}
        <BallMarker position={ballPosition} animDuration={ballAnimDuration} />

        {/* Players */}
        {players.map((player) => {
          const pos = positions[player.id] || { x: 0, y: 0 };
          return (
            <PlayerMarker
              key={player.id}
              player={player}
              position={pos}
              isTarget={player.id === step.targetPlayerId}
              isHighlighted={phase === "answering" && player.id === step.targetPlayerId}
              animDuration={playerAnimDuration}
              facingAngle={!player.isOffense ? defenseFacingAngles[player.id] : undefined}
            />
          );
        })}

        {/* Phase labels */}
        <AnimatePresence>
          {phase === "animating" && (
            <motion.div key="anim" className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full z-40"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              再生中...
            </motion.div>
          )}
          {phase === "answering" && (
            <motion.div key="answer" className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-yellow-500/90 text-gray-900 text-xs px-3 py-1.5 rounded-full font-bold z-40"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {step.targetPlayerLabel}はどう動く？
            </motion.div>
          )}
          {phase === "postAnswer" && (
            <motion.div key="post" className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-blue-500/80 text-white text-xs px-3 py-1 rounded-full z-40"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              その後の展開...
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
