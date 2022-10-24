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

const findWinners = (game: Game): Player[] => {
  return game.players.reduce((winners, player) => {
    if (winners.length === 0) return [player];
    if (player.score[0].value > winners[0].score[0].value) return [player];
    if (player.score[0].value === winners[0].score[0].value)
      return [...winners, player];
    return winners;
  }, [] as Player[]);
};
