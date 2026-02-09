import { SRCard, UserProgress } from "@/types/quiz";

const STORAGE_KEY = "basketball-iq-progress";

// SM-2 Algorithm adapted for quiz scoring
// Based on SuperMemo's spaced repetition algorithm
export function calculateNextReview(
  card: SRCard,
  score: number // 0, 50, or 100
): SRCard {
  const quality = score === 100 ? 5 : score === 50 ? 3 : 1;

  let { easeFactor, interval, repetitions } = card;

  if (quality >= 3) {
    // Correct or partially correct
    if (repetitions === 0) {
      interval = 1; // 1 day
    } else if (repetitions === 1) {
      interval = 3; // 3 days
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  } else {
    // Incorrect - reset
    repetitions = 0;
    interval = 0; // Review again immediately (same session or next)
  }

  // Update ease factor
  easeFactor =
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const nextReview = Date.now() + interval * 24 * 60 * 60 * 1000;

  return {
    ...card,
    easeFactor,
    interval,
    repetitions,
    nextReview,
    lastScore: score,
  };
}

// Get questions due for review, sorted by priority
export function getDueQuestions(
  progress: UserProgress,
  allQuestionIds: string[]
): string[] {
  const now = Date.now();
  const due: { id: string; priority: number }[] = [];

  for (const id of allQuestionIds) {
    const card = progress.cards[id];
    if (!card) {
      // New question - highest priority
      due.push({ id, priority: 0 });
    } else if (card.nextReview <= now) {
      // Due for review - priority by how overdue
      due.push({ id, priority: card.nextReview });
    }
  }

  // Sort: new questions first, then most overdue
  due.sort((a, b) => a.priority - b.priority);
  return due.map((d) => d.id);
}

// Create a new card for a question
export function createNewCard(questionId: string): SRCard {
  return {
    questionId,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: 0,
    lastScore: 0,
  };
}

// Load progress from localStorage
export function loadProgress(): UserProgress {
  if (typeof window === "undefined") {
    return getDefaultProgress();
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // Ignore parse errors
  }
  return getDefaultProgress();
}

// Save progress to localStorage
export function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore storage errors
  }
}

function getDefaultProgress(): UserProgress {
  return {
    cards: {},
    totalAnswered: 0,
    totalCorrect: 0,
    streakDays: 0,
    lastStudyDate: "",
  };
}

// Update streak
export function updateStreak(progress: UserProgress): UserProgress {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000)
    .toISOString()
    .split("T")[0];

  if (progress.lastStudyDate === today) {
    return progress; // Already studied today
  }

  const newStreak =
    progress.lastStudyDate === yesterday ? progress.streakDays + 1 : 1;

  return {
    ...progress,
    streakDays: newStreak,
    lastStudyDate: today,
  };
}
