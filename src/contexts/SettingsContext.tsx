import { useContext, useMemo } from 'react';
import { createCtx } from './CreateCtx';
import { MAX_RCL } from '../utils/constants';

const initialState = {
  codeDrawerOpen: false,
  brush: '' || null,
  rcl: MAX_RCL,
  room: 'E3S1',
  shard: 'shard0',
};

type State = {
  codeDrawerOpen: boolean;
  brush: string | null;
  rcl: number;
  room: string;
  shard: string;
};

type Action =
  | { type: 'set_brush'; brush: string }
  | { type: 'set_rcl'; rcl: number }
  | { type: 'set_room'; room: string }
  | { type: 'set_shard'; shard: string }
  | { type: 'open_code_drawer' }
  | { type: 'unset_brush' };

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'set_brush':
      return { ...state, brush: action.brush };
    case 'set_rcl':
      return { ...state, rcl: action.rcl };
    case 'set_room':
      return { ...state, room: action.room };
    case 'set_shard':
      return { ...state, shard: action.shard };
    case 'open_code_drawer':
      return { ...state, codeDrawerOpen: !state.codeDrawerOpen };
    case 'unset_brush':
      return { ...state, brush: null };
    default:
      throw new Error(`Unknown action for SettingsContext: ${action}`);
  }
}

const [ctx, SettingsProvider] = createCtx(reducer, initialState);

function useSettings() {
  const context = useContext(ctx);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  const { state, dispatch } = context;
  return useMemo(
    () => ({
      settings: state,
      updateSettings: dispatch,
    }),
    [state, dispatch]
  );
}

export { SettingsProvider, useSettings };
