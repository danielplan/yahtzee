import { Game } from "./types";
import { curateWinner } from "./curation";
import { startGame } from "./gameplay";
import { setupGame } from "./setup";

const main = (): Game => {
  const game = setupGame();
  const updatedGame = startGame(game);
  return curateWinner(updatedGame);
};

main();
