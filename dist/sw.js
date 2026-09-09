// Service worker mínimo: permite que el navegador ofrezca "Instalar app".
// No cachea nada todavía — cada visita trae la versión más nueva del sitio.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
