// ゲーミフィケーションAPI

export class GamificationApi {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.endpoint = '/gamification';
  }
  
  // 達成可能な実績一覧を取得
  async getAchievements() {
    return this.apiClient.get(`${this.endpoint}/achievements`);
  }
  
  // ユーザーの獲得済み実績を取得
  async getUserAchievements() {
    return this.apiClient.get(`${this.endpoint}/user-achievements`);
  }
  
  // レベルシステム情報を取得
  async getLevels() {
    return this.apiClient.get(`${this.endpoint}/levels`);
  }
  
  // ユーザーのレベル情報を取得
  async getUserLevel() {
    return this.apiClient.get(`${this.endpoint}/user-level`);
  }
  
  // ユーザーの連続学習日数を取得
  async getStreak() {
    return this.apiClient.get(`${this.endpoint}/streak`);
  }
  
  // 経験値を追加
  async addExp(amount, reason = '') {
    return this.apiClient.post(`${this.endpoint}/add-exp`, {
      amount,
      reason
    });
  }
}
