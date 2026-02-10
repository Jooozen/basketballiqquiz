import Papa from "papaparse";
import { Possession, Player, Position, DecisionStep } from "@/types/quiz";

interface CSVPossessionRow {
  id: string;
  title: string;
  description: string;
  players_json: string;
  initial_positions_json: string;
  initial_ball_holder: string;
  steps_json: string;
}

export async function loadPossessionsFromCSV(url: string): Promise<Possession[]> {
  const response = await fetch(url);
  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse<CSVPossessionRow>(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const data = results.data.map(rowToPossession);
          resolve(data);
        } catch (err) {
          reject(err);
        }
      },
      error: (err: Error) => reject(err),
    });
  });
}

function rowToPossession(row: CSVPossessionRow): Possession {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    players: JSON.parse(row.players_json) as Player[],
    initialPositions: JSON.parse(row.initial_positions_json) as Record<string, Position>,
    initialBallHolder: row.initial_ball_holder,
    steps: JSON.parse(row.steps_json) as DecisionStep[],
  };
}

export async function loadFromGoogleSheets(sheetId: string, gid: string = "0"): Promise<Possession[]> {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
  return loadPossessionsFromCSV(url);
}
