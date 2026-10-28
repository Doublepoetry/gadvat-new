// Leaflet touches `window` at import time, so the home page can't render on the server.
// Remove once the map is ported (it then renders client-side only inside onMount).
export const ssr = false;
