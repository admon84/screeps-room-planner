import { create } from 'zustand';
import type { Point } from '@/types';

type State = {
  hoverRoomPos: Point | null;
  setHoverRoomPos: (position: Point | null) => void;
};

/**
 * The room tile currently under the cursor, published by the canvas so HoverTilePanel can read it
 * without being handed a renderer reference.
 */
export const useGameAppStore = create<State>((set) => ({
  hoverRoomPos: null,
  setHoverRoomPos: (position) => set(() => ({ hoverRoomPos: position })),
}));
