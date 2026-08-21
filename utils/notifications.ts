import { Platform } from 'react-native';
import { UserSettings } from '../types';

// --- 診断用ビルド: expo-notifications を一時的に完全に無効化 ---
// クラッシュの原因切り分けのため、実際のネイティブ呼び出しは一切行わず、
// すべて no-op(何もしない)関数にしている。
// 元に戻す際は、このファイルを notifications.ts の正式版に差し戻すこと。

export function initNotificationHandler(): void {
  console.log('[notifications] (disabled for diagnosis) initNotificationHandler skipped');
}

export async function requestNotificationPermission(): Promise<boolean> {
  console.log('[notifications] (disabled for diagnosis) requestNotificationPermission skipped');
  return false;
}

function parseHHmm(value: string): { hour: number; minute: number } {
  const [hour, minute] = value.split(':').map(Number);
  return { hour, minute };
}

export function buildReminderTimes(
  intervalMinutes: number,
  quietHoursStart: string,
  quietHoursEnd: string
): { hour: number; minute: number }[] {
  const start = parseHHmm(quietHoursEnd);
  const end = parseHHmm(quietHoursStart);

  const startTotal = start.hour * 60 + start.minute;
  let endTotal = end.hour * 60 + end.minute;
  if (endTotal <= startTotal) endTotal += 24 * 60;

  const times: { hour: number; minute: number }[] = [];
  for (let t = startTotal; t < endTotal; t += intervalMinutes) {
    const normalized = t % (24 * 60);
    times.push({ hour: Math.floor(normalized / 60), minute: normalized % 60 });
  }
  return times;
}

export async function rescheduleReminders(_settings: UserSettings): Promise<void> {
  console.log('[notifications] (disabled for diagnosis) rescheduleReminders skipped');
}

export async function cancelAllReminders(): Promise<void> {
  console.log('[notifications] (disabled for diagnosis) cancelAllReminders skipped');
}

export const isAndroid = Platform.OS === 'android';
