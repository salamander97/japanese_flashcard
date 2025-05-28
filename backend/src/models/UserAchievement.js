const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Achievement = require('./Achievement');

const UserAchievement = sequelize.define('UserAchievement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  achievement_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Achievements',
      key: 'id'
    }
  },
  achieved_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'achievement_id']
    }
  ]
});

// リレーションシップの設定
User.hasMany(UserAchievement, {
  foreignKey: 'user_id',
  as: 'achievements'
});

UserAchievement.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

Achievement.hasMany(UserAchievement, {
  foreignKey: 'achievement_id',
  as: 'users'
});

UserAchievement.belongsTo(Achievement, {
  foreignKey: 'achievement_id',
  as: 'achievement'
});

module.exports = UserAchievement;
