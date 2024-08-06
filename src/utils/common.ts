import {
  TIE,
  PLAYER_O,
  PLAYER_X,
  PLAYER_TYPES,
  BOARD_SIZES,
} from "../constants/common";
import { GameBoard, GameSettings } from "../types/types";

export const createBoard = (size: number) =>
  new Array(size).fill(Array(size).fill(null));

// Get a random number between min and max
export const getRandomNumber = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const switchPlayer = (player: number) => {
  return player === PLAYER_X ? PLAYER_O : PLAYER_X;
};

/**
 * This function is used to return a random move for the computer
 * @param board
 * @param boardSize
 * @returns
 */
export const getRandomMove = (board: GameBoard, boardSize?: number | null) => {
  const max = (boardSize ?? BOARD_SIZES._3x3) - 1;
  let row = getRandomNumber(0, max);
  let col = getRandomNumber(0, max);

  while (board[row][col]) {
    row = getRandomNumber(0, max);
    col = getRandomNumber(0, max);
  }

  return [row, col];
};

/**
 * This function returns the game's final status based on player X and O, or tie
 * @param winner
 * @returns
 */
export const getWinnerText = (winner: number) => {
  let winnerText = "";
  switch (winner) {
    case PLAYER_X:
      winnerText = "The winner is player X";
      break;
    case PLAYER_O:
      winnerText = "The winner is player O";
      break;
    case TIE:
    default:
      winnerText = "It's a tie";
  }

  return winnerText;
};

/**
 * This function calculates all winning possibilities, e.g. column, row, or diagonal in order to determine the winner
 *
 * TODO: This function can def be improved by calculating all possibilities dynamically - no hard coding
 * @param board
 * @param boardSize
 * @returns
 */
export const getWinner = (board: GameBoard, boardSize?: number | null) => {
  const dimensions = boardSize ?? BOARD_SIZES._3x3;

  const rowMarked = (row: number, board: GameBoard) => {
    if (dimensions === BOARD_SIZES._3x3) {
      return (
        board[row][0] !== null &&
        board[row][0] === board[row][1] &&
        board[row][1] === board[row][2]
      );
    }
    if (dimensions === BOARD_SIZES._4x4) {
      return (
        board[row][0] !== null &&
        board[row][0] === board[row][1] &&
        board[row][1] === board[row][2] &&
        board[row][2] === board[row][3]
      );
    }
    if (dimensions === BOARD_SIZES._5x5) {
      return (
        board[row][0] !== null &&
        board[row][0] === board[row][1] &&
        board[row][1] === board[row][2] &&
        board[row][2] === board[row][3] &&
        board[row][3] === board[row][4]
      );
    }
  };

  const colMarked = (column: number, board: GameBoard) => {
    if (dimensions === BOARD_SIZES._3x3) {
      return (
        board[0][column] !== null &&
        board[0][column] === board[1][column] &&
        board[1][column] === board[2][column]
      );
    }
    if (dimensions === BOARD_SIZES._4x4) {
      return (
        board[0][column] !== null &&
        board[0][column] === board[1][column] &&
        board[1][column] === board[2][column] &&
        board[2][column] === board[3][column]
      );
    }
    if (dimensions === BOARD_SIZES._5x5) {
      return (
        board[0][column] !== null &&
        board[0][column] === board[1][column] &&
        board[1][column] === board[2][column] &&
        board[2][column] === board[3][column] &&
        board[3][column] === board[4][column]
      );
    }
  };

  const diagonalMarked = (diagonal: number, board: GameBoard) => {
    if (dimensions === BOARD_SIZES._3x3) {
      if (diagonal === 1) {
        return (
          board[0][0] !== null &&
          board[0][0] === board[1][1] &&
          board[1][1] === board[2][2]
        );
      } else {
        return (
          board[2][0] !== null &&
          board[2][0] === board[1][1] &&
          board[1][1] === board[0][2]
        );
      }
    }
    if (dimensions === BOARD_SIZES._4x4) {
      if (diagonal === 1) {
        return (
          board[0][0] !== null &&
          board[0][0] === board[1][1] &&
          board[1][1] === board[2][2] &&
          board[2][2] === board[3][3]
        );
      } else {
        return (
          board[2][0] !== null &&
          board[3][0] === board[2][1] &&
          board[2][1] === board[1][2] &&
          board[1][2] === board[0][3]
        );
      }
    }
    if (dimensions === BOARD_SIZES._5x5) {
      if (diagonal === 1) {
        return (
          board[0][0] !== null &&
          board[0][0] === board[1][1] &&
          board[1][1] === board[2][2] &&
          board[2][2] === board[3][3] &&
          board[3][3] === board[4][4]
        );
      } else {
        return (
          board[2][0] !== null &&
          board[4][0] === board[3][1] &&
          board[3][1] === board[2][2] &&
          board[2][2] === board[1][3] &&
          board[1][3] === board[0][4]
        );
      }
    }
  };

  if (dimensions === BOARD_SIZES._5x5 && rowMarked(4, board)) {
    return board[4][0];
  }
  if (dimensions === BOARD_SIZES._4x4 && rowMarked(3, board)) {
    return board[3][0];
  }

  if (dimensions === BOARD_SIZES._5x5 && colMarked(4, board)) {
    return board[0][4];
  }
  if (dimensions === BOARD_SIZES._4x4 && colMarked(3, board)) {
    return board[0][3];
  }

  if (dimensions === BOARD_SIZES._5x5 && diagonalMarked(2, board)) {
    return board[4][0];
  }
  if (dimensions === BOARD_SIZES._4x4 && diagonalMarked(2, board)) {
    return board[3][0];
  }

  if (rowMarked(0, board)) {
    return board[0][0];
  }
  if (rowMarked(1, board)) {
    return board[1][0];
  }
  if (rowMarked(2, board)) {
    return board[2][0];
  }

  if (colMarked(0, board)) {
    return board[0][0];
  }
  if (colMarked(1, board)) {
    return board[0][1];
  }
  if (colMarked(2, board)) {
    return board[0][2];
  }

  if (diagonalMarked(1, board)) {
    return board[0][0];
  }
  if (diagonalMarked(2, board)) {
    return board[2][0];
  }

  // if we get here, we need to check for any empty spot before we determine if game is a tie
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === null) {
        return null;
      }
    }
  }

  return TIE;
};

export const isUserVsUser = (settings: GameSettings) =>
  settings.playerX === PLAYER_TYPES.user &&
  settings.playerO === PLAYER_TYPES.user;

export const isComputerVsComputer = (settings: GameSettings) =>
  settings.playerX === PLAYER_TYPES.computer &&
  settings.playerO === PLAYER_TYPES.computer;

export const getUserValue = (settings: GameSettings) =>
  isUserVsUser(settings)
    ? PLAYER_X
    : settings.playerX === PLAYER_TYPES.user
    ? PLAYER_X
    : PLAYER_O;

export const getComputerValue = (settings: GameSettings) =>
  isComputerVsComputer(settings)
    ? PLAYER_X
    : settings.playerO === PLAYER_TYPES.computer
    ? PLAYER_O
    : PLAYER_X;
