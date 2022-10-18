import { resetColor, colorToCode, readInput } from "./helpers";
import type { Color, Game, Player, ScoreElement } from "./types";

export const setupGame = (): Game => {
  console.clear();
  console.log("Welcome to Yahtzee!\n\nPlease follow the setup steps below!");
  const playerAmount = promptForPlayerAmount();
  const players = setupPlayers([], 0, playerAmount);
  return { players };
};

const setupPlayers = (
  players: Player[],
  current: number,
  amount: number
): Player[] => {
  if (current === amount) return players;
  const newPlayers = [...players, setupPlayer(current)];
  return setupPlayers(newPlayers, current + 1, amount);
};

const promptForPlayerAmount = (): number => {
  const playerAmount = readInput(
    "How many players are playing? ",
    (input) => {
      const parsed = parseInt(input);
      return !isNaN(parsed) && parsed > 0;
    },
    "Please enter a number greater than 0!"
  );

  return Number.parseInt(playerAmount);
};

const setupPlayer = (playerNumber: number): Player => {
  console.clear();
  printColors();
  const color = promptForColor(playerNumber);
  const score = setupScore();
  return { color, score };
};

const promptForColor = (playerNumber: number): Color => {
  const color = readInput(
    `Enter the color of Player N. ${playerNumber + 1}: `,
    (input) => {
      return colorToCode.has(input);
    },
    "Please enter a valid color!",
    [...colorToCode.keys()]
  );
  return {
    label: color,
    code: colorToCode.get(color) || "",
  };
};

const printColors = (): void => {
  console.log("Available colors:");
  colorToCode.forEach((code, label) => {
    console.log("✘  " + code + label + resetColor);
  });
};

const setupScore = (): ScoreElement[] => {
  return [
    {
      label: "Ones",
      value: -1,
      priority: 1,
    },
    {
      label: "Twos",
      value: -1,
      priority: 2,
    },
    {
      label: "Threes",
      value: -1,
      priority: 3,
    },
    {
      label: "Fours",
      value: -1,
      priority: 4,
    },
    {
      label: "Fives",
      value: -1,
      priority: 5,
    },
    {
      label: "Sixes",
      value: -1,
      priority: 6,
    },
    {
      label: "Three of a kind",
      value: -1,
      priority: 7,
    },
    {
      label: "Four of a kind",
      value: -1,
      priority: 8,
    },
    {
      label: "Full house",
      value: -1,
      priority: 9,
    },
    {
      label: "Small straight",
      value: -1,
      priority: 10,
    },
    {
      label: "Large straight",
      value: -1,
      priority: 11,
    },
    {
      label: "Chance",
      value: -1,
      priority: 12,
    },
    {
      label: "Yahtzee",
      value: -1,
      priority: 13,
    },
  ];
};
