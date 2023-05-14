import { useContext, useState, createContext, PropsWithChildren } from 'react';

type State = {
  roomTerrain: { [tile: number]: string };
  updateRoomTerrain: (tile: number, terrain: string) => void;
  resetRoomTerrain: () => void;
};

const RoomTerrainContext = createContext<State | null>(null);

const initialState: State['roomTerrain'] = {};

export const RoomTerrainProvider = ({ children }: PropsWithChildren) => {
  const [roomTerrain, setRoomTerrain] = useState(initialState);

  const updateRoomTerrain = (tile: number, terrain: string) => {
    setRoomTerrain((current) => ({ ...current, [tile]: terrain }));
  };

  const resetRoomTerrain = () => {
    setRoomTerrain(initialState);
  };

  return (
    <RoomTerrainContext.Provider value={{ roomTerrain, updateRoomTerrain, resetRoomTerrain }}>
      {children}
    </RoomTerrainContext.Provider>
  );
};

export function useRoomTerrain() {
  const context = useContext(RoomTerrainContext);
  if (!context) {
    throw new Error('useRoomTerrain must be used within a RoomTerrainProvider');
  }
  return context;
}
