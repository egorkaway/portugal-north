/** Register the service worker after first paint so workbox is off the critical path. */
export function registerPwaServiceWorker(): void {
  void import("virtual:pwa-register")
    .then(({ registerSW }) => {
      registerSW({
        immediate: true,
        onRegisteredSW(_url, registration) {
          if (!registration) return;
          void registration.update();
        },
        onRegisterError(error) {
          console.warn("Service worker registration failed", error);
        },
      });
    })
    .catch((error) => {
      console.warn("Service worker setup failed", error);
    });
}
