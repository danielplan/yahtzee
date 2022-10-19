import type { Game, Player } from "../helpers/types";

export const curateWinner = (game: Game): Game => {
  const winner = findWinner(game);
  console.clear();
  console.log("The game is over!\n");
  console.log(`The winner is ${winner.color.code}${winner.color.label}!`);
  return game;
};

const findWinner = (game: Game): Player => {
  return game.players.reduce((acc, player) => {
    if (player.score > acc.score) return player;
    return acc;
  }, game.players[0]);
};
