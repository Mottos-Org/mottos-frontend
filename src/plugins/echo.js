import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

let echoInstance = null;

const API_BASE_URL = import.meta.env.VITE_API_URL;

export function initializeEcho(token) {
    if (!token) {
        console.warn("No token, Echo will not initialize.");
        return null;
    }

    window.Pusher = Pusher;

    echoInstance = new Echo({
        broadcaster: 'reverb',
        key: import.meta.env.VITE_REVERB_APP_KEY,
        wsHost: import.meta.env.VITE_REVERB_HOST,
        wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
        wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
        forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
        enabledTransports: ['ws', 'wss'],
        authEndpoint: `${API_BASE_URL}/api/broadcasting/auth`,
        auth: {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    });

    window.Echo = echoInstance;

    return echoInstance;
}
