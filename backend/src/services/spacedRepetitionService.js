// スペース反復学習サービス
const UserProgress = require('../models/UserProgress');
const Character = require('../models/Character');
const { Op } = require('sequelize');

/**
 * スペース反復アルゴリズムに基づいて次回復習日を計算する
 * @param {Object} progress - 進捗オブジェクト
 * @param {Boolean} isCorrect - 正解かどうか
 * @returns {Object} - 更新された進捗データ
 */
const calculateNextReview = (progress, isCorrect) => {
  let { ease_factor, interval } = progress;
  
  if (isCorrect) {
    // 正解の場合
    if (interval === 0) {
      interval = 1; // 初めての正解
    } else {
      interval = Math.round(interval * ease_factor);
    }
    ease_factor += 0.1; // 難易度を下げる（簡単になる）
  } else {
    // 不正解の場合
    interval = 1; // 次の日に復習
    ease_factor -= 0.2; // 難易度を上げる（難しくなる）
    
    // 難易度係数の最小値を1.3に制限
    if (ease_factor < 1.3) {
      ease_factor = 1.3;
    }
  }
  
  // 次回復習日を計算
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);
  
  return {
    ease_factor,
    interval,
    next_review: nextReview,
    last_reviewed: new Date()
  };
};

/**
 * ユーザーの未学習文字を取得する
 * @param {Number} userId - ユーザーID
 * @param {String} type - 文字タイプ（hiragana/katakana/all）
 * @returns {Array} - 未学習文字の配列
 */
const getNotLearnedCharacters = async (userId, type = 'all') => {
  try {
    // ユーザーが既に学習を開始した文字のIDを取得
    const learnedCharacterIds = await UserProgress.findAll({
      where: { user_id: userId },
      attributes: ['character_id']
    }).then(progress => progress.map(p => p.character_id));
    
    // 文字タイプに基づいてクエリ条件を設定
    const whereCondition = {};
    if (type !== 'all') {
      whereCondition.type = type;
    }
    
    // まだ学習していない文字を取得
    if (learnedCharacterIds.length > 0) {
      whereCondition.id = { [Op.notIn]: learnedCharacterIds };
    }
    
    const notLearnedCharacters = await Character.findAll({
      where: whereCondition,
      order: [['order_index', 'ASC']]
    });
    
    return notLearnedCharacters;
  } catch (error) {
    throw error;
  }
};

/**
 * 復習が必要な文字を取得する
 * @param {Number} userId - ユーザーID
 * @returns {Array} - 復習が必要な文字の配列
 */
const getReviewDueCharacters = async (userId) => {
  try {
    const now = new Date();
    
    // 復習期限が現在時刻以前の文字を取得
    const reviewDueProgress = await UserProgress.findAll({
      where: {
        user_id: userId,
        next_review: { [Op.lte]: now },
        status: { [Op.ne]: 'mastered' } // マスターした文字は除外
      },
      include: [{
        model: Character,
        as: 'character'
      }],
      order: [['next_review', 'ASC']] // 最も復習が遅れているものから
    });
    
    return reviewDueProgress.map(progress => ({
      ...progress.character.toJSON(),
      progress: {
        id: progress.id,
        status: progress.status,
        correct_count: progress.correct_count,
        incorrect_count: progress.incorrect_count,
        ease_factor: progress.ease_factor,
        interval: progress.interval,
        next_review: progress.next_review
      }
    }));
  } catch (error) {
    throw error;
  }
};

/**
 * 学習進捗を更新する
 * @param {Number} userId - ユーザーID
 * @param {Number} characterId - 文字ID
 * @param {Boolean} isCorrect - 正解かどうか
 * @returns {Object} - 更新された進捗データ
 */
const updateProgress = async (userId, characterId, isCorrect) => {
  try {
    // 既存の進捗を検索
    let progress = await UserProgress.findOne({
      where: {
        user_id: userId,
        character_id: characterId
      }
    });
    
    if (!progress) {
      // 新しい進捗レコードを作成
      progress = await UserProgress.create({
        user_id: userId,
        character_id: characterId,
        status: 'learning',
        correct_count: 0,
        incorrect_count: 0,
        ease_factor: 2.5,
        interval: 0
      });
    }
    
    // 正解/不正解のカウントを更新
    if (isCorrect) {
      progress.correct_count += 1;
    } else {
      progress.incorrect_count += 1;
    }
    
    // スペース反復アルゴリズムで次回復習日を計算
    const updatedValues = calculateNextReview(progress, isCorrect);
    
    // 進捗ステータスの更新
    if (isCorrect && progress.correct_count >= 5 && progress.correct_count > progress.incorrect_count * 2) {
      updatedValues.status = 'mastered';
    } else {
      updatedValues.status = 'learning';
    }
    
    // 進捗を更新
    await progress.update(updatedValues);
    
    // 更新された進捗を取得
    const updatedProgress = await UserProgress.findByPk(progress.id, {
      include: [{
        model: Character,
        as: 'character'
      }]
    });
    
    return updatedProgress;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  calculateNextReview,
  getNotLearnedCharacters,
  getReviewDueCharacters,
  updateProgress
};
