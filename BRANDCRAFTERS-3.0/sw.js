// Service Worker for Brand Crafters Website
// Implements caching strategies for better performance

const CACHE_NAME = "brand-crafters-v001";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/css/styles.css?v=20250002",
  "/js/script.js?v=20250002",
  "/js/logo-carousel.js?v=20250002",
  "/js/projects-carousel.js?v=20250002",
  "/bc-new-bg.webp",
  "/bc-new-about.webp",
  "/bc%20logo%20black.png", // URL encoded space
];

// Install event - cache critical assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        // Try to cache each asset individually to avoid total failure
        return Promise.allSettled(
          ASSETS_TO_CACHE.map((url) =>
            cache.add(url).catch((error) => {
              console.warn(`Failed to cache ${url}:`, error);
              return null; // Continue with other assets
            })
          )
        );
      })
      .then(() => {
        console.log("Service Worker installed successfully");
        self.skipWaiting();
      })
      .catch((error) => {
        console.error("Service Worker install failed:", error);
        self.skipWaiting(); // Continue even if caching fails
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Cache-first strategy for assets
  if (
    request.method === "GET" &&
    (request.destination === "style" ||
      request.destination === "script" ||
      request.destination === "image")
  ) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(request).then((fetchResponse) => {
          const responseClone = fetchResponse.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => {
              cache.put(request, responseClone);
            })
            .catch((error) => {
              console.error("Failed to cache asset:", error);
            });
          return fetchResponse;
        });
      })
    );
  }
  // Network-first strategy for HTML pages
  else if (request.method === "GET" && request.destination === "document") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => {
              cache.put(request, responseClone);
            })
            .catch((error) => {
              console.error("Failed to cache document:", error);
            });
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
  }
  // Stale-while-revalidate for other GET requests
  else if (request.method === "GET") {
    event.respondWith(
      caches.match(request).then((response) => {
        const fetchPromise = fetch(request)
          .then((fetchResponse) => {
            const responseClone = fetchResponse.clone();
            caches
              .open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseClone);
              })
              .catch((error) => {
                console.error(
                  "Failed to cache in stale-while-revalidate:",
                  error
                );
              });
            return fetchResponse;
          })
          .catch((error) => {
            console.error("Fetch failed in stale-while-revalidate:", error);
            throw error;
          });
        return response || fetchPromise;
      })
    );
  }
  // For non-GET requests (POST, PUT, DELETE, etc.), just fetch without caching
  else {
    event.respondWith(fetch(request));
  }
});
