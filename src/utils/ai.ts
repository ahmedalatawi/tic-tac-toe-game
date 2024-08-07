import {
  BOARD_SIZES,
  PLAYER_O,
  PLAYER_TYPES,
  PLAYER_X,
} from "../constants/common";
import { GameBoard, GameSettings } from "../types/types";
import { isComputerVsComputer, switchPlayer } from "./common";

/**
 *
 * This file has functions for implementing AI using Minimax Algorithm
 *
 * Resource: https://www.geeksforgeeks.org/finding-optimal-move-in-tic-tac-toe-using-minimax-algorithm-in-game-theory/
 */

/**
 * This function returns true if there are moves
   remaining on the board. It returns false if
   there are no moves left to play.
 * @param board 
 * @param boardSize 
 * @returns 
 */
function isMovesLeft(board: GameBoard, boardSize: number) {
  for (let i = 0; i < boardSize; i++)
    for (let j = 0; j < boardSize; j++) if (board[i][j] === null) return true;

  return false;
}

/**
 * This is the evaluation function as discussed
 * in the previous article ( http://goo.gl/sJgv68 )
 * @param b
 * @param human
 * @param ai
 * @param boardSize
 * @returns
 */
function evaluate(b: GameBoard, human: number, ai: number, boardSize: number) {
  // Checking for Rows for X or O victory.
  for (let row = 0; row < boardSize; row++) {
    if (b[row][0] === b[row][1] && b[row][1] === b[row][2]) {
      if (b[row][0] === ai) return +10;
      else if (b[row][0] === human) return -10;
    }
  }

  // Checking for Columns for X or O victory.
  for (let col = 0; col < boardSize; col++) {
    if (b[0][col] === b[1][col] && b[1][col] === b[2][col]) {
      if (b[0][col] === ai) return +10;
      else if (b[0][col] === human) return -10;
    }
  }

  // Checking for Diagonals for X or O victory.
  if (b[0][0] === b[1][1] && b[1][1] === b[2][2]) {
    if (b[0][0] === ai) return +10;
    else if (b[0][0] === human) return -10;
  }

  if (b[0][2] === b[1][1] && b[1][1] === b[2][0]) {
    if (b[0][2] === ai) return +10;
    else if (b[0][2] === human) return -10;
  }

  // Else if none of them have
  // won then return 0
  return 0;
}

/**
 * This is the minimax function. It
 * considers all the possible ways
   the game can go and returns the
   value of the board
 * @param board 
 * @param depth 
 * @param isMax 
 * @param human 
 * @param ai 
 * @param boardSize 
 * @returns 
 */
function minimax(
  board: GameBoard,
  depth: number,
  isMax: boolean,
  human: number,
  ai: number,
  boardSize: number,
) {
  let score = evaluate(board, human, ai, boardSize);

  // If Maximizer has won the game
  // return his/her evaluated score
  if (score === 10) return score;

  // If Minimizer has won the game
  // return his/her evaluated score
  if (score === -10) return score;

  // If there are no more moves and
  // no winner then it is a tie
  if (isMovesLeft(board, boardSize) === false) return 0;

  // If this maximizer's move
  if (isMax) {
    let best = -1000;

    // Traverse all cells
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        // Check if cell is empty
        if (board[i][j] === null) {
          // Make the move
          board[i][j] = ai;

          // Call minimax recursively
          // and choose the maximum value
          best = Math.max(
            best,
            minimax(board, depth + 1, !isMax, human, ai, boardSize),
          );

          // Undo the move
          board[i][j] = null;
        }
      }
    }
    return best;
  }

  // If this minimizer's move
  else {
    let best = 1000;

    // Traverse all cells
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        // Check if cell is empty
        if (board[i][j] == null) {
          // Make the move
          board[i][j] = human;

          // Call minimax recursively and
          // choose the minimum value
          best = Math.min(
            best,
            minimax(board, depth + 1, !isMax, human, ai, boardSize),
          );

          // Undo the move
          board[i][j] = null;
        }
      }
    }
    return best;
  }
}

// This will return the best possible
// move for the player
export function getAiMove(
  board: GameBoard,
  settings: GameSettings | null,
  currentPlayer: number | null,
) {
  let human = PLAYER_X,
    ai = PLAYER_O;

  const computerVsComputer = settings ? isComputerVsComputer(settings) : false;

  if (computerVsComputer) {
    const currPlayer = currentPlayer ?? PLAYER_X;
    human = switchPlayer(currPlayer);
    ai = currPlayer;
  } else {
    human = settings?.playerX === PLAYER_TYPES.user ? PLAYER_X : PLAYER_O;
    ai = switchPlayer(human);
  }

  const boardSize = settings?.boardSize ?? BOARD_SIZES._3x3;

  let bestVal = -1000;
  let row = -1;
  let col = -1;

  // Traverse all cells, evaluate
  // minimax function for all empty
  // cells. And return the cell
  // with optimal value.
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      // Check if cell is empty
      if (board[i][j] === null) {
        // Make the move
        board[i][j] = ai;

        // compute evaluation function
        // for this move.
        let moveVal = minimax(board, 0, false, human, ai, boardSize);

        // Undo the move
        board[i][j] = null;

        // If the value of the current move
        // is more than the best value, then
        // update best
        if (moveVal > bestVal) {
          row = i;
          col = j;
          bestVal = moveVal;
        }
      }
    }
  }

  return [row, col];
}
