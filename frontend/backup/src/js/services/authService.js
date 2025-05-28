// 認証サービス

export class AuthService {
  constructor(authApi) {
    this.authApi = authApi;
    this.storageService = new StorageService();
    this.currentUser = null;
    this._loadUserFromStorage();
  }
  
  // ユーザー登録
  async register(userData) {
    try {
      const response = await this.authApi.register(userData);
      this._handleAuthResponse(response);
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  // ログイン
  async login(credentials) {
    try {
      const response = await this.authApi.login(credentials);
      this._handleAuthResponse(response);
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  // ログアウト
  async logout() {
    try {
      // APIログアウト（トークン無効化）
      await this.authApi.logout();
    } catch (error) {
      console.error('ログアウトエラー:', error);
    } finally {
      // ローカルストレージをクリア
      this.storageService.removeItem('token');
      this.storageService.removeItem('refreshToken');
      this.storageService.removeItem('user');
      this.currentUser = null;
    }
  }
  
  // ユーザープロフィール取得
  async getProfile() {
    try {
      const response = await this.authApi.getProfile();
      this.currentUser = response.user;
      this.storageService.setItem('user', JSON.stringify(this.currentUser));
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  // 認証状態の確認
  isAuthenticated() {
    return !!this.storageService.getItem('token');
  }
  
  // 現在のユーザー情報を取得
  getCurrentUser() {
    return this.currentUser;
  }
  
  // 認証レスポンスの処理
  _handleAuthResponse(response) {
    if (response.token) {
      this.storageService.setItem('token', response.token);
      
      if (response.refreshToken) {
        this.storageService.setItem('refreshToken', response.refreshToken);
      }
      
      if (response.user) {
        this.currentUser = response.user;
        this.storageService.setItem('user', JSON.stringify(this.currentUser));
      }
    }
  }
  
  // ストレージからユーザー情報を読み込み
  _loadUserFromStorage() {
    const userJson = this.storageService.getItem('user');
    if (userJson) {
      try {
        this.currentUser = JSON.parse(userJson);
      } catch (error) {
        console.error('ユーザー情報の解析エラー:', error);
        this.storageService.removeItem('user');
      }
    }
  }
}

// ストレージサービス
export class StorageService {
  constructor() {
    this.storage = window.localStorage;
  }
  
  // アイテムを取得
  getItem(key) {
    return this.storage.getItem(key);
  }
  
  // アイテムを設定
  setItem(key, value) {
    this.storage.setItem(key, value);
  }
  
  // アイテムを削除
  removeItem(key) {
    this.storage.removeItem(key);
  }
  
  // ストレージをクリア
  clear() {
    this.storage.clear();
  }
}
