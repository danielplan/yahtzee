import { doFor, resetColor, colorToCode, readInput } from "./helpers";
import type { Color, Game, Player, ScoreElement } from "./types";

export const setupGame = (): Game => {
  console.clear();
  console.log("Welcome to Yahtzee! Please follow the setup steps below!");
  const players = setupPlayers();
  return { players };
};

const setupPlayers = (): Player[] => {
  const playerAmount = promptForPlayerAmount();
  const players: Player[] = [];
  doFor(playerAmount, (playerNumber) => {
    let p = setupPlayer(playerNumber);
    players.push(p);
    return true;
  });

  return players;
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
      value: 0,
      priority: 1,
    },
    {
      label: "Twos",
      value: 0,
      priority: 2,
    },
    {
      label: "Threes",
      value: 0,
      priority: 3,
    },
    {
      label: "Fours",
      value: 0,
      priority: 4,
    },
    {
      label: "Fives",
      value: 0,
      priority: 5,
    },
    {
      label: "Sixes",
      value: 0,
      priority: 6,
    },
    {
      label: "Three of a kind",
      value: 0,
      priority: 7,
    },
    {
      label: "Four of a kind",
      value: 0,
      priority: 8,
    },
    {
      label: "Full house",
      value: 0,
      priority: 9,
    },
    {
      label: "Small straight",
      value: 0,
      priority: 10,
    },
    {
      label: "Large straight",
      value: 0,
      priority: 11,
    },
    {
      label: "Chance",
      value: 0,
      priority: 12,
    },
    {
      label: "Yahtzee",
      value: 0,
      priority: 13,
    },
  ];
};
