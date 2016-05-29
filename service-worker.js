var dataCacheName = 'neurral-leuzin-data';
var cacheName = 'neurral-leuzin-assets';

/* Once finalized, add:
  * index
  * js modules
  * custom.css
  * icons / images
*/

var filesToCache = [
//  '/',
  'assets/css/bootstrap.min.css',
  'assets/fonts/glyphicons-halflings-regular.eot',
  'assets/fonts/glyphicons-halflings-regular.svg',
  'assets/fonts/glyphicons-halflings-regular.ttf',
  'assets/fonts/glyphicons-halflings-regular.woff',
  'assets/fonts/glyphicons-halflings-regular.woff2',
  'assets/js/angular.min.js',
  'assets/js/bootstrap.min.js',
  'assets/js/jquery.min.js',
  'assets/js/ui-bootstrap-tpls-1.3.2.min.js'
];


/* Skips waiting */

// self.addEventListener('install', function(e) {
//   console.log('[ServiceWorker] Install');
//   e.waitUntil(
//     caches.open(cacheName)
//     .then(function(cache) {
//       console.log('[ServiceWorker] Caching App Shell');
//       return cache.addAll(filesToCache);      
//     })
//     .then(() => self.skipWaiting());
//   )
// });

self.addEventListener('install', function(event) {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
  caches.open(cacheName).then(function(cache) {
        // Important to `return` the promise here to have `skipWaiting()`
        // fire after the cache has been updated.
        console.log('[ServiceWorker] Caching App Shell');
        return cache.addAll(filesToCache);
    }).then(function() {
      console.log('[ServiceWorker] Skip waiting');
      // `skipWaiting()` forces the waiting ServiceWorker to become the
      // active ServiceWorker, triggering the `onactivate` event.
      // Together with `Clients.claim()` this allows a worker to take effect
      // immediately in the client(s).
      return self.skipWaiting();
    })
  );
});





self.addEventListener('activate',  event => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  console.log('[ServiceWorker] Fetch');
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});


/* Waits */

// self.addEventListener('install', function(e) {
//   console.log('[ServiceWorker] Install');
//   e.waitUntil(
//     caches.open(cacheName).then(function(cache) {
//       console.log('[ServiceWorker] Caching App Shell');
//       return cache.addAll(filesToCache);
//     })
//   );
// });

// self.addEventListener('activate', function(e) {
//   console.log('[ServiceWorker] Activate');
//   e.waitUntil(
//     caches.keys().then(function(keyList) {
//       return Promise.all(keyList.map(function(key) {
//         console.log('[ServiceWorker] Removing old cache', key);
//         if (key !== cacheName) {
//           return caches.delete(key);
//         }
//       }));
//     })
//   );
// });

/* FOr fetching DATA */
// self.addEventListener('fetch', function(e) {
//   console.log('[ServiceWorker] Fetch', e.request.url);
//   var dataUrl = 'http://localhost:3000/';
//   if (e.request.url.indexOf(dataUrl) === 0) {
//     e.respondWith(
//       fetch(e.request)
//         .then(function(response) {
//           return caches.open(dataCacheName).then(function(cache) {
//             cache.put(e.request.url, response.clone());
//             console.log('[ServiceWorker] Fetched&Cached Data');
//             return response;
//           });
//         })
//     );
//   } else {
//     e.respondWith(
//       caches.match(e.request).then(function(response) {
//         return response || fetch(e.request);
//       })
//     );
//   }
// });
