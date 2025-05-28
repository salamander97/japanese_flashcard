const { body, validationResult } = require('express-validator');

// 共通のバリデーションエラーハンドラー
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      status: 'error',
      message: 'バリデーションエラー',
      errors: errors.array() 
    });
  }
  next();
};

// 登録リクエストのバリデーション
const validateRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('ユーザー名は3〜50文字である必要があります')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('ユーザー名は英数字とアンダースコアのみ使用できます'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('有効なメールアドレスを入力してください')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('パスワードは8文字以上である必要があります')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('パスワードには大文字、小文字、数字、特殊文字を含める必要があります'),
  
  handleValidationErrors
];

// ログインリクエストのバリデーション
const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('有効なメールアドレスを入力してください')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('パスワードを入力してください'),
  
  handleValidationErrors
];

// 進捗更新リクエストのバリデーション
const validateProgressUpdate = [
  body('characterId')
    .isInt({ min: 1 })
    .withMessage('有効な文字IDを指定してください'),
  
  body('isCorrect')
    .isBoolean()
    .withMessage('正解かどうかはブール値で指定してください'),
  
  handleValidationErrors
];

// 経験値追加リクエストのバリデーション
const validateAddExp = [
  body('amount')
    .isInt({ min: 1 })
    .withMessage('経験値は1以上の整数である必要があります'),
  
  body('reason')
    .optional()
    .isString()
    .withMessage('理由は文字列である必要があります'),
  
  handleValidationErrors
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateProgressUpdate,
  validateAddExp
};
