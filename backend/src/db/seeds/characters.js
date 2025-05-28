const { Character } = require('../models');

const hiraganaData = [
  // あ行 (A-gyou)
  { character: 'あ', romaji: 'a', type: 'hiragana', group_name: 'あ行', order_index: 1 },
  { character: 'い', romaji: 'i', type: 'hiragana', group_name: 'あ行', order_index: 2 },
  { character: 'う', romaji: 'u', type: 'hiragana', group_name: 'あ行', order_index: 3 },
  { character: 'え', romaji: 'e', type: 'hiragana', group_name: 'あ行', order_index: 4 },
  { character: 'お', romaji: 'o', type: 'hiragana', group_name: 'あ行', order_index: 5 },

  // か行 (Ka-gyou)
  { character: 'か', romaji: 'ka', type: 'hiragana', group_name: 'か行', order_index: 6 },
  { character: 'き', romaji: 'ki', type: 'hiragana', group_name: 'か行', order_index: 7 },
  { character: 'く', romaji: 'ku', type: 'hiragana', group_name: 'か行', order_index: 8 },
  { character: 'け', romaji: 'ke', type: 'hiragana', group_name: 'か行', order_index: 9 },
  { character: 'こ', romaji: 'ko', type: 'hiragana', group_name: 'か行', order_index: 10 },

  // さ行 (Sa-gyou)
  { character: 'さ', romaji: 'sa', type: 'hiragana', group_name: 'さ行', order_index: 11 },
  { character: 'し', romaji: 'shi', type: 'hiragana', group_name: 'さ行', order_index: 12 },
  { character: 'す', romaji: 'su', type: 'hiragana', group_name: 'さ行', order_index: 13 },
  { character: 'せ', romaji: 'se', type: 'hiragana', group_name: 'さ行', order_index: 14 },
  { character: 'そ', romaji: 'so', type: 'hiragana', group_name: 'さ行', order_index: 15 },

  // た行 (Ta-gyou)
  { character: 'た', romaji: 'ta', type: 'hiragana', group_name: 'た行', order_index: 16 },
  { character: 'ち', romaji: 'chi', type: 'hiragana', group_name: 'た行', order_index: 17 },
  { character: 'つ', romaji: 'tsu', type: 'hiragana', group_name: 'た行', order_index: 18 },
  { character: 'て', romaji: 'te', type: 'hiragana', group_name: 'た行', order_index: 19 },
  { character: 'と', romaji: 'to', type: 'hiragana', group_name: 'た行', order_index: 20 },

  // な行 (Na-gyou)
  { character: 'な', romaji: 'na', type: 'hiragana', group_name: 'な行', order_index: 21 },
  { character: 'に', romaji: 'ni', type: 'hiragana', group_name: 'な行', order_index: 22 },
  { character: 'ぬ', romaji: 'nu', type: 'hiragana', group_name: 'な行', order_index: 23 },
  { character: 'ね', romaji: 'ne', type: 'hiragana', group_name: 'な行', order_index: 24 },
  { character: 'の', romaji: 'no', type: 'hiragana', group_name: 'な行', order_index: 25 },

  // は行 (Ha-gyou)
  { character: 'は', romaji: 'ha', type: 'hiragana', group_name: 'は行', order_index: 26 },
  { character: 'ひ', romaji: 'hi', type: 'hiragana', group_name: 'は行', order_index: 27 },
  { character: 'ふ', romaji: 'fu', type: 'hiragana', group_name: 'は行', order_index: 28 },
  { character: 'へ', romaji: 'he', type: 'hiragana', group_name: 'は行', order_index: 29 },
  { character: 'ほ', romaji: 'ho', type: 'hiragana', group_name: 'は行', order_index: 30 },

  // ま行 (Ma-gyou)
  { character: 'ま', romaji: 'ma', type: 'hiragana', group_name: 'ま行', order_index: 31 },
  { character: 'み', romaji: 'mi', type: 'hiragana', group_name: 'ま行', order_index: 32 },
  { character: 'む', romaji: 'mu', type: 'hiragana', group_name: 'ま行', order_index: 33 },
  { character: 'め', romaji: 'me', type: 'hiragana', group_name: 'ま行', order_index: 34 },
  { character: 'も', romaji: 'mo', type: 'hiragana', group_name: 'ま行', order_index: 35 },

  // や行 (Ya-gyou)
  { character: 'や', romaji: 'ya', type: 'hiragana', group_name: 'や行', order_index: 36 },
  { character: 'ゆ', romaji: 'yu', type: 'hiragana', group_name: 'や行', order_index: 37 },
  { character: 'よ', romaji: 'yo', type: 'hiragana', group_name: 'や行', order_index: 38 },

  // ら行 (Ra-gyou)
  { character: 'ら', romaji: 'ra', type: 'hiragana', group_name: 'ら行', order_index: 39 },
  { character: 'り', romaji: 'ri', type: 'hiragana', group_name: 'ら行', order_index: 40 },
  { character: 'る', romaji: 'ru', type: 'hiragana', group_name: 'ら行', order_index: 41 },
  { character: 'れ', romaji: 're', type: 'hiragana', group_name: 'ら行', order_index: 42 },
  { character: 'ろ', romaji: 'ro', type: 'hiragana', group_name: 'ら行', order_index: 43 },

  // わ行 (Wa-gyou)
  { character: 'わ', romaji: 'wa', type: 'hiragana', group_name: 'わ行', order_index: 44 },
  { character: 'を', romaji: 'wo', type: 'hiragana', group_name: 'わ行', order_index: 45 },
  { character: 'ん', romaji: 'n', type: 'hiragana', group_name: 'わ行', order_index: 46 }
];

