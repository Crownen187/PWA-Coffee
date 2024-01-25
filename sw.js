
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
  "/images/coffee9.jpg"
];



// Definiere die `logLifecycleEvent`-Funktion
function logLifecycleEvent(event) {
  console.log(`[LifecycleEvent] ${event}`);
}

// Definiere die `reinstallServiceworker`-Funktion
function reinstallServiceworker() {
  // Registriere den Service Worker neu
  navigator.serviceWorker.register("/serviceworker.js").then(() => {
    console.log("Serviceworker neu installiert");
  });
}

// Registriere den Service Worker
navigator.serviceWorker.register("/serviceworker.js").then(() => {
  // Rufe die `logLifecycleEvent`-Funktion auf
  logLifecycleEvent("install");

  // Implementiere weitere Funktionalität
});

// Implementiere die `activate()`-Handler
// Rufe die `logLifecycleEvent`-Funktion auf
window.addEventListener("activate", logLifecycleEvent);

// Rufe die `reinstallServiceworker`-Funktion auf
window.addEventListener("activate", reinstallServiceworker);

// Install-Handler
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(staticDevCoffee)
      .then((cache) => {
        cache.addAll(assets);
        console.log("Cache angelegt");
        // Rufe die `logLifecycleEvent`-Funktion auf
        logLifecycleEvent("install");
      })
      .catch(console.log)
  );
});

// Aktivieren-Handler
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        cacheNames.filter(cacheName => cacheName !== staticDevCoffee)
          .map((cacheName) => caches.delete(cacheName))
          .then(() => {
            console.log("Cache geleert");
            // Rufe die `logLifecycleEvent`-Funktion auf
            logLifecycleEvent("activate");
            // Rufe die `reinstallServiceworker`-Funktion auf
            reinstallServiceworker();
          })
          .catch(console.log)
      )
  );
});