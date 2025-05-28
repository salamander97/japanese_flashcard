// APIクライアント基本クラス

export class ApiClient {
  constructor() {
    this.baseUrl = '';
    this.authToken = null;
  }
  
  setBaseUrl(url) {
    this.baseUrl = url;
  }
  
  setAuthToken(token) {
    this.authToken = token;
  }
  
  clearAuthToken() {
    this.authToken = null;
  }
  
  // GETリクエスト
  async get(endpoint, params = {}) {
    const url = this._buildUrl(endpoint, params);
    const options = this._getRequestOptions('GET');
    
    return this._sendRequest(url, options);
  }
  
  // POSTリクエスト
  async post(endpoint, data = {}) {
    const url = this._buildUrl(endpoint);
    const options = this._getRequestOptions('POST', data);
    
    return this._sendRequest(url, options);
  }
  
  // PUTリクエスト
  async put(endpoint, data = {}) {
    const url = this._buildUrl(endpoint);
    const options = this._getRequestOptions('PUT', data);
    
    return this._sendRequest(url, options);
  }
  
  // DELETEリクエスト
  async delete(endpoint) {
    const url = this._buildUrl(endpoint);
    const options = this._getRequestOptions('DELETE');
    
    return this._sendRequest(url, options);
  }
  
  // URLの構築
  _buildUrl(endpoint, params = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    Object.keys(params).forEach(key => {
      url.searchParams.append(key, params[key]);
    });
    
    return url;
  }
  
  // リクエストオプションの取得
  _getRequestOptions(method, data = null) {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include'
    };
    
    // 認証トークンがある場合はヘッダーに追加
    if (this.authToken) {
      options.headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    
    // データがある場合はボディに追加
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    return options;
  }
  
  // リクエストの送信
  async _sendRequest(url, options) {
    try {
      const response = await fetch(url, options);
      
      // レスポンスのJSONを解析
      const data = await response.json();
      
      // エラーレスポンスの場合
      if (!response.ok) {
        const error = new Error(data.message || 'APIリクエストエラー');
        error.status = response.status;
        error.data = data;
        throw error;
      }
      
      return data;
    } catch (error) {
      // ネットワークエラーなど
      if (!error.status) {
        error.message = 'ネットワークエラー: サーバーに接続できません';
      }
      
      throw error;
    }
  }
}
