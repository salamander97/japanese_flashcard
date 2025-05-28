// Frontend Main Application
import { Router } from './components/Router.js';
import { Navbar } from './components/Navbar.js';
import { Toast } from './components/Toast.js';
import { ApiClient } from './api/api.js';
import { AuthApi } from './api/auth.js';
import { CharactersApi } from './api/characters.js';
import { ProgressApi } from './api/progress.js';
import { GamificationApi } from './api/gamification.js';
import { AuthService } from './services/authService.js';

// Pages
import { LoginPage } from './pages/Login.js';
import { RegisterPage } from './pages/Register.js';
import { DashboardPage } from './pages/Dashboard.js';
import { StudyPage } from './pages/Study.js';
import { QuizPage } from './pages/Quiz.js';
import { ReviewPage } from './pages/Review.js';
import { ProfilePage } from './pages/Profile.js';

class App {
  constructor() {
    this.apiClient = new ApiClient();
    this.router = new Router();
    this.toast = new Toast();
    this.navbar = null;
    this.currentPage = null;
    
    // Set API base URL
    this.apiClient.setBaseUrl('/api');
    
    // Initialize API clients
    this.authApi = new AuthApi(this.apiClient);
    this.charactersApi = new CharactersApi(this.apiClient);
    this.progressApi = new ProgressApi(this.apiClient);
    this.gamificationApi = new GamificationApi(this.apiClient);
    
    // Initialize services
    this.authService = new AuthService(this.authApi);
    
    // Initialize pages
    this.pages = {
      login: new LoginPage(this.authService, this.toast, this.router),
      register: new RegisterPage(this.authService, this.toast, this.router),
      dashboard: new DashboardPage(this.charactersApi, this.progressApi, this.gamificationApi, this.toast, this.router),
      study: new StudyPage(this.charactersApi, this.progressApi, this.gamificationApi, this.toast, this.router),
      quiz: new QuizPage(this.charactersApi, this.progressApi, this.gamificationApi, this.toast, this.router),
      review: new ReviewPage(this.charactersApi, this.progressApi, this.gamificationApi, this.toast, this.router),
      profile: new ProfilePage(this.authService, this.gamificationApi, this.toast, this.router)
    };
    
    this.init();
  }
  
  async init() {
    try {
      // Setup authentication token if exists
      this.setupAuthToken();
      
      // Setup router
      this.setupRouter();
      
      // Setup global event listeners
      this.setupEventListeners();
      
      // Start the application
      this.router.start();
      
      console.log('🚀 Japanese Flashcard App initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize app:', error);
      this.toast.error('アプリの初期化に失敗しました');
    }
  }
  
  setupAuthToken() {
    const token = localStorage.getItem('token');
    if (token) {
      this.apiClient.setAuthToken(token);
    }
  }
  
  setupRouter() {
    // Public routes
    this.router.addRoute('/', () => this.handleHome());
    this.router.addRoute('/login', () => this.renderPage('login'));
    this.router.addRoute('/register', () => this.renderPage('register'));
    
    // Protected routes
    this.router.addRoute('/dashboard', () => this.renderPage('dashboard'), this.authMiddleware.bind(this));
    this.router.addRoute('/study', () => this.renderPage('study'), this.authMiddleware.bind(this));
    this.router.addRoute('/quiz', () => this.renderPage('quiz'), this.authMiddleware.bind(this));
    this.router.addRoute('/review', () => this.renderPage('review'), this.authMiddleware.bind(this));
    this.router.addRoute('/profile', () => this.renderPage('profile'), this.authMiddleware.bind(this));
    
    // 404 handler
    this.router.setNotFoundHandler(() => this.handle404());
  }
  
