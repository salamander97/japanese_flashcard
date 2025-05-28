// Service Worker
const CACHE_NAME = 'japanese-flashcard-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/main.css',
  '/js/app.js',
  '/js/components/Router.js',
  '/js/components/Navbar.js',
  '/js/components/Toast.js',
  '/js/services/authService.js',
  '/js/api/api.js',
  '/js/api/auth.js',
  '/js/api/characters.js',
  '/js/api/progress.js',
  '/js/api/gamification.js',
  '/js/pages/Login.js',
  '/js/pages/Register.js',
  '/js/pages/Dashboard.js',
  '/js/pages/Study.js',
  '/js/pages/Quiz.js',
  '/js/pages/Review.js',
  '/js/pages/Profile.js',
  '/assets/fonts/NotoSansJP-Regular.woff2',
  '/assets/fonts/NotoSansJP-Bold.woff2',
  '/assets/fonts/Inter-Regular.woff2',
  '/assets/fonts/Inter-Bold.woff2',
  '/manifest.json'
];

// Service Workerのインストール
self.addEventListener('install', (event) => {
  console.log('Service Worker: インストール中');
  
  // キャッシュの事前読み込み
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: 静的アセットをキャッシュ中');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        // 即座にアクティベーション
        return self.skipWaiting();
      })
  );
});

// Service Workerのアクティベーション
self.addEventListener('activate', (event) => {
  console.log('Service Worker: アクティベート中');
  
  // 古いキャッシュの削除
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: 古いキャッシュを削除中', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // 新しいService Workerがすぐに制御を開始
      return self.clients.claim();
    })
  );
});

// フェッチイベントの処理
self.addEventListener('fetch', (event) => {
  // APIリクエストの場合
  if (event.request.url.includes('/api/')) {
    // ネットワークファースト戦略
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // レスポンスのクローンを作成
          const responseClone = response.clone();
          
          // キャッシュに保存
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          
          return response;
        })
        .catch(() => {
          // オフライン時はキャッシュから取得
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // オフラインフォールバック
            return caches.match('/offline.html');
          });
        })
    );
  } else {
    // 静的アセットの場合はキャッシュファースト戦略
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // キャッシュになければネットワークから取得
        return fetch(event.request).then((response) => {
          // 有効なレスポンスのみキャッシュ
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // レスポンスのクローンを作成
          const responseClone = response.clone();
          
          // キャッシュに保存
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          
          return response;
        }).catch(() => {
          // オフラインフォールバック（画像やフォントなど）
          if (event.request.destination === 'image' || 
              event.request.destination === 'font') {
            return new Response();
          }
          
          return caches.match('/offline.html');
        });
      })
    );
  }
});

// プッシュ通知の処理
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const notification = event.data.json();
  const title = notification.title || '日本語フラッシュカード';
  const options = {
    body: notification.body || '新しい通知があります',
    icon: notification.icon || '/assets/icons/icon-192x192.png',
    badge: notification.badge || '/assets/icons/badge-72x72.png',
    data: notification.data || {},
    actions: notification.actions || []
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// 通知クリックの処理
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const urlToOpen = event.notification.data.url || '/';
  
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clientList) => {
      // 既に開いているウィンドウがあれば、そこにフォーカス
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      
      // なければ新しいウィンドウを開く
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// バックグラウンド同期
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-progress') {
    event.waitUntil(syncProgress());
  }
});

// 進捗データの同期
async function syncProgress() {
  try {
    const db = await openDB();
    const offlineProgress = await db.getAll('offlineProgress');
    
    if (offlineProgress.length === 0) {
      return;
    }
    
    // オフラインデータをサーバーに送信
    const responses = await Promise.all(
      offlineProgress.map(async (progress) => {
        try {
          const response = await fetch('/api/progress/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${progress.token}`
            },
            body: JSON.stringify({
              characterId: progress.characterId,
              isCorrect: progress.isCorrect
            })
          });
          
          if (response.ok) {
            // 成功したらデータを削除
            await db.delete('offlineProgress', progress.id);
            return { success: true, id: progress.id };
          }
          
          return { success: false, id: progress.id };
        } catch (error) {
          return { success: false, id: progress.id, error };
        }
      })
    );
    
    // 結果を通知
    const successCount = responses.filter(r => r.success).length;
    if (successCount > 0) {
      self.registration.showNotification('同期完了', {
        body: `${successCount}件の学習データが同期されました`,
        icon: '/assets/icons/icon-192x192.png'
      });
    }
  } catch (error) {
    console.error('同期エラー:', error);
  }
}

// IndexedDBの初期化
async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('japaneseFlashcardDB', 1);
    
    request.onerror = (event) => {
      reject('データベースエラー: ' + event.target.errorCode);
    };
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // オフライン進捗データ用のオブジェクトストア
      if (!db.objectStoreNames.contains('offlineProgress')) {
        const store = db.createObjectStore('offlineProgress', { keyPath: 'id', autoIncrement: true });
        store.createIndex('characterId', 'characterId', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
      
      // キャッシュされた文字データ用のオブジェクトストア
      if (!db.objectStoreNames.contains('characters')) {
        const store = db.createObjectStore('characters', { keyPath: 'id' });
        store.createIndex('type', 'type', { unique: false });
      }
    };
  });
}
