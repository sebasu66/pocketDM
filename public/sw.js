// Define a unique cache name for this version of the PWA.
// It's a good practice to include a version number to manage caches across updates.
const CACHE_NAME = 'pocket-dm-cache-v1';

// List of assets to cache on installation.
const urlsToCache = [
  '/',
  '/dashboard',
  '/manifest.json',
  '/favicon.ico',
  // Add other important assets here, like core JS/CSS bundles if they have static names.
  // Note: Next.js often generates dynamic names, so we'll cache them on the fly.
];

// Event: install
// This event is fired when the service worker is first installed.
self.addEventListener('install', (event) => {
  // waitUntil() ensures that the service worker will not install until the code inside has successfully completed.
  event.waitUntil(
    // Open the cache.
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Add all the specified assets to the cache.
        return cache.addAll(urlsToCache);
      })
  );
});

// Event: activate
// This event is fired when the service worker is activated. It's a good place to clean up old caches.
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // If the cache name is not in our whitelist, delete it.
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Event: fetch
// This event is fired for every request the PWA makes.
self.addEventListener('fetch', (event) => {
  // We only want to handle GET requests.
  if (event.request.method !== 'GET') {
    return;
  }

  // Use the "Stale-While-Revalidate" strategy.
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      // 1. Respond from the cache immediately if available.
      return cache.match(event.request).then((cachedResponse) => {
        // 2. In the background, fetch a fresh version from the network.
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // If the fetch is successful, update the cache with the new version.
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });

        // Return the cached response if it exists, otherwise wait for the network response.
        return cachedResponse || fetchPromise;
      });
    })
  );
});


// --- PUSH NOTIFICATION EVENTS ---

// Event: push
// This event is fired when a push notification is received from the server.
self.addEventListener('push', (event) => {
  // Default data for the notification if none is provided in the push event.
  let data = { title: 'New Update', body: 'Something new happened!' };
  
  // Try to parse the data from the push event.
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      console.error('Push event data is not valid JSON.', e);
    }
  }

  const options = {
    body: data.body,
    icon: '/icon-192x192.png', // Default icon for notifications
    badge: '/icon-96x96.png',   // Icon for the notification tray
  };

  // Show the notification.
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Event: notificationclick
// This event is fired when a user clicks on a notification.
self.addEventListener('notificationclick', (event) => {
  // Close the notification.
  event.notification.close();

  // Focus or open the application window.
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientsArr) => {
      // If a window is already open, focus it.
      const hadWindowToFocus = clientsArr.some((windowClient) =>
        windowClient.url === self.location.origin + '/' ? (windowClient.focus(), true) : false
      );

      // Otherwise, open a new window.
      if (!hadWindowToFocus) {
        clients.openWindow(self.location.origin).then((windowClient) => (windowClient ? windowClient.focus() : null));
      }
    })
  );
});
