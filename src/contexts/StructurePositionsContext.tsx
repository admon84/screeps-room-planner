import { useContext, useState, createContext, PropsWithChildren, useMemo } from 'react';
import { RoomPosition } from '../utils/types';

type State = { [structure: string]: RoomPosition[] };

type Context = {
  structurePositions: State;
  getPlacedStructureCount: (structure: string) => number;
  addStructurePosition: (structure: string, position: RoomPosition) => void;
  removeStructurePosition: (structure: string, position: RoomPosition) => void;
  resetStructurePositions: () => void;
};

const StructurePositionsContext = createContext<Context | null>(null);

export const StructurePositionsProvider = ({ children }: PropsWithChildren) => {
  const [structurePositions, setStructurePositions] = useState<State>({});

  const value = useMemo(() => {
    const getPlacedStructureCount = (structure: string) => {
      return structurePositions[structure] ? structurePositions[structure].length : 0;
    };

    const addStructurePosition = (structure: string, position: RoomPosition) => {
      setStructurePositions((current) => {
        const positions = [...(current[structure] || []), position];
        return { ...current, [structure]: [...new Set(positions)] };
      });
    };

    const removeStructurePosition = (structure: string, position: RoomPosition) => {
      setStructurePositions((current) => {
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

    const resetStructurePositions = () => {
      setStructurePositions({});
    };

    return {
      structurePositions,
      getPlacedStructureCount,
      addStructurePosition,
      removeStructurePosition,
      resetStructurePositions,
    };
  }, [structurePositions]);

  return <StructurePositionsContext.Provider value={value}>{children}</StructurePositionsContext.Provider>;
};

export function useStructurePositions() {
  const context = useContext(StructurePositionsContext);
  if (!context) {
    throw new Error('useStructurePositions must be used within a StructurePositionsProvider');
  }
  return context;
}
