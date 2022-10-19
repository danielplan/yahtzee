import { colorToCode, printTable, resetColor } from "./helpers";
import type { Die, Player, ScoreElement } from "./types";

export const printCategories = (ScoreElements: ScoreElement[]) => {
  console.log("Available categories:");
  ScoreElements.forEach((s) => {
    console.log("✘  " + s.label);
  });
};

export const printDice = (dice: Die[]) => {
  console.log("\n\n");
  const firstRow = ["Die N.", "Value", "Fixed"];
  printTable([
    firstRow,
    ...dice.map((d) => [
      d.id.toString(),
      d.currentValue.toString(),
      d.fixed ? "☑️" : "☐",
    ]),
  ]);
};

export const printScores = (players: Player[]) => {
  console.log("\n\n\n--- Current Scores ---\n");
  const firstRow = ["Type"];

  let rows: string[][] = [];
  players.forEach((p) => {
    firstRow.push("Score of " + p.color.code + p.color.label + resetColor);
    p.score.forEach((s, i) => {
      if (!rows[i]) {
        rows[i] = [s.label];
      }
      const value = parseScoreValue(s.value);
      rows[i].push(value);
    });
  });
  printTable([firstRow, ...rows]);
};

const parseScoreValue = (value: number): string => {
  switch (value) {
    case -1:
      return "0";
    case 0:
      return "✘";
    default:
      return value.toString();
  }
};

export const printColors = (): void => {
  console.log("Available colors:");
  colorToCode.forEach((code, label) => {
    console.log("✘  " + code + label + resetColor);
  });
};
