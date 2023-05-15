import { useContext, useState, createContext, PropsWithChildren, useMemo } from 'react';

type State = { [tile: number]: string };

type Context = {
  roomTerrain: State;
  updateRoomTerrain: (tile: number, terrain: string) => void;
  resetRoomTerrain: () => void;
};

const RoomTerrainContext = createContext<Context | null>(null);

export const RoomTerrainProvider = ({ children }: PropsWithChildren) => {
  const [roomTerrain, setRoomTerrain] = useState<State>({});

  const value = useMemo(() => {
    const updateRoomTerrain = (tile: number, terrain: string) => {
      setRoomTerrain((current) => ({ ...current, [tile]: terrain }));
    };

    const resetRoomTerrain = () => {
      setRoomTerrain({});
    };

    return { roomTerrain, updateRoomTerrain, resetRoomTerrain };
  }, [roomTerrain]);

  return <RoomTerrainContext.Provider value={value}>{children}</RoomTerrainContext.Provider>;
};

export function useRoomTerrain() {
  const context = useContext(RoomTerrainContext);
  if (!context) {
    throw new Error('useRoomTerrain must be used within a RoomTerrainProvider');
  }
  return context;
}
