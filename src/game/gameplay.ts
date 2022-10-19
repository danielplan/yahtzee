import { runDiceTurn, setupDice } from "./dice";
import { resetColor } from "../helpers/helpers";
import { printScores } from "../helpers/printer";
import { updateScore } from "./score";
import type { Game, Player } from "../helpers/types";

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
  console.log("\n\nRound " + (current + 1));

  const updatedPlayers = players.map((p, i, players) => {
    const player = runTurn(p);
    console.clear();
    printScores([...players.slice(0, i), player, ...players.slice(i + 1)]);
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
