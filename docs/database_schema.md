# データベース設計

## テーブル構造

### users
ユーザー情報を管理するテーブル

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | SERIAL | PRIMARY KEY | ユーザーID |
| username | VARCHAR(50) | NOT NULL, UNIQUE | ユーザー名 |
| email | VARCHAR(100) | NOT NULL, UNIQUE | メールアドレス |
| password | VARCHAR(100) | NOT NULL | ハッシュ化されたパスワード |
| exp | INTEGER | NOT NULL, DEFAULT 0 | 経験値 |
| level | INTEGER | NOT NULL, DEFAULT 1 | レベル |
| streak_count | INTEGER | NOT NULL, DEFAULT 0 | 連続学習日数 |
| streak_last_date | DATE | | 最後に学習した日付 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 更新日時 |

### characters
日本語の文字（ひらがな・カタカナ）を管理するテーブル

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | SERIAL | PRIMARY KEY | 文字ID |
| character | VARCHAR(10) | NOT NULL, UNIQUE | 文字 |
| romaji | VARCHAR(10) | NOT NULL | ローマ字表記 |
| type | VARCHAR(10) | NOT NULL | 種類（hiragana/katakana） |
| group_name | VARCHAR(20) | NOT NULL | 文字グループ（あ行、か行など） |
| order_index | INTEGER | NOT NULL | 表示順序 |

### user_progress
ユーザーごとの文字学習進捗を管理するテーブル

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | SERIAL | PRIMARY KEY | 進捗ID |
| user_id | INTEGER | NOT NULL, FOREIGN KEY | ユーザーID |
| character_id | INTEGER | NOT NULL, FOREIGN KEY | 文字ID |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'not_learned' | 学習状態（not_learned/learning/mastered） |
| correct_count | INTEGER | NOT NULL, DEFAULT 0 | 正解回数 |
| incorrect_count | INTEGER | NOT NULL, DEFAULT 0 | 不正解回数 |
| last_reviewed | TIMESTAMP | | 最後に復習した日時 |
| next_review | TIMESTAMP | | 次回復習予定日時 |
| ease_factor | FLOAT | NOT NULL, DEFAULT 2.5 | 難易度係数（スペース反復用） |
| interval | INTEGER | NOT NULL, DEFAULT 0 | 復習間隔（日数） |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 更新日時 |

### achievements
達成可能な実績を管理するテーブル

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | SERIAL | PRIMARY KEY | 実績ID |
| name | VARCHAR(50) | NOT NULL, UNIQUE | 実績名 |
| description | TEXT | NOT NULL | 実績の説明 |
| condition_type | VARCHAR(50) | NOT NULL | 条件タイプ（characters_learned/streak/quiz_speed等） |
| condition_value | INTEGER | NOT NULL | 条件値 |
| exp_reward | INTEGER | NOT NULL | 獲得経験値 |
| icon | VARCHAR(100) | NOT NULL | アイコンパス |

### user_achievements
ユーザーが獲得した実績を管理するテーブル

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | SERIAL | PRIMARY KEY | ID |
| user_id | INTEGER | NOT NULL, FOREIGN KEY | ユーザーID |
| achievement_id | INTEGER | NOT NULL, FOREIGN KEY | 実績ID |
| achieved_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 達成日時 |

### levels
レベルシステムを管理するテーブル

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| level | INTEGER | PRIMARY KEY | レベル |
| exp_required | INTEGER | NOT NULL | 必要経験値 |
| title | VARCHAR(50) | | レベルの称号 |

### sessions
ユーザーの学習セッションを記録するテーブル

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | SERIAL | PRIMARY KEY | セッションID |
| user_id | INTEGER | NOT NULL, FOREIGN KEY | ユーザーID |
| start_time | TIMESTAMP | NOT NULL, DEFAULT NOW() | 開始時間 |
| end_time | TIMESTAMP | | 終了時間 |
| duration | INTEGER | | 学習時間（秒） |
| characters_studied | INTEGER | NOT NULL, DEFAULT 0 | 学習した文字数 |
| correct_answers | INTEGER | NOT NULL, DEFAULT 0 | 正解数 |
| incorrect_answers | INTEGER | NOT NULL, DEFAULT 0 | 不正解数 |
| session_type | VARCHAR(20) | NOT NULL | セッションタイプ（study/quiz/review） |

### refresh_tokens
リフレッシュトークンを管理するテーブル

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | SERIAL | PRIMARY KEY | トークンID |
| user_id | INTEGER | NOT NULL, FOREIGN KEY | ユーザーID |
| token | VARCHAR(255) | NOT NULL | リフレッシュトークン |
| expires_at | TIMESTAMP | NOT NULL | 有効期限 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 作成日時 |

## リレーション

- `users` と `user_progress`: 1対多 (1人のユーザーに対して複数の文字進捗)
- `characters` と `user_progress`: 1対多 (1つの文字に対して複数のユーザー進捗)
- `users` と `user_achievements`: 1対多 (1人のユーザーに対して複数の実績)
- `achievements` と `user_achievements`: 1対多 (1つの実績に対して複数のユーザー獲得)
- `users` と `sessions`: 1対多 (1人のユーザーに対して複数の学習セッション)
- `users` と `refresh_tokens`: 1対多 (1人のユーザーに対して複数のリフレッシュトークン)

## インデックス

- `users`: `email` にインデックス
- `user_progress`: `user_id`, `character_id`, `next_review` にインデックス
- `user_achievements`: `user_id`, `achievement_id` の複合インデックス
- `sessions`: `user_id`, `start_time` にインデックス
- `refresh_tokens`: `token` にインデックス

## スペース反復アルゴリズム

スペース反復学習のために、`user_progress` テーブルには以下のフィールドを使用します：

- `ease_factor`: 文字の難易度係数（初期値2.5）
- `interval`: 次回復習までの間隔（日数）
- `next_review`: 次回復習予定日時

アルゴリズムの流れ：

1. ユーザーが文字を学習/復習する
2. ユーザーの回答に基づいて `ease_factor` と `interval` を更新
   - 「知っている」と回答: `interval = interval * ease_factor`, `ease_factor += 0.1`
   - 「知らない」と回答: `interval = 1`, `ease_factor -= 0.2` (最小値1.3)
3. `next_review = 現在時刻 + interval日`

これにより、ユーザーが苦手な文字はより頻繁に、得意な文字はより長い間隔で復習されるようになります。
