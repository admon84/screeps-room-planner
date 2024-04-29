import { create } from 'zustand';
import { CONTROLLER_STRUCTURES } from '@/utils/constants';

interface State {
  positions: Record<string, string[]>;
  getPlacedCount: (structure: string | null) => number;
  addStructure: (structure: string, position: string) => void;
  removeStructure: (structure: string, position: string) => void;
  reset: () => void;
}

const initialPositions = Object.keys(CONTROLLER_STRUCTURES).reduce((acc, s) => ({ ...acc, [s]: [] }), {});

export const useStructurePositions = create<State>((set, get) => ({
  positions: initialPositions,
  getPlacedCount: (structure) => (structure ? get().positions[structure].length : 0),
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
