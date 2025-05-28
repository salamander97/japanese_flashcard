/**
 * Application Constants
 * Central place for all constants used throughout the application
 */

// User related constants
const USER_CONSTANTS = {
  // Password requirements
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    SALT_ROUNDS: 12
  },
  
  // Username requirements
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z0-9_]+$/
  },
  
  // User levels
  LEVEL: {
    MIN: 1,
    MAX: 50,
    DEFAULT: 1
  },
  
  // Experience points
  EXP: {
    DEFAULT: 0,
    MIN: 0
  }
};

// Character system constants
const CHARACTER_CONSTANTS = {
  TYPES: {
    HIRAGANA: 'hiragana',
    KATAKANA: 'katakana'
  },
  
  GROUPS: {
    HIRAGANA: [
      'あ行', 'か行', 'さ行', 'た行', 'な行',
      'は行', 'ま行', 'や行', 'ら行', 'わ行'
    ],
    KATAKANA: [
      'ア行', 'カ行', 'サ行', 'タ行', 'ナ行',
      'ハ行', 'マ行', 'ヤ行', 'ラ行', 'ワ行'
    ]
  },
  
  COUNTS: {
    HIRAGANA_TOTAL: 46,
    KATAKANA_TOTAL: 46,
    TOTAL: 92
  }
};

// Progress tracking constants
const PROGRESS_CONSTANTS = {
  STATUS: {
    NOT_LEARNED: 'not_learned',
    LEARNING: 'learning',
    MASTERED: 'mastered'
  },
  
  // Spaced repetition algorithm
  SPACED_REPETITION: {
    INITIAL_EASE_FACTOR: 2.5,
    MIN_EASE_FACTOR: 1.3,
    MAX_EASE_FACTOR: 5.0,
    EASE_INCREMENT: 0.1,
    EASE_DECREMENT: 0.2,
    MIN_INTERVAL: 1,
    INITIAL_INTERVAL: 0
  },
  
  // Mastery requirements
  MASTERY: {
    MIN_CORRECT_COUNT: 5,
    CORRECT_RATIO_THRESHOLD: 2.0 // correct_count >= incorrect_count * 2
  }
};

// Study session constants
const SESSION_CONSTANTS = {
  TYPES: {
    STUDY: 'study',
    QUIZ: 'quiz',
    REVIEW: 'review'
  },
  
  // Quiz settings
  QUIZ: {
    DEFAULT_QUESTION_COUNT: 10,
    MIN_QUESTIONS: 5,
    MAX_QUESTIONS: 50,
    MULTIPLE_CHOICE_OPTIONS: 4,
    TIME_LIMIT_SECONDS: 300, // 5 minutes
    PASSING_SCORE_PERCENTAGE: 70
  },
  
  // Study session limits
  LIMITS: {
    MAX_NEW_CHARACTERS_PER_SESSION: 10,
    MAX_REVIEW_CHARACTERS_PER_SESSION: 50,
    MIN_SESSION_DURATION_SECONDS: 10
  }
};

// Achievement system constants
const ACHIEVEMENT_CONSTANTS = {
  CONDITION_TYPES: {
    CHARACTERS_LEARNED: 'characters_learned',
    HIRAGANA_MASTERED: 'hiragana_mastered',
    KATAKANA_MASTERED: 'katakana_mastered',
    STREAK: 'streak',
    TOTAL_CORRECT: 'total_correct',
    QUIZ_SPEED: 'quiz_speed',
    LEVEL: 'level',
    PERFECT_QUIZ: 'perfect_quiz',
    PERFECT_STREAK: 'perfect_streak',
    REVIEW_SESSIONS: 'review_sessions',
    REVIEW_ACCURACY: 'review_accuracy'
  },
  
  // Experience rewards for different actions
  EXP_REWARDS: {
    FIRST_CHARACTER: 10,
    CHARACTER_LEARNED: 5,
    CHARACTER_MASTERED: 15,
    QUIZ_COMPLETED: 25,
    REVIEW_SESSION: 10,
    DAILY_LOGIN: 5,
    STREAK_BONUS: 10, // per day of streak
    PERFECT_QUIZ_BONUS: 50
  }
};

// JWT Token constants
const TOKEN_CONSTANTS = {
  ACCESS_TOKEN: {
    EXPIRES_IN: '24h',
    SECRET_ENV: 'JWT_SECRET'
  },
  
  REFRESH_TOKEN: {
    EXPIRES_IN: '7d',
    SECRET_ENV: 'JWT_REFRESH_SECRET'
  },
  
  ALGORITHM: 'HS256'
};

