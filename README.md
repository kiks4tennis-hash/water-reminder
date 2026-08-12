# Water Reminder

## 現在の状態

- App Store提出済み(build 9)、TestFlightでクラッシュが再現中
- クラッシュは `com.facebook.react.ExceptionsManagerQueue` 上での未捕捉のObjective-C例外(SIGABRT)
- 今回のバージョンで、JSエラーがネイティブクラッシュへ伝播するのを防ぐ防御コードを追加:
  - `components/ErrorBoundary.tsx`: Reactのレンダリングエラーを画面内でキャッチ
  - `app/_layout.tsx`: `Sentry.init()`をtry/catchで保護し、`ErrorUtils.setGlobalHandler`でグローバルなJS例外もSentryに送るようにした

## 反映手順

```bash
npm install
git add .
git commit -m "Add defensive error handling to prevent native crash propagation"
git push
eas build --platform ios --profile production --clear-cache
eas submit --platform ios --profile production
```

## eas.json の要差し替え項目

- `appleId`: Apple Developerログイン用メールアドレス
- `appleTeamId`: developer.apple.com/account の Team ID
(`ascAppId`は 6797351627 で設定済み)
