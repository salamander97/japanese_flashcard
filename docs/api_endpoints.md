# API エンドポイント設計

## 認証 (Authentication)

| エンドポイント | メソッド | 説明 | リクエスト | レスポンス |
|--------------|--------|------|----------|-----------|
| `/api/auth/register` | POST | 新規ユーザー登録 | `{ username, email, password }` | `{ user, token }` |
| `/api/auth/login` | POST | ユーザーログイン | `{ email, password }` | `{ user, token }` |
| `/api/auth/profile` | GET | ユーザープロフィール取得 | JWT Token | `{ user }` |
| `/api/auth/refresh` | POST | トークン更新 | `{ refreshToken }` | `{ token, refreshToken }` |

## 文字 (Characters)

| エンドポイント | メソッド | 説明 | リクエスト | レスポンス |
|--------------|--------|------|----------|-----------|
| `/api/characters` | GET | 全ての文字を取得 | - | `{ characters: [] }` |
| `/api/characters/hiragana` | GET | ひらがなのみ取得 | - | `{ characters: [] }` |
| `/api/characters/katakana` | GET | カタカナのみ取得 | - | `{ characters: [] }` |
| `/api/characters/:id` | GET | 特定の文字の詳細を取得 | - | `{ character }` |

## 進捗 (Progress)

| エンドポイント | メソッド | 説明 | リクエスト | レスポンス |
|--------------|--------|------|----------|-----------|
| `/api/progress` | GET | ユーザーの全進捗を取得 | JWT Token | `{ progress: [] }` |
| `/api/progress/not-learned` | GET | 未学習の文字を取得 | JWT Token | `{ characters: [] }` |
| `/api/progress/review-due` | GET | 復習が必要な文字を取得 | JWT Token | `{ characters: [] }` |
| `/api/progress/update` | POST | 学習進捗を更新 | `{ characterId, status, nextReview }` | `{ progress }` |
| `/api/progress/stats` | GET | 学習統計を取得 | JWT Token | `{ stats }` |

## ゲーミフィケーション (Gamification)

| エンドポイント | メソッド | 説明 | リクエスト | レスポンス |
|--------------|--------|------|----------|-----------|
| `/api/gamification/achievements` | GET | 達成可能な実績一覧を取得 | JWT Token | `{ achievements: [] }` |
| `/api/gamification/user-achievements` | GET | ユーザーの獲得済み実績を取得 | JWT Token | `{ achievements: [] }` |
| `/api/gamification/levels` | GET | レベルシステム情報を取得 | JWT Token | `{ levels: [] }` |
| `/api/gamification/user-level` | GET | ユーザーのレベル情報を取得 | JWT Token | `{ level, exp, nextLevel }` |
| `/api/gamification/streak` | GET | ユーザーの連続学習日数を取得 | JWT Token | `{ currentStreak, maxStreak }` |
| `/api/gamification/add-exp` | POST | 経験値を追加 | `{ amount, reason }` | `{ newExp, newLevel, levelUp }` |

## クイズ (Quiz)

| エンドポイント | メソッド | 説明 | リクエスト | レスポンス |
|--------------|--------|------|----------|-----------|
| `/api/quiz/generate` | POST | クイズを生成 | `{ type, count }` | `{ questions: [] }` |
| `/api/quiz/submit` | POST | クイズ結果を提出 | `{ answers: [] }` | `{ score, expGained, achievements }` |
