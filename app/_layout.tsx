import { Stack } from 'expo-router';

// --- 診断用の最小構成レイアウト ---
// ErrorBoundary, 通知初期化など、独自コードは一切呼び出さない

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