  setupEventListeners() {
    // Global logout event
    document.addEventListener('logout', async () => {
      await this.handleLogout();
    });
    
    // Global error handler
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      this.toast.error('予期しない error が発生しました');
    });
    
    // Handle online/offline status
    window.addEventListener('online', () => {
      this.toast.success('オンラインに復帰しました');
      this.syncOfflineData();
    });
    
    window.addEventListener('offline', () => {
      this.toast.error('オフラインモードです');
    });
    
    // Handle token expiration
    this.apiClient.onTokenExpired = () => {
      this.handleTokenExpired();
    };
  }
  
  // Authentication middleware
  authMiddleware(next) {
    if (this.authService.isAuthenticated()) {
      // Set auth token for API calls
      const token = localStorage.getItem('token');
      this.apiClient.setAuthToken(token);
      next();
    } else {
      // Redirect to login
      this.router.navigate('/login');
      this.toast.error('ログインが必要です');
    }
  }
  
  // Route handlers
  handleHome() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate('/dashboard');
    } else {
      this.router.navigate('/login');
    }
  }
  
  async renderPage(pageName) {
    try {
      // Clear current page
      if (this.currentPage && this.currentPage.cleanup) {
        this.currentPage.cleanup();
      }
      
      // Clear app content
      const appElement = document.getElementById('app');
      appElement.innerHTML = '';
      
      // Render navbar for authenticated pages
      if (this.authService.isAuthenticated() && pageName !== 'login' && pageName !== 'register') {
        this.navbar = new Navbar(this.authService, this.router);
        this.navbar.render();
      }
      
      // Render page
      const page = this.pages[pageName];
      if (page) {
        this.currentPage = page;
        await page.render();
      } else {
        throw new Error(`Page not found: ${pageName}`);
      }
    } catch (error) {
      console.error(`Error rendering page ${pageName}:`, error);
      this.toast.error('ページの読み込みに失敗しました');
    }
  }
  
  handle404() {
    const appElement = document.getElementById('app');
    appElement.innerHTML = `
      <div class="container mt-lg text-center">
        <div class="card">
          <h1>404 - ページが見つかりません</h1>
          <p>お探しのページは存在しないか、移動した可能性があります。</p>
          <div class="flex justify-center gap-md mt-md">
            <a href="/dashboard" class="btn btn-primary">ダッシュボード</a>
            <a href="/login" class="btn btn-secondary">ログイン</a>
          </div>
        </div>
      </div>
    `;
  }
  
  async handleLogout() {
    try {
      // Clear current page
      if (this.currentPage && this.currentPage.cleanup) {
        this.currentPage.cleanup();
      }
      
      // Logout from service
      await this.authService.logout();
      
      // Clear API token
      this.apiClient.clearAuthToken();
      
      // Redirect to login
      this.router.navigate('/login');
      this.toast.success('ログアウトしました');
    } catch (error) {
      console.error('Logout error:', error);
      this.toast.error('ログアウト中にエラーが発生しました');
    }
  }
  
  handleTokenExpired() {
    // Clear authentication
    this.authService.logout();
    this.apiClient.clearAuthToken();
    
    // Redirect to login
    this.router.navigate('/login');
    this.toast.error('セッションの有効期限が切れました。再度ログインしてください。');
  }
  
  async syncOfflineData() {
    // Sync offline data when coming back online
    try {
      // This would sync any offline progress data
      console.log('Syncing offline data...');
      
      // Check for offline progress data in localStorage
      const offlineData = localStorage.getItem('offlineProgress');
      if (offlineData) {
        const progressData = JSON.parse(offlineData);
        
        // Sync each progress update
        for (const progress of progressData) {
          try {
            await this.progressApi.updateProgress(progress.characterId, progress.isCorrect);
          } catch (error) {
            console.error('Failed to sync progress:', error);
          }
        }
        
        // Clear offline data after successful sync
        localStorage.removeItem('offlineProgress');
        this.toast.success('オフラインデータを同期しました');
      }
    } catch (error) {
      console.error('Failed to sync offline data:', error);
    }
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});

// Export for global access
export default App;