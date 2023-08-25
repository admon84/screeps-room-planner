import { create } from 'zustand';
import { CONTROLLER_STRUCTURES } from '../utils/constants';

interface State {
  positions: Record<string, ReadonlyArray<string>>;
  getPlacedCount: (structure: string) => number;
  addStructure: (structure: string, position: string) => void;
  removeStructure: (structure: string, position: string) => void;
  reset: () => void;
}

// fill out the initial positions object with keys for all possible structures
const initialPositions = Object.keys(CONTROLLER_STRUCTURES).reduce((acc, s) => ({ ...acc, [s]: [] }), {});

export const useStructurePositions = create<State>((set, get) => ({
  positions: initialPositions,
  getPlacedCount: (structure) => get().positions[structure].length,
  addStructure: (structure, position) =>
    set((state) => ({
      positions: {
        ...state.positions,
        [structure]: [...state.positions[structure], position],
      },
    })),
  removeStructure: (structure, position) =>
    set((state) => ({
      positions: { ...state.positions, [structure]: state.positions[structure].filter((p) => p !== position) },
    })),
  reset: () => set({ positions: initialPositions }),
}));
