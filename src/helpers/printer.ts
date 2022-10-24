import { calculateScoreValue } from "./../game/score";
import { colorToCode, printTable, resetColor } from "./helpers";
import type { Die, Player, ScoreElement } from "./types";

export const printCategories = (ScoreElements: ScoreElement[], dice: Die[]) => {
  printTitle("Available Categories:");
  ScoreElements.forEach((s) => {
    const scoreValue = parseScoreValue(calculateScoreValue(dice, s));
    console.log(` ✘  ${s.label} \x1b[3m(Points: ${scoreValue})${resetColor}`);
  });
};

const printTitle = (title: string) => {
  console.log(`\x1b[1m${title}${resetColor}`);
};

export const printDice = (dice: Die[]) => {
  console.log("\n\n");
  const firstRow = ["Die", "Value", "Fixed"];
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
  console.log("\n\n");
  printTitle("Current Scores:");
  const firstRow = [
    "Type",
    ...players.map(
      (p) => `${p.color.code}Player ${p.color.label}${resetColor}`
    ),
  ];
  const rows = players.reduce((acc, p) => {
    return p.score.map((s, i) => {
      const value = parseScoreValue(s.value);
      return acc[i] ? [...acc[i], value] : [s.label, value];
    });
  }, [] as string[][]);

  printTable([firstRow, ...rows]);
};

const parseScoreValue = (value: number): string => {
  if (value === -1) return "✘";
  return value.toString();
};

export const printColors = (): void => {
  printTitle("Available Colors:");
  colorToCode.forEach((code, label) => {
    console.log(" ✘  " + code + label + resetColor);
  });
};
