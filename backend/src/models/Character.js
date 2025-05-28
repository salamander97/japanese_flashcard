const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Character = sequelize.define('Character', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  character: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true
  },
  romaji: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('hiragana', 'katakana'),
    allowNull: false
  },
  group_name: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  order_index: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false
});

module.exports = Character;
