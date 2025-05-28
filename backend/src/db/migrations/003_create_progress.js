const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    // Create UserProgress table
    await queryInterface.createTable('UserProgresses', {
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
      character_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Characters',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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

    // Create Sessions table
    await queryInterface.createTable('Sessions', {
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

    // Create RefreshTokens table
    await queryInterface.createTable('RefreshTokens', {
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
      token: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    });

    // Add indexes for UserProgress
    await queryInterface.addIndex('UserProgresses', ['user_id']);
    await queryInterface.addIndex('UserProgresses', ['character_id']);
    await queryInterface.addIndex('UserProgresses', ['next_review']);
    await queryInterface.addIndex('UserProgresses', ['status']);
    await queryInterface.addIndex('UserProgresses', ['user_id', 'character_id'], { unique: true });

    // Add indexes for Sessions
    await queryInterface.addIndex('Sessions', ['user_id']);
    await queryInterface.addIndex('Sessions', ['start_time']);
    await queryInterface.addIndex('Sessions', ['session_type']);

    // Add indexes for RefreshTokens
    await queryInterface.addIndex('RefreshTokens', ['token'], { unique: true });
    await queryInterface.addIndex('RefreshTokens', ['user_id']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('RefreshTokens');
    await queryInterface.dropTable('Sessions');
    await queryInterface.dropTable('UserProgresses');
  }
};