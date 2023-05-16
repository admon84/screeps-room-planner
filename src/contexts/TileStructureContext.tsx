import { useContext, useState, createContext, PropsWithChildren, useMemo } from 'react';

type State = { [tile: number]: string[] };

type Context = {
  tileStructures: State;
  addTileStructure: (tile: number, structure: string) => void;
  removeTileStructure: (tile: number, structure: string) => void;
  resetTileStructures: () => void;
};

const TileStructureContext = createContext<Context | null>(null);

export const TileStructureProvider = ({ children }: PropsWithChildren) => {
  const [tileStructures, setTileStructure] = useState<State>({});

  const value = useMemo(() => {
    const addTileStructure = (tile: number, structure: string) => {
      setTileStructure((current) => {
        const structures = [...(current[tile] || []), structure];
        return { ...current, [tile]: [...new Set(structures)] };
      });
    };

    const removeTileStructure = (tile: number, structure: string) => {
      setTileStructure((current) => ({ ...current, [tile]: (current[tile] || []).filter((s) => s !== structure) }));
    };

    const resetTileStructures = () => {
      setTileStructure({});
    };

    return {
      tileStructures,
      addTileStructure,
      removeTileStructure,
      resetTileStructures,
    };
  }, [tileStructures]);

  return <TileStructureContext.Provider value={value}>{children}</TileStructureContext.Provider>;
};

export function useTileStructure() {
  const context = useContext(TileStructureContext);
  if (!context) {
    throw new Error('useTileStructure must be used within a TileStructureProvider');
  }
  return context;
}
