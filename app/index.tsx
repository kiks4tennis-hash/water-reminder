import { View, Text, StyleSheet } from 'react-native';

// --- 診断用の最小構成画面 ---
// 独自フック・AsyncStorage・SVG等は一切使わず、文字を表示するだけ。
// これでもクラッシュする場合、原因はアプリのコードではなくビルド設定側にある。

export default function DiagnosticScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>診断用の最小画面です</Text>
      <Text style={styles.text}>これが表示されていればクラッシュしていません</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  text: { fontSize: 16, textAlign: 'center' },
});
