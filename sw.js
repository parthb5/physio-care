/* Vanshika's Physio Care — Service Worker
   Bump APP_VERSION any time you push an update.
   The next time the app is opened, it will auto-refresh to the new version. */

const APP_VERSION = 'v1.2.0';
const CACHE_NAME  = 'physio-care-' + APP_VERSION;
const FILES = ['/', '/index.html', '/manifest.json'];

/* Install — cache all files */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES))
      .then(() => self.skipWaiting())
  );
});

/* Activate — delete old caches from previous versions */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

/* Fetch — serve from cache, fall back to network */
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

/* When a new version is detected, notify the app to reload */
self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});
