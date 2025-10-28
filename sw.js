// 更新：快取版本 v2
const CACHE_NAME = 'english-helper-v2';

// 更新：加入新的圖示路徑
const FILES_TO_CACHE = [
  'index.html',
  'favicon.ico',
  'icon/icon-192x192.png',
  'icon/icon-512x512.png',
  'https://cdn.tailwindcss.com'
];

/**
 * install 事件：在 Service Worker 安裝時觸發
 * 目的是快取所有核心檔案
 */
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Opening cache & caching all files');
        // addAll 會自動發出請求並將回應存入快取
        return cache.addAll(FILES_TO_CACHE);
      })
      .catch(err => {
        console.error('[ServiceWorker] Cache addAll failed:', err);
      })
  );
});

/**
 * fetch 事件：攔截所有網路請求
 * 採用 "Cache First" (快取優先) 策略
 */
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 如果快取中有對應的回應
        if (response) {
          console.log(`[ServiceWorker] Returning cached response for: ${event.request.url}`);
          return response;
        }

        // 如果快取中沒有，則從網路請求
        console.log(`[ServiceWorker] Fetching from network for: ${event.request.url}`);
        return fetch(event.request);
      })
      .catch(err => {
        console.error(`[ServiceWorker] Fetch event failed for: ${event.request.url}`, err);
      })
  );
});

/**
 * activate 事件：在 Service Worker 啟動時觸發
 * 目的是清除舊的快取，確保使用的是最新版本的快取
 */
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // 如果快取名稱不是目前的 CACHE_NAME，就刪除它
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});