const katakanaData = [
  // ア行 (A-gyou)
  { character: 'ア', romaji: 'a', type: 'katakana', group_name: 'ア行', order_index: 47 },
  { character: 'イ', romaji: 'i', type: 'katakana', group_name: 'ア行', order_index: 48 },
  { character: 'ウ', romaji: 'u', type: 'katakana', group_name: 'ア行', order_index: 49 },
  { character: 'エ', romaji: 'e', type: 'katakana', group_name: 'ア行', order_index: 50 },
  { character: 'オ', romaji: 'o', type: 'katakana', group_name: 'ア行', order_index: 51 },

  // カ行 (Ka-gyou)
  { character: 'カ', romaji: 'ka', type: 'katakana', group_name: 'カ行', order_index: 52 },
  { character: 'キ', romaji: 'ki', type: 'katakana', group_name: 'カ行', order_index: 53 },
  { character: 'ク', romaji: 'ku', type: 'katakana', group_name: 'カ行', order_index: 54 },
  { character: 'ケ', romaji: 'ke', type: 'katakana', group_name: 'カ行', order_index: 55 },
  { character: 'コ', romaji: 'ko', type: 'katakana', group_name: 'カ行', order_index: 56 },

  // サ行 (Sa-gyou)
  { character: 'サ', romaji: 'sa', type: 'katakana', group_name: 'サ行', order_index: 57 },
  { character: 'シ', romaji: 'shi', type: 'katakana', group_name: 'サ行', order_index: 58 },
  { character: 'ス', romaji: 'su', type: 'katakana', group_name: 'サ行', order_index: 59 },
  { character: 'セ', romaji: 'se', type: 'katakana', group_name: 'サ行', order_index: 60 },
  { character: 'ソ', romaji: 'so', type: 'katakana', group_name: 'サ行', order_index: 61 },

  // タ行 (Ta-gyou)
  { character: 'タ', romaji: 'ta', type: 'katakana', group_name: 'タ行', order_index: 62 },
  { character: 'チ', romaji: 'chi', type: 'katakana', group_name: 'タ行', order_index: 63 },
  { character: 'ツ', romaji: 'tsu', type: 'katakana', group_name: 'タ行', order_index: 64 },
  { character: 'テ', romaji: 'te', type: 'katakana', group_name: 'タ行', order_index: 65 },
  { character: 'ト', romaji: 'to', type: 'katakana', group_name: 'タ行', order_index: 66 },

  // ナ行 (Na-gyou)
  { character: 'ナ', romaji: 'na', type: 'katakana', group_name: 'ナ行', order_index: 67 },
  { character: 'ニ', romaji: 'ni', type: 'katakana', group_name: 'ナ行', order_index: 68 },
  { character: 'ヌ', romaji: 'nu', type: 'katakana', group_name: 'ナ行', order_index: 69 },
  { character: 'ネ', romaji: 'ne', type: 'katakana', group_name: 'ナ行', order_index: 70 },
  { character: 'ノ', romaji: 'no', type: 'katakana', group_name: 'ナ行', order_index: 71 },

  // ハ行 (Ha-gyou)
  { character: 'ハ', romaji: 'ha', type: 'katakana', group_name: 'ハ行', order_index: 72 },
  { character: 'ヒ', romaji: 'hi', type: 'katakana', group_name: 'ハ行', order_index: 73 },
  { character: 'フ', romaji: 'fu', type: 'katakana', group_name: 'ハ行', order_index: 74 },
  { character: 'ヘ', romaji: 'he', type: 'katakana', group_name: 'ハ行', order_index: 75 },
  { character: 'ホ', romaji: 'ho', type: 'katakana', group_name: 'ハ行', order_index: 76 },

  // マ行 (Ma-gyou)
  { character: 'マ', romaji: 'ma', type: 'katakana', group_name: 'マ行', order_index: 77 },
  { character: 'ミ', romaji: 'mi', type: 'katakana', group_name: 'マ行', order_index: 78 },
  { character: 'ム', romaji: 'mu', type: 'katakana', group_name: 'マ行', order_index: 79 },
  { character: 'メ', romaji: 'me', type: 'katakana', group_name: 'マ行', order_index: 80 },
  { character: 'モ', romaji: 'mo', type: 'katakana', group_name: 'マ行', order_index: 81 },

  // ヤ行 (Ya-gyou)
  { character: 'ヤ', romaji: 'ya', type: 'katakana', group_name: 'ヤ行', order_index: 82 },
  { character: 'ユ', romaji: 'yu', type: 'katakana', group_name: 'ヤ行', order_index: 83 },
  { character: 'ヨ', romaji: 'yo', type: 'katakana', group_name: 'ヤ行', order_index: 84 },

  // ラ行 (Ra-gyou)
  { character: 'ラ', romaji: 'ra', type: 'katakana', group_name: 'ラ行', order_index: 85 },
  { character: 'リ', romaji: 'ri', type: 'katakana', group_name: 'ラ行', order_index: 86 },
  { character: 'ル', romaji: 'ru', type: 'katakana', group_name: 'ラ行', order_index: 87 },
  { character: 'レ', romaji: 're', type: 'katakana', group_name: 'ラ行', order_index: 88 },
  { character: 'ロ', romaji: 'ro', type: 'katakana', group_name: 'ラ行', order_index: 89 },

  // ワ行 (Wa-gyou)
  { character: 'ワ', romaji: 'wa', type: 'katakana', group_name: 'ワ行', order_index: 90 },
  { character: 'ヲ', romaji: 'wo', type: 'katakana', group_name: 'ワ行', order_index: 91 },
  { character: 'ン', romaji: 'n', type: 'katakana', group_name: 'ワ行', order_index: 92 }
];

module.exports = {
  up: async (queryInterface) => {
    try {
      // Check if data already exists
      const existingCharacters = await Character.findAll();
      if (existingCharacters.length > 0) {
        console.log('Characters already seeded, skipping...');
        return;
      }

      console.log('Seeding Hiragana characters...');
      await Character.bulkCreate(hiraganaData);

      console.log('Seeding Katakana characters...');
      await Character.bulkCreate(katakanaData);

      console.log('✅ Character seed completed successfully!');
      console.log(`📝 Total characters seeded: ${hiraganaData.length + katakanaData.length}`);
    } catch (error) {
      console.error('❌ Error seeding characters:', error);
      throw error;
    }
  },

  down: async (queryInterface) => {
    await Character.destroy({ where: {} });
  }
};