const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Session = sequelize.define('Session', {
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
  start_time: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '学習時間（秒）'
  },
  characters_studied: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  correct_answers: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  incorrect_answers: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  session_type: {
    type: DataTypes.ENUM('study', 'quiz', 'review'),
    allowNull: false
  }
}, {
  timestamps: false,
  indexes: [
    {
      fields: ['user_id', 'start_time']
    }
  ]
});

module.exports = Session;
