// 登録ページ

export class RegisterPage {
  constructor(authService, toast, router) {
    this.authService = authService;
    this.toast = toast;
    this.router = router;
  }
  
  render() {
    const appElement = document.getElementById('app');
    
    // 登録フォームのHTML
    const registerHTML = `
      <div class="container">
        <div class="card mt-lg" style="max-width: 500px; margin: 2rem auto;">
          <h1 class="text-center">アカウント登録</h1>
          
          <form id="register-form" class="mt-md">
            <div class="form-group">
              <label for="username" class="form-label">ユーザー名</label>
              <input type="text" id="username" class="form-input" placeholder="ユーザー名" required>
              <div class="form-error" id="username-error"></div>
            </div>
            
            <div class="form-group">
              <label for="email" class="form-label">メールアドレス</label>
              <input type="email" id="email" class="form-input" placeholder="example@example.com" required>
              <div class="form-error" id="email-error"></div>
            </div>
            
            <div class="form-group">
              <label for="password" class="form-label">パスワード</label>
              <input type="password" id="password" class="form-input" placeholder="パスワード（8文字以上）" required>
              <div class="form-error" id="password-error"></div>
            </div>
            
            <div class="form-group">
              <label for="confirm-password" class="form-label">パスワード（確認）</label>
              <input type="password" id="confirm-password" class="form-input" placeholder="パスワードを再入力" required>
              <div class="form-error" id="confirm-password-error"></div>
            </div>
            
            <button type="submit" class="btn btn-primary w-100 mt-md" id="register-button">
              登録
            </button>
            
            <div class="text-center mt-md">
              <p>既にアカウントをお持ちの方は <a href="/login" id="login-link">ログイン</a> してください</p>
            </div>
          </form>
        </div>
      </div>
    `;
    
    // コンテンツエリアに登録フォームを追加
    const contentArea = document.createElement('div');
    contentArea.innerHTML = registerHTML;
    appElement.appendChild(contentArea);
    
    // イベントリスナーを追加
    this._addEventListeners();
  }
  
  _addEventListeners() {
    // ログインリンク
    const loginLink = document.getElementById('login-link');
    loginLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.router.navigate('/login');
    });
    
    // 登録フォーム
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // フォームデータの取得
      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      
      // エラーメッセージをクリア
      document.getElementById('username-error').textContent = '';
      document.getElementById('email-error').textContent = '';
      document.getElementById('password-error').textContent = '';
      document.getElementById('confirm-password-error').textContent = '';
      
      // バリデーション
      let isValid = true;
      
      if (!username) {
        document.getElementById('username-error').textContent = 'ユーザー名を入力してください';
        isValid = false;
      } else if (username.length < 3 || username.length > 50) {
        document.getElementById('username-error').textContent = 'ユーザー名は3〜50文字である必要があります';
        isValid = false;
      } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        document.getElementById('username-error').textContent = 'ユーザー名は英数字とアンダースコアのみ使用できます';
        isValid = false;
      }
      
      if (!email) {
        document.getElementById('email-error').textContent = 'メールアドレスを入力してください';
        isValid = false;
      } else if (!this._validateEmail(email)) {
        document.getElementById('email-error').textContent = '有効なメールアドレスを入力してください';
        isValid = false;
      }
      
      if (!password) {
        document.getElementById('password-error').textContent = 'パスワードを入力してください';
        isValid = false;
      } else if (password.length < 8) {
        document.getElementById('password-error').textContent = 'パスワードは8文字以上である必要があります';
        isValid = false;
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
        document.getElementById('password-error').textContent = 'パスワードには大文字、小文字、数字、特殊文字を含める必要があります';
        isValid = false;
      }
      
      if (!confirmPassword) {
        document.getElementById('confirm-password-error').textContent = 'パスワード（確認）を入力してください';
        isValid = false;
      } else if (password !== confirmPassword) {
        document.getElementById('confirm-password-error').textContent = 'パスワードが一致しません';
        isValid = false;
      }
      
      if (!isValid) return;
      
      // 登録ボタンを無効化
      const registerButton = document.getElementById('register-button');
      registerButton.disabled = true;
      registerButton.textContent = '登録中...';
      
      try {
        // 登録リクエスト
        await this.authService.register({ username, email, password });
        
        // 成功メッセージ
        this.toast.success('アカウントが登録されました');
        
        // ダッシュボードへリダイレクト
        this.router.navigate('/dashboard');
      } catch (error) {
        // エラーメッセージ
        if (error.status === 409) {
          if (error.data && error.data.field === 'email') {
            document.getElementById('email-error').textContent = 'このメールアドレスは既に使用されています';
          } else if (error.data && error.data.field === 'username') {
            document.getElementById('username-error').textContent = 'このユーザー名は既に使用されています';
          } else {
            this.toast.error('このメールアドレスまたはユーザー名は既に使用されています');
          }
        } else {
          this.toast.error('登録中にエラーが発生しました');
          console.error('登録エラー:', error);
        }
      } finally {
        // 登録ボタンを再有効化
        registerButton.disabled = false;
        registerButton.textContent = '登録';
      }
    });
  }
  
  // メールアドレスのバリデーション
  _validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}
