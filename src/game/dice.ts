import { readInput, throwDie } from "../helpers/helpers";
import { printDice } from "../helpers/printer";
import type { Die } from "../helpers/types";

const DICE_AMOUNT = 5;
const MAX_THROWS = 3;

export const runDiceTurn = (dice: Die[], currentTurn: number): Die[] => {
  const newDice = rollDice(dice);
  printDice(newDice);
  if (currentTurn < MAX_THROWS - 1) {
    const newFixedDice = redefineFixedDice(newDice);
    if (newFixedDice.some((d) => !d.fixed)) {
      return runDiceTurn(newFixedDice, currentTurn + 1);
    }
  }
  return newDice;
};

export const setupDice = (dice: Die[], current: number): Die[] => {
  if (current === DICE_AMOUNT) return dice;
  const newDice = [
    ...dice,
    {
      id: current + 1,
      fixed: false,
      currentValue: 0,
    },
  ];
  return setupDice(newDice, current + 1);
};

const rollDice = (dice: Die[]): Die[] => {
  return dice.map((d) => {
    if (!d.fixed) {
      return { ...d, currentValue: throwDie() };
    }
    return d;
  });
};

const redefineFixedDice = (dice: Die[]) => {
  const rethrowableDiceIds = promptForRedefineFixedDice(dice);
  return dice.map((d) => {
    if (rethrowableDiceIds.indexOf(d.id) === -1) {
      return {
        ...d,
        fixed: true,
      };
    }
    return d;
  });
};

const promptForRedefineFixedDice = (dice: Die[]): number[] => {
  const rethrowableDiceRaw = readInput(
    "Which dice should be rethrown (e.g. 1,2)? ",
    (input) =>
      input
        .split(",")
        .map((d) => Number.parseInt(d))
        .every((d) => d > 0 && d <= DICE_AMOUNT && !dice[d - 1].fixed) ||
      input === "",
    "Please enter a comma-separated list of numbers between 1 and " +
      DICE_AMOUNT +
      " that are not fixed yet."
  );

  return rethrowableDiceRaw.split(",").map((n) => Number.parseInt(n));
};
