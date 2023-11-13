// serviceWorker.js

const CACHE_NAME = 'my-pwa-cache-v1';

const cacheAssets = [
  '/',
  'rizaldi.html',
  'style.css',
  'your_photo.jpg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened');
        return cache.addAll(cacheAssets)
  .then(() => console.log('Aset berhasil dicache'))
  .catch((error) => console.error('Gagal mencache aset:', error));

      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request).then((fetchResponse) => {
        // Menyimpan respons baru ke dalam cache
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      });
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data.action === 'download') {
    // Mengirim pesan ke halaman untuk menampilkan notifikasi download
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          action: 'showDownloadNotification',
          url: event.data.url,
        });
      });
    });
  } else if (event.data.action === 'subscribeToPush') {
    // Menanggapi permintaan langganan push
    subscribeToPush();
  }
});

// Menambahkan fungsi untuk langganan push
function subscribeToPush() {
  self.registration.pushManager.subscribe({ userVisibleOnly: true })
    .then((subscription) => {
      // Mengirimkan informasi langganan push ke server
      sendSubscriptionToServer(subscription);
    })
    .catch((error) => {
      console.error('Error subscribing to push:', error);
    });
}

// Menambahkan fungsi untuk mengirim informasi langganan push ke server
function sendSubscriptionToServer(subscription) {
  // Mengirimkan subscription ke server (ganti dengan logika sesuai kebutuhan Anda)
  console.log('Subscription:', subscription);
}


self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: 'icon.png', // Ganti dengan URL ikon yang sesuai
    badge: 'badge.png', // Ganti dengan URL badge yang sesuai
  };

  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});
