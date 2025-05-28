// ダッシュボードページ

export class DashboardPage {
  constructor(charactersApi, progressApi, gamificationApi, toast, router) {
    this.charactersApi = charactersApi;
    this.progressApi = progressApi;
    this.gamificationApi = gamificationApi;
    this.toast = toast;
    this.router = router;
    this.stats = null;
    this.userLevel = null;
    this.streak = null;
  }
  
  async render() {
    const appElement = document.getElementById('app');
    
    // ローディング表示
    const loadingHTML = `
      <div class="container mt-lg">
        <div class="loading">
          <div class="loading-spinner"></div>
          <p>データを読み込み中...</p>
        </div>
      </div>
    `;
    
    const contentArea = document.createElement('div');
    contentArea.innerHTML = loadingHTML;
    appElement.appendChild(contentArea);
    
    try {
      // データの取得
      await this._fetchData();
      
      // ダッシュボードのHTML
      const dashboardHTML = `
        <div class="container mt-lg">
          <h1>ダッシュボード</h1>
          
          ${this._renderUserLevel()}
          
          <div class="grid mt-lg">
            <div class="card" style="grid-column: span 12; grid-column: span 6 at 640px;">
              <h2>学習進捗</h2>
              ${this._renderProgressStats()}
            </div>
            
            <div class="card" style="grid-column: span 12; grid-column: span 6 at 640px;">
              <h2>学習オプション</h2>
              <div class="flex flex-col gap-md mt-md">
                <a href="/study" class="btn btn-primary" id="study-btn">新しい文字を学ぶ</a>
                <a href="/review" class="btn btn-secondary" id="review-btn">復習する</a>
                <a href="/quiz" class="btn btn-secondary" id="quiz-btn">クイズに挑戦</a>
              </div>
            </div>
          </div>
          
          <div class="card mt-lg">
            <h2>最近の学習状況</h2>
            ${this._renderRecentActivity()}
          </div>
        </div>
      `;
      
      // コンテンツを更新
      contentArea.innerHTML = dashboardHTML;
      
      // イベントリスナーを追加
      this._addEventListeners();
      
    } catch (error) {
      console.error('ダッシュボードデータ取得エラー:', error);
      contentArea.innerHTML = `
        <div class="container mt-lg">
          <div class="card">
            <h1>エラーが発生しました</h1>
            <p>データの読み込み中にエラーが発生しました。再試行してください。</p>
            <button class="btn btn-primary mt-md" id="retry-btn">再試行</button>
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
    }
  }
  
  // データの取得
  async _fetchData() {
    // 並列でデータを取得
    const [statsResponse, userLevelResponse, streakResponse] = await Promise.all([
      this.progressApi.getStats(),
      this.gamificationApi.getUserLevel(),
      this.gamificationApi.getStreak()
    ]);
    
    this.stats = statsResponse.stats;
    this.userLevel = userLevelResponse.level;
    this.streak = streakResponse;
  }
  
  // ユーザーレベル情報の表示
  _renderUserLevel() {
    if (!this.userLevel) return '';
    
    return `
      <div class="card mt-md">
        <div class="flex justify-between items-center">
          <div>
            <h2>レベル ${this.userLevel.currentLevel} ${this.userLevel.title ? `- ${this.userLevel.title}` : ''}</h2>
            <p>経験値: ${this.userLevel.currentExp} / ${this.userLevel.nextLevelExp || '最大'}</p>
          </div>
          <div class="badge badge-primary">
            ${this.streak.currentStreak} 日連続学習中
          </div>
        </div>
        
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
  
  // 進捗統計の表示
  _renderProgressStats() {
    if (!this.stats) return '<p>データを読み込み中...</p>';
    
    return `
      <div class="mt-md">
        <h3>ひらがな</h3>
        <div class="progress-bar">
          <div class="progress-bar-fill" style="width: ${this.stats.hiragana.progress}%"></div>
        </div>
        <p class="text-sm mt-xs">
          ${this.stats.hiragana.learned} / ${this.stats.hiragana.total} 文字学習済み
          (${this.stats.hiragana.mastered} 文字マスター)
        </p>
        
        <h3 class="mt-md">カタカナ</h3>
        <div class="progress-bar">
          <div class="progress-bar-fill" style="width: ${this.stats.katakana.progress}%"></div>
        </div>
        <p class="text-sm mt-xs">
          ${this.stats.katakana.learned} / ${this.stats.katakana.total} 文字学習済み
          (${this.stats.katakana.mastered} 文字マスター)
        </p>
        
        <h3 class="mt-md">全体進捗</h3>
        <div class="progress-bar">
          <div class="progress-bar-fill" style="width: ${this.stats.total.progress}%"></div>
        </div>
        <p class="text-sm mt-xs">
          ${this.stats.total.learned} / ${this.stats.total.total} 文字学習済み
          (${this.stats.total.mastered} 文字マスター)
        </p>
        
        <div class="mt-md">
          <h3>正解率</h3>
          <p class="text-lg font-bold ${this.stats.accuracy.rate >= 70 ? 'text-success' : ''}">
            ${this.stats.accuracy.rate.toFixed(1)}%
          </p>
          <p class="text-sm">
            ${this.stats.accuracy.correct} 正解 / ${this.stats.accuracy.incorrect} 不正解
            (全 ${this.stats.accuracy.total} 回)
          </p>
        </div>
      </div>
    `;
  }
  
  // 最近の学習活動の表示
  _renderRecentActivity() {
    // 実際のアプリでは最近の学習セッションデータを表示
    return `
      <div class="mt-md">
        <p>まだ学習記録がありません。「新しい文字を学ぶ」ボタンをクリックして学習を始めましょう！</p>
      </div>
    `;
  }
  
  // イベントリスナーの追加
  _addEventListeners() {
    // 学習ボタン
    const studyBtn = document.getElementById('study-btn');
    if (studyBtn) {
      studyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.router.navigate('/study');
      });
    }
    
    // 復習ボタン
    const reviewBtn = document.getElementById('review-btn');
    if (reviewBtn) {
      reviewBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.router.navigate('/review');
      });
    }
    
    // クイズボタン
    const quizBtn = document.getElementById('quiz-btn');
    if (quizBtn) {
      quizBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.router.navigate('/quiz');
      });
    }
  }
}
