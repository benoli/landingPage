/*jshint esversion: 6 */
const cacheName = 'v1.6';
// const resourcesToPrecache = [
//     '/',
//     'index.html'

// ];

if (navigator.serviceWorker) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('swSS.js', { scope: '/' })
        .then( reg => {
            console.log('Service Worker: Register ok', reg);
        }).catch( err => {
            console.log('Registration failed', err);
        });
    });
    
}

// Save resources on cache
self.addEventListener('install', event => {
    console.log('Service Worker: Install event');
    // event.waitUntil(
    //     caches.open(cacheName)
    //       .then( cache => {
    //           return cache.addAll(resourcesToPrecache);
    //       })
    //       .catch(err => console.log('Error => ' + err))
    // );
    
});

// Activate Event

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache != cacheName) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Return resources from cache first. If doesn't find it go to fetch. // WARNING this aproach is only for a very static site
self.addEventListener('fetch', event => {
    event.respondWith(caches.match(event.request)
      .then(cachedResponse => {
        return cachedResponse;})
      .catch(fetch(event.request)
        .then(res => {
            const resClone = res.clone();
            caches
            .open(cacheName)
            .then(cache => {
                cache.put(event.request, resClone);
            })
            .then(res => {return res;})
            .catch(err => console.log('Error => ' + err)
            );
        })
      )
    );
});
// // CAll fetch event

// self.addEventListener('fetch', event => {
//     console.log('SW fetching');
    
//     event.respondWith(
//         fetch(event.request)
//         .then(res => {
//             const resClone = res.clone();
//             caches
//             .open(cacheName)
//             .then(cache => {
//                 cache.put(event.request, resClone);
//             });
//         return res;
//         })
//         .catch(err=> caches.match(event.request).then(res => res))
//     );
// });