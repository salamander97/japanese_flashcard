const { migrate } = require('./migrations');
const { seedAll } = require('./seeds');
const { logger } = require('../utils/logger');

// Database initialization script
const initializeDatabase = async () => {
  try {
    logger.info('🚀 Starting database initialization...');
    
    // Run migrations first
    logger.info('📋 Running migrations...');
    const migrationResult = await migrate();
    if (!migrationResult) {
      throw new Error('Migration failed');
    }
    
    // Then run seeds
    logger.info('🌱 Running seeds...');
    const seedResult = await seedAll();
    if (!seedResult) {
      throw new Error('Seeding failed');
    }
    
    logger.info('🎉 Database initialization completed successfully!');
    return true;
  } catch (error) {
    logger.error('❌ Database initialization failed:', error);
    return false;
  }
};

// CLI execution
if (require.main === module) {
  initializeDatabase()
    .then(result => {
      if (result) {
        logger.info('✅ Database initialization successful');
        process.exit(0);
      } else {
        logger.error('❌ Database initialization failed');
        process.exit(1);
      }
    })
    .catch(error => {
      logger.error('❌ Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { initializeDatabase };