/*jshint esversion: 6 */
window.addEventListener('online', () => {console.log('You are online');}
);

window.addEventListener('offline', () => {console.log('You are offline');}
);

navigator.serviceWorker.addEventListener('message', event => {
    console.log(event.data.msg, event.data.url);
  });