// OK Mart Khata service worker (2026-11-13)
// Cache-first for the same-origin app shell + the logo. Everything else
// (Firebase, CDNs) passes through to the network untouched.
// Relative URLs so the app works on root hosts AND subpaths (GitHub Pages project site).
const CACHE_NAME = 'okmart-khata-v1';
const LOGO_URL = 'https://blogger.googleusercontent.com/img/a/AVvXsEjfBhFUQu97TtoyBqkTmnXHAX0wwrVBZTDnD5NXtYp0ZLrcZsEwqzFAnrAVyGNd0lA7V_fptO0i2d0OjZROR4_44XeVBUCynuddGzAZohimGJkrrZjw1ZWoqOh0aJdUPDROPqOW0Ir5cIL5q0e4mPC5Q-sFAPUDE1xZAKYk6IrrLjZgFZgHAr8FfZSR=rw';
const urlsToCache = [
  './',
  'index.html',
  'customers.html',
  'customer-detail.html',
  'group-khata.html',
  'expenses.html',
  'profit-loss.html',
  'reports.html',
  'loyalty-points.html',
  'bulk-reminder.html',
  'settings.html',
  'login.html',
  'manifest.json',
  'css/khata.css',
  'js/firebase.js',
  'assets/images/okmart-logo.png',
  LOGO_URL
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      // Cache each URL on its own, so one failed fetch (e.g. the
      // cross-origin logo) does not fail the whole install.
      Promise.all(urlsToCache.map(url =>
        cache.add(url).catch(err => console.warn('SW: failed to cache', url, err))
      ))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const sameOrigin = url.origin === self.location.origin;
  const isLogo = event.request.url === LOGO_URL;
  if (!sameOrigin && !isLogo) return; // Firebase / CDN traffic: network only
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
