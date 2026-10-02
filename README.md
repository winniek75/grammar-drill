# to / ing 使い分けドリル（VerbForm Battle）🎮

英検3級〜準2級めやすの動詞パターン練習ゲーム。  
**to + 動詞** vs **動詞 + ing** の使い分けをゲーム形式でマスターできます。

## 問題数

- **全94問**収録
  - TO動詞: 35問（want / hope / decide / plan / need / promise / agree / refuse / offer / choose / manage / fail / expect / afford / appear / seem / prepare）
  - ING動詞: 34問（enjoy / finish / keep / avoid / mind / miss / consider / suggest / practice / delay / put off / give up / imagine / dislike / look forward to / spend時間-ing）
  - BOTH使い分け: 25問（remember / forget / stop / try / regret 各5問）

## ゲームモード

| モード | 問題数 | 特徴 |
|--------|--------|------|
| 📖 基礎練習 | 20問（5/10問も選択可） | to + 動詞 vs 動詞ing の2択・時間制限なし |
| 🔄 意味が変わる動詞（BOTH） | 16問（5/10問も選択可） | 形をえらぶ問題＋英文の意味をえらぶ問題（約4割） |
| ⚡ タイムアタック | 25問（5/10問も選択可） | 12秒制限・コンボで得点倍率UP・時間切れは別集計 |

各セッションの最後に「I want ___.」「I enjoy ___.」を自分で完成させる作文チャレンジ（2問、to / ing の形だけを寛容に採点）があります。

## URLパラメータ（ポータルからの直接起動）

| パラメータ | 値 | 内容 |
|---|---|---|
| `mode` | `basic` / `both` / `attack` | そのモードのルール画面を直接開く（`practice`=basic も可） |
| `count` | 3以上の整数 | 問題数（モードの収録数が上限） |
| `start` | `1` | ルール画面をとばしてすぐ出題 |
| `write` | `0` | 最後の作文チャレンジを出さない |

例: `/?mode=basic&count=10` 、 `/?mode=both&count=8&start=1`

## ローカル開発

```bash
npm install
npm run dev
```

## ビルド

```bash
npm run build
```

## Vercelデプロイ

GitHubと連携してVercelにpushするだけで自動デプロイされます。  
Build Command: `npm run build`  
Output Directory: `dist`