// Rate limiting constants
const RATE_LIMIT_CONSTANTS = {
  GENERAL: {
    WINDOW_MINUTES: 15,
    MAX_REQUESTS: 1000
  },
  
  AUTH: {
    WINDOW_MINUTES: 15,
    MAX_REQUESTS: 10
  },
  
  QUIZ: {
    WINDOW_MINUTES: 1,
    MAX_REQUESTS: 20
  }
};

// File upload constants
const FILE_CONSTANTS = {
  AVATAR: {
    MAX_SIZE_MB: 5,
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    UPLOAD_PATH: './uploads/avatars/',
    DEFAULT_AVATAR: '/assets/images/default-avatar.png'
  },
  
  AUDIO: {
    MAX_SIZE_MB: 10,
    ALLOWED_TYPES: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
    UPLOAD_PATH: './uploads/audio/'
  }
};

// Database constants
const DATABASE_CONSTANTS = {
  CONNECTION: {
    MAX_CONNECTIONS: 5,
    MIN_CONNECTIONS: 0,
    ACQUIRE_TIMEOUT: 30000,
    IDLE_TIMEOUT: 10000
  },
  
  // Table names
  TABLES: {
    USERS: 'Users',
    CHARACTERS: 'Characters',
    USER_PROGRESS: 'UserProgresses',
    SESSIONS: 'Sessions',
    ACHIEVEMENTS: 'Achievements',
    USER_ACHIEVEMENTS: 'UserAchievements',
    LEVELS: 'Levels',
    REFRESH_TOKENS: 'RefreshTokens'
  }
};

// API Response constants
const API_CONSTANTS = {
  STATUS_CODES: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500
  },
  
  MESSAGES: {
    SUCCESS: 'Success',
    CREATED: 'Created successfully',
    UPDATED: 'Updated successfully',
    DELETED: 'Deleted successfully',
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: '認証が必要です',
    FORBIDDEN: 'アクセスが拒否されました',
    BAD_REQUEST: '不正なリクエストです',
    VALIDATION_ERROR: 'バリデーションエラー',
    SERVER_ERROR: 'サーバーエラーが発生しました'
  }
};

// Email constants (for future use)
const EMAIL_CONSTANTS = {
  TEMPLATES: {
    WELCOME: 'welcome',
    PASSWORD_RESET: 'password_reset',
    EMAIL_VERIFICATION: 'email_verification',
    ACHIEVEMENT_UNLOCKED: 'achievement_unlocked'
  },
  
  SUBJECTS: {
    WELCOME: 'Japanese Flashcardへようこそ！',
    PASSWORD_RESET: 'パスワードリセットのご依頼',
    EMAIL_VERIFICATION: 'メールアドレスの確認',
    ACHIEVEMENT_UNLOCKED: '新しい実績を獲得しました！'
  }
};

// Frontend constants
const FRONTEND_CONSTANTS = {
  // Local storage keys
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'token',
    REFRESH_TOKEN: 'refreshToken',
    USER_DATA: 'user',
    THEME: 'theme',
    LANGUAGE: 'language',
    OFFLINE_PROGRESS: 'offlineProgress'
  },
  
  // Theme constants
  THEMES: {
    LIGHT: 'light',
    DARK: 'dark',
    AUTO: 'auto'
  },
  
  // Animation durations (ms)
  ANIMATIONS: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 600,
    CARD_FLIP: 600
  },
  
  // Breakpoints (px)
  BREAKPOINTS: {
    MOBILE: 480,
    TABLET: 768,
    DESKTOP: 1024,
    WIDE: 1440
  }
};

// Error codes for specific application errors
const ERROR_CODES = {
  // Authentication errors
  AUTH: {
    INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
    TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
    TOKEN_INVALID: 'AUTH_TOKEN_INVALID',
    USER_NOT_FOUND: 'AUTH_USER_NOT_FOUND',
    EMAIL_ALREADY_EXISTS: 'AUTH_EMAIL_EXISTS',
    USERNAME_ALREADY_EXISTS: 'AUTH_USERNAME_EXISTS'
  },
  
  // Character errors
  CHARACTER: {
    NOT_FOUND: 'CHARACTER_NOT_FOUND',
    INVALID_TYPE: 'CHARACTER_INVALID_TYPE'
  },
  
  // Progress errors
  PROGRESS: {
    NOT_FOUND: 'PROGRESS_NOT_FOUND',
    INVALID_STATUS: 'PROGRESS_INVALID_STATUS',
    UPDATE_FAILED: 'PROGRESS_UPDATE_FAILED'
  },
  
  // Session errors
  SESSION: {
    NOT_FOUND: 'SESSION_NOT_FOUND',
    INVALID_TYPE: 'SESSION_INVALID_TYPE',
    ALREADY_ACTIVE: 'SESSION_ALREADY_ACTIVE'
  },
  
  // Achievement errors
  ACHIEVEMENT: {
    NOT_FOUND: 'ACHIEVEMENT_NOT_FOUND',
    ALREADY_EARNED: 'ACHIEVEMENT_ALREADY_EARNED'
  },
  
  // Quiz errors
  QUIZ: {
    INSUFFICIENT_CHARACTERS: 'QUIZ_INSUFFICIENT_CHARACTERS',
    INVALID_ANSWER: 'QUIZ_INVALID_ANSWER',
    TIME_EXPIRED: 'QUIZ_TIME_EXPIRED'
  }
};

