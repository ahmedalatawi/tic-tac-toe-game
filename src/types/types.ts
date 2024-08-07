export type PlayerTypes = "user" | "computer";
export type GameBoard = (number | null)[][];
export type GameSettings = {
  playerX: PlayerTypes | null;
  playerO: PlayerTypes | null;
  boardSize: number | null;
  useAi: boolean;
};
export type Players = {
  user: number | null;
  computer: number | null;
};
