/* SLF Code Scribe — Service Worker
   Caches the app for offline use on mobile/iPad.
   Strategy:
     - Navigations / the HTML document → NETWORK-FIRST (always get the latest when online,
       fall back to cache only when offline). This prevents a stale or half-updated page
       from being served after an update.
     - Other assets (icons, manifest) → stale-while-revalidate (fast, refreshed in background).
*/

const CACHE_NAME = 'slf-scribe-v20';
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

// Is this request for the app's HTML document (a page navigation)?
function isDocumentRequest(request) {
    return request.mode === 'navigate'
        || (request.destination === 'document')
        || request.url.endsWith('/')
        || request.url.endsWith('/index.html');
}

self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') return;

    const req = event.request;

    if (isDocumentRequest(req)) {
        // NETWORK-FIRST for the page itself: always load the freshest HTML when online.
        // Update the cache copy on success; fall back to cache only when the network fails.
        event.respondWith(
            fetch(req)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                        const clone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put('./index.html', clone));
                    }
                    return networkResponse;
                })
                .catch(() => caches.match('./index.html').then((c) => c || caches.match('./')))
        );
        return;
    }

    // Other assets: stale-while-revalidate (serve cache fast, refresh in background).
    event.respondWith(
        caches.match(req).then((cachedResponse) => {
            const networkFetch = fetch(req)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(req, responseClone));
                    }
                    return networkResponse;
                })
                .catch(() => cachedResponse);
            return cachedResponse || networkFetch;
        })
    );
});
