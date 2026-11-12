/**
 * TechTest PWA Service Worker
 * Provides offline-first caching for diagnostic suites, hardware math engines, and UI assets.
 */

const CACHE_NAME = 'techtest-pwa-v5';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.png',
  '/og-image.png',
  '/verify/',
  '/repair-guides/',
  '/answers/',
  '/shared/styles.css',
  '/shared/sidebar.js',
  '/shared/modules/capability-detector.js',
  '/shared/modules/analog-math.js',
  '/shared/modules/polling-analyzer.js',
  '/shared/modules/imu-tracker.js',
  '/shared/modules/revision-decoder.js',
  '/shared/modules/hall-effect.js',
  '/shared/modules/gpu-stress.js',
  '/shared/modules/certificate-generator.js',
  '/shared/modules/controller-3d.js',
  '/shared/modules/virtual-gamepad.js',
  '/tools/controller-lab/',
  '/tools/controller-lab/css/controller-lab.css',
  '/tools/controller-lab/js/controller-lab-core.js',
  '/repair-guides/playstation/dualsense-trigger-spring/',
  '/repair-guides/apple/macbook-keyboard-cleaning/',
  '/repair-guides/displays/dead-vs-stuck-pixels/',
  '/tools/laptop/',
  '/tools/laptop-comprehensive/',
  '/tools/laptop-stress/',
  '/tools/keyboard-test/',
  '/tools/mouse-test/',
  '/tools/display-test/',
  '/tools/dead-pixel-test/',
  '/tools/benchmark/',
  '/tools/speaker-test/',
  '/tools/mic-test/',
  '/tools/webcam-test/',
  '/tools/network-test/',
  '/tools/system-specs/',
  '/tools/phone-diagnostics/'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Some offline precache assets failed to fetch:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests, external analytics, or dynamic API endpoints
  if (event.request.method !== 'GET' || url.origin !== location.origin || url.pathname.startsWith('/api/')) {
    return;
  }

  // Network-first for HTML navigations so content updates appear immediately
  const isHtmlRequest = event.request.mode === 'navigate' ||
    url.pathname.endsWith('/') ||
    url.pathname.endsWith('.html');

  if (isHtmlRequest) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Stale-while-revalidate for static assets (JS/CSS/images)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
