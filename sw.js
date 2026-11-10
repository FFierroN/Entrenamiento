// Service worker: guarda la app en caché para que funcione sin internet (gimnasio sin señal).
// Estrategia "stale-while-revalidate": responde al instante desde la caché y actualiza en segundo plano.
// Si cambias archivos y quieres forzar la actualización, sube el número de CACHE.
const CACHE = "entreno-v5";
const ASSETS = [
  "./", "./index.html", "./styles.css", "./manifest.webmanifest",
  "./js/app.js", "./js/store.js", "./js/stats.js", "./js/timer.js", "./js/rutina.js", "./js/guia.js",
  "./icons/apple-touch-icon.png", "./icons/icon-192.png", "./icons/icon-512.png",
  // Fotos de la guía de ejercicios
  "./img/ejercicios/box-squat.jpg", "./img/ejercicios/burpees.jpg", "./img/ejercicios/cadena-posterior.jpg", "./img/ejercicios/cobra.jpg", "./img/ejercicios/dominada-australiana.jpg", "./img/ejercicios/dominada.jpg", "./img/ejercicios/escapulas.jpg", "./img/ejercicios/estir-cuadriceps.jpg", "./img/ejercicios/estir-isquios.jpg", "./img/ejercicios/estir-psoas.jpg", "./img/ejercicios/estir-triceps.jpg", "./img/ejercicios/estocada.jpg", "./img/ejercicios/gemelos.jpg", "./img/ejercicios/jumping-jacks.jpg", "./img/ejercicios/mountain-climbers.jpg", "./img/ejercicios/nadadores.jpg", "./img/ejercicios/postura-nino.jpg", "./img/ejercicios/puente-gluteo.jpg", "./img/ejercicios/push-up.jpg", "./img/ejercicios/sentadilla.jpg", "./img/ejercicios/step-up.jpg", "./img/ejercicios/toques-hombro.jpg", "./img/ejercicios/trote.jpg",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req, { ignoreSearch: true });
      const network = fetch(req)
        .then((res) => { if (res.ok) cache.put(req, res.clone()); return res; })
        .catch(() => cached);
      return cached || network;
    }),
  );
});
