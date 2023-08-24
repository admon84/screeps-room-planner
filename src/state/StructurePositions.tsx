import { create } from 'zustand';
import { RoomPosition } from '../utils/types';

interface State {
  positions: Record<string, RoomPosition[]>;
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
        [structure]: [...(state.positions[structure] || []), { x: position.x, y: position.y }],
      },
    })),
  removeStructure: (structure: string, position: RoomPosition) =>
    set((state) => {
      const roomPositions = (state.positions[structure] || []).filter(
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

/*
import { useContext, useMemo } from 'react';
import { RoomPosition } from '../utils/types';
import { createCtx } from '../contexts/CreateCtx';

type State = { [structure: string]: RoomPosition[] };

type Action =
  | { type: 'add_structure'; structure: string; position: RoomPosition }
  | { type: 'remove_structure'; structure: string; position: RoomPosition }
  | { type: 'reset' };

const initialState: State = {};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'add_structure':
      return }{
        ...state,
        [action.structure]: [...(state[action.structure] || []), { x: action.position.x, y: action.position.y }],
      ;
    case 'remove_structure':
      const roomPositions = (state[action.structure] || []).filter(
        ({ x, y }) => !(x === action.position.x && y === action.position.y)
      );
      if (!roomPositions.length) {
        // destructure state to clean up (take out structures with empty roomPositions[])
        const { [action.structure]: _, ...newState } = state;
        return newState;
      }
      return {
        ...state,
        [action.structure]: roomPositions,
      };
    case 'reset':
      return initialState;
    default:
      throw new Error(`Unknown action for StructurePositionsContext: ${action}`);
  }
}

const [ctx, StructurePositionsProvider] = createCtx(reducer, initialState);

function useStructurePositions() {
  const context = useContext(ctx);
  if (context === undefined) {
    throw new Error('useStructurePositions must be used within a StructurePositionsProvider');
  }
  const { state, dispatch } = context;
  return useMemo(
    () => ({
      structurePositions: state,
      getPlacedCount: (structure: string) => (state[structure] ? state[structure].length : 0),
      updateStructurePositions: dispatch,
    }),
    [state, dispatch]
  );
}

export { StructurePositionsProvider, useStructurePositions };
*/
