// Modlitby – service worker: offline režim a push notifikácie
const CACHE = 'modlitby-v11';
const SHELL = ['./', 'index.html', 'style.css', 'data.js', 'app.js', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/splash.webp'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET') return;
  // veľké nemenné dáta (Biblia, Strong): z cache, doťahuje sa len raz
  if (u.origin === location.origin && /\/(biblie|strong)\//.test(u.pathname)) {
    e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => { if (res.ok) { const c = res.clone(); caches.open(CACHE).then(x => x.put(r, c)); } return res; })));
    return;
  }
  // písma Google: z cache, na pozadí obnoviť
  if (/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)) {
    e.respondWith(caches.match(r).then(hit => { const net = fetch(r).then(res => { const c = res.clone(); caches.open(CACHE).then(x => x.put(r, c)); return res; }).catch(() => hit); return hit || net; }));
    return;
  }
  // appka: najprv sieť (aby sa aktualizácie prejavili hneď), pri výpadku cache
  if (u.origin === location.origin && !u.pathname.startsWith('/api/')) {
    e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(CACHE).then(x => x.put(r, c)); return res; }).catch(() => caches.match(r).then(h => h || caches.match('index.html'))));
  }
});

// push notifikácie
self.addEventListener('push', e => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch (err) { d = { body: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Čas na modlitbu', {
    body: d.body || 'Chvíľa pre Boha.', icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', tag: d.tag || 'modlitba', data: { url: d.url || './' }
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    const c = cs.find(x => 'focus' in x); return c ? c.focus() : self.clients.openWindow((e.notification.data && e.notification.data.url) || './');
  }));
});
