import { View, Text, StyleSheet } from 'react-native';

// 診断用プレースホルダー: フック・AsyncStorage・SVGは未使用
export default function settingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>settings プレースホルダー</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 16 },
});
