import { useContext, useMemo } from 'react';
import { createCtx } from './CreateCtx';

type State = {
  tile: number;
  x: number;
  y: number;
};

type Action = { type: 'set_hover'; tile: number; x: number; y: number } | { type: 'reset' };

const fallbackValue = -1;
const initialState = { tile: fallbackValue, x: fallbackValue, y: fallbackValue };

function reducer(_: State, action: Action) {
  switch (action.type) {
    case 'set_hover':
      return { tile: action.tile, x: action.x, y: action.y };
    case 'reset':
      return initialState;
    default:
      throw new Error(`Unknown action for RoomGridContext: ${action}`);
  }
}

const [ctx, HoverTileProvider] = createCtx(reducer, initialState);

function useHoverTile() {
  const context = useContext(ctx);
  if (context === undefined) {
    throw new Error('useHoverTile must be used within a HoverTileProvider');
  }
  const { state, dispatch } = context;
  return useMemo(
    () => ({
      hover: state,
      updateHover: dispatch,
    }),
    [dispatch, state]
  );
}

export { HoverTileProvider, initialState, useHoverTile };
