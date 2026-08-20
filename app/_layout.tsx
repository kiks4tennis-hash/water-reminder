import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as Sentry from '@sentry/react-native';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { initNotificationHandler } from '../utils/notifications';

// Sentry初期化自体が失敗してもアプリを道連れにしないようtry/catchで保護
try {
  Sentry.init({
    dsn: 'https://0dba472d1eb2330eb863a230e7e70f6e@o4511852701745152.ingest.us.sentry.io/4511852709871616',
    enableNativeCrashHandling: true,
    tracesSampleRate: 1.0,
    debug: false,
  });
} catch (e) {
  console.warn('[Sentry] init failed', e);
}

// キャッチされなかったJSエラーが、ネイティブ側の例外処理に伝播して
// アプリごとクラッシュするのを防ぐためのグローバルハンドラ。
// (RCTExceptionsManager経由のネイティブクラッシュ対策)
const globalAny = global as any;
if (globalAny.ErrorUtils && typeof globalAny.ErrorUtils.setGlobalHandler === 'function') {
  const defaultHandler = globalAny.ErrorUtils.getGlobalHandler?.();
  globalAny.ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
    try {
      Sentry.captureException(error, { extra: { isFatal: !!isFatal } });
    } catch {
      // no-op
    }
    // 元のハンドラも呼んでおく(開発時のRedBox表示等のため)
    if (typeof defaultHandler === 'function') {
      defaultHandler(error, isFatal);
    }
  });
}

function RootLayout() {
  useEffect(() => {
    // アプリ起動直後(モジュール読み込み時)ではなく、
    // 最初の描画が終わった後に安全に初期化する
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

export default Sentry.wrap(RootLayout);
