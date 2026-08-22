import { useCallback, useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

// アプリの起動が終わるまでスプラッシュ画面を維持する
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  // タブのアイコン(Ionicons)のフォントを、画面を表示する前に確実に読み込む。
  // これを待たずにアイコンを描画しようとすると、本番ビルドでクラッシュすることが分かったため。
  const [fontsLoaded, fontError] = useFonts({
    ...Ionicons.font,
  });

  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      setAppReady(true);
    }
  }, [fontsLoaded, fontError]);

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
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </View>
  );
}
