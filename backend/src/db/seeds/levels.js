const levelsData = [
  { level: 1, exp_required: 0, title: 'Người mới bắt đầu' },
  { level: 2, exp_required: 100, title: 'Người học' },
  { level: 3, exp_required: 250, title: 'Lính mới' },
  { level: 4, exp_required: 500, title: 'Thực tập sinh' },
  { level: 5, exp_required: 850, title: 'Sinh viên' },
  { level: 6, exp_required: 1300, title: 'Người chăm chỉ' },
  { level: 7, exp_required: 1850, title: 'Người cần cù' },
  { level: 8, exp_required: 2500, title: 'Người nhiệt huyết' },
  { level: 9, exp_required: 3250, title: 'Người chuyên tâm' },
  { level: 10, exp_required: 4100, title: 'Ứng cử viên bậc thầy' },
  { level: 11, exp_required: 5050, title: 'Người giỏi' },
  { level: 12, exp_required: 6100, title: 'Người thành thạo' },
  { level: 13, exp_required: 7250, title: 'Chuyên gia' },
  { level: 14, exp_required: 8500, title: 'Người hướng dẫn' },
  { level: 15, exp_required: 9850, title: 'Bậc thầy' },
  { level: 16, exp_required: 11300, title: 'Danh nhân' },
  { level: 17, exp_required: 12850, title: 'Sư phụ' },
  { level: 18, exp_required: 14500, title: 'Tôn sư' },
  { level: 19, exp_required: 16250, title: 'Đại sư' },
  { level: 20, exp_required: 18100, title: 'Tiên nhân' },
  { level: 21, exp_required: 20050, title: 'Thần văn tự' },
  { level: 22, exp_required: 22100, title: 'Vương giả ngôn ngữ' },
  { level: 23, exp_required: 24250, title: 'Hoàng đế tiếng Nhật' },
  { level: 24, exp_required: 26500, title: 'Đế vương văn tự' },
  { level: 25, exp_required: 28850, title: 'Người học tối thượng' },
  { level: 26, exp_required: 31300, title: 'Chuyên gia Hiragana' },
  { level: 27, exp_required: 33850, title: 'Chuyên gia Katakana' },
  { level: 28, exp_required: 36500, title: 'Người cầu toàn' },
  { level: 29, exp_required: 39250, title: 'Người học huyền thoại' },
  { level: 30, exp_required: 42100, title: 'Bậc thầy bất diệt' },
  { level: 31, exp_required: 45050, title: 'Sinh vật huyền thoại' },
  { level: 32, exp_required: 48100, title: 'Người siêu việt' },
  { level: 33, exp_required: 51250, title: 'Kiến thức vô hạn' },
  { level: 34, exp_required: 54500, title: 'Người học vĩnh cửu' },
  { level: 35, exp_required: 57850, title: 'Người vượt qua chiều không gian' },
  { level: 36, exp_required: 61300, title: 'Nhà hiền triết vũ trụ' },
  { level: 37, exp_required: 64850, title: 'Toàn năng' },
  { level: 38, exp_required: 68500, title: 'Đấng sáng tạo' },
  { level: 39, exp_required: 72250, title: 'Nhà sáng tạo ngôn ngữ' },
  { level: 40, exp_required: 76100, title: 'Tồn tại tối thượng' },
  { level: 41, exp_required: 80050, title: 'Bậc thầy bất khả chiến bại' },
  { level: 42, exp_required: 84100, title: 'Người hoàn hảo' },
  { level: 43, exp_required: 88250, title: 'Tồn tại tuyệt đối' },
  { level: 44, exp_required: 92500, title: 'Tồn tại siêu việt' },
  { level: 45, exp_required: 96850, title: 'Tồn tại tối cao' },
  { level: 46, exp_required: 101300, title: 'Thần Hiragana' },
  { level: 47, exp_required: 105850, title: 'Thần Katakana' },
  { level: 48, exp_required: 110500, title: 'Chúa tể văn tự' },
  { level: 49, exp_required: 115250, title: 'Chúa tể ngôn ngữ' },
  { level: 50, exp_required: 120100, title: 'Thần tiếng Nhật' }
];
module.exports = {
  up: async (queryInterface) => {
    try {
      // Kiểm tra xem dữ liệu đã tồn tại chưa
      const existingLevels = await Level.findAll();
      if (existingLevels.length > 0) {
        console.log('Hệ thống cấp độ đã được tạo sẵn, bỏ qua...');
        return;
      }

      console.log('Đang tạo dữ liệu cấp độ...');
      await Level.bulkCreate(levelsData);

      console.log('✅ Tạo dữ liệu cấp độ thành công!');
      console.log(`📊 Tổng số cấp độ đã tạo: ${levelsData.length}`);
      
      // Hiển thị một số cấp độ mẫu
      console.log('📋 Các cấp độ mẫu:');
      console.log('  Cấp độ 1: Người mới bắt đầu (0 EXP)');
      console.log('  Cấp độ 10: Ứng cử viên bậc thầy (4,100 EXP)');
      console.log('  Cấp độ 25: Người học tối thượng (28,850 EXP)');
      console.log('  Cấp độ 46: Thần Hiragana (101,300 EXP)');
      console.log('  Cấp độ 50: Thần tiếng Nhật (120,100 EXP)');
    } catch (error) {
      console.error('❌ Lỗi khi tạo dữ liệu cấp độ:', error);
      throw error;
    }
  },

  down: async (queryInterface) => {
    // Xóa tất cả dữ liệu cấp độ
    await Level.destroy({ where: {} });
    console.log('✅ Đã xóa tất cả các cấp độ.');
  }
};
