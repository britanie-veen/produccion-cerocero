/* Service Worker — hace que la app se pueda "instalar" y abrir sin internet.
   Guarda una copia de los archivos base en el teléfono (caché). */
const CACHE = 'produccion-cerocero-v4';
const ARCHIVOS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  // La PÁGINA (navegación): primero internet (para ver cambios al instante); si no hay, la caché.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(r => { const copia = r.clone(); caches.open(CACHE).then(c => c.put(req, copia)); return r; })
        .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
    return;
  }
  // Lo demás (iconos, etc.): primero caché, si no, internet.
  e.respondWith(caches.match(req).then(r => r || fetch(req)));
});
