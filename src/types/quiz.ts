// Position on the tactical board (percentage-based coordinates)
// Coordinate system: rim at TOP (y~10), half-court at BOTTOM (y~95)
export interface Position {
  x: number; // 0-100 (left to right)
  y: number; // 0-100 (rim at top, half-court at bottom)
}

export interface Player {
  id: string;
  label: string; // "PG", "SG", "SF", "PF", "C" or "×"
  isOffense: boolean;
}

export interface AnimationStep {
  playerId: string;
  from: Position;
  to: Position;
  duration: number;
  type: "move" | "cut" | "dribble";
  hasBall?: boolean;
}

export interface Action {
  steps: AnimationStep[];
  pauseAfter?: number;
  ballPass?: { from: string; to: string };
}

// Movement type for answer visualization
export type MoveType = "cut" | "screen" | "dribble" | "pass";

export interface AnswerSpot {
  id: string;
  position: Position;
  moveType: MoveType;
  curveDirection?: "left" | "right"; // for curved cut lines
  score: number; // 0, 50, or 100
  explanation: string;
}

// A decision point within a possession
export interface DecisionStep {
  description: string;
  targetPlayerId: string;
  targetPlayerLabel: string;
  preAnimations: Action[];
  answerSpots: AnswerSpot[];
  postAnswerActions?: Record<string, Action[]>;
  shootQuality: number; // 0-10: how good is shooting right now
  shootExplanation: string;
  feedback: string;
  explanation: string;
}

// A single possession - multiple decisions until a shot
export interface Possession {
  id: string;
  title: string;
  description: string;
  players: Player[];
  initialPositions: Record<string, Position>;
  initialBallHolder: string;
  steps: DecisionStep[];
}

// Spaced repetition card data
export interface SRCard {
  questionId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: number;
  lastScore: number;
}

export interface UserProgress {
  cards: Record<string, SRCard>;
  totalAnswered: number;
  totalCorrect: number;
  streakDays: number;
  lastStudyDate: string;
}
