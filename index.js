import "react-native-gesture-handler";
import { AppRegistry } from "react-native";
import App from "./src/Config/native/App";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { name as appName } from './app.json';
import React from 'react';

const RootApp = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <App />
  </GestureHandlerRootView>
);

AppRegistry.registerComponent(appName, () => RootApp);
