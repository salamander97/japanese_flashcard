const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Password utility functions
 */
const passwordUtils = {
  /**
   * Hash password using bcrypt
   * @param {string} password - Plain text password
   * @returns {Promise<string>} - Hashed password
   */
  async hashPassword(password) {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  },

  /**
   * Compare password with hash
   * @param {string} password - Plain text password
   * @param {string} hash - Hashed password
   * @returns {Promise<boolean>} - Match result
   */
  async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  },

  /**
   * Generate random password
   * @param {number} length - Password length
   * @returns {string} - Random password
   */
  generateRandomPassword(length = 12) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  },

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {Object} - Validation result
   */
  validatePasswordStrength(password) {
    const result = {
      isValid: true,
      errors: [],
      score: 0
    };

    if (password.length < 8) {
      result.isValid = false;
      result.errors.push('パスワードは8文字以上である必要があります');
    } else {
      result.score += 1;
    }

    if (!/[a-z]/.test(password)) {
      result.isValid = false;
      result.errors.push('小文字を含める必要があります');
    } else {
      result.score += 1;
    }

    if (!/[A-Z]/.test(password)) {
      result.isValid = false;
      result.errors.push('大文字を含める必要があります');
    } else {
      result.score += 1;
    }

    if (!/\d/.test(password)) {
      result.isValid = false;
      result.errors.push('数字を含める必要があります');
    } else {
      result.score += 1;
    }

    if (!/[@$!%*?&]/.test(password)) {
      result.isValid = false;
      result.errors.push('特殊文字を含める必要があります');
    } else {
      result.score += 1;
    }

    return result;
  }
};

/**
 * JWT utility functions
 */
const jwtUtils = {
  /**
   * Generate access token
   * @param {Object} payload - Token payload
   * @param {string} expiresIn - Expiration time
   * @returns {string} - JWT token
   */
  generateAccessToken(payload, expiresIn = '24h') {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  },

  /**
   * Generate refresh token
   * @param {Object} payload - Token payload
   * @param {string} expiresIn - Expiration time
   * @returns {string} - JWT refresh token
   */
  generateRefreshToken(payload, expiresIn = '7d') {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn });
  },

  /**
   * Verify JWT token
   * @param {string} token - JWT token
   * @param {boolean} isRefresh - Is refresh token
   * @returns {Object} - Decoded payload
   */
  verifyToken(token, isRefresh = false) {
    const secret = isRefresh ? process.env.JWT_REFRESH_SECRET : process.env.JWT_SECRET;
    return jwt.verify(token, secret);
  },

  /**
   * Decode token without verification
   * @param {string} token - JWT token
   * @returns {Object} - Decoded payload
   */
  decodeToken(token) {
    return jwt.decode(token);
  }
};

/**
 * Date and time utility functions
 */
const dateUtils = {
  /**
   * Format date to Japanese locale
   * @param {Date} date - Date object
   * @param {Object} options - Formatting options
   * @returns {string} - Formatted date string
   */
  formatDateJP(date, options = {}) {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Tokyo'
    };
    return new Intl.DateTimeFormat('ja-JP', { ...defaultOptions, ...options }).format(date);
  },

  /**
   * Get days between two dates
   * @param {Date} date1 - First date
   * @param {Date} date2 - Second date
   * @returns {number} - Days difference
   */
  getDaysBetween(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((date1 - date2) / oneDay));
  },

  /**
   * Check if date is today
   * @param {Date} date - Date to check
   * @returns {boolean} - Is today
   */
  isToday(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  },

  /**
   * Get start of day
   * @param {Date} date - Date object
   * @returns {Date} - Start of day
   */
  getStartOfDay(date = new Date()) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    return start;
  },

  /**
   * Get end of day
   * @param {Date} date - Date object
   * @returns {Date} - End of day
   */
  getEndOfDay(date = new Date()) {
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return end;
  },

  /**
   * Add days to date
   * @param {Date} date - Base date
   * @param {number} days - Days to add
   * @returns {Date} - New date
   */
  addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
};

/**
 * String utility functions
 */
const stringUtils = {
  /**
   * Generate random string
   * @param {number} length - String length
   * @param {string} charset - Character set
   * @returns {string} - Random string
   */
  generateRandomString(length = 32, charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
  },

  /**
   * Generate UUID v4
   * @returns {string} - UUID string
   */
  generateUUID() {
    return crypto.randomUUID();
  },

  /**
   * Slug generator from Japanese text
   * @param {string} text - Text to slugify
   * @returns {string} - Slug string
   */
  slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  },

  /**
   * Truncate string
   * @param {string} str - String to truncate
   * @param {number} length - Max length
   * @param {string} suffix - Suffix for truncated string
   * @returns {string} - Truncated string
   */
  truncate(str, length = 100, suffix = '...') {
    if (str.length <= length) return str;
    return str.substring(0, length) + suffix;
  },

  /**
   * Capitalize first letter
   * @param {string} str - String to capitalize
   * @returns {string} - Capitalized string
   */
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
};

