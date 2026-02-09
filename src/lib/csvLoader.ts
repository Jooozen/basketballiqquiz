import Papa from "papaparse";
import { QuizQuestion, Player, Position, Action, AnswerSpot } from "@/types/quiz";

interface CSVRow {
  id: string;
  category: string;
  title: string;
  description: string;
  difficulty: string;
  // Players as JSON strings
  players_json: string;
  initial_positions_json: string;
  actions_json: string;
  target_player_id: string;
  target_player_label: string;
  answer_spots_json: string;
  correct_feedback: string;
  concept_explanation: string;
}

export async function loadQuestionsFromCSV(
  url: string
): Promise<QuizQuestion[]> {
  const response = await fetch(url);
  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse<CSVRow>(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const questions = results.data.map(rowToQuestion);
          resolve(questions);
        } catch (err) {
          reject(err);
        }
      },
      error: (err: Error) => reject(err),
    });
  });
}

function rowToQuestion(row: CSVRow): QuizQuestion {
  return {
    id: row.id,
    category: row.category as QuizQuestion["category"],
    title: row.title,
    description: row.description,
    players: JSON.parse(row.players_json) as Player[],
    initialPositions: JSON.parse(row.initial_positions_json) as Record<
      string,
      Position
    >,
    actions: JSON.parse(row.actions_json) as Action[],
    targetPlayerId: row.target_player_id,
    targetPlayerLabel: row.target_player_label,
    answerSpots: JSON.parse(row.answer_spots_json) as AnswerSpot[],
    correctFeedback: row.correct_feedback,
    conceptExplanation: row.concept_explanation,
    difficulty: parseInt(row.difficulty) as 1 | 2 | 3,
  };
}

// Load from Google Sheets published as CSV
export async function loadFromGoogleSheets(
  sheetId: string,
  gid: string = "0"
): Promise<QuizQuestion[]> {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
  return loadQuestionsFromCSV(url);
}
