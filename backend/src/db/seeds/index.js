// Seed runner for database initialization
const { sequelize } = require('../../models');
const { logger } = require('../../utils/logger');
const path = require('path');
const fs = require('fs');

/**
 * Run all database seeds in order
 */
async function seedAll() {
  try {
    logger.info('🌱 Starting database seeding...');
    
    // Test database connection first
    await sequelize.authenticate();
    logger.info('✅ Database connection established');
    
    // Get all seed files in order
    const seedsDir = __dirname;
    const seedFiles = ['characters.js', 'levels.js', 'achievements.js'];
    
    // Run each seed
    for (const file of seedFiles) {
      const filePath = path.join(seedsDir, file);
      if (fs.existsSync(filePath)) {
        try {
          logger.info(`📋 Running seed: ${file}`);
          const seed = require(filePath);
          
          if (typeof seed.up === 'function') {
            await seed.up(sequelize.getQueryInterface());
            logger.info(`✅ Seed ${file} completed successfully`);
          } else {
            logger.warn(`⚠️  Seed ${file} has no 'up' method`);
          }
        } catch (error) {
          logger.error(`❌ Seed ${file} failed:`, error);
          // Continue with other seeds
        }
      } else {
        logger.warn(`⚠️  Seed file not found: ${file}`);
      }
    }
    
    logger.info('🎉 All seeds completed successfully!');
    logger.info('📊 Database is now ready with sample data!');
    return true;
  } catch (error) {
    logger.error('❌ Seeding process failed:', error);
    throw error;
  }
}

/**
 * Clear all seed data (development only)
 */
async function clearSeeds() {
  try {
    logger.info('🧹 Clearing seed data...');
    
    const seedsDir = __dirname;
    const seedFiles = ['achievements.js', 'levels.js', 'characters.js']; // Reverse order
    
    for (const file of seedFiles) {
      const filePath = path.join(seedsDir, file);
      if (fs.existsSync(filePath)) {
        try {
          logger.info(`📋 Clearing seed: ${file}`);
          const seed = require(filePath);
          
          if (typeof seed.down === 'function') {
            await seed.down(sequelize.getQueryInterface());
            logger.info(`✅ Seed ${file} cleared successfully`);
          }
        } catch (error) {
          logger.error(`❌ Clear seed ${file} failed:`, error);
        }
      }
    }
    
    logger.info('🎉 All seed data cleared!');
    return true;
  } catch (error) {
    logger.error('❌ Clear seeds process failed:', error);
    throw error;
  }
}

module.exports = {
  seedAll,
  clearSeeds
};