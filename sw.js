const CACHE_NAME = 'ortelan-cache-v1';
const ASSETS = [
  'index.html',
  'manifest.json'
];

// Instala o aplicativo salvando a interface na memória do celular
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Ativa o sistema limpando caches antigos se houver atualização
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Intercepta requisições: se estiver sem sinal, puxa o layout do cache local
self.addEventListener('fetch', (e) => {
  // Ignora chamadas enviadas para a planilha do google para não travar os envios off-line
  if (e.request.url.includes('script.google.com')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});