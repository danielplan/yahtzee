import type { Game } from "./helpers/types";
import { curateWinner } from "./game/curation";
import { startGame } from "./game/gameplay";
import { setupGame } from "./game/setup";

/**
 * Implementation of the Yahtzee game, in which functional programming principles were strictly followed.
 */

const main = (): Game => {
  const game = setupGame();
  const updatedGame = startGame(game);
  return curateWinner(updatedGame);
};

main();
