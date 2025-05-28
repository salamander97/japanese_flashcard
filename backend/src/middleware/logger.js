const winston = require('winston');
const path = require('path');
const fs = require('fs');

// ログディレクトリの作成
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// ログフォーマットの定義
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// ロガーの設定
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: { service: 'japanese-flashcard-api' },
  transports: [
    // エラーログはerror.logファイルに書き込む
    new winston.transports.File({ 
      filename: path.join(logDir, 'error.log'), 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // すべてのログはcombined.logファイルに書き込む
    new winston.transports.File({ 
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  ]
});

// 開発環境では、コンソールにもログを出力
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// センシティブ情報をマスクする関数
const maskSensitiveData = (data) => {
  if (!data) return data;
  
  const maskedData = { ...data };
  
  // パスワードをマスク
  if (maskedData.password) {
    maskedData.password = '********';
  }
  
  // トークンをマスク
  if (maskedData.token) {
    maskedData.token = maskedData.token.substring(0, 10) + '...';
  }
  
  // リフレッシュトークンをマスク
  if (maskedData.refreshToken) {
    maskedData.refreshToken = maskedData.refreshToken.substring(0, 10) + '...';
  }
  
  return maskedData;
};

// リクエストロギングミドルウェア
const requestLogger = (req, res, next) => {
  // リクエスト開始時間を記録
  req.startTime = Date.now();
  
  // レスポンス送信後にログを記録
  res.on('finish', () => {
    const duration = Date.now() - req.startTime;
    const maskedBody = maskSensitiveData(req.body);
    
    logger.info({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      user: req.user ? req.user.id : 'anonymous',
      body: maskedBody
    });
  });
  
  next();
};

// エラーロギングミドルウェア
const errorLogger = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    user: req.user ? req.user.id : 'anonymous'
  });
  
  next(err);
};

module.exports = {
  logger,
  requestLogger,
  errorLogger
};
