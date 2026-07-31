import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

type Props = {
  label: string;
  onPress: () => void;
};

export function PresetButton({ label, onPress }: Props) {
  return (
    <Pressable style={({ pressed }) => [styles.button, pressed && styles.pressed]} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  pressed: {
    opacity: 0.6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
});
