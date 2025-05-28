const { sequelize } = require('../../models');
const { logger } = require('../../utils/logger');

// Import all migrations in order
const migrations = [
  require('./001_create_users'),
  require('./002_create_characters'),
  require('./003_create_progress'),
  require('./004_create_achievements')
];

/**
 * Run all database migrations
 */
async function runMigrations() {
  try {
    logger.info('🚀 Starting database migrations...');
    
    // Test database connection
    await sequelize.authenticate();
    logger.info('✅ Database connection established');
    
    // Run migrations in sequence
    for (let i = 0; i < migrations.length; i++) {
      const migration = migrations[i];
      const migrationName = `Migration ${String(i + 1).padStart(3, '0')}`;
      
      try {
        logger.info(`📋 Running ${migrationName}...`);
        await migration.up(sequelize.getQueryInterface());
        logger.info(`✅ ${migrationName} completed successfully`);
      } catch (error) {
        logger.error(`❌ ${migrationName} failed:`, error);
        throw error;
      }
    }
    
    logger.info('🎉 All migrations completed successfully!');
    return true;
  } catch (error) {
    logger.error('❌ Migration failed:', error);
    throw error;
  }
}

/**
 * Rollback all migrations (for development)
 */
async function rollbackMigrations() {
  try {
    logger.info('🔄 Rolling back database migrations...');
    
    // Rollback in reverse order
    for (let i = migrations.length - 1; i >= 0; i--) {
      const migration = migrations[i];
      const migrationName = `Migration ${String(i + 1).padStart(3, '0')}`;
      
      try {
        logger.info(`📋 Rolling back ${migrationName}...`);
        await migration.down(sequelize.getQueryInterface());
        logger.info(`✅ ${migrationName} rollback completed`);
      } catch (error) {
        logger.error(`❌ ${migrationName} rollback failed:`, error);
        throw error;
      }
    }
    
    logger.info('🎉 All migrations rolled back successfully!');
    return true;
  } catch (error) {
    logger.error('❌ Rollback failed:', error);
    throw error;
  }
}

// CLI execution
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'up':
      runMigrations()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
      break;
      
    case 'down':
      rollbackMigrations()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
      break;
      
    default:
      console.log('Usage: node migrate.js [up|down]');
      process.exit(1);
  }
}

module.exports = {
  runMigrations,
  rollbackMigrations
};