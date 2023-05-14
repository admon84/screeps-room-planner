import { useContext, useState, createContext, PropsWithChildren } from 'react';

type State = {
  roomGrid: { [tile: number]: string[] };
  addRoomGridStructure: (tile: number, structure: string) => void;
  removeRoomGridStructure: (tile: number, structure: string) => void;
  resetRoomGrid: () => void;
};

const RoomGridContext = createContext<State | null>(null);

export const initialState: State['roomGrid'] = {};

export const RoomGridProvider = ({ children }: PropsWithChildren) => {
  const [roomGrid, setRoomGrid] = useState(initialState);

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
    setRoomGrid(initialState);
  };

  return (
    <RoomGridContext.Provider value={{ roomGrid, addRoomGridStructure, removeRoomGridStructure, resetRoomGrid }}>
      {children}
    </RoomGridContext.Provider>
  );
};

export function useRoomGrid() {
  const context = useContext(RoomGridContext);
  if (!context) {
    throw new Error('useRoomGrid must be used within a RoomGridProvider');
  }
  return context;
}
