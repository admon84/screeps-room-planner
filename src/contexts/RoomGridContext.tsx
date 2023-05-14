import { useContext, useMemo } from 'react';
import { createCtx } from './CreateCtx';

type State = { [tile: number]: string[] };

type Action =
  | { type: 'add_structure'; tile: number; structure: string }
  | { type: 'remove_structure'; tile: number; structure: string }
  | { type: 'reset' };

const initialState: State = {};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'add_structure':
      return { ...state, [action.tile]: [...(state[action.tile] || []), action.structure] };
    case 'remove_structure':
      return { ...state, [action.tile]: (state[action.tile] || []).filter((s) => s !== action.structure) };
    case 'reset':
      return initialState;
    default:
      throw new Error(`Unknown action for RoomGridContext: ${action}`);
  }
}

const [ctx, RoomGridProvider] = createCtx(reducer, initialState);

function useRoomGrid() {
  const context = useContext(ctx);
  if (context === undefined) {
    throw new Error('useRoomGrid must be used within a RoomGridProvider');
  }
  const { state, dispatch } = context;
  return useMemo(
    () => ({
      roomGrid: state,
      updateRoomGrid: dispatch,
    }),
    [state, dispatch]
  );
}

export { RoomGridProvider, useRoomGrid };
