// Migration runner for database initialization
const { sequelize } = require('../../models');
const { logger } = require('../../utils/logger');
const path = require('path');
const fs = require('fs');

/**
 * Run all database migrations in order
 */
async function migrate() {
  try {
    logger.info('🚀 Starting database migrations...');
    
    // Test database connection first
    await sequelize.authenticate();
    logger.info('✅ Database connection established');
    
    // Get all migration files
    const migrationsDir = __dirname;
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.match(/^\d{3}_.*\.js$/))
      .sort();
    
    if (migrationFiles.length === 0) {
      logger.warn('⚠️  No migration files found');
      return true;
    }
    
    // Run each migration
    for (const file of migrationFiles) {
      try {
        logger.info(`📋 Running migration: ${file}`);
        const migration = require(path.join(migrationsDir, file));
        
        if (typeof migration.up === 'function') {
          await migration.up(sequelize.getQueryInterface());
          logger.info(`✅ Migration ${file} completed successfully`);
        } else {
          logger.warn(`⚠️  Migration ${file} has no 'up' method`);
        }
      } catch (error) {
        logger.error(`❌ Migration ${file} failed:`, error);
        throw error;
      }
    }
    
    logger.info('🎉 All migrations completed successfully!');
    return true;
  } catch (error) {
    logger.error('❌ Migration process failed:', error);
    throw error;
  }
}

/**
 * Rollback all migrations (development only)
 */
async function rollback() {
  try {
    logger.info('🔄 Starting database rollback...');
    
    const migrationsDir = __dirname;
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.match(/^\d{3}_.*\.js$/))
      .sort()
      .reverse(); // Reverse order for rollback
    
    // Run each rollback
    for (const file of migrationFiles) {
      try {
        logger.info(`📋 Rolling back migration: ${file}`);
        const migration = require(path.join(migrationsDir, file));
        
        if (typeof migration.down === 'function') {
          await migration.down(sequelize.getQueryInterface());
          logger.info(`✅ Rollback ${file} completed successfully`);
        } else {
          logger.warn(`⚠️  Migration ${file} has no 'down' method`);
        }
      } catch (error) {
        logger.error(`❌ Rollback ${file} failed:`, error);
        // Continue with other rollbacks
      }
    }
    
    logger.info('🎉 All rollbacks completed!');
    return true;
  } catch (error) {
    logger.error('❌ Rollback process failed:', error);
    throw error;
  }
}

module.exports = {
  migrate,
  rollback
};