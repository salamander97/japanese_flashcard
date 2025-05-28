const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Character = require('./Character');

const UserProgress = sequelize.define('UserProgress', {
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
  character_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Characters',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('not_learned', 'learning', 'mastered'),
    allowNull: false,
    defaultValue: 'not_learned'
  },
  correct_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  incorrect_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  last_reviewed: {
    type: DataTypes.DATE,
    allowNull: true
  },
  next_review: {
    type: DataTypes.DATE,
    allowNull: true
  },
  ease_factor: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 2.5
  },
  interval: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// リレーションシップの設定
User.hasMany(UserProgress, {
  foreignKey: 'user_id',
  as: 'progress'
});

UserProgress.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

Character.hasMany(UserProgress, {
  foreignKey: 'character_id',
  as: 'progress'
});

UserProgress.belongsTo(Character, {
  foreignKey: 'character_id',
  as: 'character'
});

module.exports = UserProgress;
