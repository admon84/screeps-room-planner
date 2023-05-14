import { useContext, useState, createContext, PropsWithChildren } from 'react';
import { RoomPosition } from '../utils/types';

type State = {
  roomStructures: { [structure: string]: RoomPosition[] };
  addRoomStructure: (structure: string, position: RoomPosition) => void;
  removeRoomStructure: (structure: string, position: RoomPosition) => void;
  resetRoomStructures: () => void;
};

const RoomStructuresContext = createContext<State | null>(null);

export const initialState: State['roomStructures'] = {};

export const RoomStructuresProvider = ({ children }: PropsWithChildren) => {
  const [roomStructures, setRoomStructures] = useState(initialState);

  const addRoomStructure = (structure: string, position: RoomPosition) => {
    setRoomStructures((current) => {
      const positions = [...(current[structure] || []), position];
      return { ...current, [structure]: [...new Set(positions)] };
    });
  };

  const removeRoomStructure = (structure: string, position: RoomPosition) => {
    setRoomStructures((current) => {
      const roomPositions = (current[structure] || []).filter((p) => p !== position);
      if (!roomPositions.length) {
        // destructure state to clean up (take out structures with empty roomPositions[])
        const { [structure]: _, ...newState } = current;
        return newState;
      }
      return {
        ...current,
        [structure]: roomPositions,
      };
    });
  };

  const resetRoomStructures = () => {
    setRoomStructures(initialState);
  };

  return (
    <RoomStructuresContext.Provider
      value={{ roomStructures, addRoomStructure, removeRoomStructure, resetRoomStructures }}
    >
      {children}
    </RoomStructuresContext.Provider>
  );
};

export function useRoomStructures() {
  const context = useContext(RoomStructuresContext);
  if (!context) {
    throw new Error('useRoomStructures must be used within a RoomStructuresProvider');
  }
  return context;
}
