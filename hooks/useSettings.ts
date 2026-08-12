import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getItem, setItem, STORAGE_KEYS } from '../utils/storage';
import { DEFAULT_SETTINGS, UserSettings } from '../types';
import { rescheduleReminders } from '../utils/notifications';

export function recommendedGoalMl(weightKg: number): number {
  return Math.round((weightKg * 35) / 50) * 50;
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
