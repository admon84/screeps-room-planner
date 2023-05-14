import { useContext, useMemo } from 'react';
import { RoomPosition } from '../utils/types';
import { createCtx } from './CreateCtx';

type State = { [structure: string]: RoomPosition[] };

type Action =
  | { type: 'add_structure'; structure: string; x: number; y: number }
  | { type: 'remove_structure'; structure: string; x: number; y: number }
  | { type: 'reset' };

const initialState: State = {};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'add_structure':
      return { ...state, [action.structure]: [...(state[action.structure] || []), { x: action.x, y: action.y }] };
    case 'remove_structure':
      const roomPositions = (state[action.structure] || []).filter(({ x, y }) => !(x === action.x && y === action.y));
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
      throw new Error(`Unknown action for RoomStructuresContext: ${action}`);
  }
}

const [ctx, RoomStructuresProvider] = createCtx(reducer, initialState);

function useRoomStructures() {
  const context = useContext(ctx);
  if (context === undefined) {
    throw new Error('useRoomStructures must be used within a RoomStructuresProvider');
  }
  const { state, dispatch } = context;
  return useMemo(
    () => ({
      roomStructures: state,
      updateRoomStructures: dispatch,
    }),
    [state, dispatch]
  );
}

export { RoomStructuresProvider, useRoomStructures };
