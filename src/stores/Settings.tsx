import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BrushType, MAX_RCL, USER_ID } from '@/utils/constants';
import { ScreepsServer } from '@/utils/screepsApi';

interface State {
  settings: {
    blockEdges: boolean;
    brush: string | null;
    brushType: BrushType;
    debug: boolean;
    playerName: string;
    rcl: number;
    room: string;
    server: ScreepsServer;
    shard: string;
  };
  setBlockEdges: (blockEdges: boolean) => void;
  setBrush: (brush: string) => void;
  setBrushType: (brushType: BrushType) => void;
  setDebug: (debug: boolean) => void;
  setPlayerName: (playerName: string) => void;
  setRCL: (rcl: number) => void;
  setRoom: (room: string) => void;
  setServer: (server: ScreepsServer) => void;
  setShard: (shard: string) => void;
  resetBrush: () => void;
}

const initialSettings = {
  blockEdges: true,
  brush: null,
  brushType: BrushType.Structure,
  debug: false,
  playerName: USER_ID,
  rcl: MAX_RCL,
  room: 'W1N1',
  server: 'persistent' as ScreepsServer,
  shard: 'shard0',
};

export const useSettings = create<State>()(
  persist(
    (set) => ({
      settings: initialSettings,
      setBlockEdges: (blockEdges) => set((state) => ({ settings: { ...state.settings, blockEdges } })),
      setBrush: (brush) => set((state) => ({ settings: { ...state.settings, brush } })),
      setBrushType: (brushType) => set((state) => ({ settings: { ...state.settings, brushType } })),
      setDebug: (debug) => set((state) => ({ settings: { ...state.settings, debug } })),
      setPlayerName: (playerName) => set((state) => ({ settings: { ...state.settings, playerName } })),
      setRCL: (rcl) => set((state) => ({ settings: { ...state.settings, rcl } })),
      setRoom: (room) => set((state) => ({ settings: { ...state.settings, room } })),
      setServer: (server) => set((state) => ({ settings: { ...state.settings, server } })),
      setShard: (shard) => set((state) => ({ settings: { ...state.settings, shard } })),
      resetBrush: () => set((state) => ({ settings: { ...state.settings, brush: initialSettings.brush } })),
    }),
    {
      name: 'screeps-room-planner-settings',
      // Bumped past the short-lived renderer-settings shape so those persisted keys are dropped
      // rather than merged back in.
      version: 3,
      // The brush stays per-session: persisting it would restore the app mid-paint-mode on reload.
      // The room properties (playerName/rcl/room/shard) are durable so a plan's identity -- and the
      // badge the playerName drives -- survives a reload.
      partialize: ({ settings: { blockEdges, debug, playerName, rcl, room, shard } }) => ({
        settings: { blockEdges, debug, playerName, rcl, room, shard },
      }),
      merge: (persisted, current) => ({
        ...current,
        settings: { ...current.settings, ...(persisted as { settings?: Partial<State['settings']> })?.settings },
      }),
    }
  )
);
