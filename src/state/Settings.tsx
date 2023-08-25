import { create } from 'zustand';
import { MAX_RCL } from '../utils/constants';

interface State {
  codeDrawerOpen: boolean;
  brush: string | null;
  rcl: number;
  room: string;
  shard: string;
  setBrush: (brush: string) => void;
  setRCL: (rcl: number) => void;
  setRoom: (room: string) => void;
  setShard: (shard: string) => void;
  toggleCodeDrawer: () => void;
  unsetBrush: () => void;
}

export const useSettings = create<State>((set) => ({
  codeDrawerOpen: false,
  brush: null,
  rcl: MAX_RCL,
  room: 'E3S1',
  shard: 'shard0',
  setBrush: (brush: string) => set({ brush }),
  setRCL: (rcl: number) => set({ rcl }),
  setRoom: (room: string) => set({ room }),
  setShard: (shard: string) => set({ shard }),
  toggleCodeDrawer: () => set((state) => ({ codeDrawerOpen: !state.codeDrawerOpen })),
  unsetBrush: () => set({ brush: null }),
}));
