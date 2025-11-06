const CACHE_NAME = 'random-aita-v5';
const APP_SHELL = ['/', '/static/styles.css?v=5', '/static/app.js?v=33'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(APP_SHELL)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  e.respondWith(
    caches.match(req).then(cached =>
      cached ||
      fetch(req).then(res => {
        if (req.method === 'GET' && new URL(req.url).origin === location.origin) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, copy)).catch(()=>{});
        }
        return res;
      }).catch(() => cached)
    )
  );
});
