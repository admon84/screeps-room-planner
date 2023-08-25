import { create } from 'zustand';
import { GRID_SIZE } from '../utils/constants';

interface State {
  structures: Record<number, ReadonlyArray<string>>;
  getStructures: (tile: number) => ReadonlyArray<string>;
  addStructure: (tile: number, structure: string) => void;
  removeStructure: (tile: number, structure: string) => void;
  reset: () => void;
}

// fill out the initial structures object with keys for all possible tiles
// this makes it so RoomGridTile will only re-render when the list of structures changes for the related tile
const initialStructures = Array.from(Array(GRID_SIZE).keys()).reduce((acc, i) => ({ ...acc, [i]: [] }), {});

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
