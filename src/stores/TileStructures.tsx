import { create } from 'zustand';
import { ROOM_GRID } from '@/utils/constants';

interface State {
  structures: Record<number, string[]>;
  getStructures: (tile: number) => string[];
  addStructure: (tile: number, structure: string) => void;
  removeStructure: (tile: number, structure: string) => void;
  reset: () => void;
}

const initialStructures = ROOM_GRID.reduce((acc, tile) => ({ ...acc, [tile]: [] }), {});

export const useTileStructures = create<State>((set, get) => ({
  structures: initialStructures,
  getStructures: (tile) => get().structures[tile],
  addStructure: (tile, structure) =>
    set((state) => ({ structures: { ...state.structures, [tile]: [...state.structures[tile], structure] } })),
  removeStructure: (tile, structure) =>
    set((state) => ({
      structures: { ...state.structures, [tile]: state.structures[tile].filter((s) => s !== structure) },
    })),
  reset: () => set({ structures: initialStructures }),
}));
