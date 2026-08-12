import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, SafeAreaView, ScrollView, Pressable, Alert } from 'react-native';
import { useSettings, recommendedGoalMl } from '../../hooks/useSettings';
import { useWaterLog } from '../../hooks/useWaterLog';
import { UserSettings } from '../../types';

const INTERVAL_OPTIONS = [30, 60, 120, 150];

type Draft = {
  goalMl: string;
  remindersEnabled: boolean;
  reminderIntervalMinutes: number;
  quietHoursStart: string;
  quietHoursEnd: string;
};

function toDraft(settings: UserSettings): Draft {
  return {
    goalMl: String(settings.goalMl),
    remindersEnabled: settings.remindersEnabled,
    reminderIntervalMinutes: settings.reminderIntervalMinutes,
    quietHoursStart: settings.quietHoursStart,
    quietHoursEnd: settings.quietHoursEnd,
  };
}

const TIME_FORMAT = /^([01]?\d|2[0-3]):([0-5]\d)$/;

export default function SettingsScreen() {
  const { settings, loaded, updateSettings } = useSettings();
  const { resetToday } = useWaterLog();
  const [weightInput, setWeightInput] = useState('');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    if (loaded) setDraft(toDraft(settings));
  }, [loaded, settings]);

  if (!loaded || !draft) return null;

  const currentDraft = draft;
  const hasChanges = JSON.stringify(currentDraft) !== JSON.stringify(toDraft(settings));

  const applyRecommendation = () => {
    const weight = parseFloat(weightInput);
    if (!Number.isNaN(weight) && weight > 0) {
      setDraft({ ...currentDraft, goalMl: String(recommendedGoalMl(weight)) });
    }
  };

  const saveAll = () => {
    const goalValue = parseInt(currentDraft.goalMl, 10);
    if (Number.isNaN(goalValue) || goalValue <= 0) {
      Alert.alert('入力エラー', '目標水分量は1以上の数値で入力してください。');
      return;
    }
    if (!TIME_FORMAT.test(currentDraft.quietHoursStart) || !TIME_FORMAT.test(currentDraft.quietHoursEnd)) {
      Alert.alert('入力エラー', '就寝時間帯は "22:00" のような形式で入力してください。');
      return;
    }

    updateSettings({
      goalMl: goalValue,
      remindersEnabled: currentDraft.remindersEnabled,
      reminderIntervalMinutes: currentDraft.reminderIntervalMinutes,
      quietHoursStart: currentDraft.quietHoursStart,
      quietHoursEnd: currentDraft.quietHoursEnd,
    });
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1500);
  };

  const confirmResetToday = () => {
    Alert.alert(
      '今日の記録をリセット',
      '今日記録した水分量をすべて削除します。この操作は取り消せません。',
      [
        { text: 'キャンセル', style: 'cancel' },
        { text: 'リセットする', style: 'destructive', onPress: () => resetToday() },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 16, gap: 24 }}>
        <View>
          <Text style={styles.sectionTitle}>1日の目標水分量</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={currentDraft.goalMl}
            onChangeText={(v) => setDraft({ ...currentDraft, goalMl: v })}
          />

          <Text style={styles.subLabel}>体重から推奨値を計算(任意)</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              keyboardType="number-pad"
              placeholder="体重(kg)"
              value={weightInput}
              onChangeText={setWeightInput}
            />
            <Pressable style={styles.smallButton} onPress={applyRecommendation}>
              <Text style={styles.smallButtonLabel}>反映</Text>
            </Pressable>
          </View>
        </View>

        <View>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>リマインダー通知</Text>
            <Switch
              value={currentDraft.remindersEnabled}
              onValueChange={(v) => setDraft({ ...currentDraft, remindersEnabled: v })}
            />
          </View>

          <Text style={styles.subLabel}>通知間隔</Text>
          <View style={styles.row}>
            {INTERVAL_OPTIONS.map((min) => (
              <Pressable
                key={min}
                style={[
                  styles.chip,
                  currentDraft.reminderIntervalMinutes === min && styles.chipActive,
                ]}
                onPress={() => setDraft({ ...currentDraft, reminderIntervalMinutes: min })}
              >
                <Text
                  style={[
                    styles.chipLabel,
                    currentDraft.reminderIntervalMinutes === min && styles.chipLabelActive,
                  ]}
                >
                  {min}分
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.subLabel}>就寝時間帯(通知を送らない時間)</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={currentDraft.quietHoursStart}
              onChangeText={(v) => setDraft({ ...currentDraft, quietHoursStart: v })}
              placeholder="22:00"
            />
            <Text style={{ alignSelf: 'center' }}>〜</Text>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={currentDraft.quietHoursEnd}
              onChangeText={(v) => setDraft({ ...currentDraft, quietHoursEnd: v })}
              placeholder="07:00"
            />
          </View>
        </View>

        <View>
          <Pressable
            style={[styles.saveButton, !hasChanges && styles.smallButtonDisabled]}
            onPress={saveAll}
            disabled={!hasChanges}
          >
            <Text style={styles.saveButtonLabel}>保存</Text>
          </Pressable>
          {justSaved && <Text style={styles.savedLabel}>保存しました</Text>}
        </View>

        <View>
          <Text style={styles.sectionTitle}>データ</Text>
          <Pressable style={styles.dangerButton} onPress={confirmResetToday}>
            <Text style={styles.dangerButtonLabel}>今日の記録をリセット</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  sectionTitle: { fontSize: 15, fontWeight: '600', marginBottom: 8 },
  subLabel: { fontSize: 12, color: '#888', marginTop: 12, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, fontSize: 16 },
  row: { flexDirection: 'row', gap: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  smallButton: { justifyContent: 'center', paddingHorizontal: 14, borderRadius: 8, backgroundColor: '#378ADD' },
  smallButtonDisabled: { backgroundColor: '#B9D6F2' },
  smallButtonLabel: { color: '#fff', fontWeight: '600' },
  saveButton: { paddingVertical: 14, borderRadius: 10, backgroundColor: '#378ADD', alignItems: 'center' },
  saveButtonLabel: { color: '#fff', fontWeight: '700', fontSize: 15 },
  savedLabel: { color: '#0F6E56', fontSize: 12, marginTop: 8, textAlign: 'center' },
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: '#ddd' },
  chipActive: { backgroundColor: '#378ADD', borderColor: '#378ADD' },
  chipLabel: { fontSize: 13, color: '#333' },
  chipLabelActive: { color: '#fff' },
  dangerButton: {
    borderWidth: 1,
    borderColor: '#E5484D',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  dangerButtonLabel: { color: '#E5484D', fontWeight: '600', fontSize: 14 },
});
