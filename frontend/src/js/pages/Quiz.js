// クイズページ

export class QuizPage {
  constructor(charactersApi, progressApi, gamificationApi, toast, router) {
    this.charactersApi = charactersApi;
    this.progressApi = progressApi;
    this.gamificationApi = gamificationApi;
    this.toast = toast;
    this.router = router;
    this.characters = [];
    this.currentQuestionIndex = 0;
    this.correctAnswers = 0;
    this.startTime = null;
    this.quizOptions = [];
    this.selectedAnswer = null;
    this.timer = null;
    this.timeElapsed = 0;
  }
  
  async render() {
    const appElement = document.getElementById('app');
    
    // ローディング表示
    const loadingHTML = `
      <div class="container mt-lg">
        <div class="loading">
          <div class="loading-spinner"></div>
          <p>クイズデータを読み込み中...</p>
        </div>
      </div>
    `;
    
    const contentArea = document.createElement('div');
    contentArea.innerHTML = loadingHTML;
    appElement.appendChild(contentArea);
    
    try {
      // 学習済みの文字を取得
      await this._fetchCharacters();
      
      if (this.characters.length < 5) {
        // クイズに必要な文字数が足りない場合
        contentArea.innerHTML = `
          <div class="container mt-lg">
            <div class="card text-center">
              <h1>クイズを始められません</h1>
              <p>クイズを始めるには、少なくとも5つの文字を学習する必要があります。</p>
              <div class="flex flex-col gap-md mt-md">
                <a href="/study" class="btn btn-primary" id="go-study">学習する</a>
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
      
      // クイズの開始画面
      contentArea.innerHTML = `
        <div class="container mt-lg">
          <div class="card text-center">
            <h1>クイズ</h1>
            <p>学習した文字の知識をテストしましょう。</p>
            <p class="mt-md">クイズは10問あります。各問題には4つの選択肢があります。</p>
            <button class="btn btn-primary mt-lg" id="start-quiz-btn">クイズを始める</button>
            <a href="/dashboard" class="btn btn-secondary mt-md" id="back-dashboard">ダッシュボードに戻る</a>
          </div>
        </div>
      `;
      
      // イベントリスナーを追加
      document.getElementById('start-quiz-btn').addEventListener('click', () => {
        this._startQuiz();
      });
      
      document.getElementById('back-dashboard').addEventListener('click', (e) => {
        e.preventDefault();
        this.router.navigate('/dashboard');
      });
      
    } catch (error) {
      console.error('クイズデータ取得エラー:', error);
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
  
  // 学習済みの文字を取得
  async _fetchCharacters() {
    // 学習済みの文字を取得（未学習以外の文字）
    const response = await this.progressApi.getAllProgress();
    this.characters = response.progress
      .filter(p => p.status !== 'not_learned')
      .map(p => p.character);
    
    // ランダムに10問選択（または全問、もし10問未満なら）
    this.characters = this._shuffleArray(this.characters).slice(0, 10);
    this.currentQuestionIndex = 0;
    this.correctAnswers = 0;
  }
  
  // クイズを開始
  _startQuiz() {
    this.startTime = Date.now();
    this._showQuestion();
    this._startTimer();
  }
  
  // タイマーを開始
  _startTimer() {
    const updateTimer = () => {
      this.timeElapsed = Math.floor((Date.now() - this.startTime) / 1000);
      const timerElement = document.getElementById('timer');
      if (timerElement) {
        timerElement.textContent = this._formatTime(this.timeElapsed);
      }
    };
    
    // 1秒ごとにタイマーを更新
    this.timer = setInterval(updateTimer, 1000);
    updateTimer(); // 初期表示
  }
  
  // 時間のフォーマット
  _formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  // 問題を表示
  _showQuestion() {
    const appElement = document.getElementById('app');
    const currentCharacter = this.characters[this.currentQuestionIndex];
    
    // 選択肢を生成
    this.quizOptions = this._generateOptions(currentCharacter);
    
    // 問題のHTML
    const questionHTML = `
      <div class="container mt-lg">
        <div class="card">
          <div class="flex justify-between items-center">
            <h1>クイズ</h1>
            <div>
              <span class="badge badge-primary">問題 ${this.currentQuestionIndex + 1}/${this.characters.length}</span>
              <span class="badge badge-accent ml-sm" id="timer">0:00</span>
            </div>
          </div>
          
          <div class="text-center mt-lg">
            <p>この文字の読み方は？</p>
            <div class="japanese-character mt-md">${currentCharacter.character}</div>
          </div>
          
          <div class="mt-lg" id="options-container">
            ${this.quizOptions.map((option, index) => `
              <button class="btn btn-secondary w-100 mt-sm option-btn" data-index="${index}">
                ${option.romaji}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    
    // コンテンツを更新
    appElement.innerHTML = questionHTML;
    
    // 選択肢のイベントリスナーを追加
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(button => {
      button.addEventListener('click', () => {
        const index = parseInt(button.getAttribute('data-index'));
        this._selectAnswer(index);
      });
    });
  }
  
  // 選択肢を生成
  _generateOptions(correctCharacter) {
    // 正解の選択肢
    const correctOption = {
      romaji: correctCharacter.romaji,
      isCorrect: true
    };
    
    // 不正解の選択肢用に他の文字から3つ選ぶ
    const otherCharacters = this.characters.filter(c => c.id !== correctCharacter.id);
    const incorrectOptions = this._shuffleArray(otherCharacters)
      .slice(0, 3)
      .map(c => ({
        romaji: c.romaji,
        isCorrect: false
      }));
    
    // 正解と不正解を混ぜてシャッフル
    return this._shuffleArray([correctOption, ...incorrectOptions]);
  }
  
  // 回答を選択
  _selectAnswer(index) {
    // 既に回答済みの場合は何もしない
    if (this.selectedAnswer !== null) return;
    
    this.selectedAnswer = index;
    const selectedOption = this.quizOptions[index];
    const isCorrect = selectedOption.isCorrect;
    
    // 選択肢のスタイルを更新
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach((button, i) => {
      const buttonIndex = parseInt(button.getAttribute('data-index'));
      const buttonOption = this.quizOptions[buttonIndex];
      
      if (buttonIndex === index) {
        // 選択された選択肢
        button.classList.remove('btn-secondary');
        button.classList.add(isCorrect ? 'btn-success' : 'btn-error');
      } else if (buttonOption.isCorrect) {
        // 正解の選択肢（選択されていない場合）
        button.classList.remove('btn-secondary');
        button.classList.add('btn-success');
      }
      
      // すべての選択肢を無効化
      button.disabled = true;
    });
    
    // 正解数を更新
    if (isCorrect) {
      this.correctAnswers++;
    }
    
    // 現在の文字の進捗を更新
    const currentCharacter = this.characters[this.currentQuestionIndex];
    this.progressApi.updateProgress(currentCharacter.id, isCorrect)
      .catch(error => console.error('進捗更新エラー:', error));
    
    // 次の問題へ進むボタンを表示
    const optionsContainer = document.getElementById('options-container');
    const nextButtonHTML = `
      <button class="btn btn-primary w-100 mt-lg" id="next-question-btn">
        ${this.currentQuestionIndex < this.characters.length - 1 ? '次の問題へ' : '結果を見る'}
      </button>
    `;
    optionsContainer.insertAdjacentHTML('afterend', nextButtonHTML);
    
    // 次の問題へ進むボタンのイベントリスナー
    document.getElementById('next-question-btn').addEventListener('click', () => {
      this._nextQuestion();
    });
  }
  
  // 次の問題へ進む
  _nextQuestion() {
    this.currentQuestionIndex++;
    this.selectedAnswer = null;
    
    // すべての問題が終了した場合
    if (this.currentQuestionIndex >= this.characters.length) {
      this._showResults();
      return;
    }
    
    // 次の問題を表示
    this._showQuestion();
  }
  
  // 結果を表示
  _showResults() {
    // タイマーを停止
    clearInterval(this.timer);
    
    const appElement = document.getElementById('app');
    const scorePercentage = (this.correctAnswers / this.characters.length) * 100;
    const isPerfectScore = this.correctAnswers === this.characters.length;
    
    // 結果のHTML
    const resultsHTML = `
      <div class="container mt-lg">
        <div class="card text-center">
          <h1>クイズ結果</h1>
          
          <div class="mt-lg">
            <p class="text-lg">正解数: <span class="font-bold">${this.correctAnswers}/${this.characters.length}</span></p>
            <p class="text-lg">正解率: <span class="font-bold ${scorePercentage >= 70 ? 'text-success' : ''}">${scorePercentage.toFixed(1)}%</span></p>
            <p class="text-lg">所要時間: <span class="font-bold">${this._formatTime(this.timeElapsed)}</span></p>
          </div>
          
          ${isPerfectScore ? `
            <div class="mt-lg">
              <p class="text-lg text-success font-bold">おめでとうございます！全問正解です！</p>
            </div>
          ` : ''}
          
          <div class="flex flex-col gap-md mt-lg">
            <button class="btn btn-primary" id="retry-quiz-btn">もう一度挑戦</button>
            <a href="/dashboard" class="btn btn-secondary" id="back-dashboard">ダッシュボードに戻る</a>
          </div>
        </div>
      </div>
    `;
    
    // コンテンツを更新
    appElement.innerHTML = resultsHTML;
    
    // 紙吹雪アニメーション（全問正解の場合）
    if (isPerfectScore) {
      this._showConfetti();
      
      // 実績の可能性をチェック
      this.gamificationApi.addExp(50, 'クイズで高得点を獲得')
        .catch(error => console.error('経験値追加エラー:', error));
    }
    
    // 速度実績のチェック
    if (this.timeElapsed < 30 && this.characters.length >= 5) {
      this.gamificationApi.addExp(75, 'クイズを素早く完了')
        .catch(error => console.error('経験値追加エラー:', error));
    }
    
    // イベントリスナーを追加
    document.getElementById('retry-quiz-btn').addEventListener('click', () => {
      this.render();
    });
    
    document.getElementById('back-dashboard').addEventListener('click', (e) => {
      e.preventDefault();
      this.router.navigate('/dashboard');
    });
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
  
  // 配列をシャッフル
  _shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
  
  // コンポーネントのクリーンアップ
  cleanup() {
    // タイマーを停止
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
