// プロフィールページ

export class ProfilePage {
  constructor(authService, gamificationApi, toast, router) {
    this.authService = authService;
    this.gamificationApi = gamificationApi;
    this.toast = toast;
    this.router = router;
    this.user = null;
    this.userLevel = null;
    this.achievements = [];
    this.streak = null;
  }
  
  async render() {
    const appElement = document.getElementById('app');
    
    // ローディング表示
    const loadingHTML = `
      <div class="container mt-lg">
        <div class="loading">
          <div class="loading-spinner"></div>
          <p>プロフィールデータを読み込み中...</p>
        </div>
      </div>
    `;
    
    const contentArea = document.createElement('div');
    contentArea.innerHTML = loadingHTML;
    appElement.appendChild(contentArea);
    
    try {
      // データの取得
      await this._fetchData();
      
      // プロフィールページのHTML
      const profileHTML = `
        <div class="container mt-lg">
          <h1>プロフィール</h1>
          
          ${this._renderUserInfo()}
          
          <div class="grid mt-lg">
            <div class="card" style="grid-column: span 12; grid-column: span 6 at 640px;">
              <h2>レベル情報</h2>
              ${this._renderLevelInfo()}
            </div>
            
            <div class="card" style="grid-column: span 12; grid-column: span 6 at 640px;">
              <h2>連続学習</h2>
              ${this._renderStreakInfo()}
            </div>
          </div>
          
          <div class="card mt-lg">
            <h2>実績</h2>
            ${this._renderAchievements()}
          </div>
          
          <div class="card mt-lg">
            <h2>アカウント設定</h2>
            <button class="btn btn-error mt-md" id="logout-btn">ログアウト</button>
          </div>
        </div>
      `;
      
      // コンテンツを更新
      contentArea.innerHTML = profileHTML;
      
      // イベントリスナーを追加
      this._addEventListeners();
      
    } catch (error) {
      console.error('プロフィールデータ取得エラー:', error);
      contentArea.innerHTML = `
        <div class="container mt-lg">
          <div class="card">
            <h1>エラーが発生しました</h1>
            <p>データの読み込み中にエラーが発生しました。再試行してください。</p>
            <button class="btn btn-primary mt-md" id="retry-btn">再試行</button>
            <a href="/dashboard" class="btn btn-secondary mt-md" id="back-dashboard">ダッシュボードに戻る</a>
          </div>
        </div>
      `;
      
      // 再試行ボタンのイベントリスナー
      const retryBtn = document.getElementById('retry-btn');
      if (retryBtn) {
        retryBtn.addEventListener('click', () => {
          this.render();
        });
      }
      
      // ダッシュボードに戻るボタンのイベントリスナー
      const backDashboardBtn = document.getElementById('back-dashboard');
      if (backDashboardBtn) {
        backDashboardBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.router.navigate('/dashboard');
        });
      }
    }
  }
  
  // データの取得
  async _fetchData() {
    // ユーザー情報を取得
    this.user = this.authService.getCurrentUser();
    
    if (!this.user) {
      const profileResponse = await this.authService.getProfile();
      this.user = profileResponse.user;
    }
    
    // 並列でデータを取得
    const [userLevelResponse, achievementsResponse, streakResponse] = await Promise.all([
      this.gamificationApi.getUserLevel(),
      this.gamificationApi.getUserAchievements(),
      this.gamificationApi.getStreak()
    ]);
    
    this.userLevel = userLevelResponse.level;
    this.achievements = achievementsResponse.achievements;
    this.streak = streakResponse;
  }
  
  // ユーザー情報の表示
  _renderUserInfo() {
    if (!this.user) return '';
    
    return `
      <div class="card mt-md">
        <div class="flex items-center">
          <div class="text-center" style="width: 80px; height: 80px; background-color: var(--color-primary-start); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: bold;">
            ${this.user.username.charAt(0).toUpperCase()}
          </div>
          <div class="ml-md">
            <h2>${this.user.username}</h2>
            <p>${this.user.email}</p>
          </div>
        </div>
      </div>
    `;
  }
  
  // レベル情報の表示
  _renderLevelInfo() {
    if (!this.userLevel) return '<p>データを読み込み中...</p>';
    
    return `
      <div class="mt-md">
        <div class="flex justify-between items-center">
          <h3>レベル ${this.userLevel.currentLevel}</h3>
          <span class="badge badge-primary">${this.userLevel.title || ''}</span>
        </div>
        
        <p class="mt-sm">経験値: ${this.userLevel.currentExp} / ${this.userLevel.nextLevelExp || '最大'}</p>
        
        <div class="progress-bar mt-sm">
          <div class="progress-bar-fill" style="width: ${this.userLevel.progress}%"></div>
        </div>
        
        ${this.userLevel.nextLevelExp ? 
          `<p class="text-sm mt-xs">次のレベルまであと ${this.userLevel.expToNextLevel} EXP</p>` : 
          '<p class="text-sm mt-xs">最高レベルに達しました！</p>'
        }
      </div>
    `;
  }
  
  // 連続学習情報の表示
  _renderStreakInfo() {
    if (!this.streak) return '<p>データを読み込み中...</p>';
    
    return `
      <div class="mt-md">
        <div class="text-center">
          <p class="text-lg font-bold">${this.streak.currentStreak} 日</p>
          <p>連続学習中</p>
          
          <p class="mt-md">最終学習日: ${this._formatDate(this.streak.lastStudyDate)}</p>
        </div>
      </div>
    `;
  }
  
  // 実績の表示
  _renderAchievements() {
    if (!this.achievements || this.achievements.length === 0) {
      return '<p>まだ実績はありません。学習を続けて実績を獲得しましょう！</p>';
    }
    
    // 獲得済みの実績
    const earnedAchievements = this.achievements.filter(a => a.achieved);
    
    // 未獲得の実績
    const unearnedAchievements = this.achievements.filter(a => !a.achieved);
    
    return `
      <div class="mt-md">
        <h3>獲得済み実績 (${earnedAchievements.length})</h3>
        <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: var(--spacing-md);">
          ${earnedAchievements.map(achievement => `
            <div class="card p-md">
              <div class="flex items-center">
                <div class="text-center" style="width: 40px; height: 40px; background-color: var(--color-primary-start); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
                  🏆
                </div>
                <div class="ml-sm">
                  <h4>${achievement.name}</h4>
                  <p class="text-sm">${achievement.description}</p>
                  <p class="text-sm text-success">+${achievement.exp_reward} EXP</p>
                  <p class="text-sm">${this._formatDate(achievement.achieved_at)}</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        
        ${unearnedAchievements.length > 0 ? `
          <h3 class="mt-lg">未獲得実績 (${unearnedAchievements.length})</h3>
          <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: var(--spacing-md);">
            ${unearnedAchievements.map(achievement => `
              <div class="card p-md" style="opacity: 0.7;">
                <div class="flex items-center">
                  <div class="text-center" style="width: 40px; height: 40px; background-color: var(--color-text-secondary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
                    🔒
                  </div>
                  <div class="ml-sm">
                    <h4>${achievement.name}</h4>
                    <p class="text-sm">${achievement.description}</p>
                    <p class="text-sm">+${achievement.exp_reward} EXP</p>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }
  
  // 日付のフォーマット
  _formatDate(dateString) {
    if (!dateString) return '不明';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  // イベントリスナーの追加
  _addEventListeners() {
    // ログアウトボタン
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        // カスタムイベントを発行
        const logoutEvent = new Event('logout');
        document.dispatchEvent(logoutEvent);
      });
    }
  }
}
