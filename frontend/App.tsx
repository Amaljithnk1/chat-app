import React, { useCallback } from 'react';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import RootNavigator from './src/navigation';
import { colors } from './src/theme';

SplashScreen.preventAutoHideAsync().catch(() => {
  // no-op — safe to ignore if the splash screen module isn't ready yet
});

function Gate() {
  const { isLoading } = useAuth();
  if (isLoading) return <View style={{ flex: 1, backgroundColor: colors.bgDeep }} />;
  return <RootNavigator />;
}

export default function App() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <AuthProvider>
        <Gate />
      </AuthProvider>
    </View>
  );
}
