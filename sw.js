/* SLF Code Scribe — Service Worker
   Caches the app for offline use on mobile/iPad.
   Strategy: cache-first for the app shell, network fallback when online.
*/

const CACHE_NAME = 'slf-scribe-v4';
const APP_SHELL = [
    './',
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

// On install: cache the app shell
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
    );
    self.skipWaiting();
});

// On activate: clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
            )
        )
    );
    self.clients.claim();
});

// On fetch: serve from cache, fall back to network, then re-cache fresh copy
self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Always try a network refresh in the background (stale-while-revalidate)
            const networkFetch = fetch(event.request)
                .then((networkResponse) => {
                    // Only cache successful responses
                    if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseClone);
                        });
                    }
                    return networkResponse;
                })
                .catch(() => cachedResponse); // offline: just return cache

            // Return cache immediately if we have it, otherwise wait for network
            return cachedResponse || networkFetch;
        })
    );
});
