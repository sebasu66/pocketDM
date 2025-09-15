// public/sw.js

const CACHE_NAME = 'lore-weaver-cache-v2';
const urlsToCache = [
  '/',
  '/manifest.json'
  // Icons are often cached automatically by the browser when referenced in the manifest.
  // No need to explicitly cache them unless issues arise.
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching basic assets');
        const cachePromises = urlsToCache.map(urlToCache => {
            return cache.add(new Request(urlToCache, {cache: 'reload'})).catch(err => {
                console.warn(`Failed to cache ${urlToCache}:`, err);
            });
        });
        return Promise.all(cachePromises);
      })
  );
});

self.addEventListener('activate', event => {
  const currentCaches = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    })
  );
});


self.addEventListener('fetch', event => {
  // We only want to handle navigation requests for offline support
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        // If the fetch fails, serve the offline page from the cache.
        const cachedResponse = await cache.match('/');
        return cachedResponse;
      })
    );
  }
});
