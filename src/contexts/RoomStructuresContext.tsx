import { useContext, useState, createContext, PropsWithChildren, useMemo } from 'react';
import { RoomPosition } from '../utils/types';

type State = { [structure: string]: RoomPosition[] };

type Context = {
  roomStructures: State;
  addRoomStructure: (structure: string, position: RoomPosition) => void;
  removeRoomStructure: (structure: string, position: RoomPosition) => void;
  resetRoomStructures: () => void;
};

const RoomStructuresContext = createContext<Context | null>(null);

export const RoomStructuresProvider = ({ children }: PropsWithChildren) => {
  const [roomStructures, setRoomStructures] = useState<State>({});

  const value = useMemo(() => {
    const addRoomStructure = (structure: string, position: RoomPosition) => {
      setRoomStructures((current) => {
        const positions = [...(current[structure] || []), position];
        return { ...current, [structure]: [...new Set(positions)] };
      });
    };

    const removeRoomStructure = (structure: string, position: RoomPosition) => {
      setRoomStructures((current) => {
        const roomPositions = (current[structure] || []).filter((p) => !(p.x === position.x && p.y === position.y));
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
      setRoomStructures({});
    };

    return { roomStructures, addRoomStructure, removeRoomStructure, resetRoomStructures };
  }, [roomStructures]);

  return <RoomStructuresContext.Provider value={value}>{children}</RoomStructuresContext.Provider>;
};

export function useRoomStructures() {
  const context = useContext(RoomStructuresContext);
  if (!context) {
    throw new Error('useRoomStructures must be used within a RoomStructuresProvider');
  }
  return context;
}
