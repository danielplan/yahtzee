import { doFor, throwDie, printTable, resetColor, readInput } from "./helpers";
import type { Game, Player, ScoreElement, Die } from "./types";

const diceAmount = 5;
const maxThrows = 3;
const turns = 13;

export const startGame = (game: Game) => {
  console.clear();
  doFor(turns, (i) => {
    console.log("\n----------------------------------------");
    console.log("\n\nRound " + (i + 1));

    game.players.forEach((player, i) => {
      console.log(
        "\n\nIt's your turn, " +
          player.color.code +
          player.color.label +
          resetColor +
          "!\n"
      );
      game.players[i] = runTurn(player);
      console.clear();
      printScores(game.players);
    });
    return true;
  });
};

const runTurn = (player: Player): Player => {
  let dice = setupDice();
  let throws = 0;
  do {
    dice = throwDice(dice);
    console.log("\n");
    printDice(dice);
    throws++;
    if (throws <= maxThrows) {
      dice = defineFixed(dice);
    }
  } while (dice.filter((d) => !d.fixed).length > 0 && throws <= maxThrows);

  return updateScore(player, dice);
};

const setupDice = (): Die[] => {
  let dice: Die[] = [];

  doFor(diceAmount, (i) => {
    dice = [
      ...dice,
      {
        id: i + 1,
        fixed: false,
        currentValue: 0,
      },
    ];
    return true;
  });
  return dice;
};

const throwDice = (dice: Die[]): Die[] => {
  const d = dice.map((d) => {
    if (!d.fixed) {
      d.currentValue = throwDie();
    }
    return d;
  });
  return d;
};

const defineFixed = (dice: Die[]) => {
  const rethrownDiceRaw = readInput(
    "Which dice should be rethrown (e.g. 1,2)? ",
    (input) => {
      return (
        input
          .split(",")
          .map((d) => Number.parseInt(d))
          .every((d) => d > 0 && d <= diceAmount && !dice[d - 1].fixed) ||
        input === ""
      );
    },
    "Please enter a comma-separated list of numbers between 1 and " +
      diceAmount +
      " that are not fixed yet."
  );

  const rethrownDice = rethrownDiceRaw
    .split(",")
    .map((n) => Number.parseInt(n));

  return dice.map((d) => {
    if (rethrownDice.indexOf(d.id) === -1) {
      d.fixed = true;
    }
    return d;
  });
};

const updateScore = (player: Player, dice: Die[]): Player => {
  printCategories(player);
  const wantedCategory = readInput(
    "Which category do you want to use? ",
    (input) => {
      return player.score.some(
        (s) => s.label.toLowerCase() === input.toLowerCase()
      );
    },
    "Please enter a valid category",
    [...player.score.map((s) => s.label)]
  );
  const category = wantedCategory.trim().toLowerCase();
  let score = 0;

  if (
    ["ones", "twos", "threes", "fours", "fives", "sixes"].indexOf(category) !==
    -1
  ) {
    score = dice.reduce((acc, d) => {
      switch (category) {
        case "ones":
          if (d.currentValue === 1) {
            acc += 1;
          }
          break;
        case "twos":
          if (d.currentValue === 2) {
            acc += 2;
          }
          break;
        case "threes":
          if (d.currentValue === 3) {
            acc += 3;
          }
          break;
        case "fours":
          if (d.currentValue === 4) {
            acc += 4;
          }
          break;
        case "fives":
          if (d.currentValue === 5) {
            acc += 5;
          }
          break;
        case "sixes":
          if (d.currentValue === 6) {
            acc += 6;
          }
          break;
      }
      return acc;
    }, score);
  } else {
    switch (category) {
      case "three of a kind":
        for (let die of dice) {
          const sameValue = countSameValue(die, dice);
          if (sameValue >= 3) {
            score = sameValue * die.currentValue;
            break;
          }
        }
        break;
      case "four of a kind":
        for (let die of dice) {
          const sameValue = countSameValue(die, dice);
          if (sameValue >= 4) {
            score = sameValue * die.currentValue;
            break;
          }
        }
        break;
      case "full house":
        let threeOfAKind = false;
        let twoOfAKind = false;
        for (let die of dice) {
          const sameValue = countSameValue(die, dice);
          if (sameValue === 3) {
            threeOfAKind = true;
          }
          if (sameValue === 2) {
            twoOfAKind = true;
          }
        }

        if (threeOfAKind && twoOfAKind) {
          score = 25;
        }
        break;
      case "small straight":
        if (countSequenceLength(dice) >= 4) {
          score = 30;
        }

        break;
      case "large straight":
        if (countSequenceLength(dice) >= 5) {
          score = 50;
        }
        break;
      case "chance":
        score = dice.reduce((acc, d) => acc + d.currentValue, score);
        break;
      case "yahtzee":
        for (let die of dice) {
          const sameValue = countSameValue(die, dice);
          if (sameValue === 5) {
            score = 50;
            break;
          }
        }
        break;
    }
  }
  const scoreElement = player.score.find(
    (s) => s.label.toLowerCase() === category
  ) as ScoreElement;

  return {
    ...player,
    score: [
      ...player.score.filter((s) => s.label.toLowerCase() !== category),
      {
        ...scoreElement,
        value: score,
      },
    ],
  };
};

const countSameValue = (currentDie: Die, dice: Die[]) => {
  return dice.filter((d) => d.currentValue === currentDie.currentValue).length;
};

const countSequenceLength = (dice: Die[]): number => {
  const sortedDice = dice.sort((a, b) => a.currentValue - b.currentValue);

  let currentSequenceLength = 1;
  let maxSequenceLength = 0;
  sortedDice.forEach((die, i, d) => {
    if (i > 0 && d[i - 1].currentValue + 1 === die.currentValue) {
      currentSequenceLength++;
    } else {
      if (maxSequenceLength < currentSequenceLength) {
        maxSequenceLength = currentSequenceLength;
      }
      currentSequenceLength = 1;
    }
  });
  if (maxSequenceLength < currentSequenceLength) {
    maxSequenceLength = currentSequenceLength;
  }

  return maxSequenceLength;
};

const printDice = (dice: Die[]) => {
  const firstRow = ["Die nr.", "Value", "Fixed"];
  printTable([
    firstRow,
    ...dice.map((d) => [
      d.id.toString(),
      d.currentValue.toString(),
      d.fixed ? "☑️" : "☐",
    ]),
  ]);
};

const printScores = (players: Player[]) => {
  console.log("\n\n\n--- Current Scores ---\n");
  const firstRow = ["Type"];

  let rows: string[][] = [];
  players.forEach((p) => {
    firstRow.push("Score of " + p.color.code + p.color.label + resetColor);
    p.score
      .sort((a, b) => a.priority - b.priority)
      .forEach((s, i) => {
        if (!rows[i]) {
          rows[i] = [s.label];
        }
        rows[i].push(s.value.toString());
      });
  });
  printTable([firstRow, ...rows]);
};

const printCategories = (player: Player) => {
  console.log("Available categories:");
  player.score
    .sort((a, b) => a.priority - b.priority)
    .forEach((s) => {
      console.log("✘  " + s.label);
    });
};
