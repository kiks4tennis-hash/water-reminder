import { Stack } from 'expo-router';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://0dba472d1eb2330eb863a230e7e70f6e@o4511852701745152.ingest.us.sentry.io/4511852709871616',
  // ネイティブクラッシュ(今回のようなObjective-C例外によるアプリ全体クラッシュ)も
  // 拾えるようにする
  enableNativeCrashHandling: true,
  tracesSampleRate: 1.0,
  debug: false,
});

function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default Sentry.wrap(RootLayout);
