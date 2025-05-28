// 学習ページ

export class StudyPage {
  constructor(charactersApi, progressApi, gamificationApi, toast, router) {
    this.charactersApi = charactersApi;
    this.progressApi = progressApi;
    this.gamificationApi = gamificationApi;
    this.toast = toast;
    this.router = router;
    this.characters = [];
    this.currentCharacterIndex = 0;
    this.isFlipped = false;
  }
  
  async render() {
    const appElement = document.getElementById('app');
    
    // ローディング表示
    const loadingHTML = `
      <div class="container mt-lg">
        <div class="loading">
          <div class="loading-spinner"></div>
          <p>学習データを読み込み中...</p>
        </div>
      </div>
    `;
    
    const contentArea = document.createElement('div');
    contentArea.innerHTML = loadingHTML;
    appElement.appendChild(contentArea);
    
    try {
      // 未学習の文字を取得
      await this._fetchCharacters();
      
      if (this.characters.length === 0) {
        // 学習する文字がない場合
        contentArea.innerHTML = `
          <div class="container mt-lg">
            <div class="card text-center">
              <h1>おめでとうございます！</h1>
              <p>現在学習可能な新しい文字はありません。</p>
              <div class="flex flex-col gap-md mt-md">
                <a href="/review" class="btn btn-primary" id="go-review">復習する</a>
                <a href="/dashboard" class="btn btn-secondary" id="go-dashboard">ダッシュボードに戻る</a>
              </div>
            </div>
          </div>
        `;
        
        // イベントリスナーを追加
        document.getElementById('go-review').addEventListener('click', (e) => {
          e.preventDefault();
          this.router.navigate('/review');
        });
        
        document.getElementById('go-dashboard').addEventListener('click', (e) => {
          e.preventDefault();
          this.router.navigate('/dashboard');
        });
        
        return;
      }
      
      // 学習ページのHTML
      const studyHTML = `
        <div class="container mt-lg">
          <h1>新しい文字を学ぶ</h1>
          
          <div class="card mt-md text-center">
            <p>残り: <span id="remaining-count">${this.characters.length}</span> 文字</p>
          </div>
          
          <div class="mt-lg">
            ${this._renderFlashcard()}
          </div>
          
          <div class="flex justify-center gap-md mt-lg" id="action-buttons" style="display: none;">
            <button class="btn btn-error" id="dont-know-btn">知らない</button>
            <button class="btn btn-success" id="know-btn">知っている</button>
          </div>
          
          <div class="text-center mt-lg">
            <a href="/dashboard" class="btn btn-secondary" id="back-dashboard">ダッシュボードに戻る</a>
          </div>
        </div>
      `;
      
      // コンテンツを更新
      contentArea.innerHTML = studyHTML;
      
      // イベントリスナーを追加
      this._addEventListeners();
      
    } catch (error) {
      console.error('学習データ取得エラー:', error);
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
  
  // 未学習の文字を取得
  async _fetchCharacters() {
    const response = await this.progressApi.getNotLearned();
    this.characters = response.characters;
    this.currentCharacterIndex = 0;
  }
  
  // フラッシュカードの表示
  _renderFlashcard() {
    if (this.characters.length === 0) return '';
    
    const character = this.characters[this.currentCharacterIndex];
    
    return `
      <div class="flashcard" id="flashcard">
        <div class="flashcard-inner">
          <div class="flashcard-front">
            <span class="japanese-character">${character.character}</span>
          </div>
          <div class="flashcard-back">
            <span class="text-lg">${character.romaji}</span>
            <p class="mt-sm">タイプ: ${character.type === 'hiragana' ? 'ひらがな' : 'カタカナ'}</p>
            <p>グループ: ${character.group_name}</p>
          </div>
        </div>
      </div>
    `;
  }
  
  // イベントリスナーの追加
  _addEventListeners() {
    // フラッシュカードのクリックイベント
    const flashcard = document.getElementById('flashcard');
    if (flashcard) {
      flashcard.addEventListener('click', () => {
        this._flipCard();
      });
    }
    
    // 「知っている」ボタン
    const knowBtn = document.getElementById('know-btn');
    if (knowBtn) {
      knowBtn.addEventListener('click', () => {
        this._handleAnswer(true);
      });
    }
    
    // 「知らない」ボタン
    const dontKnowBtn = document.getElementById('dont-know-btn');
    if (dontKnowBtn) {
      dontKnowBtn.addEventListener('click', () => {
        this._handleAnswer(false);
      });
    }
    
    // ダッシュボードに戻るボタン
    const backDashboardBtn = document.getElementById('back-dashboard');
    if (backDashboardBtn) {
      backDashboardBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.router.navigate('/dashboard');
      });
    }
    
    // キーボードショートカット
    document.addEventListener('keydown', this._handleKeyPress.bind(this));
  }
  
