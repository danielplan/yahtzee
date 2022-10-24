import { resetColor } from "./../helpers/helpers";
import type { Game, Player } from "../helpers/types";

export const curateWinner = (game: Game): Game => {
  const winners = findWinners(game);
  console.clear();
  console.log("The game is over!\n");
  const winnerNames = winners
    .map((w) => w.color.code + w.color.label)
    .join(`${resetColor}, `);
  console.log(
    `The winner${
      winners.length > 1 ? "s are" : " is"
    } ${winnerNames}${resetColor}!`
  );
  return game;
};

const getTotalScore = (player: Player): number => {
  return player.score.find((s) => s.label === "Total")?.value || 0;
};

const findWinners = (game: Game): Player[] => {
  return game.players.reduce((winners, player) => {
    if (winners.length === 0) return [player];
    const winnerTotal = getTotalScore(winners[0]);
    const playerTotal = getTotalScore(player);
    if (playerTotal > winnerTotal) return [player];
    if (playerTotal === winnerTotal) return [...winners, player];
    return winners;
  }, [] as Player[]);
};