/**
 * Validation utility functions
 */
const validationUtils = {
  /**
   * Validate email address
   * @param {string} email - Email to validate
   * @returns {boolean} - Is valid email
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate username
   * @param {string} username - Username to validate
   * @returns {Object} - Validation result
   */
  validateUsername(username) {
    const result = { isValid: true, errors: [] };

    if (!username || username.length < 3) {
      result.isValid = false;
      result.errors.push('ユーザー名は3文字以上である必要があります');
    }

    if (username.length > 50) {
      result.isValid = false;
      result.errors.push('ユーザー名は50文字以下である必要があります');
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      result.isValid = false;
      result.errors.push('ユーザー名は英数字とアンダースコアのみ使用できます');
    }

    return result;
  },

  /**
   * Sanitize HTML content
   * @param {string} html - HTML content
   * @returns {string} - Sanitized content
   */
  sanitizeHtml(html) {
    return html
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  /**
   * Validate character ID
   * @param {number} id - Character ID
   * @returns {boolean} - Is valid
   */
  isValidCharacterId(id) {
    return Number.isInteger(id) && id > 0 && id <= 92; // 46 hiragana + 46 katakana
  }
};

/**
 * Array utility functions
 */
const arrayUtils = {
  /**
   * Shuffle array
   * @param {Array} array - Array to shuffle
   * @returns {Array} - Shuffled array
   */
  shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  /**
   * Get random elements from array
   * @param {Array} array - Source array
   * @param {number} count - Number of elements
   * @returns {Array} - Random elements
   */
  getRandomElements(array, count) {
    const shuffled = this.shuffle(array);
    return shuffled.slice(0, Math.min(count, array.length));
  },

  /**
   * Remove duplicates from array
   * @param {Array} array - Array with duplicates
   * @param {string} key - Key to compare (for objects)
   * @returns {Array} - Array without duplicates
   */
  removeDuplicates(array, key = null) {
    if (key) {
      return array.filter((item, index, arr) => 
        arr.findIndex(t => t[key] === item[key]) === index
      );
    }
    return [...new Set(array)];
  },

  /**
   * Chunk array into smaller arrays
   * @param {Array} array - Array to chunk
   * @param {number} size - Chunk size
   * @returns {Array} - Chunked array
   */
  chunk(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
};

/**
 * Number utility functions
 */
const numberUtils = {
  /**
   * Generate random number between min and max
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} - Random number
   */
  randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   * Format number with Japanese locale
   * @param {number} number - Number to format
   * @returns {string} - Formatted number
   */
  formatNumber(number) {
    return new Intl.NumberFormat('ja-JP').format(number);
  },

  /**
   * Round to specified decimal places
   * @param {number} number - Number to round
   * @param {number} decimals - Decimal places
   * @returns {number} - Rounded number
   */
  roundTo(number, decimals = 2) {
    return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
  },

  /**
   * Calculate percentage
   * @param {number} value - Current value
   * @param {number} total - Total value
   * @returns {number} - Percentage
   */
  calculatePercentage(value, total) {
    if (total === 0) return 0;
    return this.roundTo((value / total) * 100, 1);
  }
};

/**
 * Response utility functions
 */
const responseUtils = {
  /**
   * Success response
   * @param {Object} res - Express response object
   * @param {Object} data - Response data
   * @param {string} message - Success message
   * @param {number} status - HTTP status code
   */
  success(res, data = null, message = 'Success', status = 200) {
    res.status(status).json({
      success: true,
      message,
      data
    });
  },

  /**
   * Error response
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   * @param {number} status - HTTP status code
   * @param {Object} errors - Validation errors
   */
  error(res, message = 'Error occurred', status = 500, errors = null) {
    const response = {
      success: false,
      message
    };

    if (errors) {
      response.errors = errors;
    }

    if (process.env.NODE_ENV === 'development') {
      response.timestamp = new Date().toISOString();
    }

    res.status(status).json(response);
  },

  /**
   * Validation error response
   * @param {Object} res - Express response object
   * @param {Array} errors - Validation errors
   */
  validationError(res, errors) {
    this.error(res, 'バリデーションエラー', 400, errors);
  },

  /**
   * Not found response
   * @param {Object} res - Express response object
   * @param {string} resource - Resource name
   */
  notFound(res, resource = 'リソース') {
    this.error(res, `${resource}が見つかりません`, 404);
  },

  /**
   * Unauthorized response
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   */
  unauthorized(res, message = '認証が必要です') {
    this.error(res, message, 401);
  },

  /**
   * Forbidden response
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   */
  forbidden(res, message = 'アクセスが拒否されました') {
    this.error(res, message, 403);
  }
};

module.exports = {
  passwordUtils,
  jwtUtils,
  dateUtils,
  stringUtils,
  validationUtils,
  arrayUtils,
  numberUtils,
  responseUtils
};