// 復習ページ

export class ReviewPage {
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
          <p>復習データを読み込み中...</p>
        </div>
      </div>
    `;
    
    const contentArea = document.createElement('div');
    contentArea.innerHTML = loadingHTML;
    appElement.appendChild(contentArea);
    
    try {
      // 復習が必要な文字を取得
      await this._fetchCharacters();
      
      if (this.characters.length === 0) {
        // 復習する文字がない場合
        contentArea.innerHTML = `
          <div class="container mt-lg">
            <div class="card text-center">
              <h1>復習する文字がありません</h1>
              <p>現在復習が必要な文字はありません。</p>
              <div class="flex flex-col gap-md mt-md">
                <a href="/study" class="btn btn-primary" id="go-study">新しい文字を学ぶ</a>
                <a href="/dashboard" class="btn btn-secondary" id="go-dashboard">ダッシュボードに戻る</a>
              </div>
            </div>
          </div>
        `;
        
        // イベントリスナーを追加
        document.getElementById('go-study').addEventListener('click', (e) => {
          e.preventDefault();
          this.router.navigate('/study');
        });
        
        document.getElementById('go-dashboard').addEventListener('click', (e) => {
          e.preventDefault();
          this.router.navigate('/dashboard');
        });
        
        return;
      }
      
      // 復習ページのHTML
      const reviewHTML = `
        <div class="container mt-lg">
          <h1>復習</h1>
          
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
      contentArea.innerHTML = reviewHTML;
      
      // イベントリスナーを追加
      this._addEventListeners();
      
    } catch (error) {
      console.error('復習データ取得エラー:', error);
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
  
  // 復習が必要な文字を取得
  async _fetchCharacters() {
    const response = await this.progressApi.getReviewDue();
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
      
      // 次の文字へ
      this.currentCharacterIndex++;
      
      // 残りの文字数を更新
      const remainingCount = document.getElementById('remaining-count');
      remainingCount.textContent = this.characters.length - this.currentCharacterIndex;
      
      // すべての文字を復習した場合
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
  
  // 復習完了メッセージの表示
  _showCompletionMessage() {
    const container = document.querySelector('.container');
    container.innerHTML = `
      <div class="card text-center">
        <h1>おめでとうございます！</h1>
        <p>すべての復習を完了しました。</p>
        <div class="flex flex-col gap-md mt-md">
          <a href="/study" class="btn btn-primary" id="go-study">新しい文字を学ぶ</a>
          <a href="/quiz" class="btn btn-secondary" id="go-quiz">クイズに挑戦</a>
          <a href="/dashboard" class="btn btn-secondary" id="go-dashboard">ダッシュボードに戻る</a>
        </div>
      </div>
    `;
    
    // 経験値を追加
    this.gamificationApi.addExp(20, '復習を完了')
      .catch(error => console.error('経験値追加エラー:', error));
    
    // イベントリスナーを追加
    document.getElementById('go-study').addEventListener('click', (e) => {
      e.preventDefault();
      this.router.navigate('/study');
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
  
  // コンポーネントのクリーンアップ
  cleanup() {
    // キーボードイベントリスナーを削除
    document.removeEventListener('keydown', this._handleKeyPress.bind(this));
  }
}
