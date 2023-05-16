import { useContext, useMemo } from 'react';
import { RoomPosition } from '../utils/types';
import { createCtx } from './CreateCtx';

type State = { [structure: string]: RoomPosition[] };

type Action =
  | { type: 'add_structure'; structure: string; position: RoomPosition }
  | { type: 'remove_structure'; structure: string; position: RoomPosition }
  | { type: 'reset' };

const initialState: State = {};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'add_structure':
      return {
        ...state,
        [action.structure]: [...(state[action.structure] || []), { x: action.position.x, y: action.position.y }],
      };
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
