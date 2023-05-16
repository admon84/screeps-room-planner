import { useContext, useState, createContext, PropsWithChildren, useMemo } from 'react';

type State = { [tile: number]: string };

type Context = {
  tileTerrain: State;
  updateTileTerrain: (tile: number, terrain: string) => void;
  resetTileTerrain: () => void;
};

const TileTerrainContext = createContext<Context | null>(null);

export const TileTerrainProvider = ({ children }: PropsWithChildren) => {
  const [tileTerrain, setTileTerrain] = useState<State>({});

  const value = useMemo(() => {
    const updateTileTerrain = (tile: number, terrain: string) => {
      setTileTerrain((current) => ({ ...current, [tile]: terrain }));
    };

    const resetTileTerrain = () => {
      setTileTerrain({});
    };

    return { tileTerrain, updateTileTerrain, resetTileTerrain };
  }, [tileTerrain]);

  return <TileTerrainContext.Provider value={value}>{children}</TileTerrainContext.Provider>;
};

export function useTileTerrain() {
  const context = useContext(TileTerrainContext);
  if (!context) {
    throw new Error('useTileTerrain must be used within a TileTerrainProvider');
  }
  return context;
}
