import { create } from 'zustand';
import { ROOM_GRID } from '@/utils/constants';

interface State {
  sources: Record<number, boolean>;
  minerals: Record<number, string | null>;
  addSource: (tile: number) => void;
  removeSource: (tile: number) => void;
  addMineral: (tile: number, type: string) => void;
  removeMineral: (tile: number) => void;
  resetSources: () => void;
  resetMineral: () => void;
}

const initialSources = ROOM_GRID.reduce((acc, tile) => ({ ...acc, [tile]: false }), {});
const initialMinerals = ROOM_GRID.reduce((acc, tile) => ({ ...acc, [tile]: null }), {});

export const useTileObjects = create<State>((set, get) => ({
  sources: initialSources,
  minerals: initialMinerals,
  addSource: (tile) => {
    const { sources } = get();
    const existingSources = Object.keys(sources).filter((k) => sources[+k]);
    const removeSources = existingSources.length > 1 ? existingSources : [];
    return set((state) => ({
      sources: { ...state.sources, ...removeSources.reduce((acc, k) => ({ acc, [k]: false }), {}), [tile]: true },
    }));
  },
  removeSource: (tile) => set((state) => ({ sources: { ...state.sources, [tile]: false } })),
  addMineral: (tile, type) => {
    const { minerals } = get();
    const removeMinerals = Object.keys(minerals).filter((k) => minerals[+k]);
    return set((state) => ({
      minerals: { ...state.minerals, ...removeMinerals.reduce((acc, k) => ({ acc, [k]: null }), {}), [tile]: type },
    }));
  },
  removeMineral: (tile) => set((state) => ({ minerals: { ...state.minerals, [tile]: null } })),
  resetSources: () => set({ sources: initialSources }),
  resetMineral: () => set({ minerals: initialMinerals }),
}));
