import { create } from 'zustand';
import { RoomPosition } from '../utils/types';

interface State {
  positions: Record<string, ReadonlyArray<RoomPosition>>;
  getPlacedCount: (structure: string) => number;
  addStructure: (structure: string, position: RoomPosition) => void;
  removeStructure: (structure: string, position: RoomPosition) => void;
  reset: () => void;
}

export const useStructurePositions = create<State>((set, get) => ({
  positions: {},
  getPlacedCount: (structure: string) => get().positions[structure]?.length || 0,
  addStructure: (structure: string, position: RoomPosition) =>
    set((state) => ({
      positions: {
        ...state.positions,
        [structure]: [...(state.positions[structure] ?? []), { x: position.x, y: position.y }],
      },
    })),
  removeStructure: (structure: string, position: RoomPosition) =>
    set((state) => {
      const roomPositions = (state.positions[structure] ?? []).filter(
        ({ x, y }) => !(x === position.x && y === position.y)
      );
      if (roomPositions.length === 0) {
        // destructure state to clean up (take out structures with empty roomPositions[])
        const { [structure]: _, ...newState } = state.positions;
        return { positions: newState };
      }
      return {
        positions: {
          ...state.positions,
          [structure]: roomPositions,
        },
      };
    }),
  reset: () => set({ positions: {} }),
}));
