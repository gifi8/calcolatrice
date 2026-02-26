const CACHE_NAME = 'calc-fin-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png',
  '/calcolatrice_6_49.html',
  '/calcolatrice_6_99.html',
  '/calcolatrice_7_49.html',
  '/calcolatrice_7_99.html',
  '/calcolatrice_8_49.html',
  '/calcolatrice_8_99.html',
  '/calcolatrice_9_49.html',
  '/calcolatrice_9_99.html'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      if (res && res.status === 200) {
        caches.open(CACHE_NAME).then(c => c.put(e.request, res.clone()));
      }
      return res;
    })).catch(() => e.request.destination === 'document' ? caches.match('/index.html') : undefined)
  );
});
