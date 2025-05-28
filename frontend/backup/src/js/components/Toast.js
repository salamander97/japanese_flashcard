// トースト通知コンポーネント

export class Toast {
  constructor() {
    this.container = null;
    this.timeout = null;
    this._createContainer();
  }
  
  // トースト通知を表示
  show(message, type = 'success', duration = 3000) {
    // 既存のタイムアウトをクリア
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    
    // トースト要素を作成
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // トーストの内容
    toast.innerHTML = `
      <div class="toast-icon">${type === 'success' ? '✓' : '✕'}</div>
      <div class="toast-message">${message}</div>
      <button class="toast-close" aria-label="閉じる">×</button>
    `;
    
    // コンテナに追加
    this.container.appendChild(toast);
    
    // 閉じるボタンのイベントリスナー
    const closeButton = toast.querySelector('.toast-close');
    closeButton.addEventListener('click', () => {
      this._removeToast(toast);
    });
    
    // 自動的に消える
    this.timeout = setTimeout(() => {
      this._removeToast(toast);
    }, duration);
    
    return toast;
  }
  
  // 成功トースト
  success(message, duration = 3000) {
    return this.show(message, 'success', duration);
  }
  
  // エラートースト
  error(message, duration = 4000) {
    return this.show(message, 'error', duration);
  }
  
  // トーストコンテナを作成
  _createContainer() {
    // 既存のコンテナを確認
    let container = document.querySelector('.toast-container');
    
    // コンテナが存在しない場合は作成
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    
    this.container = container;
  }
  
  // トーストを削除
  _removeToast(toast) {
    // フェードアウトアニメーション
    toast.style.opacity = '0';
    
    // アニメーション後に要素を削除
    setTimeout(() => {
      if (toast.parentNode === this.container) {
        this.container.removeChild(toast);
      }
    }, 300);
  }
}
