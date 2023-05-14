import { useContext, useMemo } from 'react';
import { createCtx } from './CreateCtx';

type State = { [tile: number]: string };

type Action = { type: 'add_terrain'; tile: number; terrain: string } | { type: 'reset' };

const initialState: State = {};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'add_terrain':
      return { ...state, [action.tile]: action.terrain };
    case 'reset':
      return initialState;
    default:
      throw new Error(`Unknown action for RoomTerrainContext: ${action}`);
  }
}

const [ctx, RoomTerrainProvider] = createCtx(reducer, initialState);

function useRoomTerrain() {
  const context = useContext(ctx);
  if (context === undefined) {
    throw new Error('useRoomTerrain must be used within a RoomTerrainProvider');
  }
  const { state, dispatch } = context;
  return useMemo(
    () => ({
      roomTerrain: state,
      updateRoomTerrain: dispatch,
    }),
    [state, dispatch]
  );
}

export { RoomTerrainProvider, useRoomTerrain };
