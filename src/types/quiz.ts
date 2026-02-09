// Position on the tactical board (percentage-based coordinates)
// Coordinate system: rim is at TOP (y=0), half-court line at BOTTOM (y=100)
export interface Position {
  x: number; // 0-100 percentage (left to right)
  y: number; // 0-100 percentage (rim at top, half-court at bottom)
}

// A player marker on the tactical board
export interface Player {
  id: string;
  label: string; // e.g., "1", "2", "3", "4", "5" or "PG", "SG", etc.
  isOffense: boolean;
  color?: string;
}

// A single animation keyframe for a player movement
export interface AnimationStep {
  playerId: string;
  from: Position;
  to: Position;
  duration: number; // seconds
  type: "move" | "screen" | "cut" | "pass" | "dribble";
  hasBall?: boolean;
  receiveBall?: boolean; // this player receives the ball after this step
  // Visual aids
  showArrow?: boolean;
  arrowStyle?: "solid" | "dashed" | "wavy";
}

// One action = a set of simultaneous movements
export interface Action {
  steps: AnimationStep[];
  pauseAfter?: number; // seconds to pause after this action
  ballPass?: { from: string; to: string }; // pass ball between players during this action
}

// An answer spot on the board
export interface AnswerSpot {
  id: string;
  position: Position;
  score: number; // 100, 50, or 0
  explanation: string;
}

// A single quiz question
export interface QuizQuestion {
  id: string;
  category: "spacing" | "cutting" | "drive-kick";
  title: string;
  description: string; // Situation description
  // Board setup
  players: Player[];
  initialPositions: Record<string, Position>; // playerId -> starting position
  initialBallHolder: string; // playerId who starts with the ball
  // Animation sequence (1-3 actions) played BEFORE the question
  actions: Action[];
  // Which player should the user move?
  targetPlayerId: string;
  targetPlayerLabel: string;
  // Answer options
  answerSpots: AnswerSpot[];
  // Post-answer animation: what happens after the correct play
  // keyed by answer spot id
  postAnswerActions?: Record<string, Action[]>;
  // Correct answer feedback
  correctFeedback: string;
  // General explanation of the concept
  conceptExplanation: string;
  difficulty: 1 | 2 | 3;
}

// Spaced repetition card data
export interface SRCard {
  questionId: string;
  easeFactor: number; // Default 2.5
  interval: number; // Days until next review
  repetitions: number;
  nextReview: number; // Unix timestamp
  lastScore: number;
}

// User progress
export interface UserProgress {
  cards: Record<string, SRCard>;
  totalAnswered: number;
  totalCorrect: number;
  streakDays: number;
  lastStudyDate: string;
}
