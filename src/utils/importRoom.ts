import { STRUCTURE_CONTROLLER } from '@/utils/constants';
import { ScreepsServer, fetchRoomObjects, fetchRoomTerrain, terrainTilesFromEncoded } from '@/utils/screepsApi';
import { createObjectsFromApi } from '@/utils/gameObjects';
import { useGameObjectStore } from '@/stores/useGameObjectsStore';
import { useHistoryStore } from '@/stores/useHistoryStore';
import { useSettings } from '@/stores/Settings';
import { useTerrainStore } from '@/stores/useTerrainStore';

export interface ImportRoomOptions {
  server: ScreepsServer;
  shard: string;
  /** Already normalized and validated by the caller. */
  room: string;
  includeTerrain?: boolean;
  includeStructures?: boolean;
  /** Startup auto-load skips the snapshot: the room is still empty, so there is nothing to undo to. */
  commitHistory?: boolean;
}

/**
 * Fetches a live room and replaces the terrain/objects stores with it. Shared by the Import dialog
 * and the URL-param startup load; fetch errors propagate so each caller can surface them its own
 * way (inline Alert vs snackbar).
 */
export async function importRoomFromApi({
  server,
  shard,
  room,
  includeTerrain = true,
  includeStructures = true,
  commitHistory = true,
}: ImportRoomOptions): Promise<void> {
  const [terrainData, objectsData] = await Promise.all([
    includeTerrain ? fetchRoomTerrain(server, shard, room) : null,
    fetchRoomObjects(server, shard, room),
  ]);

  if (commitHistory) {
    useHistoryStore.getState().commit();
  }
  if (terrainData) {
    useTerrainStore.getState().setTerrain(terrainTilesFromEncoded(terrainData.terrain[0].terrain));
  }
  useGameObjectStore.getState().setObjects(createObjectsFromApi(objectsData.objects, includeStructures));

  // Unowned and reserved controllers report level 0, which leaves the current RCL alone.
  const controller = objectsData.objects.find((object) => object.type === STRUCTURE_CONTROLLER);
  if (controller?.level) {
    useSettings.getState().setRCL(controller.level);
  }
}
