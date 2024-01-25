const staticDevCoffee = "dev-coffee-site-v1";
const assets = [
  "/",
  "/index.html",
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
  "/images/coffee9.jpg",
  "/star-wars-logo.jpg",
  "/gallery/bountyHunters.jpg",
  "/gallery/myLittleVader.jpg",
  "/gallery/snowTroopers.jpg"
];

self.addEventListener("install", installEvent => {
  console.log('Service Worker wurde installiert');
  installEvent.waitUntil(
    caches
      .open(staticDevCoffee)
      .then(cache => {
        console.log('Assets werden in den Cache geladen');
        cache.addAll(assets);
      })
      .catch(console.error)
  );
});

self.addEventListener("fetch", event => {
  console.log('Fetch-Event abgefangen:', event.request.url);
  event.respondWith(
    caches
      .match(event.request)
      .then(res => {
        return res || fetch(event.request);
      })
      .catch(console.error)
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
