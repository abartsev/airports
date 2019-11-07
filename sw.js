if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js');
    })
}

const CACHE_NAME = 'my-offline-cache';
const urlsToCache = ['/', '/style.css', '/index.js'];

self.addEventListener('install', (e) => {
    console.log(e)
    e.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => cache.addAll(urlsToCache))
    )
})

self.addEventListener('fetch', (e)=>{
    console.log(e.request)
    e.respondWith(
        fetch(e.request)
            .then(response => {
                caches.open(CACHE_NAME).then(cache => cache.put(e.request, response))
            })       
            .catch(()=>{
                caches.match(e.request).then(res => res)
            })
    )
})