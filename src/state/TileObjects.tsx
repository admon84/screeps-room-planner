import { create } from 'zustand';

interface State {
  sources: number[];
  mineral: { tile: number; type: string } | null;
  addSource: (tile: number) => void;
  addMineral: (tile: number, type: string) => void;
  resetSources: () => void;
  removeSource: (tile: number) => void;
  resetMineral: () => void;
}

const initial = {
  sources: [],
  mineral: null,
};

export const useTileObjects = create<State>((set, get) => ({
  sources: initial.sources,
  mineral: initial.mineral,
  addSource: (tile) =>
    set((state) => ({
      sources: [...(state.sources.length ? [state.sources[state.sources.length - 1]] : []), tile],
    })),
  addMineral: (tile, type) =>
    set({
      mineral: { tile, type },
    }),
  resetSources: () => set({ sources: initial.sources }),
  removeSource: (tile: number) =>
    set((state) => ({
      sources: state.sources.filter((t) => t !== tile),
    })),
  resetMineral: () => set({ mineral: initial.mineral }),
}));
