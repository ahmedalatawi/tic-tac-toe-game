import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useCallback, useEffect, useState } from "react";
import Board from "./Board";
import { BOARD_SIZES, GAME_STATES, PLAYER_X } from "../constants/common";
import {
  createBoard,
  getComputerValue,
  getRandomMove,
  getUserValue,
  getWinner,
  getWinnerText,
  isComputerVsComputer,
  isUserVsUser,
  switchPlayer,
} from "../utils/common";
import { displayAlert } from "../utils/alert";
import { GameBoard, GameSettings, Players } from "../types/types";
import Settings from "./Settings";
import { Colors } from "../constants/colors";
import { getAiMove } from "../utils/ai";

// create a 3x3 as the default board
const emptyBoard = createBoard(BOARD_SIZES._3x3);

/**
 *
 * Core component for handling game logic and implementation
 */
function Game() {
  const [board, setBoard] = useState<GameBoard>(emptyBoard);
  const [gameState, setGameState] = useState(GAME_STATES.notStarted);
  const [nextMove, setNextMove] = useState<null | number>(null);
  const [winner, setWinner] = useState<null | string>(null);
  const [players, setPlayers] = useState<Players>({
    user: null,
    computer: null,
  });
  const [currentPlayer, setCurrentPlayer] = useState<null | number>(null);
  const [gameSettings, setGameSettings] = useState<GameSettings | null>(null);

  // This function handles updating the board, invoked by userMove or computerMove function
  const updateBoard = useCallback(
    (row: number, col: number, player: number | null) => {
      player &&
        gameState === GAME_STATES.inProgress &&
        setBoard((board) => {
          const boardCopy = board.map((arr) => arr.slice());
          boardCopy[row][col] = player;
          return boardCopy;
        });
    },
    [gameState],
  );

  //This function handles the user's interaction on the board
  const userMove = (row: number, col: number) => {
    if (!board[row][col] && nextMove === players.user) {
      const currPlayer = currentPlayer ? switchPlayer(currentPlayer) : nextMove;

      //if it's user vs. user, let the opposite of player X or O update the board
      updateBoard(row, col, players.computer ? players.user : currPlayer);

      //if it's user vs. user, let the user make the next move
      setNextMove(players.computer ? players.computer : players.user);
      setCurrentPlayer(currPlayer);
    }
  };

  //This function handles the computer's interaction on the board
  const computerMove = useCallback(() => {
    const currPlayer = currentPlayer ? switchPlayer(currentPlayer) : nextMove;

    // if AI is incorporated, call getAiMove, otherwise call getRandomMove
    const [row, col] = gameSettings?.useAi
      ? getAiMove(board, gameSettings, currPlayer)
      : getRandomMove(board, gameSettings?.boardSize);

    //if it's computer vs. computer, let the opposite of player X or O update the board
    updateBoard(row, col, players.user ? players.computer : currPlayer);

    //if it's computer vs. computer, let the computer make the next move
    setNextMove(players.user ? players.user : players.computer);
    setCurrentPlayer(currPlayer);
  }, [board, players, currentPlayer, updateBoard]);

  // handler for when game is started
  const handleStartGame = (settings: GameSettings) => {
    setGameSettings(settings);

    const userVsUser = isUserVsUser(settings);
    const computerVsComputer = isComputerVsComputer(settings);

    const user = getUserValue(settings);
    const computer = getComputerValue(settings);

    setBoard(createBoard(settings.boardSize ?? BOARD_SIZES._3x3));
    setGameState(GAME_STATES.inProgress);
    setPlayers({
      user: computerVsComputer ? null : user,
      computer: userVsUser ? null : computer,
    });

    //Player X always makes the first move
    setNextMove(PLAYER_X);
    setCurrentPlayer(null);
  };

  //Reset all states when game is started
  const startNewGame = () => {
    setGameState(GAME_STATES.notStarted);
    setBoard(emptyBoard);
    setWinner(null);
    setNextMove(null);
    setCurrentPlayer(null);
    setGameSettings(null);
  };

  //We need this to keep track of whose next move is, and also ensure the right track of turns
  useEffect(() => {
    let timeout: any;
    const isComputerMove =
      nextMove &&
      nextMove === players.computer &&
      gameState !== GAME_STATES.ended;

    if (isComputerMove) {
      timeout = setTimeout(
        () => {
          computerMove();
        },
        // Give it more time when it's a computer .vs computer
        players.user ? 500 : 1200,
      );
    }
    return () => {
      // clean up timeout
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [gameState, nextMove, players.computer, computerMove]);

  useEffect(() => {
    if (gameState !== GAME_STATES.ended) {
      const winnerValue = getWinner(board, gameSettings?.boardSize);

      if (winnerValue !== null) {
        //Return either a win or tie
        const winnerText = getWinnerText(winnerValue);

        setGameState(GAME_STATES.ended);
        setWinner(winnerText);
        setNextMove(null);
        displayAlert("Game over", winnerText);
      }
    }
  }, [board, nextMove, gameState]);

  const getPlayersTurnInfo = () => {
    let playerStateInfo = "";
    const playerVsItself = !players.user || !players.computer;

    if (playerVsItself) {
      playerStateInfo = winner
        ? winner
        : currentPlayer === PLAYER_X
          ? "Player O's turn"
          : "Player X's turn";
    } else {
      playerStateInfo = winner
        ? winner
        : nextMove === PLAYER_X
          ? "Player X's turn"
          : "Player O's turn";
    }

    return playerStateInfo;
  };

  const gameStateInfo =
    gameState === GAME_STATES.inProgress ? "Game in progress" : "Game over";

  return gameState === GAME_STATES.notStarted ? (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Tic Tac Toe</Text>
      <Settings onStartGame={(settings) => handleStartGame(settings)} />
    </View>
  ) : (
    <View style={styles.boardContainer}>
      <View style={styles.gameStateTextContainer}>
        <Text
          style={styles.playersInfoText}
        >{`${gameSettings?.playerX?.toUpperCase()} .vs ${gameSettings?.playerO?.toUpperCase()}`}</Text>
        <Text style={styles.gameStateText}>{gameStateInfo}</Text>
      </View>
      <Board
        board={board}
        gameState={gameState}
        disabled={!players.user}
        onPressUser={(rowIndex, colIndex) => userMove(rowIndex, colIndex)}
      />
      <View style={styles.playerTextContainer}>
        <Text style={styles.playerText}>{getPlayersTurnInfo()}</Text>
      </View>
      <TouchableOpacity style={styles.resetBtn} onPress={() => startNewGame()}>
        <Text style={styles.resetText}>Start over</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  boardContainer: {},
  headerContainer: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 38,
    padding: 10,
    fontWeight: "bold",
  },
  resetBtn: {
    padding: 10,
    marginTop: 24,
    borderColor: Colors.gray,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "center",
  },
  resetText: {
    fontSize: 20,
  },
  gameStateText: {
    fontSize: 18,
  },
  gameStateTextContainer: {
    alignItems: "center",
    rowGap: 20,
  },
  playerText: {
    fontSize: 16,
  },
  playersInfoText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  playerTextContainer: {
    alignItems: "center",
  },
});

export default Game;