// Logging constants
const LOG_CONSTANTS = {
  LEVELS: {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    DEBUG: 'debug'
  },
  
  CATEGORIES: {
    AUTH: 'auth',
    DATABASE: 'database',
    API: 'api',
    SYSTEM: 'system',
    USER_ACTION: 'user_action'
  }
};

// Cache constants (for future Redis implementation)
const CACHE_CONSTANTS = {
  TTL: {
    SHORT: 300,    // 5 minutes
    MEDIUM: 1800,  // 30 minutes
    LONG: 3600,    // 1 hour
    DAILY: 86400   // 24 hours
  },
  
  KEYS: {
    USER_PROFILE: 'user:profile:',
    CHARACTER_LIST: 'characters:all',
    ACHIEVEMENTS: 'achievements:all',
    LEVELS: 'levels:all',
    USER_PROGRESS: 'user:progress:',
    LEADERBOARD: 'leaderboard:',
    STATS: 'stats:'
  }
};

// Notification constants (for future push notifications)
const NOTIFICATION_CONSTANTS = {
  TYPES: {
    ACHIEVEMENT: 'achievement',
    LEVEL_UP: 'level_up',
    STREAK_REMINDER: 'streak_reminder',
    REVIEW_DUE: 'review_due',
    DAILY_GOAL: 'daily_goal'
  },
  
  TITLES: {
    ACHIEVEMENT: '実績獲得！',
    LEVEL_UP: 'レベルアップ！',
    STREAK_REMINDER: '連続学習を続けよう',
    REVIEW_DUE: '復習の時間です',
    DAILY_GOAL: '今日の目標を達成しましょう'
  }
};

// Validation patterns
const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME: /^[a-zA-Z0-9_]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  JAPANESE_CHARACTER: /^[\u3040-\u309F\u30A0-\u30FF]$/,
  ROMAJI: /^[a-zA-Z]+$/
};

// Time constants
const TIME_CONSTANTS = {
  SECONDS: {
    MINUTE: 60,
    HOUR: 3600,
    DAY: 86400,
    WEEK: 604800,
    MONTH: 2592000, // 30 days
    YEAR: 31536000  // 365 days
  },
  
  MILLISECONDS: {
    SECOND: 1000,
    MINUTE: 60000,
    HOUR: 3600000,
    DAY: 86400000
  }
};

// Game mechanics constants
const GAME_CONSTANTS = {
  // Difficulty levels
  DIFFICULTY: {
    BEGINNER: 1,
    INTERMEDIATE: 2,
    ADVANCED: 3,
    EXPERT: 4,
    MASTER: 5
  },
  
  // Streak bonuses
  STREAK_BONUSES: {
    3: 1.1,   // 10% bonus
    7: 1.2,   // 20% bonus
    14: 1.3,  // 30% bonus
    30: 1.5,  // 50% bonus
    100: 2.0  // 100% bonus
  },
  
  // Performance ratings
  PERFORMANCE: {
    EXCELLENT: 95,
    GOOD: 80,
    AVERAGE: 65,
    POOR: 50,
    VERY_POOR: 35
  }
};

// Export all constants
module.exports = {
  USER_CONSTANTS,
  CHARACTER_CONSTANTS,
  PROGRESS_CONSTANTS,
  SESSION_CONSTANTS,
  ACHIEVEMENT_CONSTANTS,
  TOKEN_CONSTANTS,
  RATE_LIMIT_CONSTANTS,
  FILE_CONSTANTS,
  DATABASE_CONSTANTS,
  API_CONSTANTS,
  EMAIL_CONSTANTS,
  FRONTEND_CONSTANTS,
  ERROR_CODES,
  LOG_CONSTANTS,
  CACHE_CONSTANTS,
  NOTIFICATION_CONSTANTS,
  VALIDATION_PATTERNS,
  TIME_CONSTANTS,
  GAME_CONSTANTS
};