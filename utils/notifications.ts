import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { UserSettings } from '../types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

function parseHHmm(value: string): { hour: number; minute: number } {
  const [hour, minute] = value.split(':').map(Number);
  return { hour, minute };
}

/**
 * quietHours(就寝時間帯)をまたがない時刻のリストを、指定した間隔(分)で生成する。
 */
export function buildReminderTimes(
  intervalMinutes: number,
  quietHoursStart: string,
  quietHoursEnd: string
): { hour: number; minute: number }[] {
  const start = parseHHmm(quietHoursEnd); // 起きている時間帯の開始
  const end = parseHHmm(quietHoursStart); // 起きている時間帯の終了

  const startTotal = start.hour * 60 + start.minute;
  let endTotal = end.hour * 60 + end.minute;
  if (endTotal <= startTotal) endTotal += 24 * 60; // 日をまたぐケース

  const times: { hour: number; minute: number }[] = [];
  for (let t = startTotal; t < endTotal; t += intervalMinutes) {
    const normalized = t % (24 * 60);
    times.push({ hour: Math.floor(normalized / 60), minute: normalized % 60 });
  }
  return times;
}

const NOTIFICATION_CATEGORY = 'water-reminder-daily';

// iOSの登録上限(64件)に対する安全マージン。これを超える場合は
// 就寝時間帯を考慮しないシンプルな繰り返しタイマー通知にフォールバックする。
const MAX_SAFE_SCHEDULED_NOTIFICATIONS = 60;

export async function rescheduleReminders(settings: UserSettings): Promise<void> {
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
    // 間隔が短すぎて安全上限を超える場合は、就寝時間帯を無視した単純な繰り返しに切り替える
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
}

export async function cancelAllReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export const isAndroid = Platform.OS === 'android';
