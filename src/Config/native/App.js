/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { MenuProvider } from 'react-native-popup-menu';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { QueryClient, onlineManager } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import NetInfo from '@react-native-community/netinfo';
// import Toast from 'react-native-toast-message';
//  import ToastConfig from './src/utils/toastConfig';
import StackNavigator from '../../router/native/navigation/stackNavigator';
import { persistor, store } from '../../redux/native/store';
import Toast from 'react-native-toast-message';



const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage
})

function App() {

  // useEffect(() => {

  //   return NetInfo.addEventListener(state => {

  //     const status = !!state.isConnected;
  //     onlineManager.setOnline(status);

  //   });

  // }, []);

  return (

    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
    >

      <Provider store={store}>

        <PersistGate loading={null} persistor={persistor}>

          <NavigationContainer>

            <MenuProvider>


              <StackNavigator />

              <Toast />

            </MenuProvider>

          </NavigationContainer>

        </PersistGate>

      </Provider>

    </PersistQueryClientProvider>

  );

}

export default App;