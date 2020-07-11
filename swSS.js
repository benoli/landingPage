/*jshint esversion: 8 */
const cacheName = 'v1.5';
// const resourcesToPrecache = [
// 	"/css/bootstrap.css",
//     "/css/font-awesome.min.css",
//     "/css/responsive.css",
//     "/css/style.css",
//     "/fonts/fontawesome-webfont.woff2?v=4.5.0",
//     "/img/banner/home-banner.png",
//     "/img/banner/right-mobile2.png",
//     "/img/favicon.png",
//     "/img/icon/f-icon-1.png",
//     "/img/video-for-doctors.png",
//     "/img/video-for-patients.png",
//     "/index.html",
//     "/js/bootstrap.min.js",
//     "/js/jquery-3.2.1.min.js",
//     "/js/jquery.ajaxchimp.min.js",
//     "/js/mail-script.js",
//     "/js/popper.js",
//     "/js/stellar.js",
//     "/js/theme.js",
//     "/swSS.js",
//     "/vendors/animate-css/animate.css",
//     "/vendors/counter-up/jquery.counterup.js",
//     "/vendors/counter-up/jquery.waypoints.min.js",
//     "/vendors/isotope/imagesloaded.pkgd.min.js",
//     "/vendors/isotope/isotope-min.js",
//     "/vendors/lightbox/simpleLightbox.css",
//     "/vendors/lightbox/simpleLightbox.min.js",
//     "/vendors/linericon/style.css",
//     "/vendors/nice-select/css/nice-select.css",
//     "/vendors/nice-select/js/jquery.nice-select.min.js",
//     "/vendors/owl-carousel/owl.carousel.min.css",
//     "/vendors/owl-carousel/owl.carousel.min.js",
//     "/vendors/popup/jquery.magnific-popup.min.js",
//     "/vendors/popup/magnific-popup.css",
//     "/css?family=Open+Sans:400,600,700|Roboto:300,300i,400,500,700",
//     "/s/opensans/v17/mem5YaGs126MiZpBA-UN7rgOUuhpKKSTjw.woff2",
//     "/s/opensans/v17/mem5YaGs126MiZpBA-UNirkOUuhpKKSTjw.woff2",
//     "/s/roboto/v20/KFOlCnqEu92Fr1MmSU5fBBc4AMP6lQ.woff2",
//     "/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
//     "/intranet/assets/images/logo.png"

// ];

// if (navigator.serviceWorker) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('swSS.js', { scope: '/' })
//         .then( reg => {
//             console.log('Service Worker: Register ok', reg);
//         }).catch( err => {
//             console.log('Registration failed', err);
//         });
//     });
    
// }

// Save resources on cache
self.addEventListener('install', event => {
    console.log('Service Worker: Install event');
    self.skipWaiting(); // This should only be employed when you are certain the new service worker will not break any existing clients
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
        return cachedResponse || fetch(event.request)
        .then(res => {
            const resClone = res.clone();
            caches
            .open(cacheName)
            .then(cache => {
                cache.put(event.request, resClone);
            })
            .catch(err => console.log('Error => ' + err)
            );
            return res;
        });
    
      })
      .catch(err => console.log('Error => ' + err)
      )
    );
    event.waitUntil(async function() {
        // Exit early if we don't have access to the client.
        // Eg, if it's cross-origin.
        if (!event.clientId) return;
    
        // Get the client.
        const client = await clients.get(event.clientId);
        // Exit early if we don't get the client.
        // Eg, if it closed.
        if (!client) return;
    
        // Send a message to the client.
        client.postMessage({
          msg: "Hey I just got a fetch from you!",
          url: event.request.url
        });
       
      }());
});

self.addEventListener('sync', e => {
    console.log(e);
    console.log('This is a sync event');
    
    
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