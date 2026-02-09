// Position on the tactical board (percentage-based coordinates)
// Coordinate system: rim at TOP (y~10), half-court at BOTTOM (y~95)
export interface Position {
  x: number; // 0-100 (left to right)
  y: number; // 0-100 (rim at top, half-court at bottom)
}

export interface Player {
  id: string;
  label: string;
  isOffense: boolean;
}

export interface AnimationStep {
  playerId: string;
  from: Position;
  to: Position;
  duration: number;
  type: "move" | "screen" | "cut" | "pass" | "dribble";
  hasBall?: boolean;
}

export interface Action {
  steps: AnimationStep[];
  pauseAfter?: number;
  ballPass?: { from: string; to: string };
}

export interface AnswerSpot {
  id: string;
  position: Position;
  score: number; // 100, 50, or 0
  explanation: string;
}

// A single step in a sequence - one question about one player's movement
export interface QuizStep {
  description: string; // What's being asked
  targetPlayerId: string;
  targetPlayerLabel: string;
  // Animations to play BEFORE showing the question
  preAnimations: Action[];
  // Answer options
  answerSpots: AnswerSpot[];
  // Post-answer animation per answer (keyed by answer spot id)
  postAnswerActions?: Record<string, Action[]>;
  feedback: string; // Short feedback on correct answer
  explanation: string; // Why this is the right move
}

// A full quiz sequence - one continuous play broken into multiple steps
export interface QuizSequence {
  id: string;
  title: string;
  subtitle: string;
  description: string; // Overall situation
  players: Player[];
  initialPositions: Record<string, Position>;
  initialBallHolder: string;
  steps: QuizStep[]; // 5-10 sequential questions
  difficulty: 1 | 2 | 3;
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
