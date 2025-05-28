const { sequelize } = require('../../models');
const { logger } = require('../../utils/logger');

// Import all seed files
const seeds = [
  require('./characters'),
  require('./levels'),
  require('./achievements')
];

/**
 * Run all database seeds
 */
async function runSeeds() {
  try {
    logger.info('🌱 Starting database seeding...');
    
    // Test database connection
    await sequelize.authenticate();
    logger.info('✅ Database connection established');
    
    // Run seeds in sequence
    for (let i = 0; i < seeds.length; i++) {
      const seed = seeds[i];
      const seedName = getSeedName(i);
      
      try {
        logger.info(`📋 Running ${seedName} seed...`);
        await seed.up(sequelize.getQueryInterface());
        logger.info(`✅ ${seedName} seed completed successfully`);
      } catch (error) {
        logger.error(`❌ ${seedName} seed failed:`, error);
        throw error;
      }
    }
    
    logger.info('🎉 All seeds completed successfully!');
    logger.info('📊 Database is now ready with:');
    logger.info('  📝 92 Japanese characters (46 Hiragana + 46 Katakana)');
    logger.info('  📈 50 levels with Japanese titles');
    logger.info('  🏆 38 diverse achievements');
    
    return true;
  } catch (error) {
    logger.error('❌ Seeding failed:', error);
    throw error;
  }
}

/**
 * Clear all seed data (for development)
 */
async function clearSeeds() {
  try {
    logger.info('🧹 Clearing database seed data...');
    
    // Clear seeds in reverse order
    for (let i = seeds.length - 1; i >= 0; i--) {
      const seed = seeds[i];
      const seedName = getSeedName(i);
      
      try {
        logger.info(`📋 Clearing ${seedName} seed...`);
        await seed.down(sequelize.getQueryInterface());
        logger.info(`✅ ${seedName} seed cleared`);
      } catch (error) {
        logger.error(`❌ ${seedName} seed clear failed:`, error);
        // Continue with other seeds even if one fails
      }
    }
    
    logger.info('🎉 All seed data cleared successfully!');
    return true;
  } catch (error) {
    logger.error('❌ Clear seeds failed:', error);
    throw error;
  }
}

/**
 * Get human-readable seed name
 */
function getSeedName(index) {
  const names = ['Characters', 'Levels', 'Achievements'];
  return names[index] || `Seed ${index + 1}`;
}

/**
 * Check if database has seed data
 */
async function checkSeedStatus() {
  try {
    const { Character, Level, Achievement } = require('../../models');
    
    const characterCount = await Character.count();
    const levelCount = await Level.count();
    const achievementCount = await Achievement.count();
    
    logger.info('📊 Current database status:');
    logger.info(`  📝 Characters: ${characterCount}/92`);
    logger.info(`  📈 Levels: ${levelCount}/50`);
    logger.info(`  🏆 Achievements: ${achievementCount}/38`);
    
    const isSeeded = characterCount > 0 && levelCount > 0 && achievementCount > 0;
    return {
      isSeeded,
      counts: {
        characters: characterCount,
        levels: levelCount,
        achievements: achievementCount
      }
    };
  } catch (error) {
    logger.error('❌ Failed to check seed status:', error);
    return { isSeeded: false, counts: null };
  }
}

// CLI execution
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'run':
      runSeeds()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
      break;
      
    case 'clear':
      clearSeeds()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
      break;
      
    case 'status':
      checkSeedStatus()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
      break;
      
    default:
      console.log('Usage: node seed.js [run|clear|status]');
      console.log('');
      console.log('Commands:');
      console.log('  run    - Run all seed scripts');
      console.log('  clear  - Clear all seed data');
      console.log('  status - Check current seed status');
      process.exit(1);
  }
}

module.exports = {
  runSeeds,
  clearSeeds,
  checkSeedStatus
};