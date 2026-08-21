import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { initNotificationHandler } from '../utils/notifications';

// --- Sentryランタイム部分は原因切り分けのため一時的に無効化 ---
// import * as Sentry from '@sentry/react-native';
// -----------------------------------------------------------

export default function RootLayout() {
  useEffect(() => {
    initNotificationHandler();
  }, []);

  return (
    <ErrorBoundary>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ErrorBoundary>
  );
}