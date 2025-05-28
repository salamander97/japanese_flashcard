const { Achievement } = require('../models');

const achievementsData = [
  // Thành tích học tập cơ bản
  {
    name: 'Bước đi đầu tiên',
    description: 'Học chữ đầu tiên',
    condition_type: 'characters_learned',
    condition_value: 1,
    exp_reward: 10,
    icon: '🎯'
  },
  {
    name: 'Bắt đầu học tập',
    description: 'Học 5 chữ cái',
    condition_type: 'characters_learned',
    condition_value: 5,
    exp_reward: 25,
    icon: '📚'
  },
  {
    name: 'Tiến bộ vững chắc',
    description: 'Học 10 chữ cái',
    condition_type: 'characters_learned',
    condition_value: 10,
    exp_reward: 50,
    icon: '🌱'
  },
  {
    name: 'Tăng trưởng ổn định',
    description: 'Học 25 chữ cái',
    condition_type: 'characters_learned',
    condition_value: 25,
    exp_reward: 100,
    icon: '🌿'
  },
  {
    name: 'Đạt nửa chặng đường',
    description: 'Học 50 chữ cái',
    condition_type: 'characters_learned',
    condition_value: 50,
    exp_reward: 200,
    icon: '🌳'
  },

  // Thành tích Hiragana
  {
    name: 'Nhập môn Hiragana',
    description: 'Học và thành thạo 5 chữ Hiragana',
    condition_type: 'hiragana_mastered',
    condition_value: 5,
    exp_reward: 75,
    icon: '🌸'
  },
  {
    name: 'Hiragana Cơ bản',
    description: 'Học và thành thạo 15 chữ Hiragana',
    condition_type: 'hiragana_mastered',
    condition_value: 15,
    exp_reward: 150,
    icon: '🌺'
  },
  {
    name: 'Hiragana Nâng cao',
    description: 'Học và thành thạo 30 chữ Hiragana',
    condition_type: 'hiragana_mastered',
    condition_value: 30,
    exp_reward: 300,
    icon: '🎋'
  },
  {
    name: 'Thành thạo Hiragana',
    description: 'Học và thành thạo tất cả chữ Hiragana',
    condition_type: 'hiragana_mastered',
    condition_value: 46,
    exp_reward: 500,
    icon: '👑'
  },

  // Thành tích Katakana
  {
    name: 'Nhập môn Katakana',
    description: 'Học và thành thạo 5 chữ Katakana',
    condition_type: 'katakana_mastered',
    condition_value: 5,
    exp_reward: 75,
    icon: '⚡'
  },
  {
    name: 'Katakana Cơ bản',
    description: 'Học và thành thạo 15 chữ Katakana',
    condition_type: 'katakana_mastered',
    condition_value: 15,
    exp_reward: 150,
    icon: '🔥'
  },
  {
    name: 'Katakana Nâng cao',
    description: 'Học và thành thạo 30 chữ Katakana',
    condition_type: 'katakana_mastered',
    condition_value: 30,
    exp_reward: 300,
    icon: '⭐'
  },
  {
    name: 'Thành thạo Katakana',
    description: 'Học và thành thạo tất cả chữ Katakana',
    condition_type: 'katakana_mastered',
    condition_value: 46,
    exp_reward: 500,
    icon: '💫'
  },

  // Thành tích học tập liên tục
  {
    name: 'Kiên trì là sức mạnh',
    description: 'Học liên tục trong 3 ngày',
    condition_type: 'streak',
    condition_value: 3,
    exp_reward: 50,
    icon: '📅'
  },
  {
    name: 'Xây dựng thói quen',
    description: 'Học liên tục trong 7 ngày',
    condition_type: 'streak',
    condition_value: 7,
    exp_reward: 100,
    icon: '🔥'
  },
  {
    name: 'Thói quen vững chắc',
    description: 'Học liên tục trong 14 ngày',
    condition_type: 'streak',
    condition_value: 14,
    exp_reward: 200,
    icon: '💪'
  },
  {
    name: 'Nhà vô địch tháng',
    description: 'Học liên tục trong 30 ngày',
    condition_type: 'streak',
    condition_value: 30,
    exp_reward: 500,
    icon: '🏆'
  },
  {
    name: 'Tinh thần bất khuất',
    description: 'Học liên tục trong 50 ngày',
    condition_type: 'streak',
    condition_value: 50,
    exp_reward: 750,
    icon: '⚡'
  },
  {
    name: 'Vinh quang 100 ngày',
    description: 'Học liên tục trong 100 ngày',
    condition_type: 'streak',
    condition_value: 100,
    exp_reward: 1000,
    icon: '🌟'
  },

  // Thành tích đúng đắn
  {
    name: 'Cải thiện độ chính xác',
    description: 'Trả lời đúng 100 câu hỏi',
    condition_type: 'total_correct',
    condition_value: 100,
    exp_reward: 100,
    icon: '✅'
  },
  {
    name: 'Tích lũy kiến thức',
    description: 'Trả lời đúng 500 câu hỏi',
    condition_type: 'total_correct',
    condition_value: 500,
    exp_reward: 250,
    icon: '📖'
  },
  {
    name: 'Chứng nhận thành thạo',
    description: 'Trả lời đúng 1000 câu hỏi',
    condition_type: 'total_correct',
    condition_value: 1000,
    exp_reward: 500,
    icon: '🎓'
  },
  {
    name: 'Chuyên gia',
    description: 'Trả lời đúng 2000 câu hỏi',
    condition_type: 'total_correct',
    condition_value: 2000,
    exp_reward: 750,
    icon: '🏅'
  },
  {
    name: 'Cấp độ bậc thầy',
    description: 'Trả lời đúng 5000 câu hỏi',
    condition_type: 'total_correct',
    condition_value: 5000,
    exp_reward: 1000,
    icon: '👑'
  },

  // Thành tích tốc độ
  {
    name: 'Phản ứng nhanh',
    description: 'Trả lời câu hỏi quiz trong vòng 1 giây',
    condition_type: 'quiz_speed',
    condition_value: 1,
    exp_reward: 150,
    icon: '⚡'
  },
  {
    name: 'Tốc độ như chớp',
    description: 'Trả lời câu hỏi quiz trong vòng 0.5 giây',
    condition_type: 'quiz_speed',
    condition_value: 0.5,
    exp_reward: 300,
    icon: '🌟'
  },

  // Thành tích theo cấp độ
  {
    name: 'Cấp độ lên!',
    description: 'Đạt cấp độ 5',
    condition_type: 'level',
    condition_value: 5,
    exp_reward: 100,
    icon: '📈'
  },
  {
    name: 'Người chơi trung cấp',
    description: 'Đạt cấp độ 10',
    condition_type: 'level',
    condition_value: 10,
    exp_reward: 200,
    icon: '⭐'
  },
  {
    name: 'Người chơi cao cấp',
    description: 'Đạt cấp độ 20',
    condition_type: 'level',
    condition_value: 20,
    exp_reward: 500,
    icon: '💫'
  },
  {
    name: 'Bậc thầy',
    description: 'Đạt cấp độ 30',
    condition_type: 'level',
    condition_value: 30,
    exp_reward: 750,
    icon: '🎯'
  },
  {
    name: 'Người học huyền thoại',
    description: 'Đạt cấp độ 40',
    condition_type: 'level',
    condition_value: 40,
    exp_reward: 1000,
    icon: '🏆'
  },
  {
    name: 'Vùng đất của thần thánh',
    description: 'Đạt cấp độ 50',
    condition_type: 'level',
    condition_value: 50,
    exp_reward: 1500,
    icon: '👑'
  },

  // Thành tích đặc biệt
  {
    name: 'Kẻ cầu toàn',
    description: 'Đạt tỉ lệ đúng 100% trong các bài quiz',
    condition_type: 'perfect_quiz',
    condition_value: 1,
    exp_reward: 250,
    icon: '💯'
  },
  {
    name: 'Không sai một lần',
    description: 'Trả lời đúng 50 câu liên tiếp',
    condition_type: 'perfect_streak',
    condition_value: 50,
    exp_reward: 300,
    icon: '🎯'
  },
  {
    name: 'Sự hoàn hảo tuyệt đối',
    description: 'Trả lời đúng 100 câu liên tiếp',
    condition_type: 'perfect_streak',
    condition_value: 100,
    exp_reward: 500,
    icon: '🌟'
  },

  // Thành tích ôn tập
  {
    name: 'Quái vật ôn tập',
    description: 'Hoàn thành 100 bài ôn tập',
    condition_type: 'review_sessions',
    condition_value: 100,
    exp_reward: 200,
    icon: '🔄'
  },
  {
    name: 'Gác cổng trí nhớ',
    description: 'Duy trì tỉ lệ chính xác trên 90% trong ôn tập',
    condition_type: 'review_accuracy',
    condition_value: 90,
    exp_reward: 300,
    icon: '🧠'
  }
];

