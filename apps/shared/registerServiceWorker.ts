/**
 * Shared Service Worker Registration
 * 
 * Ensures that whenever any mini-app or page in the monorepo is opened,
 * the central root service worker (/sw.js) is registered with scope '/'.
 * 
 * This enables full offline precaching across all apps without requiring
 * the user to visit the root homepage first.
 */

let registered = false;

export function registerServiceWorker() {
  if (registered) return;
  registered = true;

  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    const isLocalhost = Boolean(
      window.location.hostname === 'localhost' ||
      window.location.hostname === '[::1]' ||
      window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
    );

    const doRegister = () => {
      // Register root service worker with full domain scope
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          // Check for updates on load
          registration.update().catch(() => {});
        })
        .catch((error) => {
          if (!isLocalhost) {
            console.warn('[SW] ServiceWorker registration failed:', error);
          }
        });
    };

    if (document.readyState === 'complete') {
      doRegister();
    } else {
      window.addEventListener('load', doRegister);
    }
  }
}
