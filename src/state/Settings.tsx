import { create } from 'zustand';
import { MAX_RCL } from '../utils/constants';

interface State {
  settings: {
    codeDrawerOpen: boolean;
    brush: string | null;
    rcl: number;
    room: string;
    shard: string;
    zoom: number;
  };
  setBrush: (brush: string) => void;
  setRCL: (rcl: number) => void;
  setRoom: (room: string) => void;
  setShard: (shard: string) => void;
  setZoom: (zoom: number) => void;
  toggleCodeDrawer: () => void;
  resetBrush: () => void;
}

const initialSettings = {
  codeDrawerOpen: false,
  brush: null,
  rcl: MAX_RCL,
  room: 'E3S1',
  shard: 'shard0',
  zoom: 1.0,
};

export const useSettings = create<State>((set) => ({
  settings: initialSettings,
  setBrush: (brush) => set((state) => ({ settings: { ...state.settings, brush } })),
  setRCL: (rcl) => set((state) => ({ settings: { ...state.settings, rcl } })),
  setRoom: (room) => set((state) => ({ settings: { ...state.settings, room } })),
  setShard: (shard) => set((state) => ({ settings: { ...state.settings, shard } })),
  setZoom: (zoom) => set((state) => ({ settings: { ...state.settings, zoom } })),
  toggleCodeDrawer: () =>
    set((state) => ({ settings: { ...state.settings, codeDrawerOpen: !state.settings.codeDrawerOpen } })),
  resetBrush: () => set((state) => ({ settings: { ...state.settings, brush: initialSettings.brush } })),
}));
