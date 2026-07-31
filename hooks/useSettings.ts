import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getItem, setItem, STORAGE_KEYS } from '../utils/storage';
import { DEFAULT_SETTINGS, UserSettings } from '../types';
import { rescheduleReminders } from '../utils/notifications';

// 体重ベースの簡易推奨計算式（体重1kgあたり35ml、一般的な目安値）
export function recommendedGoalMl(weightKg: number): number {
  return Math.round((weightKg * 35) / 50) * 50; // 50ml単位に丸める
}

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  const reload = useCallback(async () => {
    const stored = await getItem<UserSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    setSettings(stored);
    setLoaded(true);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  // 他のタブ(設定画面など)での変更を、タブ切り替え時に反映する
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  const updateSettings = useCallback(
    async (partial: Partial<UserSettings>) => {
      const next = { ...settings, ...partial };
      setSettings(next);
      await setItem(STORAGE_KEYS.SETTINGS, next);

      // リマインダーに関わる項目が実際に変わった場合だけ通知を再スケジュール
      const reminderKeys: (keyof UserSettings)[] = [
        'remindersEnabled',
        'reminderIntervalMinutes',
        'quietHoursStart',
        'quietHoursEnd',
      ];
      const reminderChanged = reminderKeys.some(
        (k) => k in partial && partial[k] !== settings[k]
      );
      if (reminderChanged) {
        await rescheduleReminders(next);
      }
    },
    [settings]
  );

  return { settings, loaded, updateSettings };
}
