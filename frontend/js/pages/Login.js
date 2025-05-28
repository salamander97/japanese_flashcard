// ログインページ

export class LoginPage {
  constructor(authService, toast, router) {
    this.authService = authService;
    this.toast = toast;
    this.router = router;
  }

  render() {
    const appElement = document.getElementById('app');

    // ログインフォームのHTML
    const loginHTML = `
      <div class="container">
        <div class="card mt-lg" style="max-width: 500px; margin: 2rem auto;">
          <h1 class="text-center">ログイン</h1>
          
          <form id="login-form" class="mt-md">
            <div class="form-group">
              <label for="email" class="form-label">メールアドレス</label>
              <input type="email" id="email" class="form-input" placeholder="example@example.com" required>
              <div class="form-error" id="email-error"></div>
            </div>
            
            <div class="form-group">
              <label for="password" class="form-label">パスワード</label>
              <input type="password" id="password" class="form-input" placeholder="パスワード" required>
              <div class="form-error" id="password-error"></div>
            </div>
            
            <button type="submit" class="btn btn-primary w-100 mt-md" id="login-button">
              ログイン
            </button>
            
            <div class="text-center mt-md">
              <p>アカウントをお持ちでない方は <a href="/register" id="register-link">登録</a> してください</p>
            </div>
          </form>
        </div>
      </div>
    `;

    // コンテンツエリアにログインフォームを追加
    const contentArea = document.createElement('div');
    contentArea.innerHTML = loginHTML;
    appElement.appendChild(contentArea);

    // イベントリスナーを追加
    this._addEventListeners();
  }

  _addEventListeners() {
    // 登録リンク
    const registerLink = document.getElementById('register-link');
    registerLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.router.navigate('/register');
    });

    // ログインフォーム
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('🔐 Login form submitted');
      console.log('🔌 AuthService:', this.authService);
      console.log('🔌 AuthAPI:', this.authService.authApi);
      console.log('🔌 API Client:', this.authService.authApi.apiClient);
      console.log('🔌 Base URL:', this.authService.authApi.apiClient.baseUrl);
      // フォームデータの取得
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      // エラーメッセージをクリア
      document.getElementById('email-error').textContent = '';
      document.getElementById('password-error').textContent = '';

      // バリデーション
      let isValid = true;

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
      }

      if (!isValid) return;

      // ログインボタンを無効化
      const loginButton = document.getElementById('login-button');
      loginButton.disabled = true;
      loginButton.textContent = 'ログイン中...';

      try {
        // ログインリクエスト
        await this.authService.login({ email, password });

        // 成功メッセージ
        this.toast.success('ログインしました');

        // ダッシュボードへリダイレクト
        this.router.navigate('/dashboard');
      } catch (error) {
        // エラーメッセージ
        if (error.status === 401) {
          this.toast.error('メールアドレスまたはパスワードが正しくありません');
        } else {
          this.toast.error('ログイン中にエラーが発生しました');
          console.error('ログインエラー:', error);
        }
      } finally {
        // ログインボタンを再有効化
        loginButton.disabled = false;
        loginButton.textContent = 'ログイン';
      }
    });
  }

  // メールアドレスのバリデーション
  _validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}
