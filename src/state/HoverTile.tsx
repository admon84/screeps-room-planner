import { create } from 'zustand';

interface State {
  tile: number | null;
  setHover: (tile: number) => void;
  reset: () => void;
}

export const useHoverTile = create<State>((set) => ({
  tile: null,
  setHover: (tile) => set({ tile }),
  reset: () => set({ tile: null }),
}));
