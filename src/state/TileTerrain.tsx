import { create } from 'zustand';

interface State {
  terrain: Record<number, string>;
  setTileTerrain: (tile: number, terrain: string) => void;
  reset: () => void;
}

export const useTileTerrain = create<State>((set) => ({
  terrain: {},
  setTileTerrain: (tile: number, terrain: string) =>
    set((state) => ({ terrain: { ...state.terrain, [tile]: terrain } })),
  reset: () => set({ terrain: {} }),
}));
