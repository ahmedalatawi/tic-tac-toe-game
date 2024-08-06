import type { ComponentProps } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface Props extends ComponentProps<typeof TouchableOpacity> {
  selected: boolean;
  onSelect: () => void;
}

function RadioButton({ selected, onSelect, ...props }: Props) {
  const handlePress = () => {
    onSelect();
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container} {...props}>
      {selected ? <View style={styles.selected} /> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 18,
    width: 18,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  selected: {
    height: 10,
    width: 10,
    borderRadius: 7,
    backgroundColor: "black",
  },
});

//const Radio = styled.TouchableOpacity({});

//const RadioSelected = styled.View({});

export default RadioButton;
