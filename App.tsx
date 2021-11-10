import React from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StatusBar } from 'expo-status-bar';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import AppLoading from 'expo-app-loading';
import { ThemeProvider } from 'styled-components';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import { Routes } from './src/routes';

import theme from './src/global/styles/theme';
import { AuthProvider, useAuth } from './src/hooks/auth';

export default function App() {
  const { userStorageLoading } = useAuth();
  async function changeScreenOrientation() {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP,
    );
  }
  changeScreenOrientation();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  if (!fontsLoaded || userStorageLoading) {
    return <AppLoading />;
  }

  return (
    <ThemeProvider theme={theme}>
      <StatusBar style="light" />
      <AuthProvider>
        <BottomSheetModalProvider>
          <Routes />
        </BottomSheetModalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
