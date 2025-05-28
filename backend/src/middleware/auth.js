const jwt = require('jsonwebtoken');
const { verifyToken } = require('../config/jwt');
const User = require('../models/User');

// JWT認証ミドルウェア
const auth = async (req, res, next) => {
  try {
    // ヘッダーからトークンを取得
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '認証が必要です' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: '認証トークンが必要です' });
    }

    try {
      // トークンを検証
      const decoded = verifyToken(token);
      
      // ユーザーを検索
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'ユーザーが見つかりません' });
      }

      // リクエストオブジェクトにユーザー情報を追加
      req.user = { id: user.id };
      next();
    } catch (error) {
      return res.status(401).json({ message: '無効なトークンです' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = auth;
