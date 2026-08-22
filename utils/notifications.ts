import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { UserSettings } from '../types';

let handlerInitialized = false;

/**
 * 通知ハンドラの登録。
 * モジュール読み込み時ではなく、アプリの初期描画が終わった後に
 * 呼び出し側(app/_layout.tsx)から明示的に呼ぶ。try/catchで保護。
 */
export function initNotificationHandler(): void {
  if (handlerInitialized) return;
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    handlerInitialized = true;
  } catch (e) {
    console.warn('[notifications] setNotificationHandler failed', e);
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') return true;

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch (e) {
    console.warn('[notifications] requestNotificationPermission failed', e);
    return false;
  }
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

const NOTIFICATION_CATEGORY = 'water-reminder-daily';
const MAX_SAFE_SCHEDULED_NOTIFICATIONS = 60;

export async function rescheduleReminders(settings: UserSettings): Promise<void> {
  try {
    initNotificationHandler();
    await Notifications.cancelAllScheduledNotificationsAsync();
    if (!settings.remindersEnabled) return;

    const granted = await requestNotificationPermission();
    if (!granted) return;

    const times = buildReminderTimes(
      settings.reminderIntervalMinutes,
      settings.quietHoursStart,
      settings.quietHoursEnd
    );

    if (times.length > MAX_SAFE_SCHEDULED_NOTIFICATIONS || times.length === 0) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '水分補給の時間です',
          body: 'コップ1杯、水を飲みましょう',
          data: { category: NOTIFICATION_CATEGORY },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: Math.max(60, settings.reminderIntervalMinutes * 60),
          repeats: true,
        },
      });
      return;
    }

    for (const { hour, minute } of times) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '水分補給の時間です',
          body: 'コップ1杯、水を飲みましょう',
          data: { category: NOTIFICATION_CATEGORY },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
        },
      });
    }
  } catch (e) {
    console.warn('[notifications] rescheduleReminders failed', e);
  }
}

export async function cancelAllReminders(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (e) {
    console.warn('[notifications] cancelAllReminders failed', e);
  }
}

export const isAndroid = Platform.OS === 'android';
