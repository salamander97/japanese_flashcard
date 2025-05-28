# 🇯🇵 Japanese Flashcard App

Ứng dụng học bảng chữ cái tiếng Nhật (ひらがな & カタカナ) với hệ thống gamification, spaced repetition và PWA support.

## ✨ Tính năng chính

- 📚 **Học 92 ký tự**: 46 Hiragana + 46 Katakana
- 🧠 **Spaced Repetition**: Thuật toán lặp lại cách quãng thông minh
- 🎮 **Gamification**: 50 levels, 38+ achievements, streak system
- 📱 **PWA**: Hoạt động offline, có thể install như native app
- 📊 **Analytics**: Theo dõi tiến độ chi tiết, thống kê học tập
- ⚡ **Responsive**: Tối ưu cho mobile, tablet, desktop

## 🏗️ Kiến trúc

- **Backend**: Node.js + Express.js + PostgreSQL
- **Frontend**: Vanilla JavaScript + PWA
- **Authentication**: JWT tokens
- **Database**: PostgreSQL với Sequelize ORM
- **Deployment**: Docker ready

## 📋 Yêu cầu hệ thống

- Node.js 16+ 
- PostgreSQL 12+
- RAM: 512MB+
- Storage: 1GB+

## 🚀 Cài đặt và chạy

### 1. Clone repository
```bash
git clone <your-repo-url>
cd japanese-flashcard-app
```

### 2. Setup Database
```bash
# Cài đặt PostgreSQL
sudo apt install postgresql postgresql-contrib

# Tạo database và user
sudo -u postgres psql
CREATE USER flashcard_user WITH PASSWORD 'your_password';
CREATE DATABASE japanese_flashcard OWNER flashcard_user;
GRANT ALL PRIVILEGES ON DATABASE japanese_flashcard TO flashcard_user;
\q
```

### 3. Setup Backend
```bash
cd backend

# Cài đặt dependencies
npm install

# Tạo file .env
cp .env.example .env
# Chỉnh sửa .env với thông tin database thực

# Chạy migrations và seed data
npm run init-db

# Khởi động server
npm start
```

### 4. Setup Frontend
```bash
cd frontend

# Cài đặt dependencies (nếu có)
npm install

# Serve frontend (development)
npm start
```

### 5. Truy cập ứng dụng
- Backend API: http://localhost:5000
- Frontend: http://localhost:3000

## 📊 Database Schema

### Tables chính:
- **Users**: Thông tin người dùng, level, exp, streak
- **Characters**: 92 ký tự Hiragana/Katakana
- **UserProgress**: Tiến độ học từng ký tự, spaced repetition
- **Achievements**: Hệ thống thành tích
- **Sessions**: Lịch sử học tập

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/profile` - Thông tin user

### Characters
- `GET /api/characters` - Tất cả ký tự
- `GET /api/characters/hiragana` - Chỉ Hiragana
- `GET /api/characters/katakana` - Chỉ Katakana

### Progress  
- `GET /api/progress` - Tiến độ tổng thể
- `GET /api/progress/not-learned` - Ký tự chưa học
- `POST /api/progress/update` - Cập nhật tiến độ

### Gamification
- `GET /api/gamification/user-level` - Level hiện tại
- `GET /api/gamification/achievements` - Danh sách thành tích
- `GET /api/gamification/streak` - Chuỗi học liên tục

## 🎮 Game Mechanics

### Level System
- 50 levels với tên tiếng Nhật
- Từ "初心者" (Level 1) đến "日本語の神" (Level 50)
- Exponential EXP requirement

### Achievement Categories
- 📚 Basic Learning (5 achievements)
- 🌸 Hiragana Mastery (4 achievements) 
- ⚡ Katakana Mastery (4 achievements)
- 🔥 Streak Challenges (6 achievements)
- ✅ Accuracy Rewards (5 achievements)
- 📈 Level Milestones (6 achievements)
- 🌟 Special Challenges (8 achievements)

### Spaced Repetition
- SM-2 Algorithm implementation
- Dynamic difficulty adjustment
- Optimal review timing

## 🔧 Development

### Scripts
```bash
# Backend
npm run dev          # Development với nodemon
npm run migrate      # Chạy database migrations  
npm run seed         # Seed initial data
npm run reset-db     # Reset và seed lại database

# Frontend
npm run dev          # Development server
npm run build        # Build for production
```

### Testing
```bash
npm test             # Chạy unit tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

## 🐳 Docker Deployment

```bash
# Build và chạy với Docker Compose
docker-compose up -d

# Chỉ build
docker-compose build

# Xem logs
docker-compose logs -f
```

## 📱 PWA Features

- ✅ Offline functionality
- ✅ Install prompt  
- ✅ Background sync
- ✅ Push notifications (optional)
- ✅ Responsive design

## 🔒 Security

- JWT authentication
- Password hashing (bcrypt)
- Rate limiting
- Input validation
- CORS protection
- Security headers

## 📈 Performance

- Database indexing
- Query optimization  
- Asset compression
- Service Worker caching
- Lazy loading

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## 📄 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 👨‍💻 Author

**Your Name**
- GitHub: [@Salamander97](https://github.com/Salamander97)
- Email: trunghieu.bomm@gmail.com

## 🙏 Acknowledgments

- [Noto Sans JP](https://fonts.google.com/noto/specimen/Noto+Sans+JP) - Font tiếng Nhật
- [Inter](https://rsms.me/inter/) - UI Font
- Japanese characters data from various sources

---

Made with ❤️ for Japanese learners worldwide