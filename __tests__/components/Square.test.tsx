import React from "react";
import renderer from "react-test-renderer";
import { render, screen, userEvent } from "@testing-library/react-native";
import Square from "../../src/components/Square";

const onSquarePressMock = jest.fn();
const propsMock = {
  value: "X",
  disabled: false,
  testID: "squareTestId",
  onSquarePress: onSquarePressMock,
};

describe("<Square />", () => {
  test("renders correctly", () => {
    const tree = renderer.create(<Square {...propsMock} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("should display the correct value, e.g. X", async () => {
    render(<Square {...propsMock} />);

    const x = screen.getByText("X");

    expect(x).toBeDefined();
  });

  test("should fire onSquarePress when square is pressed", async () => {
    render(<Square {...propsMock} />);

    const x = screen.getByText("X");

    await userEvent.press(x);

    expect(onSquarePressMock).toHaveBeenCalled();
  });

  test("should fire not onSquarePress when square is disabled", async () => {
    const callBack = jest.fn();
    render(<Square {...propsMock} onSquarePress={callBack} disabled={true} />);

    const x = screen.getByText("X");

    await userEvent.press(x);

    expect(callBack).not.toHaveBeenCalled();
  });
});
