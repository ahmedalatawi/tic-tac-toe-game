import { View, StyleSheet } from "react-native";
import Square from "./Square";
import { GameBoard } from "../types/types";
import { GAME_STATES, PLAYER_X } from "../constants/common";

interface Props {
  board: GameBoard;
  gameState: string;
  disabled?: boolean;
  onPressUser: (rowIndex: number, colIndex: number) => void;
}

/**
 * This is a presentational (stateless) component for the game board
 *
 * @param param0
 * @returns
 */
function Board({ board, gameState, disabled, onPressUser }: Props) {
  return (
    <View style={styles.container}>
      {board.map((row, rowIndex) => (
        <View key={rowIndex}>
          {row.map((_, colIndex) => {
            const value = board[rowIndex][colIndex];

            return (
              <Square
                testID={`${rowIndex}${colIndex}`}
                key={colIndex}
                disabled={gameState === GAME_STATES.ended || disabled}
                onSquarePress={() => onPressUser(rowIndex, colIndex)}
                value={value ? (value === PLAYER_X ? "X" : "O") : null}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 10,
  },
});

export default Board;
