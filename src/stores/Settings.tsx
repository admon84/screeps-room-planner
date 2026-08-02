import { create } from 'zustand';
import { BrushType, MAX_RCL } from '@/utils/constants';

interface State {
  settings: {
    brush: string | null;
    brushType: BrushType;
    rcl: number;
    room: string;
    shard: string;
  };
  setBrush: (brush: string) => void;
  setBrushType: (brushType: BrushType) => void;
  setRCL: (rcl: number) => void;
  setRoom: (room: string) => void;
  setShard: (shard: string) => void;
  resetBrush: () => void;
}

const initialSettings = {
  brush: null,
  brushType: BrushType.Structure,
  rcl: MAX_RCL,
  room: 'E3S1',
  shard: 'shard0',
};

export const useSettings = create<State>((set) => ({
  settings: initialSettings,
  setBrush: (brush) => set((state) => ({ settings: { ...state.settings, brush } })),
  setBrushType: (brushType) => set((state) => ({ settings: { ...state.settings, brushType } })),
  setRCL: (rcl) => set((state) => ({ settings: { ...state.settings, rcl } })),
  setRoom: (room) => set((state) => ({ settings: { ...state.settings, room } })),
  setShard: (shard) => set((state) => ({ settings: { ...state.settings, shard } })),
  resetBrush: () => set((state) => ({ settings: { ...state.settings, brush: initialSettings.brush } })),
}));
