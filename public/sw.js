// Basic service worker for PWA functionality

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  // Skip waiting to activate the new service worker immediately.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  // Take control of all clients as soon as the service worker activates.
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // For now, just pass through fetch requests.
  // Caching strategies would be added here for offline support.
  event.respondWith(fetch(event.request));
});

// Listener for push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push Received.');
  const pushData = event.data.json();

  const title = pushData.title || 'Lore Weaver';
  const options = {
    body: pushData.body || 'A new chapter in your story awaits.',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Listener for notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked.');
  event.notification.close();

  // This example focuses the browser tab of the app, or opens a new one if not available.
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        return client.focus();
      }
      return clients.openWindow('/');
    })
  );
});
