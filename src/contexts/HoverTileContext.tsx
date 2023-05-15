import { useContext, useState, createContext, PropsWithChildren, useMemo } from 'react';

type State = number | null;

type Context = {
  hoverTile: State;
  updateHoverTile: (tile: number) => void;
  resetHoverTile: () => void;
};

const HoverTileContext = createContext<Context | null>(null);

export const HoverTileProvider = ({ children }: PropsWithChildren) => {
  const [hoverTile, setHoverTile] = useState<State>(null);

  const value = useMemo(() => {
    const updateHoverTile = (tile: number) => {
      setHoverTile(tile);
    };

    const resetHoverTile = () => {
      setHoverTile(null);
    };

    return {
      hoverTile,
      updateHoverTile,
      resetHoverTile,
    };
  }, [hoverTile]);

  return <HoverTileContext.Provider value={value}>{children}</HoverTileContext.Provider>;
};

export function useHoverTile() {
  const context = useContext(HoverTileContext);
  if (!context) {
    throw new Error('useHoverTile must be used within a HoverTileProvider');
  }
  return context;
}
