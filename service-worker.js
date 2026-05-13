const CACHE_NAME = 'okmart-v1';
const urlsToCache = [
  '/',
  '/customer-view.html',
  '/manifest.json',
  '/css/khata.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
