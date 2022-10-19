import { colorToCode, readInput } from "../helpers/helpers";
import { printColors } from "../helpers/printer";
import type { Color, Game, Player, ScoreElement } from "../helpers/types";

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

const setupScore = (): ScoreElement[] => {
  return [
    {
      label: "Ones",
      value: 0,
      location: "upper",
    },
    {
      label: "Twos",
      value: 0,
      location: "upper",
    },
    {
      label: "Threes",
      value: 0,
      location: "upper",
    },
    {
      label: "Fours",
      value: 0,
      location: "upper",
    },
    {
      label: "Fives",
      value: 0,
      location: "upper",
    },
    {
      label: "Sixes",
      value: 0,
      location: "upper",
    },
    {
      label: "Bonus",
      value: 0,
      location: "upper",
      calculated: true,
    },
    {
      label: "Three of a kind",
      value: 0,
      location: "lower",
    },
    {
      label: "Four of a kind",
      value: 0,
      location: "lower",
    },
    {
      label: "Full house",
      value: 0,
      location: "lower",
    },
    {
      label: "Small straight",
      value: 0,
      location: "lower",
    },
    {
      label: "Large straight",
      value: 0,
      location: "lower",
    },
    {
      label: "Chance",
      value: 0,
      location: "lower",
    },
    {
      label: "Yahtzee",
      value: 0,
      location: "lower",
    },
    {
      label: "Total",
      value: 0,
      location: "lower",
      calculated: true,
    },
  ];
};
