import { useContext, useState, createContext, PropsWithChildren, useMemo } from 'react';

type State = { [tile: number]: string[] };

type Context = {
  roomGrid: State;
  addRoomGridStructure: (tile: number, structure: string) => void;
  removeRoomGridStructure: (tile: number, structure: string) => void;
  resetRoomGrid: () => void;
};

const RoomGridContext = createContext<Context | null>(null);

export const RoomGridProvider = ({ children }: PropsWithChildren) => {
  const [roomGrid, setRoomGrid] = useState<State>({});

  const value = useMemo(() => {
    const addRoomGridStructure = (tile: number, structure: string) => {
      setRoomGrid((current) => {
        const structures = [...(current[tile] || []), structure];
        return { ...current, [tile]: [...new Set(structures)] };
      });
    };

    const removeRoomGridStructure = (tile: number, structure: string) => {
      setRoomGrid((current) => ({ ...current, [tile]: (current[tile] || []).filter((s) => s !== structure) }));
    };

    const resetRoomGrid = () => {
      setRoomGrid({});
    };

    return {
      roomGrid,
      addRoomGridStructure,
      removeRoomGridStructure,
      resetRoomGrid,
    };
  }, [roomGrid]);

  return <RoomGridContext.Provider value={value}>{children}</RoomGridContext.Provider>;
};

export function useRoomGrid() {
  const context = useContext(RoomGridContext);
  if (!context) {
    throw new Error('useRoomGrid must be used within a RoomGridProvider');
  }
  return context;
}
