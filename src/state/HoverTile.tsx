import { create } from 'zustand';

interface State {
  tile: number | null;
  reset: () => void;
}

export const useHoverTile = create<State>((set) => ({
  tile: null,
  reset: () => set({ tile: null }),
}));
