/*jshint esversion: 6 */
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

window.addEventListener('online', () => {console.log('You are online');}
);

window.addEventListener('offline', () => {console.log('You are offline');}
);

navigator.serviceWorker.addEventListener('message', event => {
    console.log(event.data.msg, event.data.url);
  });