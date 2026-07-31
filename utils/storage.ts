import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 汎用 AsyncStorage ラッパー。
 * ポモドーロアプリの storage.ts と同じインターフェースにしてあるので、
 * 次のアプリ（習慣トラッカー等）にもそのままコピーして使い回せる。
 */
export async function getItem<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn(`[storage] getItem failed for key "${key}"`, e);
    return fallback;
  }
}

export async function setItem<T>(key: string, value: T): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn(`[storage] setItem failed for key "${key}"`, e);
    return false;
  }
}

export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.warn(`[storage] removeItem failed for key "${key}"`, e);
  }
}

export const STORAGE_KEYS = {
  WATER_LOGS: 'water_reminder:logs',
  SETTINGS: 'water_reminder:settings',
} as const;
