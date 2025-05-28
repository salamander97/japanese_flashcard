// ナビゲーションバーコンポーネント

export class Navbar {
  constructor(authService, router) {
    this.authService = authService;
    this.router = router;
    this.isAuthenticated = this.authService.isAuthenticated();
  }
  
  render() {
    const appElement = document.getElementById('app');
    
    // ナビゲーションバーのHTML
    const navbarHTML = `
      <nav class="nav">
        <div class="nav-logo">日本語フラッシュカード</div>
        <div class="nav-links">
          ${this.isAuthenticated ? this._getAuthenticatedLinks() : this._getUnauthenticatedLinks()}
        </div>
      </nav>
      
      ${this.isAuthenticated ? this._getMobileNavigation() : ''}
    `;
    
    // ナビゲーションバーを追加
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = navbarHTML;
    
    // 既存のナビゲーションバーを削除
    const existingNav = appElement.querySelector('.nav');
    if (existingNav) {
      existingNav.remove();
    }
    
    // 既存のモバイルナビゲーションを削除
    const existingMobileNav = appElement.querySelector('.mobile-nav');
    if (existingMobileNav) {
      existingMobileNav.remove();
    }
    
    // 新しいナビゲーションバーを追加
    while (tempDiv.firstChild) {
      appElement.appendChild(tempDiv.firstChild);
    }
    
    // イベントリスナーを追加
    this._addEventListeners();
  }
  
  // 認証済みユーザー向けのリンク
  _getAuthenticatedLinks() {
    return `
      <a href="/dashboard" class="nav-link">ダッシュボード</a>
      <a href="/study" class="nav-link">学習</a>
      <a href="/quiz" class="nav-link">クイズ</a>
      <a href="/review" class="nav-link">復習</a>
      <a href="/profile" class="nav-link">プロフィール</a>
      <a href="#" class="nav-link" id="logout-link">ログアウト</a>
    `;
  }
  
  // 未認証ユーザー向けのリンク
  _getUnauthenticatedLinks() {
    return `
      <a href="/login" class="nav-link">ログイン</a>
      <a href="/register" class="nav-link">登録</a>
    `;
  }
  
  // モバイルナビゲーション
  _getMobileNavigation() {
    return `
      <div class="mobile-nav">
        <a href="/dashboard" class="mobile-nav-item">
          <span class="mobile-nav-icon">📊</span>
          <span>ホーム</span>
        </a>
        <a href="/study" class="mobile-nav-item">
          <span class="mobile-nav-icon">📝</span>
          <span>学習</span>
        </a>
        <a href="/quiz" class="mobile-nav-item">
          <span class="mobile-nav-icon">🎮</span>
          <span>クイズ</span>
        </a>
        <a href="/review" class="mobile-nav-item">
          <span class="mobile-nav-icon">🔄</span>
          <span>復習</span>
        </a>
        <a href="/profile" class="mobile-nav-item">
          <span class="mobile-nav-icon">👤</span>
          <span>プロフィール</span>
        </a>
      </div>
    `;
  }
  
  // イベントリスナーの追加
  _addEventListeners() {
    // ログアウトリンク
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        
        // カスタムイベントを発行
        const logoutEvent = new Event('logout');
        document.dispatchEvent(logoutEvent);
      });
    }
    
    // ナビゲーションリンク
    const navLinks = document.querySelectorAll('.nav-link:not(#logout-link)');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        this.router.navigate(href);
      });
    });
    
    // モバイルナビゲーションリンク
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    mobileNavItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const href = item.getAttribute('href');
        this.router.navigate(href);
      });
    });
  }
}
