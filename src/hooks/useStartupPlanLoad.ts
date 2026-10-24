import { useEffect } from 'react';
import { applyRoomJsonText } from '@/utils/roomFile';
import { useNotificationStore } from '@/stores/useNotificationStore';

// Module-level for the same StrictMode reason as useStartupRoomLoad.
let consumed = false;

/**
 * Consumes `?plan=<url>` on startup: fetches room JSON from that URL (same origin, or any host that
 * sends CORS headers) and applies it like a dropped file. Strips the param first, so a refresh does
 * not load it again. `public/demo/palette.json` ships as an example: `?plan=/demo/palette.json`.
 */
export function useStartupPlanLoad() {
  useEffect(() => {
    if (consumed) return;
    consumed = true;

    const params = new URLSearchParams(window.location.search);
    const planUrl = params.get('plan');
    if (!planUrl) return;
    params.delete('plan');
    const query = params.size ? `?${params.toString()}` : '';
    history.replaceState(null, '', `${window.location.pathname}${query}${window.location.hash}`);

    const { notify } = useNotificationStore.getState();
    fetch(planUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then((text) => {
        const error = applyRoomJsonText(text);
        notify(error ? `Plan ${planUrl}: ${error}` : `Loaded plan ${planUrl}`, error ? 'error' : 'success');
      })
      .catch((error: Error) => notify(`Could not load plan ${planUrl}: ${error.message}`, 'error'));
  }, []);
}
