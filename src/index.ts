import { Game } from "./helpers/types";
import { curateWinner } from "./game/curation";
import { startGame } from "./game/gameplay";
import { setupGame } from "./game/setup";

const main = (): Game => {
  const game = setupGame();
  const updatedGame = startGame(game);
  return curateWinner(updatedGame);
};

main();