module.exports = {
  up: async (queryInterface) => {
    try {
      // Kiểm tra xem dữ liệu đã tồn tại chưa
      const existingAchievements = await Achievement.findAll();
      if (existingAchievements.length > 0) {
        console.log('Thành tích đã được tạo sẵn, bỏ qua...');
        return;
      }

      console.log('Đang tạo dữ liệu thành tích...');
      await Achievement.bulkCreate(achievementsData);

      console.log('✅ Tạo dữ liệu thành tích thành công!');
      console.log(`🏆 Tổng số thành tích đã tạo: ${achievementsData.length}`);
      
      // Hiển thị các thể loại thành tích
      const categories = {
        'characters_learned': achievementsData.filter(a => a.condition_type === 'characters_learned').length,
        'hiragana_mastered': achievementsData.filter(a => a.condition_type === 'hiragana_mastered').length,
        'katakana_mastered': achievementsData.filter(a => a.condition_type === 'katakana_mastered').length,
        'streak': achievementsData.filter(a => a.condition_type === 'streak').length,
        'total_correct': achievementsData.filter(a => a.condition_type === 'total_correct').length,
        'level': achievementsData.filter(a => a.condition_type === 'level').length,
        'special': achievementsData.filter(a => ['quiz_speed', 'perfect_quiz', 'perfect_streak', 'review_sessions', 'review_accuracy'].includes(a.condition_type)).length
      };

      console.log('📊 Các thể loại thành tích:');
      console.log(`  📚 Học cơ bản: ${categories.characters_learned} thành tích`);
      console.log(`  🌸 Hiragana: ${categories.hiragana_mastered} thành tích`);
      console.log(`  ⚡ Katakana: ${categories.katakana_mastered} thành tích`);
      console.log(`  🔥 Liên tục: ${categories.streak} thành tích`);
      console.log(`  ✅ Chính xác: ${categories.total_correct} thành tích`);
      console.log(`  📈 Cấp độ: ${categories.level} thành tích`);
      console.log(`  🌟 Đặc biệt: ${categories.special} thành tích`);
      
      console.log('🎯 Thành tích mẫu:');
      console.log('  🎯 Bước đi đầu tiên: Học chữ cái đầu tiên (10 EXP)');
      console.log('  🌸 Thành thạo Hiragana: Thành thạo tất cả chữ Hiragana (500 EXP)');
      console.log('  🏆 Nhà vô địch tháng: Học liên tục 30 ngày (500 EXP)');
      console.log('  👑 Vùng đất của thần thánh: Đạt cấp độ 50 (1500 EXP)');
    } catch (error) {
      console.error('❌ Lỗi khi tạo dữ liệu thành tích:', error);
      throw error;
    }
  },

  down: async (queryInterface) => {
    await Achievement.destroy({ where: {} });
    console.log('✅ Đã xóa tất cả thành tích.');
  }
};
