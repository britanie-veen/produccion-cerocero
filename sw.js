/* Service Worker — hace que la app se pueda "instalar" y abrir sin internet.
   Guarda una copia de los archivos base en el teléfono (caché). */
const CACHE = 'produccion-cerocero-v1';
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
  // Primero busca en caché; si no está, va a internet.
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
