const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('Characters', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
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
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    });

    // Add indexes for better performance
    await queryInterface.addIndex('Characters', ['type']);
    await queryInterface.addIndex('Characters', ['group_name']);
    await queryInterface.addIndex('Characters', ['order_index']);
    await queryInterface.addIndex('Characters', ['character']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Characters');
  }
};