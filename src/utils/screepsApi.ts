import { ROOM_NAME, TERRAIN_MASK, TERRAIN_MASK_SWAMP, TERRAIN_MASK_WALL } from './constants';
import { getPointForTile } from './helpers';
import { ScreepsGameRoomObjects, ScreepsGameRoomTerrain, ScreepsShardsInfo, TerrainTile } from '../types';

/**
 * The official Screeps servers all live on screeps.com behind a path prefix, so a server is just a
 * choice of API base. The API sends permissive CORS headers, so every call here is made directly
 * from the browser, unauthenticated -- there is no proxy to translate a transport failure into a
 * message, hence the try/catch in `apiGet`.
 */
export type ScreepsServer = 'persistent' | 'season' | 'ptr';

export const SCREEPS_SERVERS: Record<ScreepsServer, { label: string; apiBase: string }> = {
  persistent: { label: 'Persistent', apiBase: 'https://screeps.com/api' },
  season: { label: 'Season', apiBase: 'https://screeps.com/season/api' },
  ptr: { label: 'PTR', apiBase: 'https://screeps.com/ptr/api' },
};

async function apiGet<T extends { ok: number }>(url: string): Promise<T> {
  let response: Response;
  let payload: T & { error?: string };
  try {
    response = await fetch(url);
    payload = (await response.json()) as T & { error?: string };
  } catch (error) {
    throw new Error('Could not reach the Screeps API', { cause: error });
  }

  // Errors arrive as an `error` field rather than an HTTP status, so it is checked first; the
  // status/ok check backstops responses that carry neither a result nor a message.
  if (payload.error) {
    throw new Error(payload.error);
  }
  if (!response.ok || !payload.ok) {
    throw new Error('The Screeps API returned an unexpected response');
  }
  return payload;
}

const roomQuery = (shard: string, room: string) =>
  `room=${encodeURIComponent(room)}&shard=${encodeURIComponent(shard)}`;

export function fetchRoomTerrain(server: ScreepsServer, shard: string, room: string) {
  return apiGet<ScreepsGameRoomTerrain>(
    `${SCREEPS_SERVERS[server].apiBase}/game/room-terrain?encoded=1&${roomQuery(shard, room)}`
  );
}

export function fetchRoomObjects(server: ScreepsServer, shard: string, room: string) {
  return apiGet<ScreepsGameRoomObjects>(
    `${SCREEPS_SERVERS[server].apiBase}/game/room-objects?${roomQuery(shard, room)}`
  );
}

// Shard lists only change when the game adds a shard, so one fetch per server per session is plenty.
const shardsCache = new Map<ScreepsServer, string[]>();

export async function fetchShards(server: ScreepsServer): Promise<string[]> {
  const cached = shardsCache.get(server);
  if (cached) {
    return cached;
  }
  const data = await apiGet<ScreepsShardsInfo>(`${SCREEPS_SERVERS[server].apiBase}/game/shards/info`);
  const shards = data.shards.map((shard) => shard.name);
  shardsCache.set(server, shards);
  return shards;
}

/**
 * Decodes `room-terrain?encoded=1`: one terrain-mask digit per tile in row-major order. Skipping
 * plains yields exactly the sparse array the renderer wants, so callers can replace the terrain
 * store in a single write.
 */
export function terrainTilesFromEncoded(encoded: string): TerrainTile[] {
  const tiles: TerrainTile[] = [];
  for (let tile = 0; tile < encoded.length; tile++) {
    const mask = +encoded[tile];
    if (mask === TERRAIN_MASK_WALL || mask === TERRAIN_MASK_SWAMP) {
      tiles.push({ room: ROOM_NAME, ...getPointForTile(tile), type: TERRAIN_MASK[mask] });
    }
  }
  return tiles;
}

export const normalizeRoomName = (room: string) => room.trim().toUpperCase();

export const isValidRoomName = (room: string) => /^[WE]\d{1,2}[NS]\d{1,2}$/.test(room);
