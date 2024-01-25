const staticDevCoffee = "dev-coffee-site-v1";
const version = "v1";
const assets = [
  "/",
  "/js/index.html",
  "/css/styles.css",
  "/js/app.js",
  "/images/coffee1.jpg",
  "/images/coffee2.jpg",
  "/images/coffee3.jpg",
  "/images/coffee4.jpg",
  "/images/coffee5.jpg",
  "/images/coffee6.jpg",
  "/images/coffee7.jpg",
  "/images/coffee8.jpg",
  "/images/coffee9.jpg"
];

self.addEventListener("activate", activateEvent => {
  console.log("Service Worker activated" + version );
  activateEvent.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== staticDevCoffee) {
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log("Service Worker activated and old caches deleted");
    })
  );
});

self.addEventListener("install", installEvent => {
  console.log("Service Worker installed" + version );
  installEvent.waitUntil(
    caches
      .open(staticDevCoffee)
      .then(cache => {
        cache.addAll(assets);
      })
      .then(() => {
        console.log("Assets cached");
      })
      .catch(error => {
        console.error("Error caching assets:", error);
      })
  );
});

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(response => {
      return response || fetch(fetchEvent.request);
    })
  );
});

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open("v1")
      .then((cache) =>
        cache.addAll([
          "/",
          "/index.html",
          "/style.css",
          "/app.js",
          "/image-list.js",
          "/star-wars-logo.jpg",
          "/gallery/bountyHunters.jpg",
          "/gallery/myLittleVader.jpg",
          "/gallery/snowTroopers.jpg",
        ]),
      ),
  );
});
