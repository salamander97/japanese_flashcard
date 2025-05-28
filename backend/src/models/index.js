const { sequelize } = require('../config/db');
const User = require('./User');
const Character = require('./Character');
const UserProgress = require('./UserProgress');
const Achievement = require('./Achievement');
const UserAchievement = require('./UserAchievement');
const Level = require('./Level');
const Session = require('./Session');
const RefreshToken = require('./RefreshToken');

// リレーションシップの設定
// User と Session の関連付け
User.hasMany(Session, {
  foreignKey: 'user_id',
  as: 'sessions'
});

Session.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// すべてのモデルをエクスポート
module.exports = {
  sequelize,
  User,
  Character,
  UserProgress,
  Achievement,
  UserAchievement,
  Level,
  Session,
  RefreshToken
};
