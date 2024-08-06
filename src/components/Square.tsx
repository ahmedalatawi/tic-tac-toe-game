import { StyleSheet, Text, Dimensions, TouchableHighlight } from "react-native";
import { Colors } from "../constants/colors";

const { width, height } = Dimensions.get("window");

console.log(width, height);

interface Props {
  value: string | null;
  disabled?: boolean;
  testID?: string;
  onSquarePress: () => void;
}

function Square({ value, disabled, testID, onSquarePress }: Props) {
  return (
    <TouchableHighlight
      testID={testID}
      disabled={disabled}
      onPress={onSquarePress}
      style={styles.container}
      underlayColor={value ? "" : Colors.gray}
    >
      <Text style={styles.label}>{value}</Text>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    flexDirection: "row",
    width: 76,
    height: 76,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 40,
  },
});

export default Square;
