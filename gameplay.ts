import { throwDie, printTable, resetColor, readInput } from "./helpers";
import type { Game, Player, ScoreElement, Die } from "./types";

const DICE_AMOUNT = 5;
const MAX_THROWS = 3;
const TURNS_AMOUNT = 13;

export const startGame = (game: Game): Game => {
  console.clear();

  const players = runRounds(game.players, 0);

  return {
    ...game,
    players,
  };
};

const runRounds = (players: Player[], current: number): Player[] => {
  if (current === TURNS_AMOUNT) return players;
  console.log("\n----------------------------------------");
  console.log("\n\nRound " + (current + 1));

  const updatedPlayers = players.map((p, i, players) => {
    const player = runTurn(p);
    printScores([...players.slice(0, i), player, ...players.slice(i + 1)]);
    console.clear();
    return player;
  });

  return runRounds(updatedPlayers, current + 1);
};

const runTurn = (player: Player): Player => {
  const { color } = player;
  console.log(
    `\n\nIt's your turn, ${color.code}${color.label}${resetColor}!\n`
  );
  const initialDice = setupDice([], 0);
  const dice = runDiceTurn(initialDice, 0);
  return updateScore(player, dice);
};

const runDiceTurn = (dice: Die[], currentTurn: number): Die[] => {
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

const setupDice = (dice: Die[], current: number): Die[] => {
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
  const rethrownDiceRaw = readInput(
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

  const rethrownDiceIds = rethrownDiceRaw
    .split(",")
    .map((n) => Number.parseInt(n));

  return dice.map((d) => {
    if (rethrownDiceIds.indexOf(d.id) === -1) {
      return {
        ...d,
        fixed: true,
      };
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
        const value = parseScoreValue(s.value);
        rows[i].push(value);
      });
    rows[rows.length] = ["Bonus", calculateBonus(p.score).toString()];
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

const calculateBonus = (scores: ScoreElement[]): number => {
  const sum = scores.reduce((acc, current) => {
    if (current.priority <= 6) {
      return acc + current.value;
    }
    return acc;
  }, 0);
  return sum >= 63 ? 35 : 0;
};

const printCategories = (player: Player) => {
  console.log("Available categories:");
  player.score
    .sort((a, b) => a.priority - b.priority)
    .forEach((s) => {
      console.log("✘  " + s.label);
    });
};
