import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

export function initializeEcho(token) {
  if (!token) return null;

  window.Pusher = Pusher;

  const host = import.meta.env.VITE_REVERB_HOST || window.location.hostname;
  const port = Number(import.meta.env.VITE_REVERB_PORT || 8080);
  const isHttps = (import.meta.env.VITE_REVERB_SCHEME || 'http') === 'https';

  const echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: host,
    wsPort: port,
    wssPort: port,
    forceTLS: isHttps,                 // <- false for local WS
    enabledTransports: isHttps ? ['wss'] : ['ws'],
    authEndpoint: `${import.meta.env.VITE_API_URL}/api/broadcasting/auth`,
    auth: { headers: { Authorization: `Bearer ${token}` } },
  });

  window.Echo = echo;
  return echo;
}
