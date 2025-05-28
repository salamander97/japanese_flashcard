const Character = require('../models/Character');
const { Op } = require('sequelize');

/**
 * すべての文字を取得する
 */
exports.getAllCharacters = async (req, res, next) => {
  try {
    const characters = await Character.findAll({
      order: [['type', 'ASC'], ['order_index', 'ASC']]
    });
    
    res.status(200).json({ characters });
  } catch (error) {
    next(error);
  }
};

/**
 * ひらがなのみを取得する
 */
exports.getHiragana = async (req, res, next) => {
  try {
    const hiragana = await Character.findAll({
      where: { type: 'hiragana' },
      order: [['order_index', 'ASC']]
    });
    
    res.status(200).json({ characters: hiragana });
  } catch (error) {
    next(error);
  }
};

/**
 * カタカナのみを取得する
 */
exports.getKatakana = async (req, res, next) => {
  try {
    const katakana = await Character.findAll({
      where: { type: 'katakana' },
      order: [['order_index', 'ASC']]
    });
    
    res.status(200).json({ characters: katakana });
  } catch (error) {
    next(error);
  }
};

/**
 * 特定の文字の詳細を取得する
 */
exports.getCharacterById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const character = await Character.findByPk(id);
    if (!character) {
      return res.status(404).json({ message: '文字が見つかりません' });
    }
    
    res.status(200).json({ character });
  } catch (error) {
    next(error);
  }
};

/**
 * 文字をグループ別に取得する
 */
exports.getCharactersByGroup = async (req, res, next) => {
  try {
    const characters = await Character.findAll({
      order: [['type', 'ASC'], ['group_name', 'ASC'], ['order_index', 'ASC']]
    });
    
    // グループ別に整理
    const groupedCharacters = characters.reduce((groups, character) => {
      const key = `${character.type}_${character.group_name}`;
      if (!groups[key]) {
        groups[key] = {
          type: character.type,
          group_name: character.group_name,
          characters: []
        };
      }
      groups[key].characters.push(character);
      return groups;
    }, {});
    
    res.status(200).json({ groups: Object.values(groupedCharacters) });
  } catch (error) {
    next(error);
  }
};
