import { Tabs } from 'expo-router';

// 診断用: アイコン(@expo/vector-icons)を一時的に外して、
// タブナビゲーション自体とアイコン表示のどちらが原因かを切り分ける

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'ホーム' }} />
      <Tabs.Screen name="history" options={{ title: '履歴' }} />
      <Tabs.Screen name="settings" options={{ title: '設定' }} />
    </Tabs>
  );
}
