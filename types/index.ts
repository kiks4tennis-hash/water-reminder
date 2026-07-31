// 水分補給リマインダーアプリ 共通型定義

export type WaterLogEntry = {
  id: string;
  amountMl: number;
  timestamp: number; // epoch ms
};

export type UserSettings = {
  goalMl: number;
  weightKg: number | null;
  unit: 'ml' | 'oz';
  remindersEnabled: boolean;
  reminderIntervalMinutes: number;
  quietHoursStart: string; // "HH:mm"
  quietHoursEnd: string; // "HH:mm"
};

export type CharacterStage = 'seed' | 'sprout' | 'leaf' | 'bloom';

export const DEFAULT_SETTINGS: UserSettings = {
  goalMl: 2000,
  weightKg: null,
  unit: 'ml',
  remindersEnabled: true,
  reminderIntervalMinutes: 120,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
};

export const PRESET_AMOUNTS_ML = [150, 350, 500] as const;
