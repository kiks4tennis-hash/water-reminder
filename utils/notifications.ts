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
 * 例: quietHoursEnd=07:00, quietHoursStart=22:00, interval=120分
 *  -> 07:00, 09:00, 11:00, ... 21:00 のような時刻を返す。
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

// これ未満の間隔は「就寝時間帯を考慮した1日分のスケジュール」ではなく、
// シンプルな繰り返しタイマー通知に切り替える(テスト・動作確認用)。
// 60分以上であれば、起きている時間帯に必要な通知数はiOSの上限(64件)内に収まる。
const SHORT_INTERVAL_THRESHOLD_MINUTES = 60;

export async function rescheduleReminders(settings: UserSettings): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!settings.remindersEnabled) return;

  const granted = await requestNotificationPermission();
  if (!granted) return;

  if (settings.reminderIntervalMinutes < SHORT_INTERVAL_THRESHOLD_MINUTES) {
    // テスト用の短い間隔: 就寝時間帯は考慮せず、単純に繰り返す
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '水分補給の時間です',
        body: 'コップ1杯、水を飲みましょう(テスト用の短い間隔で通知しています)',
        data: { category: NOTIFICATION_CATEGORY },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: settings.reminderIntervalMinutes * 60,
        repeats: true,
      },
    });
    return;
  }

  const times = buildReminderTimes(
    settings.reminderIntervalMinutes,
    settings.quietHoursStart,
    settings.quietHoursEnd
  );

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
