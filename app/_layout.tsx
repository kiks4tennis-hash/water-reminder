import { useCallback, useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { initNotificationHandler } from '../utils/notifications';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    ...Ionicons.font,
  });

  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      setAppReady(true);
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (appReady) {
      // フォント読み込み・初期描画が終わった後、安全に通知ハンドラを初期化する
      initNotificationHandler();
    }
  }, [appReady]);

  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      await SplashScreen.hideAsync().catch(() => {});
    }
  }, [appReady]);

  if (!appReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <ErrorBoundary>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </ErrorBoundary>
    </View>
  );
}
