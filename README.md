# Water Reminder (水分補給リマインダーアプリ)

## セットアップ

このフォルダの中身を新しい Expo プロジェクトにコピーするか、
以下の手順でゼロから作成してこのコードを配置してください。

```bash
npx create-expo-app water-reminder --template blank-typescript
cd water-reminder
```

このzip内のファイルを、生成されたプロジェクトの同名パスに上書きコピーしてください
（`app.json`, `package.json`, `tsconfig.json`, `babel.config.js`, `app/`, `components/`, `hooks/`, `utils/`, `types/`, `eas.json`）。

## 依存関係のインストール

```bash
npx expo install expo-router expo-notifications expo-status-bar expo-haptics expo-linking expo-constants
npx expo install react-native-svg react-native-screens react-native-safe-area-context
npx expo install @react-native-async-storage/async-storage
npm install @expo/vector-icons
```

依存関係の衝突が出た場合:
```bash
npm install --legacy-peer-deps
npx expo install --fix
```

## 起動

```bash
npx expo start
```

## 未実装・要対応

- `assets/icons/` 配下のアイコン・スプラッシュ画像（プレースホルダー未生成）
- `assets/character/` 配下のキャラクター段階イラスト（現状は絵文字のプレースホルダー、`components/CharacterView.tsx` を参照）
- `com.kazumax71.waterreminder` の bundle identifier / package 名は仮なので、App Store Connect / Google Play Console 登録時に確定させること
- ウィジェット対応は今回のMVPから除外（ネイティブ実装が必要なため次フェーズで検討）

## ポモドーロアプリからの流用ポイント

- `utils/storage.ts` はポモドーロと共通インターフェースの AsyncStorage ラッパー
- `utils/notifications.ts` の通知スケジューリングパターンはポモドーロの実装をベースに、間隔通知＋quiet hours対応に改修したもの
- 同じパターンは次の習慣トラッカーアプリでもそのまま流用可能
