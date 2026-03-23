const APP_BASE = '/twc-worship-pptx';
const CACHE_NAME = 'twc-worship-pptx-v2';
const urlsToCache = [
  `${APP_BASE}/`,
  `${APP_BASE}/index.html`,
  `${APP_BASE}/manifest.json`
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - prefer fresh HTML so new deploys pick up the latest bundle.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(event.request.url);
  const isAppRequest = requestUrl.pathname.startsWith(APP_BASE);
  const isNavigationRequest = event.request.mode === 'navigate';
  const isHtmlRequest = event.request.headers.get('accept')?.includes('text/html');

  if (isAppRequest && (isNavigationRequest || isHtmlRequest)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => caches.match(event.request).then((response) => response || caches.match(`${APP_BASE}/index.html`)))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});