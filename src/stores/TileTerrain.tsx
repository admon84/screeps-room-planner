import { create } from 'zustand';
import { ROOM_GRID, TERRAIN_PLAIN } from '@/utils/constants';

interface State {
  terrain: Record<number, string>;
  setTileTerrain: (tile: number, terrain: string) => void;
  reset: () => void;
}

const initialTerrain = ROOM_GRID.reduce((acc, tile) => ({ ...acc, [tile]: TERRAIN_PLAIN }), {});

export const useTileTerrain = create<State>((set) => ({
  terrain: initialTerrain,
  setTileTerrain: (tile, terrain) => set((state) => ({ terrain: { ...state.terrain, [tile]: terrain } })),
  reset: () => set({ terrain: initialTerrain }),
}));
