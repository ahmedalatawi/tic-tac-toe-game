import React from "react";
import renderer from "react-test-renderer";
import Board from "../../src/components/Board";
import board from "../__mocks__/boardData.mock";
import { render, screen, userEvent } from "@testing-library/react-native";
import { GAME_STATES, PLAYER_O, PLAYER_X } from "../../src/constants/common";

const onPressCallbackGlobal = jest.fn();

const mockProps = {
  board: board,
  gameState: GAME_STATES.inProgress,
  disabled: false,
  onPressUser: onPressCallbackGlobal,
};

describe("<Board />", () => {
  const BoardComponent = () => <Board {...mockProps} />;

  test("renders correctly", () => {
    const tree = renderer.create(<BoardComponent />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("return the correct row and col indices when first square pressed", async () => {
    render(<BoardComponent />);

    const firstSquare = screen.getByTestId("00");

    expect(firstSquare).toBeDefined();

    await userEvent.press(firstSquare);

    //enure the correct row and column indices are correct
    expect(onPressCallbackGlobal).toHaveBeenCalledWith(0, 0);
  });

  test("prevent pressing when board is disabled", async () => {
    const onPressCallback = jest.fn();
    render(
      <Board {...mockProps} disabled={true} onPressUser={onPressCallback} />,
    );

    const firstSquare = screen.getByTestId("00");

    expect(firstSquare).toBeDefined();

    await userEvent.press(firstSquare);

    //enure callBack did not fire
    expect(onPressCallback).not.toHaveBeenCalled();
  });

  test("should display X and O for PLAYER_X and PLAYER_O", async () => {
    const boardCopy = board.map((arr) => arr.slice());
    boardCopy[0][0] = PLAYER_X;
    boardCopy[0][1] = PLAYER_O;
    const onPressCallback = jest.fn();

    render(
      <Board {...mockProps} board={boardCopy} onPressUser={onPressCallback} />,
    );

    //Player X should exist on the board
    expect(screen.getByText("X")).toBeDefined();

    //Player O should exist on the board
    expect(screen.getByText("O")).toBeDefined();

    const squareX = screen.getByTestId("00");
    const squareO = screen.getByTestId("01");

    expect(squareX).toBeDefined();
    expect(squareO).toBeDefined();
  });

  test("should disable board when game is ended", async () => {
    const onPressCallback = jest.fn();
    render(
      <Board
        {...mockProps}
        gameState={GAME_STATES.ended}
        onPressUser={onPressCallback}
      />,
    );

    const square = screen.getByTestId("00");

    await userEvent.press(square);

    //enure board is disabled
    expect(onPressCallback).not.toHaveBeenCalled();
  });
});
