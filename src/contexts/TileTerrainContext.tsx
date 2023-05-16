import { useContext, useMemo } from 'react';
import { createCtx } from './CreateCtx';

type State = { [tile: number]: string };

type Action = { type: 'set_terrain'; tile: number; terrain: string } | { type: 'reset' };

const initialState: State = {};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'set_terrain':
      return { ...state, [action.tile]: action.terrain };
    case 'reset':
      return initialState;
    default:
      throw new Error(`Unknown action for TileTerrainContext: ${action}`);
  }
}

const [ctx, TileTerrainProvider] = createCtx(reducer, initialState);

function useTileTerrain() {
  const context = useContext(ctx);
  if (context === undefined) {
    throw new Error('useTileTerrain must be used within a TileTerrainProvider');
  }
  const { state, dispatch } = context;
  return useMemo(
    () => ({
      tileTerrain: state,
      updateTileTerrain: dispatch,
    }),
    [state, dispatch]
  );
}

export { TileTerrainProvider, useTileTerrain };
