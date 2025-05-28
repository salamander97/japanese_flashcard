const express = require('express');
const router = express.Router();
const characterController = require('../controllers/characterController');
const auth = require('../middleware/auth');

// 全ての文字を取得
router.get('/', characterController.getAllCharacters);

// ひらがなのみを取得
router.get('/hiragana', characterController.getHiragana);

// カタカナのみを取得
router.get('/katakana', characterController.getKatakana);

// 特定の文字の詳細を取得
router.get('/:id', characterController.getCharacterById);

// 文字をグループ別に取得
router.get('/groups/all', characterController.getCharactersByGroup);

module.exports = router;
