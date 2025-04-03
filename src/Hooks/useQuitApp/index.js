import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import { Alert, BackHandler } from "react-native";

let activeScreen = null;

export const useQuitHandler = (param) => {

  const navigation = useNavigation();


  useFocusEffect(
    useCallback(() => {
      activeScreen = true;


      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => backAction(param)
      );
      return () => {
        activeScreen = false;
        backHandler.remove();
      };
    }, [param])
  );

  return { backAction }
};


const backAction = (param) => {
  if (!activeScreen) return;

  if (!param) {
    Alert.alert("Quizeepay", "Are you sure you want to Quit App?", [
      {
        text: "No",
        onPress: () => null,
        style: "cancel",
      },
      { text: "YES", onPress: () => BackHandler.exitApp() },
    ]);
  }

  return true;
};


