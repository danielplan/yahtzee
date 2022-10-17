import { startGame } from "./gameplay";
import { setupGame } from "./setup";

const main = (): void => {
  const game = setupGame();
  startGame(game);
};

main();
