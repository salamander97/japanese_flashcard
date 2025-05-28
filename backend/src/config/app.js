const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { sequelize } = require('./models');
require('dotenv').config();

// ルートのインポート
const authRoutes = require('./routes/authRoutes');
const characterRoutes = require('./routes/characterRoutes');
const progressRoutes = require('./routes/progressRoutes');
const gamificationRoutes = require('./routes/gamificationRoutes');
const dbRoutes = require('./routes/dbRoutes');

// アプリケーションの初期化
const app = express();

// ミドルウェアの設定
app.use(helmet()); // セキュリティヘッダーの設定
app.use(morgan('dev')); // リクエストロギング
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json()); // JSONボディパーサー

// レート制限の設定
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 100, // 15分あたり100リクエストまで
  standardHeaders: true,
  legacyHeaders: false,
});

// 認証エンドポイント用の厳格なレート制限
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 10, // 15分あたり10リクエストまで
  standardHeaders: true,
  legacyHeaders: false,
});

// ルートの設定
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/characters', apiLimiter, characterRoutes);
app.use('/api/progress', apiLimiter, progressRoutes);
app.use('/api/gamification', apiLimiter, gamificationRoutes);
app.use('/api/db', dbRoutes); // 開発環境用DBルート

// ルートエンドポイント
app.get('/', (req, res) => {
  res.json({ message: '日本語フラッシュカードAPI' });
});

// エラーハンドリングミドルウェア
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    error: {
      message: err.message || 'サーバーエラーが発生しました',
      status: err.statusCode || 500
    }
  });
});

// サーバーの起動
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`サーバーがポート${PORT}で起動しました`);
  try {
    await sequelize.authenticate();
    console.log('データベース接続が確立されました');
  } catch (error) {
    console.error('データベース接続エラー:', error);
  }
});

module.exports = app;
