const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const auth = require('../middleware/auth');

// ユーザーの全進捗を取得
router.get('/', auth, progressController.getAllProgress);

// 未学習の文字を取得
router.get('/not-learned', auth, progressController.getNotLearned);

// 復習が必要な文字を取得
router.get('/review-due', auth, progressController.getReviewDue);

// 学習進捗を更新
router.post('/update', auth, progressController.updateProgress);

// 学習統計を取得
router.get('/stats', auth, progressController.getStats);

module.exports = router;
