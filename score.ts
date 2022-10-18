import { readInput } from "./helpers";
import { printCategories } from "./printer";
import { Player, Die, ScoreElement } from "./types";

export const updateScore = (player: Player, dice: Die[]): Player => {
  const category = promptForChosenCategory(player);
  const score = calculateScoreValue(dice, category);
  const scoreElementIndex = player.score.findIndex(
    (s) => s.label === category.label
  );

  return {
    ...player,
    score: [
      ...player.score.splice(0, scoreElementIndex),
      {
        ...player.score[scoreElementIndex],
        value: score,
      },
      ...player.score.splice(scoreElementIndex + 1),
    ],
  };
};

const calculateScoreValue = (dice: Die[], category: ScoreElement): number => {
  if (category.location === "upper") {
    return calculateUpperScore(dice, category);
  }
  if (category.location === "lower") {
    return calculateLowerScore(dice, category);
  }
  return 0;
};

const calculateUpperScore = (dice: Die[], category: ScoreElement): number => {
  switch (category.label) {
    case "Ones":
      return calculateValueSum(dice, 1);
    case "Twos":
      return calculateValueSum(dice, 2);
    case "Threes":
      return calculateValueSum(dice, 3);
    case "Fours":
      return calculateValueSum(dice, 4);
    case "Fives":
      return calculateValueSum(dice, 5);
    case "Sixes":
      return calculateValueSum(dice, 6);
  }
  return 0;
};

const calculateLowerScore = (dice: Die[], category: ScoreElement): number => {
  switch (category.label) {
    case "Three of a kind":
    case "Four of a kind":
      const { count, value } = maxSameKind(dice);
      const neededAmount = category.label === "Three of a kind" ? 3 : 4;
      return count >= neededAmount ? count * value : 0;
    case "Full house":
      const { count: count1, value: value1 } = maxSameKind(dice);
      const { count: count2, value: value2 } = maxSameKind(
        dice.filter((d) => d.currentValue !== value1)
      );
      return count1 === 3 && count2 === 2 ? 25 : 0;
    case "Small straight":
      return maxSequenceLength(dice) >= 4 ? 30 : 0;
    case "Large straight":
      return maxSequenceLength(dice) >= 5 ? 50 : 0;
    case "Chance":
      return dice.reduce((acc, d) => acc + d.currentValue, 0);
    case "Yahtzee":
      return maxSameKind(dice).count === 5 ? 50 : 0;
  }
  return 0;
};

const maxSameKind = (
  dice: Die[]
): {
  value: number;
  count: number;
} => {
  const sameKind = dice.reduce((acc, current) => {
    if (acc[current.currentValue]) {
      acc[current.currentValue] += 1;
    } else {
      acc[current.currentValue] = 1;
    }
    return acc;
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
    .reduce(
      (acc, current, i, arr) => {
        if (i === 0) {
          return [1];
        }
        if (current.currentValue === arr[i - 1].currentValue + 1) {
          const last = acc.pop() as number;
          acc.push(last + 1);
        } else {
          acc.push(1);
        }

        return acc;
      },
      [1]
    )
    .reduce((acc, current) => {
      return acc > current ? acc : current;
    }, 0);
};

const calculateBonus = (scores: ScoreElement[]): number => {
  const sum = scores.reduce((acc, current) => {
    if (current.location === "upper") {
      return acc + current.value;
    }
    return acc;
  }, 0);
  return sum >= 63 ? 35 : 0;
};

const promptForChosenCategory = (player: Player): ScoreElement => {
  const availableScoreElements = getAvailableScoreElements(player);
  printCategories(availableScoreElements);
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
  return player.score.filter(
    (s) => (s.amount !== undefined || s.value === -1) && s.calculated !== true
  );
};
