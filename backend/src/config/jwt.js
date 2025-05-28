const jwt = require('jsonwebtoken');
require('dotenv').config();

// JWTトークン生成関数
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// リフレッシュトークン生成関数
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || 'your_refresh_token_secret_here',
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
};

// トークン検証関数
const verifyToken = (token, isRefresh = false) => {
  try {
    const secret = isRefresh 
      ? (process.env.JWT_REFRESH_SECRET || 'your_refresh_token_secret_here')
      : (process.env.JWT_SECRET || 'your_jwt_secret_key_here');
    
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('無効なトークンです');
  }
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken
};
