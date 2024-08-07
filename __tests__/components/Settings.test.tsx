import React from "react";
import renderer from "react-test-renderer";
import { render, screen, userEvent } from "@testing-library/react-native";
import { BOARD_SIZES } from "../../src/constants/common";
import Settings from "../../src/components/Settings";

const settingsMock = {
  playerX: "user",
  playerO: "computer",
  useAi: false,
  boardSize: BOARD_SIZES._3x3,
};

describe("<Settings />", () => {
  test("renders correctly", () => {
    const onStartGameMock = jest.fn();
    const tree = renderer
      .create(<Settings onStartGame={onStartGameMock} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("should emit the correct settings", async () => {
    const onStartGameMock = jest.fn();
    render(<Settings onStartGame={onStartGameMock} />);

    const board3x3 = screen.getByTestId("3x3TestId");
    const board4x4 = screen.getByTestId("4x4TestId");
    const board5x5 = screen.getByTestId("5x5TestId");

    expect(board3x3).toBeDefined();

    const startGameBtn = screen.getByTestId("startGameBtnTestId");

    await userEvent.press(startGameBtn);

    //default settings
    expect(onStartGameMock).toHaveBeenCalledWith(settingsMock);

    //select board 4x4
    await userEvent.press(board4x4);
    await userEvent.press(startGameBtn);

    expect(onStartGameMock).toHaveBeenCalledWith({
      ...settingsMock,
      boardSize: BOARD_SIZES._4x4,
    });

    //select board 5x5
    await userEvent.press(board5x5);
    await userEvent.press(startGameBtn);

    expect(onStartGameMock).toHaveBeenCalledWith({
      ...settingsMock,
      boardSize: BOARD_SIZES._5x5,
    });
  });

  test("should check the AI checkbox", async () => {
    const onStartGameMock = jest.fn();
    render(<Settings onStartGame={onStartGameMock} />);

    const aiCheckbox = screen.getByTestId("aiCheckboxTestId");

    await userEvent.press(aiCheckbox);

    const startGameBtn = screen.getByTestId("startGameBtnTestId");

    await userEvent.press(startGameBtn);

    expect(onStartGameMock).toHaveBeenCalledWith({
      ...settingsMock,
      useAi: true,
    });
  });

  //FIXME: needs fixed!
  xtest("should select the right player from dropdown", async () => {
    const onStartGameMock = jest.fn();
    render(<Settings onStartGame={onStartGameMock} />);

    const computerPlayer = screen.getByText("User");

    await userEvent.press(computerPlayer);

    const startGameBtn = screen.getByTestId("startGameBtnTestId");

    await userEvent.press(startGameBtn);

    expect(onStartGameMock).toHaveBeenCalledWith({
      ...settingsMock,
      playerX: "computer",
    });
  });
});
