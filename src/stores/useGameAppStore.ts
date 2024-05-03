import { create } from 'zustand';
import { GameRenderer } from '@screeps/renderer';
import type { Point } from '@/types';

type State = {
  gameApp: GameRenderer | null;
  hoverRoomPos: Point | null;
  setGameApp: (gameApp: GameRenderer | null) => void;
  setHoverRoomPos: (position: Point | null) => void;
};

export const useGameAppStore = create<State>((set) => ({
  gameApp: null,
  hoverRoomPos: null,
  setGameApp: (gameApp) =>
    set(() => ({
      gameApp,
    })),
  setHoverRoomPos: (position) =>
    set(() => ({
      hoverRoomPos: position,
    })),
}));
