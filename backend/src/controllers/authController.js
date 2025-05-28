const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { generateToken, generateRefreshToken } = require('../config/jwt');
const RefreshToken = require('../models/RefreshToken');

// バリデーションルール
exports.registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('ユーザー名は3〜50文字である必要があります')
    .custom(async (value) => {
      const user = await User.findOne({ where: { username: value } });
      if (user) {
        throw new Error('このユーザー名は既に使用されています');
      }
      return true;
    }),
  body('email')
    .trim()
    .isEmail()
    .withMessage('有効なメールアドレスを入力してください')
    .custom(async (value) => {
      const user = await User.findOne({ where: { email: value } });
      if (user) {
        throw new Error('このメールアドレスは既に登録されています');
      }
      return true;
    }),
  body('password')
    .isLength({ min: 8 })
    .withMessage('パスワードは8文字以上である必要があります')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('パスワードには大文字、小文字、数字、特殊文字を含める必要があります')
];

exports.loginValidation = [
  body('email').trim().isEmail().withMessage('有効なメールアドレスを入力してください'),
  body('password').notEmpty().withMessage('パスワードを入力してください')
];

// ユーザー登録
exports.register = async (req, res, next) => {
  try {
    // バリデーションエラーのチェック
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // ユーザーの作成
    const user = await User.create({
      username,
      email,
      password
    });

    // トークンの生成
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // リフレッシュトークンをデータベースに保存
    await RefreshToken.create({
      user_id: user.id,
      token: refreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7日後
    });

    res.status(201).json({
      user: user.toJSON(),
      token,
      refreshToken
    });
  } catch (error) {
    next(error);
  }
};

// ユーザーログイン
exports.login = async (req, res, next) => {
  try {
    // バリデーションエラーのチェック
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // ユーザーの検索
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'メールアドレスまたはパスワードが正しくありません' });
    }

    // パスワードの検証
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'メールアドレスまたはパスワードが正しくありません' });
    }

    // トークンの生成
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // 古いリフレッシュトークンを削除
    await RefreshToken.destroy({ where: { user_id: user.id } });

    // 新しいリフレッシュトークンをデータベースに保存
    await RefreshToken.create({
      user_id: user.id,
      token: refreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7日後
    });

    // 連続学習日数の更新
    const today = new Date().toISOString().split('T')[0];
    if (user.streak_last_date) {
      const lastDate = new Date(user.streak_last_date);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (user.streak_last_date === yesterdayStr || user.streak_last_date === today) {
        if (user.streak_last_date !== today) {
          user.streak_count += 1;
          user.streak_last_date = today;
          await user.save();
        }
      } else {
        // 連続が途切れた場合
        user.streak_count = 1;
        user.streak_last_date = today;
        await user.save();
      }
    } else {
      // 初めてのログイン
      user.streak_count = 1;
      user.streak_last_date = today;
      await user.save();
    }

    res.status(200).json({
      user: user.toJSON(),
      token,
      refreshToken
    });
  } catch (error) {
    next(error);
  }
};

// ユーザープロフィール取得
exports.getProfile = async (req, res, next) => {
  try {
    // req.userはauthミドルウェアによって設定される
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'ユーザーが見つかりません' });
    }

    res.status(200).json({ user: user.toJSON() });
  } catch (error) {
    next(error);
  }
};

// トークン更新
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'リフレッシュトークンが必要です' });
    }

    // データベースでリフレッシュトークンを検索
    const tokenRecord = await RefreshToken.findOne({ where: { token: refreshToken } });
    if (!tokenRecord) {
      return res.status(403).json({ message: '無効なリフレッシュトークンです' });
    }

    // トークンの有効期限をチェック
    if (new Date() > new Date(tokenRecord.expires_at)) {
      await RefreshToken.destroy({ where: { token: refreshToken } });
      return res.status(403).json({ message: 'リフレッシュトークンの有効期限が切れています' });
    }

    // 新しいトークンを生成
    const newToken = generateToken(tokenRecord.user_id);
    const newRefreshToken = generateRefreshToken(tokenRecord.user_id);

    // 古いトークンを削除
    await RefreshToken.destroy({ where: { token: refreshToken } });

    // 新しいリフレッシュトークンを保存
    await RefreshToken.create({
      user_id: tokenRecord.user_id,
      token: newRefreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7日後
    });

    res.status(200).json({
      token: newToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    next(error);
  }
};
