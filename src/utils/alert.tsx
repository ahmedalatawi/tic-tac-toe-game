import { Alert } from "react-native";

export const displayAlert = (
  title: string,
  message: string,
  onClose?: () => void,
) =>
  Alert.alert(title, message, [
    {
      text: "Ok",
      style: "destructive",
      onPress: onClose,
    },
  ]);
