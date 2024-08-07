import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import { BOARD_SIZES, PLAYER_TYPES } from "../constants/common";
import React, { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { GameSettings, PlayerTypes } from "../types/types";
import RadioButton from "./ui/RadioButton";
import { Colors } from "../constants/colors";
import Checkbox from "expo-checkbox";

interface Props {
  onStartGame: (settings: GameSettings) => void;
}

type GameSettingsKeys = keyof GameSettings;

function Settings({ onStartGame }: Props) {
  const [settings, setSettings] = useState<GameSettings>({
    playerX: "user",
    playerO: "computer",
    useAi: false,
    boardSize: BOARD_SIZES._3x3,
  });
  const [isUseAiChecked, setIsUseAiChecked] = useState(false);

  const handleBoardSizePress = (value: number) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      boardSize: value,
    }));
  };

  const handleAiCheckboxPress = (value: boolean) => {
    setIsUseAiChecked(value);
    setSettings((currentSettings) => ({
      ...currentSettings,
      useAi: value,
    }));
  };

  const handlePlayerDropdownPress = (
    value: PlayerTypes | null,
    key: GameSettingsKeys
  ) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      [key]: value,
    }));
  };

  const disableStartGameBtn = !settings.playerX || !settings.playerO;

  const disableAiCheckbox =
    (settings.playerX !== PLAYER_TYPES.computer &&
      settings.playerO !== PLAYER_TYPES.computer) ||
    //TODO: Currently AI is only available for 3x3 board.
    //There seems to be a performance issue that might cause your device (or virtual device)
    //to freeze when using the AI Algorithm for other board sizes.
    settings.boardSize !== BOARD_SIZES._3x3;

  useEffect(() => {
    disableAiCheckbox && setIsUseAiChecked(false);
  }, [disableAiCheckbox]);

  return (
    <View style={styles.container}>
      <View style={styles.settingsContainer}>
        <View style={styles.boardSizesContainer}>
          <View style={styles.radioBtnContainer}>
            <RadioButton
              testID="3x3TestId"
              selected={settings.boardSize === BOARD_SIZES._3x3}
              onSelect={() => handleBoardSizePress(BOARD_SIZES._3x3)}
            />
            <Text style={styles.radioBtnText}>3x3</Text>
          </View>
          <View style={styles.radioBtnContainer}>
            <RadioButton
              testID="4x4TestId"
              selected={settings.boardSize === BOARD_SIZES._4x4}
              onSelect={() => handleBoardSizePress(BOARD_SIZES._4x4)}
            />
            <Text style={styles.radioBtnText}>4x4</Text>
          </View>
          <View style={styles.radioBtnContainer}>
            <RadioButton
              testID="5x5TestId"
              selected={settings.boardSize === BOARD_SIZES._5x5}
              onSelect={() => handleBoardSizePress(BOARD_SIZES._5x5)}
            />
            <Text style={styles.radioBtnText}>5x5</Text>
          </View>
        </View>
        <View style={styles.checkboxContainer}>
          <Checkbox
            testID="aiCheckboxTestId"
            style={styles.checkbox}
            value={isUseAiChecked}
            disabled={disableAiCheckbox}
            onValueChange={handleAiCheckboxPress}
          />
          <Text style={styles.checkboxText}>Incorporate AI</Text>
        </View>
        <Text style={styles.selectPlayersText}>
          Select player "X" and "O" to start the game
        </Text>
        <View style={styles.pickersContainer}>
          <View style={[styles.pickerContainer, getAndroidPickerStyles()]}>
            <Picker<PlayerTypes | null>
              style={styles.picker}
              mode="dropdown"
              selectedValue={settings.playerX}
              onValueChange={(itemValue) =>
                handlePlayerDropdownPress(itemValue, "playerX")
              }
            >
              {Platform.OS === "android" && (
                <Picker.Item
                  value={null}
                  label="-- Player X --"
                  style={styles.pickerItem}
                />
              )}
              <Picker.Item label="User" value={PLAYER_TYPES.user} />
              <Picker.Item label="Computer" value={PLAYER_TYPES.computer} />
            </Picker>
          </View>
          <View style={[styles.pickerContainer, getAndroidPickerStyles()]}>
            <Picker<PlayerTypes | null>
              style={styles.picker}
              mode="dropdown"
              selectedValue={settings.playerO}
              onValueChange={(itemValue) =>
                handlePlayerDropdownPress(itemValue, "playerO")
              }
            >
              {Platform.OS === "android" && (
                <Picker.Item
                  value={null}
                  label="-- Player O --"
                  style={styles.pickerItem}
                />
              )}
              <Picker.Item label="User" value={PLAYER_TYPES.user} />
              <Picker.Item label="Computer" value={PLAYER_TYPES.computer} />
            </Picker>
          </View>
        </View>
      </View>
      <View style={styles.startGameBtnContainer}>
        <TouchableOpacity
          testID="startGameBtnTestId"
          style={styles.selectorBtn}
          onPress={() => onStartGame(settings)}
          disabled={disableStartGameBtn}
        >
          <Text
            style={[
              styles.startGameText,
              { color: disableStartGameBtn ? Colors.gray : Colors.black },
            ]}
          >
            Start game
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getAndroidPickerStyles = () =>
  Platform.OS === "android" && {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.gray,
  };

const styles = StyleSheet.create({
  container: {
    rowGap: 32,
  },
  boardSizesContainer: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },
  settingsContainer: {
    alignItems: "center",
    paddingHorizontal: 15,
  },
  selectPlayersText: {
    fontSize: 16,
    paddingBottom: Platform.OS === "ios" ? 70 : 10,
    paddingTop: 20,
  },
  selectorBtn: {
    alignItems: "center",
    backgroundColor: Colors.grayLight,
    padding: 10,
    margin: 10,
    width: "100%",
    borderRadius: 5,
  },
  startGameText: {
    fontSize: 18,
  },
  pickersContainer: {
    flexDirection: "row",
    gap: 10,
  },
  pickerContainer: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
  },
  picker: {
    width: "100%",
  },
  pickerItem: {
    color: "gray",
  },
  radioBtnContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    padding: 20,
    gap: 5,
  },
  radioBtnText: {
    fontSize: 18,
  },
  startGameBtnContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 8,
  },
  checkboxContainer: {
    marginHorizontal: 16,
    marginVertical: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
  },
  paragraph: {
    fontSize: 15,
  },
  checkbox: {
    margin: 8,
  },
  checkboxText: {
    fontSize: 15,
  },
});

export default Settings;
