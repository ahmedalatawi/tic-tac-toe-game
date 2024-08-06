import renderer from "react-test-renderer";
import Game from "../../src/components/Game";
import { render, screen, userEvent } from "@testing-library/react-native";

import * as utils from "../../src/utils/common";

const mockGetRandomMove = jest.spyOn(utils, "getRandomMove");

describe("<Game />", () => {
  test("renders correctly", () => {
    const tree = renderer.create(<Game />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("should display the correct labels when game is started", async () => {
    render(<Game />);

    const startGameBtn = screen.getByTestId("startGameBtnTestId");

    expect(startGameBtn).toBeDefined();

    await userEvent.press(startGameBtn);

    expect(screen.getByText("USER .vs COMPUTER")).toBeDefined();
    expect(screen.getByText("Game in progress")).toBeDefined();
    expect(screen.getByText("Player X's turn")).toBeDefined();
  });

  test("should player X (human) make the first move by default, and then player O (computer)", async () => {
    jest.useFakeTimers();

    render(<Game />);

    const startGameBtn = screen.getByTestId("startGameBtnTestId");

    await userEvent.press(startGameBtn);

    const square = screen.getByTestId("00");

    await userEvent.press(square);

    //Player X should exist on the board
    expect(screen.getByText("X")).toBeDefined();

    expect(screen.getByText(`Player O's turn`)).toBeDefined();

    jest.runAllTimers();

    //Player O should exist now after making the next move
    expect(screen.getByText("O")).toBeDefined();
  });

  test("should simulate a winning game for the human .vs computer", async () => {
    jest.useFakeTimers();

    render(<Game />);

    const startGameBtn = screen.getByTestId("startGameBtnTestId");

    await userEvent.press(startGameBtn);

    //we want human to win using these combinations
    const square1 = screen.getByTestId("00");
    const square2 = screen.getByTestId("01");
    const square3 = screen.getByTestId("02");

    // human's move
    await userEvent.press(square1);

    // computer's move
    mockGetRandomMove.mockReturnValue([1, 0]);

    jest.runAllTimers();

    // human's move
    await userEvent.press(square2);

    // computer's move
    mockGetRandomMove.mockReturnValue([2, 1]);

    jest.runAllTimers();

    // human's move
    // at this point, human should win
    await userEvent.press(square3);

    // computer's move
    mockGetRandomMove.mockReturnValue([1, 2]);

    jest.runAllTimers();

    expect(screen.getByText("Game over")).toBeDefined();
    expect(screen.getByText("The winner is player X")).toBeDefined();
  });

  test("should simulate a tie game between human and computer", async () => {
    jest.useFakeTimers();

    render(<Game />);

    const startGameBtn = screen.getByTestId("startGameBtnTestId");

    await userEvent.press(startGameBtn);

    //combinations for player X
    const square1 = screen.getByTestId("01");
    const square2 = screen.getByTestId("02");
    const square3 = screen.getByTestId("10");
    const square4 = screen.getByTestId("21");
    const square5 = screen.getByTestId("22");

    // human's move
    await userEvent.press(square1);

    // computer's move
    mockGetRandomMove.mockReturnValue([0, 0]);

    jest.runAllTimers();

    // human's move
    await userEvent.press(square2);

    // computer's move
    mockGetRandomMove.mockReturnValue([1, 2]);

    jest.runAllTimers();

    // human's move
    await userEvent.press(square3);

    // computer's move
    mockGetRandomMove.mockReturnValue([1, 1]);

    jest.runAllTimers();

    // human's move
    await userEvent.press(square4);

    // computer's move
    mockGetRandomMove.mockReturnValue([2, 0]);

    jest.runAllTimers();

    // human's move
    await userEvent.press(square5);

    expect(screen.getByText("Game over")).toBeDefined();
    expect(screen.getByText("It's a tie")).toBeDefined();
  });

  test("should simulate a battle between AI and human", async () => {
    jest.useFakeTimers();

    render(<Game />);

    const aiCheckbox = screen.getByTestId("aiCheckboxTestId");

    await userEvent.press(aiCheckbox);

    const startGameBtn = screen.getByTestId("startGameBtnTestId");

    await userEvent.press(startGameBtn);

    //combinations for player X (human)
    const square1 = screen.getByTestId("00");
    const square2 = screen.getByTestId("02");
    const square3 = screen.getByTestId("10");

    // human's move
    await userEvent.press(square1);

    // AT's move
    jest.runAllTimers();

    // human's move
    await userEvent.press(square2);

    // AI's move
    jest.runAllTimers();

    // human's move
    await userEvent.press(square3);

    // AI's move
    jest.runAllTimers();

    // AI should win since the human's combinations above are easy to beat
    expect(screen.getByText("Game over")).toBeDefined();
    expect(screen.getByText("The winner is player O")).toBeDefined();
  });
});
