const CACHE_NAME = 'english-helper-v2';


const FILES_TO_CACHE = [
  'index.html',
  'favicon.ico',
  'icon/icon-192x192.png',
  'icon/icon-512x512.png',
  'https://cdn.tailwindcss.com'
];


self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Opening cache & caching all files');
        return cache.addAll(FILES_TO_CACHE);
      })
      .catch(err => {
        console.error('[ServiceWorker] Cache addAll failed:', err);
      })
  );
});


self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          console.log(`[ServiceWorker] Returning cached response for: ${event.request.url}`);
          return response;
        }

        console.log(`[ServiceWorker] Fetching from network for: ${event.request.url}`);
        return fetch(event.request);
      })
      .catch(err => {
        console.error(`[ServiceWorker] Fetch event failed for: ${event.request.url}`, err);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});