'use strict';

const CACHE_NAME = 'lore-weaver-cache-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  '/dashboard/playerview',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});


self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request);
        })
    );
  }
});

self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : { title: 'New Lore!', body: 'A new chapter unfolds.', icon: '/icons/icon-192x192.png' };
    const title = data.title || 'New Lore!';
    const options = {
        body: data.body || 'A new chapter unfolds.',
        icon: data.icon || '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png'
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});