  // キーボードショートカットの処理
  _handleKeyPress(e) {
    if (!this.isFlipped) {
      // カードが表面の場合、スペースキーで裏返す
      if (e.code === 'Space') {
        e.preventDefault();
        this._flipCard();
      }
    } else {
      // カードが裏面の場合
      if (e.code === 'ArrowRight' || e.code === 'KeyK') {
        // 右矢印キーまたはKキーで「知っている」
        e.preventDefault();
        this._handleAnswer(true);
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyD') {
        // 左矢印キーまたはDキーで「知らない」
        e.preventDefault();
        this._handleAnswer(false);
      }
    }
  }
  
  // カードを裏返す
  _flipCard() {
    const flashcard = document.getElementById('flashcard');
    const actionButtons = document.getElementById('action-buttons');
    
    if (!this.isFlipped) {
      // カードを裏返す
      flashcard.classList.add('flipped');
      this.isFlipped = true;
      
      // アクションボタンを表示
      actionButtons.style.display = 'flex';
    } else {
      // カードを表に戻す
      flashcard.classList.remove('flipped');
      this.isFlipped = false;
      
      // アクションボタンを非表示
      actionButtons.style.display = 'none';
    }
  }
  
  // 回答の処理
  async _handleAnswer(isCorrect) {
    try {
      const character = this.characters[this.currentCharacterIndex];
      
      // 進捗を更新
      await this.progressApi.updateProgress(character.id, isCorrect);
      
      // 連続学習日数を更新（最初の文字の学習時のみ）
      if (this.currentCharacterIndex === 0) {
        await this.gamificationApi.getStreak();
      }
      
      // 次の文字へ
      this.currentCharacterIndex++;
      
      // 残りの文字数を更新
      const remainingCount = document.getElementById('remaining-count');
      remainingCount.textContent = this.characters.length - this.currentCharacterIndex;
      
      // すべての文字を学習した場合
      if (this.currentCharacterIndex >= this.characters.length) {
        this._showCompletionMessage();
        return;
      }
      
      // カードを表に戻す
      const flashcard = document.getElementById('flashcard');
      flashcard.classList.remove('flipped');
      this.isFlipped = false;
      
      // アクションボタンを非表示
      const actionButtons = document.getElementById('action-buttons');
      actionButtons.style.display = 'none';
      
      // 新しい文字を表示
      const flashcardContainer = flashcard.parentElement;
      flashcardContainer.innerHTML = this._renderFlashcard();
      
      // イベントリスナーを再設定
      document.getElementById('flashcard').addEventListener('click', () => {
        this._flipCard();
      });
      
    } catch (error) {
      console.error('進捗更新エラー:', error);
      this.toast.error('進捗の更新中にエラーが発生しました');
    }
  }
  
  // 学習完了メッセージの表示
  _showCompletionMessage() {
    // 紙吹雪アニメーション
    this._showConfetti();
    
    const container = document.querySelector('.container');
    container.innerHTML = `
      <div class="card text-center">
        <h1>おめでとうございます！</h1>
        <p>すべての新しい文字を学習しました。</p>
        <div class="flex flex-col gap-md mt-md">
          <a href="/review" class="btn btn-primary" id="go-review">復習する</a>
          <a href="/quiz" class="btn btn-secondary" id="go-quiz">クイズに挑戦</a>
          <a href="/dashboard" class="btn btn-secondary" id="go-dashboard">ダッシュボードに戻る</a>
        </div>
      </div>
    `;
    
    // イベントリスナーを追加
    document.getElementById('go-review').addEventListener('click', (e) => {
      e.preventDefault();
      this.router.navigate('/review');
    });
    
    document.getElementById('go-quiz').addEventListener('click', (e) => {
      e.preventDefault();
      this.router.navigate('/quiz');
    });
    
    document.getElementById('go-dashboard').addEventListener('click', (e) => {
      e.preventDefault();
      this.router.navigate('/dashboard');
    });
    
    // キーボードイベントリスナーを削除
    document.removeEventListener('keydown', this._handleKeyPress.bind(this));
  }
  
  // 紙吹雪アニメーション
  _showConfetti() {
    // 紙吹雪コンテナを作成
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);
    
    // 紙吹雪の色
    const colors = ['#4F46E5', '#7C3AED', '#F8BBD9', '#10B981', '#3B82F6'];
    
    // 紙吹雪を生成
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.width = `${Math.random() * 10 + 5}px`;
      confetti.style.height = `${Math.random() * 10 + 5}px`;
      confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
      confetti.style.animationDelay = `${Math.random() * 2}s`;
      confettiContainer.appendChild(confetti);
    }
    
    // 紙吹雪を一定時間後に削除
    setTimeout(() => {
      document.body.removeChild(confettiContainer);
    }, 5000);
  }
  
  // コンポーネントのクリーンアップ
  cleanup() {
    // キーボードイベントリスナーを削除
    document.removeEventListener('keydown', this._handleKeyPress.bind(this));
  }
}
