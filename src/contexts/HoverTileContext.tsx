import { useContext, useState, createContext, PropsWithChildren } from 'react';

type State = {
  hoverTile: {
    tile: number | null;
    x: number | null;
    y: number | null;
  };
  setHoverTile: (value: { tile: number; x: number; y: number }) => void;
  resetHoverTile: () => void;
};

const HoverTileContext = createContext<State | null>(null);

const initialState: State['hoverTile'] = { tile: null, x: null, y: null };

export const HoverTileProvider = ({ children }: PropsWithChildren) => {
  const [hoverTile, setHoverTile] = useState(initialState);

  const resetHoverTile = () => {
    setHoverTile(initialState);
  };

  return (
    <HoverTileContext.Provider value={{ hoverTile, setHoverTile, resetHoverTile }}>
      {children}
    </HoverTileContext.Provider>
  );
};

export function useHoverTile() {
  const context = useContext(HoverTileContext);
  if (!context) {
    throw new Error('useHoverTile must be used within a HoverTileProvider');
  }
  return context;
}
