const CACHE_NAME = 'pwa-cache-simple-v1';
const toCache = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

self.addEventListener('install', ev => {
  ev.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(toCache))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', ev => {
  ev.respondWith(
    caches.match(ev.request).then(resp => {
      return resp || fetch(ev.request).then(fetchResp => {
        return caches.open(CACHE_NAME).then(cache => {
          try { cache.put(ev.request, fetchResp.clone()); } catch(e) {}
          return fetchResp;
        });
      }).catch(() => caches.match('./'));
    })
  );
});

self.addEventListener('activate', ev => {
  ev.waitUntil(self.clients.claim());
});
