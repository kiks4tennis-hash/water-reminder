import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useWaterLog } from '../../hooks/useWaterLog';
import { useSettings } from '../../hooks/useSettings';

const CHART_HEIGHT = 140;

export default function HistoryScreen() {
  const { last7DaysTotals } = useWaterLog();
  const { settings, loaded } = useSettings();

  if (!loaded) return null;

  const maxValue = Math.max(settings.goalMl, ...last7DaysTotals.map((d) => d.totalMl), 1);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>過去7日間</Text>
      <View style={styles.chartRow}>
        {last7DaysTotals.map((day) => {
          const barHeight = Math.max(4, (day.totalMl / maxValue) * CHART_HEIGHT);
          const achieved = day.totalMl >= settings.goalMl;
          return (
            <View key={day.date} style={styles.barColumn}>
              <Text style={styles.barValue}>{day.totalMl}</Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.bar,
                    { height: barHeight, backgroundColor: achieved ? '#0F6E56' : '#85B7EB' },
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>{day.date}</Text>
            </View>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 16 },
  header: { fontSize: 15, color: '#888', marginBottom: 16, textAlign: 'center' },
  chartRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  barColumn: { alignItems: 'center', flex: 1 },
  barValue: { fontSize: 10, color: '#888', marginBottom: 4 },
  barTrack: { height: CHART_HEIGHT, justifyContent: 'flex-end' },
  bar: { width: 18, borderRadius: 4 },
  barLabel: { fontSize: 11, color: '#888', marginTop: 6 },
});
