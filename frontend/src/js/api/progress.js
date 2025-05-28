// 進捗API

export class ProgressApi {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.endpoint = '/progress';
  }
  
  // ユーザーの全進捗を取得
  async getAllProgress() {
    return this.apiClient.get(this.endpoint);
  }
  
  // 未学習の文字を取得
  async getNotLearned(type = 'all') {
    return this.apiClient.get(`${this.endpoint}/not-learned`, { type });
  }
  
  // 復習が必要な文字を取得
  async getReviewDue() {
    return this.apiClient.get(`${this.endpoint}/review-due`);
  }
  
  // 学習進捗を更新
  async updateProgress(characterId, isCorrect) {
    return this.apiClient.post(`${this.endpoint}/update`, {
      characterId,
      isCorrect
    });
  }
  
  // 学習統計を取得
  async getStats() {
    return this.apiClient.get(`${this.endpoint}/stats`);
  }
}
