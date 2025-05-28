const { body, validationResult } = require('express-validator');
const spacedRepetitionService = require('../services/spacedRepetitionService');
const UserProgress = require('../models/UserProgress');
const Character = require('../models/Character');
const { Op } = require('sequelize');

/**
 * ユーザーの全進捗を取得する
 */
exports.getAllProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const progress = await UserProgress.findAll({
      where: { user_id: userId },
      include: [{
        model: Character,
        as: 'character'
      }],
      order: [['updated_at', 'DESC']]
    });
    
    res.status(200).json({ progress });
  } catch (error) {
    next(error);
  }
};

/**
 * 未学習の文字を取得する
 */
exports.getNotLearned = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { type = 'all' } = req.query;
    
    const notLearnedCharacters = await spacedRepetitionService.getNotLearnedCharacters(userId, type);
    
    res.status(200).json({ characters: notLearnedCharacters });
  } catch (error) {
    next(error);
  }
};

/**
 * 復習が必要な文字を取得する
 */
exports.getReviewDue = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const reviewDueCharacters = await spacedRepetitionService.getReviewDueCharacters(userId);
    
    res.status(200).json({ characters: reviewDueCharacters });
  } catch (error) {
    next(error);
  }
};

/**
 * 学習進捗を更新する
 */
exports.updateProgress = [
  // バリデーション
  body('characterId').isInt().withMessage('文字IDは整数である必要があります'),
  body('isCorrect').isBoolean().withMessage('正解かどうかはブール値である必要があります'),
  
  async (req, res, next) => {
    try {
      // バリデーションエラーのチェック
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const userId = req.user.id;
      const { characterId, isCorrect } = req.body;
      
      // 文字の存在確認
      const character = await Character.findByPk(characterId);
      if (!character) {
        return res.status(404).json({ message: '文字が見つかりません' });
      }
      
      // 進捗を更新
      const updatedProgress = await spacedRepetitionService.updateProgress(userId, characterId, isCorrect);
      
      res.status(200).json({ progress: updatedProgress });
    } catch (error) {
      next(error);
    }
  }
];

/**
 * 学習統計を取得する
 */
exports.getStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // 全体の進捗状況
    const totalCharacters = await Character.count();
    const learnedCharacters = await UserProgress.count({
      where: { 
        user_id: userId,
        status: { [Op.ne]: 'not_learned' }
      }
    });
    const masteredCharacters = await UserProgress.count({
      where: { 
        user_id: userId,
        status: 'mastered'
      }
    });
    
    // ひらがな/カタカナ別の進捗
    const hiraganaTotal = await Character.count({ where: { type: 'hiragana' } });
    const hiraganaLearned = await UserProgress.count({
      where: { 
        user_id: userId,
        status: { [Op.ne]: 'not_learned' }
      },
      include: [{
        model: Character,
        as: 'character',
        where: { type: 'hiragana' }
      }]
    });
    const hiraganaMastered = await UserProgress.count({
      where: { 
        user_id: userId,
        status: 'mastered'
      },
      include: [{
        model: Character,
        as: 'character',
        where: { type: 'hiragana' }
      }]
    });
    
    const katakanaTotal = await Character.count({ where: { type: 'katakana' } });
    const katakanaLearned = await UserProgress.count({
      where: { 
        user_id: userId,
        status: { [Op.ne]: 'not_learned' }
      },
      include: [{
        model: Character,
        as: 'character',
        where: { type: 'katakana' }
      }]
    });
    const katakanaMastered = await UserProgress.count({
      where: { 
        user_id: userId,
        status: 'mastered'
      },
      include: [{
        model: Character,
        as: 'character',
        where: { type: 'katakana' }
      }]
    });
    
    // 正解率の計算
    const allProgress = await UserProgress.findAll({
      where: { user_id: userId },
      attributes: ['correct_count', 'incorrect_count']
    });
    
    let totalCorrect = 0;
    let totalIncorrect = 0;
    
    allProgress.forEach(progress => {
      totalCorrect += progress.correct_count;
      totalIncorrect += progress.incorrect_count;
    });
    
    const totalAnswers = totalCorrect + totalIncorrect;
    const accuracyRate = totalAnswers > 0 ? (totalCorrect / totalAnswers) * 100 : 0;
    
    res.status(200).json({
      stats: {
        total: {
          total: totalCharacters,
          learned: learnedCharacters,
          mastered: masteredCharacters,
          progress: totalCharacters > 0 ? (learnedCharacters / totalCharacters) * 100 : 0
        },
        hiragana: {
          total: hiraganaTotal,
          learned: hiraganaLearned,
          mastered: hiraganaMastered,
          progress: hiraganaTotal > 0 ? (hiraganaLearned / hiraganaTotal) * 100 : 0
        },
        katakana: {
          total: katakanaTotal,
          learned: katakanaLearned,
          mastered: katakanaMastered,
          progress: katakanaTotal > 0 ? (katakanaLearned / katakanaTotal) * 100 : 0
        },
        accuracy: {
          correct: totalCorrect,
          incorrect: totalIncorrect,
          total: totalAnswers,
          rate: accuracyRate
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
