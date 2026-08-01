import { create } from 'zustand';
import { ROOM_NAME, TERRAIN_PLAIN } from '@/utils/constants';
import { SAMPLE_TERRAIN } from '@/utils/sampleTerrain';
import type { TerrainTile } from '@/types';

type State = {
  terrain: TerrainTile[];
  setTerrain: (terrain: TerrainTile[]) => void;
  setTerrainAt: (x: number, y: number, type: string) => void;
  reset: () => void;
};

/**
 * Terrain in the sparse `{ room, x, y, type }` shape `GameRenderer.setTerrain()` expects. Plain is
 * the absence of an entry, so painting plain deletes rather than writes.
 */
export const useTerrainStore = create<State>((set) => ({
  terrain: SAMPLE_TERRAIN,
  setTerrain: (terrain) => set(() => ({ terrain })),
  setTerrainAt: (x, y, type) =>
    set((state) => {
      const existing = state.terrain.find((t) => t.x === x && t.y === y);
      if (existing?.type === type || (!existing && type === TERRAIN_PLAIN)) return state;

      const without = state.terrain.filter((t) => t.x !== x || t.y !== y);
      return { terrain: type === TERRAIN_PLAIN ? without : [...without, { room: ROOM_NAME, x, y, type }] };
    }),
  reset: () => set(() => ({ terrain: [] })),
}));
