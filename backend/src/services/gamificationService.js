const User = require('../models/User');
const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');
const Level = require('../models/Level');
const UserProgress = require('../models/UserProgress');
const Character = require('../models/Character');
const { Op } = require('sequelize');
const { sequelize } = require('../config/db');

/**
 * ユーザーに経験値を追加し、レベルアップを処理する
 * @param {Number} userId - ユーザーID
 * @param {Number} expAmount - 追加する経験値
 * @param {String} reason - 経験値獲得理由
 * @returns {Object} - 更新されたユーザー情報とレベルアップ情報
 */
const addExperience = async (userId, expAmount, reason = '') => {
  const transaction = await sequelize.transaction();
  
  try {
    // ユーザーを取得
    const user = await User.findByPk(userId, { transaction });
    if (!user) {
      throw new Error('ユーザーが見つかりません');
    }
    
    // 現在のレベルと経験値を記録
    const currentLevel = user.level;
    const currentExp = user.exp;
    
    // 経験値を追加
    user.exp += expAmount;
    
    // レベルアップの確認
    const levels = await Level.findAll({
      order: [['level', 'ASC']],
      transaction
    });
    
    let newLevel = currentLevel;
    let levelUp = false;
    
    // 最高レベルを超えないようにする
    const maxLevel = levels.length > 0 ? levels[levels.length - 1].level : 10;
    
    // レベルアップ処理
    for (let i = 0; i < levels.length; i++) {
      if (user.exp >= levels[i].exp_required && levels[i].level > newLevel && levels[i].level <= maxLevel) {
        newLevel = levels[i].level;
        levelUp = true;
      }
    }
    
    if (levelUp) {
      user.level = newLevel;
    }
    
    // ユーザー情報を保存
    await user.save({ transaction });
    
    // トランザクションをコミット
    await transaction.commit();
    
    return {
      user: user.toJSON(),
      expGained: expAmount,
      oldLevel: currentLevel,
      newLevel: user.level,
      levelUp,
      reason
    };
  } catch (error) {
    // エラー時はトランザクションをロールバック
    await transaction.rollback();
    throw error;
  }
};

/**
 * 実績の達成条件をチェックし、達成していれば実績を付与する
 * @param {Number} userId - ユーザーID
 * @returns {Array} - 新たに達成した実績の配列
 */
const checkAchievements = async (userId) => {
  try {
    // ユーザーを取得
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('ユーザーが見つかりません');
    }
    
    // すべての実績を取得
    const achievements = await Achievement.findAll();
    
    // ユーザーが既に獲得している実績IDを取得
    const userAchievements = await UserAchievement.findAll({
      where: { user_id: userId },
      attributes: ['achievement_id']
    });
    
    const achievedIds = userAchievements.map(ua => ua.achievement_id);
    
    // 未達成の実績をフィルタリング
    const unachievedAchievements = achievements.filter(a => !achievedIds.includes(a.id));
    
    const newlyAchieved = [];
    
    // 各実績の条件をチェック
    for (const achievement of unachievedAchievements) {
      let achieved = false;
      
      switch (achievement.condition_type) {
        case 'characters_learned':
          // 学習した文字数の条件
          const learnedCount = await UserProgress.count({
            where: {
              user_id: userId,
              status: { [Op.ne]: 'not_learned' }
            }
          });
          achieved = learnedCount >= achievement.condition_value;
          break;
          
        case 'hiragana_mastered':
          // ひらがなをマスターした数の条件
          const hiraganaMasteredCount = await UserProgress.count({
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
          achieved = hiraganaMasteredCount >= achievement.condition_value;
          break;
          
        case 'katakana_mastered':
          // カタカナをマスターした数の条件
          const katakanaMasteredCount = await UserProgress.count({
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
          achieved = katakanaMasteredCount >= achievement.condition_value;
          break;
          
        case 'streak':
          // 連続学習日数の条件
          achieved = user.streak_count >= achievement.condition_value;
          break;
          
        case 'quiz_speed':
          // クイズの速度条件（別途実装）
          break;
          
        // 他の条件タイプを追加
      }
      
      // 実績を達成した場合
      if (achieved) {
        // 実績を記録
        await UserAchievement.create({
          user_id: userId,
          achievement_id: achievement.id
        });
        
        // 経験値を付与
        await addExperience(userId, achievement.exp_reward, `実績「${achievement.name}」を達成`);
        
        // 新たに達成した実績を記録
        newlyAchieved.push({
          ...achievement.toJSON(),
          achieved_at: new Date()
        });
      }
    }
    
    return newlyAchieved;
  } catch (error) {
    throw error;
  }
};

/**
 * 連続学習日数を更新する
 * @param {Number} userId - ユーザーID
 * @returns {Object} - 更新された連続学習日数情報
 */
const updateStreak = async (userId) => {
  try {
    // ユーザーを取得
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('ユーザーが見つかりません');
    }
    
    const today = new Date().toISOString().split('T')[0];
    let streakUpdated = false;
    
    if (user.streak_last_date) {
      const lastDate = new Date(user.streak_last_date);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (user.streak_last_date === yesterdayStr) {
        // 昨日学習した場合、連続日数を増やす
        user.streak_count += 1;
        user.streak_last_date = today;
        streakUpdated = true;
      } else if (user.streak_last_date !== today) {
        // 昨日以外の日に学習した場合（連続が途切れた）
        user.streak_count = 1;
        user.streak_last_date = today;
        streakUpdated = true;
      }
    } else {
      // 初めての学習
      user.streak_count = 1;
      user.streak_last_date = today;
      streakUpdated = true;
    }
    
    if (streakUpdated) {
      await user.save();
      
      // 連続学習日数に関する実績をチェック
      await checkAchievements(userId);
    }
    
    return {
      currentStreak: user.streak_count,
      lastDate: user.streak_last_date,
      updated: streakUpdated
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addExperience,
  checkAchievements,
  updateStreak
};
