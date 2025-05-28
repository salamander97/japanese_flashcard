// 文字API

export class CharactersApi {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.endpoint = '/characters';
  }
  
  // すべての文字を取得
  async getAllCharacters() {
    return this.apiClient.get(this.endpoint);
  }
  
  // ひらがなのみを取得
  async getHiragana() {
    return this.apiClient.get(`${this.endpoint}/hiragana`);
  }
  
  // カタカナのみを取得
  async getKatakana() {
    return this.apiClient.get(`${this.endpoint}/katakana`);
  }
  
  // 特定の文字の詳細を取得
  async getCharacterById(id) {
    return this.apiClient.get(`${this.endpoint}/${id}`);
  }
  
  // 文字をグループ別に取得
  async getCharactersByGroup() {
    return this.apiClient.get(`${this.endpoint}/groups/all`);
  }
}
