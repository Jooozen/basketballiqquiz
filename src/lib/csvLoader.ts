import Papa from "papaparse";
import { QuizSequence, Player, Position, QuizStep } from "@/types/quiz";

interface CSVSequenceRow {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  difficulty: string;
  players_json: string;
  initial_positions_json: string;
  initial_ball_holder: string;
  steps_json: string;
}

export async function loadSequencesFromCSV(
  url: string
): Promise<QuizSequence[]> {
  const response = await fetch(url);
  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse<CSVSequenceRow>(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const sequences = results.data.map(rowToSequence);
          resolve(sequences);
        } catch (err) {
          reject(err);
        }
      },
      error: (err: Error) => reject(err),
    });
  });
}

function rowToSequence(row: CSVSequenceRow): QuizSequence {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    description: row.description,
    players: JSON.parse(row.players_json) as Player[],
    initialPositions: JSON.parse(row.initial_positions_json) as Record<
      string,
      Position
    >,
    initialBallHolder: row.initial_ball_holder,
    steps: JSON.parse(row.steps_json) as QuizStep[],
    difficulty: parseInt(row.difficulty) as 1 | 2 | 3,
  };
}

// Load from Google Sheets published as CSV
export async function loadFromGoogleSheets(
  sheetId: string,
  gid: string = "0"
): Promise<QuizSequence[]> {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
  return loadSequencesFromCSV(url);
}
