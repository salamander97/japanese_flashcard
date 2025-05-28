const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// ユーザー登録
router.post('/register', authController.registerValidation, authController.register);

// ユーザーログイン
router.post('/login', authController.loginValidation, authController.login);

// ユーザープロフィール取得（認証必須）
router.get('/profile', auth, authController.getProfile);

// トークン更新
router.post('/refresh', authController.refreshToken);

module.exports = router;
