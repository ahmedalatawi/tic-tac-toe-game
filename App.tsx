import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ScrollView } from "react-native";

import Game from "./src/components/Game";
import { Colors } from "./src/constants/colors";

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Game />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
});
