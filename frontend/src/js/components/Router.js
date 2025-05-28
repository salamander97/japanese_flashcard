// ルーターコンポーネント

export class Router {
  constructor() {
    this.routes = {};
    this.notFoundHandler = null;
    this.middlewares = {};
    
    // ブラウザの戻る/進むボタンのイベントハンドラ
    window.addEventListener('popstate', () => {
      this.handleRouteChange();
    });
  }
  
  // ルートの追加
  addRoute(path, handler, middleware = null) {
    this.routes[path] = handler;
    if (middleware) {
      this.middlewares[path] = middleware;
    }
  }
  
  // 404ハンドラの設定
  setNotFoundHandler(handler) {
    this.notFoundHandler = handler;
  }
  
  // ルーターの開始
  start() {
    this.handleRouteChange();
  }
  
  // ページ遷移
  navigate(path) {
    window.history.pushState(null, '', path);
    this.handleRouteChange();
  }
  
  // 現在のパスを取得
  getCurrentPath() {
    return window.location.pathname;
  }
  
  // ルート変更の処理
  handleRouteChange() {
    const path = this.getCurrentPath();
    const handler = this.routes[path];
    
    // コンテンツエリアをクリア
    const appElement = document.getElementById('app');
    
    // ナビゲーションバーとモバイルナビゲーションを保持
    const navbar = document.querySelector('.nav');
    const mobileNav = document.querySelector('.mobile-nav');
    
    // コンテンツのみをクリア
    if (navbar && mobileNav) {
      appElement.innerHTML = '';
      appElement.appendChild(navbar);
      appElement.appendChild(mobileNav);
    } else {
      appElement.innerHTML = '';
    }
    
    // アクティブなナビゲーションリンクを更新
    this.updateActiveNavLinks(path);
    
    // ハンドラが存在する場合
    if (handler) {
      // ミドルウェアがある場合は実行
      if (this.middlewares[path]) {
        this.middlewares[path](() => handler());
      } else {
        handler();
      }
    } 
    // 404ハンドラが設定されている場合
    else if (this.notFoundHandler) {
      this.notFoundHandler();
    } 
    // デフォルトの404ページ
    else {
      appElement.innerHTML = `
        <div class="container text-center mt-lg">
          <h1>404 - ページが見つかりません</h1>
          <p>お探しのページは存在しないか、移動した可能性があります。</p>
        </div>
      `;
    }
  }
  
  // アクティブなナビゲーションリンクを更新
  updateActiveNavLinks(currentPath) {
    // デスクトップナビゲーション
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
    
    // モバイルナビゲーション
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    mobileNavItems.forEach(item => {
      const href = item.getAttribute('href');
      if (href === currentPath) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
}
