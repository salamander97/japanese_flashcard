const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');
const Level = require('../models/Level');
const User = require('../models/User');
const gamificationService = require('../services/gamificationService');
const { Op } = require('sequelize');

/**
 * 達成可能な実績一覧を取得する
 */
exports.getAchievements = async (req, res, next) => {
  try {
    const achievements = await Achievement.findAll({
      order: [['id', 'ASC']]
    });
    
    res.status(200).json({ achievements });
  } catch (error) {
    next(error);
  }
};

/**
 * ユーザーの獲得済み実績を取得する
 */
exports.getUserAchievements = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const userAchievements = await UserAchievement.findAll({
      where: { user_id: userId },
      include: [{
        model: Achievement,
        as: 'achievement'
      }],
      order: [['achieved_at', 'DESC']]
    });
    
    // 全実績を取得
    const allAchievements = await Achievement.findAll();
    
    // 獲得済み実績のIDを抽出
    const achievedIds = userAchievements.map(ua => ua.achievement_id);
    
    // 未獲得の実績を抽出
    const unachievedAchievements = allAchievements
      .filter(a => !achievedIds.includes(a.id))
      .map(a => ({
        ...a.toJSON(),
        achieved: false
      }));
    
    // 獲得済み実績を整形
    const achievedAchievements = userAchievements.map(ua => ({
      ...ua.achievement.toJSON(),
      achieved: true,
      achieved_at: ua.achieved_at
    }));
    
    // 全実績（獲得済み・未獲得）を結合
    const achievements = [...achievedAchievements, ...unachievedAchievements];
    
    res.status(200).json({ achievements });
  } catch (error) {
    next(error);
  }
};

/**
 * レベルシステム情報を取得する
 */
exports.getLevels = async (req, res, next) => {
  try {
    const levels = await Level.findAll({
      order: [['level', 'ASC']]
    });
    
    res.status(200).json({ levels });
  } catch (error) {
    next(error);
  }
};

/**
 * ユーザーのレベル情報を取得する
 */
exports.getUserLevel = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'ユーザーが見つかりません' });
    }
    
    // 現在のレベルと次のレベルの情報を取得
    const currentLevel = await Level.findByPk(user.level);
    const nextLevel = await Level.findOne({
      where: { level: user.level + 1 }
    });
    
    // レベル情報を整形
    const levelInfo = {
      currentLevel: user.level,
      currentExp: user.exp,
      expForCurrentLevel: currentLevel ? currentLevel.exp_required : 0,
      nextLevelExp: nextLevel ? nextLevel.exp_required : null,
      expToNextLevel: nextLevel ? nextLevel.exp_required - user.exp : null,
      progress: nextLevel ? ((user.exp - currentLevel.exp_required) / (nextLevel.exp_required - currentLevel.exp_required)) * 100 : 100,
      title: currentLevel ? currentLevel.title : null
    };
    
    res.status(200).json({ level: levelInfo });
  } catch (error) {
    next(error);
  }
};

/**
 * ユーザーの連続学習日数を取得する
 */
exports.getStreak = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'ユーザーが見つかりません' });
    }
    
    // 連続学習日数情報を整形
    const streakInfo = {
      currentStreak: user.streak_count,
      lastStudyDate: user.streak_last_date
    };
    
    res.status(200).json(streakInfo);
  } catch (error) {
    next(error);
  }
};

/**
 * 経験値を追加する
 */
exports.addExp = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { amount, reason } = req.body;
    
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: '有効な経験値を指定してください' });
    }
    
    const result = await gamificationService.addExperience(userId, amount, reason);
    
    // 実績をチェック
    const newAchievements = await gamificationService.checkAchievements(userId);
    
    res.status(200).json({
      ...result,
      newAchievements
    });
  } catch (error) {
    next(error);
  }
};
