const express = require('express');
const router = express.Router();
const gamificationController = require('../controllers/gamificationController');
const auth = require('../middleware/auth');

// 達成可能な実績一覧を取得
router.get('/achievements', auth, gamificationController.getAchievements);

// ユーザーの獲得済み実績を取得
router.get('/user-achievements', auth, gamificationController.getUserAchievements);

// レベルシステム情報を取得
router.get('/levels', auth, gamificationController.getLevels);

// ユーザーのレベル情報を取得
router.get('/user-level', auth, gamificationController.getUserLevel);

// ユーザーの連続学習日数を取得
router.get('/streak', auth, gamificationController.getStreak);

// 経験値を追加
router.post('/add-exp', auth, gamificationController.addExp);

module.exports = router;
