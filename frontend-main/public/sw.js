// Service Worker for aggressive caching of static assets
const CACHE_VERSION = 'v5';
const CACHE_NAME = `drip-drop-${CACHE_VERSION}`;

// Assets to cache immediately
const PRECACHE_ASSETS = [
  '/',
  '/shop',
  '/favicon.ico',
];

// Cache durations (in milliseconds)
const CACHE_DURATIONS = {
  images: 365 * 24 * 60 * 60 * 1000, // 1 year
  static: 365 * 24 * 60 * 60 * 1000, // 1 year
  api: 5 * 60 * 1000, // 5 minutes
  html: 5 * 60 * 1000, // 5 minutes
};

// Install event - precache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        // Log and skip missing assets
        console.warn('Service Worker: Failed to precache some assets', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('drip-drop-') && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Listen for skip waiting message from client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }

  // Only handle http(s) requests. Some browsers/extensions generate requests like
  // chrome-extension://... which cannot be cached and can break navigation.
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip Next.js data requests to avoid stale SSR props
  if (url.pathname.startsWith('/_next/data')) {
    return;
  }

  // Skip admin pages and authentication
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api/auth')) {
    return;
  }

  // Skip caching for authenticated API requests (admin/user data should be fresh)
  if (url.pathname.startsWith('/api/') && request.headers.get('authorization')) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(request);
      const isHtml =
        request.mode === 'navigate' ||
        request.headers.get('accept')?.includes('text/html');
      const isApi = request.url.includes('/api/');

      // Network-first for HTML and API to avoid stale content
      if (isHtml || isApi) {
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            const headers = new Headers(responseToCache.headers);
            headers.set('sw-cache-time', new Date().toISOString());

            const modifiedResponse = new Response(responseToCache.body, {
              status: responseToCache.status,
              statusText: responseToCache.statusText,
              headers: headers,
            });

            try {
              await cache.put(request, modifiedResponse);
            } catch {
              // Ignore cache write failures (e.g., opaque responses, quota, unsupported schemes)
            }
          }
          return networkResponse;
        } catch (error) {
          if (cachedResponse) {
            return cachedResponse;
          }

          if (isHtml) {
            return new Response('<h1>Offline</h1><p>Please check your connection.</p>', {
              headers: { 'Content-Type': 'text/html' },
            });
          }

          throw error;
        }
      }

      // Cache-first for static assets with revalidation
      if (cachedResponse) {
        const cachedTime = new Date(cachedResponse.headers.get('sw-cache-time') || 0);
        const now = Date.now();
        const age = now - cachedTime.getTime();

        let maxAge = CACHE_DURATIONS.static;

        if (request.url.match(/\.(jpg|jpeg|png|gif|webp|avif|svg|ico)$/i)) {
          maxAge = CACHE_DURATIONS.images;
        } else if (request.url.match(/\.(js|css|woff|woff2|ttf)$/i)) {
          maxAge = CACHE_DURATIONS.static;
        }

        if (age < maxAge) {
          if (age > maxAge * 0.75) {
            event.waitUntil(
              fetch(request).then(async (response) => {
                if (response && response.status === 200) {
                  const responseToCache = response.clone();
                  const headers = new Headers(responseToCache.headers);
                  headers.set('sw-cache-time', new Date().toISOString());

                  const modifiedResponse = new Response(responseToCache.body, {
                    status: responseToCache.status,
                    statusText: responseToCache.statusText,
                    headers: headers,
                  });

                  try {
                    await cache.put(request, modifiedResponse);
                  } catch {
                    // Ignore cache write failures
                  }
                }
              })
            );
          }
          return cachedResponse;
        }
      }

      // Fetch from network for uncached/expired assets
      try {
        const networkResponse = await fetch(request);

        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          const headers = new Headers(responseToCache.headers);
          headers.set('sw-cache-time', new Date().toISOString());

          const modifiedResponse = new Response(responseToCache.body, {
            status: responseToCache.status,
            statusText: responseToCache.statusText,
            headers: headers,
          });

          try {
            await cache.put(request, modifiedResponse);
          } catch {
            // Ignore cache write failures
          }
        }

        return networkResponse;
      } catch (error) {
        if (cachedResponse) {
          return cachedResponse;
        }

        throw error;
      }
    })
  );
});

// Web Push Notifications
self.addEventListener('push', (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    try {
      payload = { title: 'Notification', body: event.data ? event.data.text() : '' };
    } catch {
      payload = { title: 'Notification', body: '' };
    }
  }

  const title = payload.title || 'Notification';
  const options = {
    body: payload.body || '',
    icon: payload.icon || '/favicon.ico',
    badge: payload.badge || '/favicon.ico',
    tag: payload.tag,
    renotify: true,
    data: payload.data || { url: payload.url || '/' },
  };

  event.waitUntil(self.registration.showNotification(title, options));

  // Also broadcast to open tabs for instant in-app updates
  try {
    event.waitUntil(
      self.clients
        .matchAll({ type: 'window', includeUncontrolled: true })
        .then((clients) => {
          for (const client of clients) {
            try {
              client.postMessage({ type: 'PUSH_NOTIFICATION', payload });
            } catch {
              // ignore
            }
          }
        })
    );
  } catch {
    // ignore
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification?.data?.url || '/';
  let targetUrl = url;
  try {
    targetUrl = new URL(url, self.location.origin).toString();
  } catch {
    // ignore
  }

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ((client.url === targetUrl || client.url === url) && 'focus' in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
        return undefined;
      })
  );
});
