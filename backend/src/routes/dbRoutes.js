const express = require('express');
const router = express.Router();
const { initializeDatabase } = require('../db/initialize');

// データベース初期化エンドポイント（開発環境のみ）
router.post('/init-db', async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ message: 'この操作は開発環境でのみ実行できます' });
  }
  
  try {
    const result = await initializeDatabase();
    if (result) {
      res.status(200).json({ message: 'データベースが正常に初期化されました' });
    } else {
      res.status(500).json({ message: 'データベース初期化に失敗しました' });
    }
  } catch (error) {
    res.status(500).json({ message: 'エラーが発生しました', error: error.message });
  }
});

module.exports = router;
