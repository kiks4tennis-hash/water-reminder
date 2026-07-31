import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Modal, Pressable, SafeAreaView } from 'react-native';
import { ProgressRing } from '../../components/ProgressRing';
import { CharacterView } from '../../components/CharacterView';
import { PresetButton } from '../../components/PresetButton';
import { useWaterLog } from '../../hooks/useWaterLog';
import { useSettings } from '../../hooks/useSettings';
import { PRESET_AMOUNTS_ML } from '../../types';

export default function HomeScreen() {
  const { todayTotalMl, addEntry } = useWaterLog();
  const { settings, loaded } = useSettings();
  const [customVisible, setCustomVisible] = useState(false);
  const [customValue, setCustomValue] = useState('');

  if (!loaded) return null;

  const progressRatio = settings.goalMl > 0 ? todayTotalMl / settings.goalMl : 0;

  const handleCustomSubmit = () => {
    const value = parseInt(customValue, 10);
    if (!Number.isNaN(value) && value > 0) {
      addEntry(value);
    }
    setCustomValue('');
    setCustomVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>今日の記録</Text>

      <ProgressRing progress={progressRatio} size={200} strokeWidth={14}>
        <View style={{ alignItems: 'center' }}>
          <CharacterView progressRatio={progressRatio} />
          <Text style={styles.total}>{todayTotalMl} ml</Text>
          <Text style={styles.goal}>目標 {settings.goalMl} ml</Text>
        </View>
      </ProgressRing>

      <View style={styles.presetRow}>
        {PRESET_AMOUNTS_ML.map((amount) => (
          <PresetButton key={amount} label={`${amount}ml`} onPress={() => addEntry(amount)} />
        ))}
        <PresetButton label="カスタム" onPress={() => setCustomVisible(true)} />
      </View>

      <Modal visible={customVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>記録する量(ml)</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={customValue}
              onChangeText={setCustomValue}
              placeholder="例: 200"
              autoFocus
            />
            <View style={styles.modalActions}>
              <Pressable onPress={() => setCustomVisible(false)}>
                <Text style={styles.cancel}>キャンセル</Text>
              </Pressable>
              <Pressable onPress={handleCustomSubmit}>
                <Text style={styles.confirm}>記録する</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 28 },
  header: { fontSize: 15, color: '#888' },
  total: { fontSize: 22, fontWeight: '600', marginTop: 4 },
  goal: { fontSize: 12, color: '#888' },
  presetRow: { flexDirection: 'row', width: '100%', paddingHorizontal: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { width: 260, backgroundColor: '#fff', borderRadius: 16, padding: 20 },
  modalTitle: { fontSize: 14, marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, fontSize: 16 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16, gap: 16 },
  cancel: { color: '#888' },
  confirm: { color: '#378ADD', fontWeight: '600' },
});
