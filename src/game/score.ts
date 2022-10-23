import { DieCount } from "./../helpers/types";
import { readInput, getNumberFromString } from "../helpers/helpers";
import { printCategories } from "../helpers/printer";
import type { Player, Die, ScoreElement } from "../helpers/types";

export const updateScore = (player: Player, dice: Die[]): Player => {
  const category = promptForChosenCategory(player, dice);
  const score = calculateScoreValue(dice, category);

  const recalculatedScore = recalculateScore(player, category, score);
  const recalculatedBonus = recalculateBonus(recalculatedScore);
  return recalculateTotal(recalculatedBonus);
};

const recalculateScore = (
  player: Player,
  category: ScoreElement,
  score: number
): Player => {
  return {
    ...player,
    score: updateScoreArray(player.score, category.label, score),
  };
};

const recalculateBonus = (player: Player): Player => {
  const bonusValue = getUpperBonusValue(player.score);
  return {
    ...player,
    score: updateScoreArray(player.score, "Bonus", bonusValue),
  };
};

const recalculateTotal = (player: Player): Player => {
  const totalValue = getTotalValue(player.score);
  return {
    ...player,
    score: updateScoreArray(player.score, "Total", totalValue),
  };
};

const updateScoreArray = (
  score: ScoreElement[],
  label: string,
  scoreValue: number
): ScoreElement[] => {
  return score.map((s) => {
    if (s.label === label) {
      return {
        ...s,
        value: scoreValue,
      };
    }
    return s;
  });
};

export const calculateScoreValue = (
  dice: Die[],
  category: ScoreElement
): number => {
  if (category.location === "upper") {
    return calculateUpperScore(dice, category);
  }
  if (category.location === "lower") {
    return calculateLowerScore(dice, category);
  }
  return 0;
};

const calculateUpperScore = (dice: Die[], category: ScoreElement): number => {
  const value = getNumberFromString(category.label);
  const sum = calculateValueSum(dice, value);
  return sum === 0 ? -1 : sum;
};

const calculateLowerScore = (dice: Die[], category: ScoreElement): number => {
  switch (category.label) {
    case "Three of a kind":
    case "Four of a kind":
      const { count, value } = maxSameKind(dice);
      const neededAmount = category.label === "Three of a kind" ? 3 : 4;
      return count >= neededAmount ? count * value : -1;
    case "Full house":
      const { count: count1, value: value1 } = maxSameKind(dice);
      const { count: count2 } = maxSameKind(
        dice.filter((d) => d.currentValue !== value1)
      );
      return count1 === 3 && count2 === 2 ? 25 : -1;
    case "Small straight":
    case "Large straight":
      const length = category.label === "Small straight" ? 4 : 5;
      const points = category.label === "Small straight" ? 30 : 50;
      return maxSequenceLength(dice) >= length ? points : -1;
    case "Chance":
      const sum = dice.reduce((acc, d) => acc + d.currentValue, 0);
      return sum === 0 ? -1 : sum;
    case "Yahtzee":
      return maxSameKind(dice).count === 5 ? 50 : -1;
  }
  return 0;
};

const maxSameKind = (dice: Die[]): DieCount => {
  const sameKind = dice.reduce((acc, current) => {
    if (acc[current.currentValue]) {
      return {
        ...acc,
        [current.currentValue]: acc[current.currentValue] + 1,
      };
    }
    return {
      ...acc,
      [current.currentValue]: 1,
    };
  }, {} as Record<number, number>);

  return Object.keys(sameKind).reduce(
    (acc, current) => {
      const currentValue = Number(current);
      if (sameKind[currentValue] > acc.count) {
        return {
          value: currentValue,
          count: sameKind[currentValue],
        };
      }
      return acc;
    },
    { value: 0, count: 0 }
  );
};

const calculateValueSum = (dice: Die[], value: number): number => {
  const amount = dice.filter((d) => d.currentValue === value).length;
  return amount * value;
};

const maxSequenceLength = (dice: Die[]): number => {
  return dice
    .sort((a, b) => a.currentValue - b.currentValue)
    .reduce(
      (acc, current, i, arr) => {
        if (i === 0) {
          return [1];
        }
        if (current.currentValue === arr[i - 1].currentValue + 1) {
          const last = acc[acc.length - 1];
          return [...acc.slice(0, acc.length - 1), last + 1];
        }
        return [...acc, 1];
      },
      [1]
    )
    .reduce((acc, current) => {
      return acc > current ? acc : current;
    }, 0);
};

const getUpperBonusValue = (scores: ScoreElement[]): number => {
  const sum = scores.reduce((acc, current) => {
    if (current.location === "upper") {
      return acc + current.value;
    }
    return acc;
  }, 0);
  return sum >= 63 ? 35 : 0;
};

const getTotalValue = (scores: ScoreElement[]): number => {
  return scores.reduce((acc, current) => {
    if (current.label === "Total" || current.value === -1) {
      return acc;
    }
    return acc + current.value;
  }, 0);
};

const promptForChosenCategory = (player: Player, dice: Die[]): ScoreElement => {
  const availableScoreElements = getAvailableScoreElements(player);
  console.log("");
  printCategories(availableScoreElements, dice);
  const wantedCategory = readInput(
    "Which category do you want to use? ",
    (input) =>
      availableScoreElements.some(
        (s) => s.label.toLowerCase() === input.toLowerCase()
      ),
    "Please enter a valid category",
    [...availableScoreElements.map((s) => s.label)]
  );

  return availableScoreElements.find(
    (s) => s.label.toLowerCase() === wantedCategory.toLowerCase()
  ) as ScoreElement;
};

const getAvailableScoreElements = (player: Player): ScoreElement[] => {
  return player.score.filter((s) => s.value === 0 && s.calculated !== true);
};
