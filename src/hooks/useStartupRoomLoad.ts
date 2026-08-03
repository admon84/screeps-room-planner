import { useEffect } from 'react';
import { SCREEPS_SERVERS, ScreepsServer, isValidRoomName, normalizeRoomName } from '@/utils/screepsApi';
import { importRoomFromApi } from '@/utils/importRoom';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { useSettings } from '@/stores/Settings';

// Module-level rather than a ref: StrictMode double-invokes mount effects, and the params must be
// consumed exactly once (same precedent as the renderer handoff in useGameRenderer).
let consumed = false;

/**
 * Consumes `?server=&shard=&room=` from the URL on startup: strips the params immediately (so a
 * refresh never re-triggers the load) and imports that room from the live Screeps API. `room` and
 * `shard` are required; `server` defaults to persistent. Errors surface as snackbars.
 */
export function useStartupRoomLoad() {
  useEffect(() => {
    if (consumed) return;
    consumed = true;

    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    const shardParam = params.get('shard');
    const serverParam = params.get('server');
    if (!roomParam && !shardParam && !serverParam) {
      return;
    }

    // Strip before the fetch so a mid-flight refresh cannot double-load; unrelated params survive.
    params.delete('room');
    params.delete('shard');
    params.delete('server');
    const query = params.size ? `?${params.toString()}` : '';
    history.replaceState(null, '', `${window.location.pathname}${query}${window.location.hash}`);

    const { notify } = useNotificationStore.getState();
    const room = normalizeRoomName(roomParam ?? '');
    if (!isValidRoomName(room)) {
      notify('Invalid room in URL (examples: W1N1, E12S34)', 'error');
      return;
    }
    const shard = shardParam?.trim() ?? '';
    if (!shard.length) {
      notify('Missing shard in URL', 'error');
      return;
    }
    let server: ScreepsServer = 'persistent';
    if (serverParam) {
      if (!(serverParam in SCREEPS_SERVERS)) {
        notify(`Unknown server '${serverParam}' in URL (persistent, season, ptr)`, 'error');
        return;
      }
      server = serverParam as ScreepsServer;
    }

    // Populate settings first so the Import dialog is pre-filled for a retry even if the fetch fails.
    const { setServer, setShard, setRoom } = useSettings.getState();
    setServer(server);
    setShard(shard);
    setRoom(room);

    importRoomFromApi({ server, shard, room, commitHistory: false }).catch((error: Error) =>
      useNotificationStore.getState().notify(error.message, 'error')
    );
  }, []);
}
