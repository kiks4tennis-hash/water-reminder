import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getItem, setItem, STORAGE_KEYS } from '../utils/storage';
import { WaterLogEntry } from '../types';

function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function isSameDay(a: number, b: number): boolean {
  return startOfDay(a) === startOfDay(b);
}

export function useWaterLog() {
  const [logs, setLogs] = useState<WaterLogEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  const reload = useCallback(async () => {
    const stored = await getItem<WaterLogEntry[]>(STORAGE_KEYS.WATER_LOGS, []);
    setLogs(stored);
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

  const addEntry = useCallback(
    async (amountMl: number) => {
      const entry: WaterLogEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        amountMl,
        timestamp: Date.now(),
      };
      const next = [...logs, entry];
      setLogs(next);
      await setItem(STORAGE_KEYS.WATER_LOGS, next);
    },
    [logs]
  );

  const removeEntry = useCallback(
    async (id: string) => {
      const next = logs.filter((l) => l.id !== id);
      setLogs(next);
      await setItem(STORAGE_KEYS.WATER_LOGS, next);
    },
    [logs]
  );

  const resetToday = useCallback(async () => {
    const now = Date.now();
    const next = logs.filter((l) => !isSameDay(l.timestamp, now));
    setLogs(next);
    await setItem(STORAGE_KEYS.WATER_LOGS, next);
  }, [logs]);

  const todayTotalMl = useMemo(() => {
    const now = Date.now();
    return logs
      .filter((l) => isSameDay(l.timestamp, now))
      .reduce((sum, l) => sum + l.amountMl, 0);
  }, [logs]);

  const last7DaysTotals = useMemo(() => {
    const days: { date: string; totalMl: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setHours(0, 0, 0, 0);
      day.setDate(day.getDate() - i);
      const dayStart = day.getTime();
      const total = logs
        .filter((l) => isSameDay(l.timestamp, dayStart))
        .reduce((sum, l) => sum + l.amountMl, 0);
      days.push({
        date: day.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' }),
        totalMl: total,
      });
    }
    return days;
  }, [logs]);

  return { logs, loaded, addEntry, removeEntry, resetToday, todayTotalMl, last7DaysTotals };
}
