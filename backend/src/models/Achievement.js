const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Achievement = sequelize.define('Achievement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  condition_type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  condition_value: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  exp_reward: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  icon: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  timestamps: false
});

module.exports = Achievement;
