import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BrushType, MAX_RCL } from '@/utils/constants';

interface State {
  settings: {
    brush: string | null;
    brushType: BrushType;
    debug: boolean;
    rcl: number;
    room: string;
    shard: string;
  };
  setBrush: (brush: string) => void;
  setBrushType: (brushType: BrushType) => void;
  setDebug: (debug: boolean) => void;
  setRCL: (rcl: number) => void;
  setRoom: (room: string) => void;
  setShard: (shard: string) => void;
  resetBrush: () => void;
}

const initialSettings = {
  brush: null,
  brushType: BrushType.Structure,
  debug: false,
  rcl: MAX_RCL,
  room: 'E3S1',
  shard: 'shard0',
};

export const useSettings = create<State>()(
  persist(
    (set) => ({
      settings: initialSettings,
      setBrush: (brush) => set((state) => ({ settings: { ...state.settings, brush } })),
      setBrushType: (brushType) => set((state) => ({ settings: { ...state.settings, brushType } })),
      setDebug: (debug) => set((state) => ({ settings: { ...state.settings, debug } })),
      setRCL: (rcl) => set((state) => ({ settings: { ...state.settings, rcl } })),
      setRoom: (room) => set((state) => ({ settings: { ...state.settings, room } })),
      setShard: (shard) => set((state) => ({ settings: { ...state.settings, shard } })),
      resetBrush: () => set((state) => ({ settings: { ...state.settings, brush: initialSettings.brush } })),
    }),
    {
      name: 'screeps-room-planner-settings',
      version: 1,
      // Only `debug` is durable. Persisting the brush would restore the app mid-paint-mode on reload,
      // and rcl/room/shard are per-session planning state.
      partialize: ({ settings: { debug } }) => ({ settings: { debug } }),
      merge: (persisted, current) => ({
        ...current,
        settings: { ...current.settings, ...(persisted as { settings?: Partial<State['settings']> })?.settings },
      }),
    }
  )
);
