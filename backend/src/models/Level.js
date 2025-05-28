const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Level = sequelize.define('Level', {
  level: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  exp_required: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  timestamps: false
});

module.exports = Level;
