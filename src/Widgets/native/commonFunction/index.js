import Toast from "react-native-toast-message";

export const showToaster = (type, message) => {
 Toast.show({
  position: 'top',
  type: type,
  text1: '',
  text2: message,
 });
}