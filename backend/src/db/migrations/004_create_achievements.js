const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    // Create Levels table
    await queryInterface.createTable('Levels', {
      level: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      exp_required: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    });

    // Create Achievements table
    await queryInterface.createTable('Achievements', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
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
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    });

    // Create UserAchievements table
    await queryInterface.createTable('UserAchievements', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      achievement_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Achievements',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      achieved_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    });

    // Add indexes for Achievements
    await queryInterface.addIndex('Achievements', ['condition_type']);
    await queryInterface.addIndex('Achievements', ['name'], { unique: true });

    // Add indexes for UserAchievements
    await queryInterface.addIndex('UserAchievements', ['user_id']);
    await queryInterface.addIndex('UserAchievements', ['achievement_id']);
    await queryInterface.addIndex('UserAchievements', ['user_id', 'achievement_id'], { unique: true });

    // Add indexes for Levels
    await queryInterface.addIndex('Levels', ['exp_required']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('UserAchievements');
    await queryInterface.dropTable('Achievements');
    await queryInterface.dropTable('Levels');
  }
};