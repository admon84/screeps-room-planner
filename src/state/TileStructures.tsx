import { create } from 'zustand';

interface State {
  structures: Record<number, string[]>;
  addStructure: (tile: number, structure: string) => void;
  removeStructure: (tile: number, structure: string) => void;
  reset: () => void;
}

export const useTileStructures = create<State>((set) => ({
  structures: {},
  addStructure: (tile: number, structure: string) =>
    set((state) => ({ structures: { ...state.structures, [tile]: [...(state.structures[tile] || []), structure] } })),
  removeStructure: (tile: number, structure: string) =>
    set((state) => ({
      structures: { ...state.structures, [tile]: (state.structures[tile] || []).filter((s) => s !== structure) },
    })),
  reset: () => set({ structures: {} }),
}));
