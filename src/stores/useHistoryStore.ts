import { create } from 'zustand';
import { useGameObjectStore } from '@/stores/useGameObjectsStore';
import { useSettings } from '@/stores/Settings';
import { useTerrainStore } from '@/stores/useTerrainStore';
import { GameObject } from '@/utils/gameObjects';
import type { TerrainTile } from '@/types';

type Snapshot = { objects: GameObject[]; terrain: TerrainTile[]; rcl: number };

type State = {
  past: Snapshot[];
  future: Snapshot[];
  commit: () => void;
  undo: () => void;
  redo: () => void;
  clear: () => void;
};

const MAX_HISTORY = 50;

// Every store mutator replaces its array rather than mutating it, so holding the references is a
// safe snapshot -- do not "fix" this into a deep clone.
const snapshot = (): Snapshot => ({
  objects: useGameObjectStore.getState().objects,
  terrain: useTerrainStore.getState().terrain,
  rcl: useSettings.getState().settings.rcl,
});

const restore = ({ objects, terrain, rcl }: Snapshot) => {
  useGameObjectStore.getState().setObjects(objects);
  useTerrainStore.getState().setTerrain(terrain);
  useSettings.getState().setRCL(rcl);
};

export const useHistoryStore = create<State>((set, get) => ({
  past: [],
  future: [],
  commit: () => set((state) => ({ past: [...state.past, snapshot()].slice(-MAX_HISTORY), future: [] })),
  // Restoring is kept out of the `set` updater: writing to other stores while computing this one's
  // next state makes the updater order-dependent and impossible to run twice safely.
  undo: () => {
    const previous = get().past.at(-1);
    if (!previous) return;

    const current = snapshot();
    set((state) => ({ past: state.past.slice(0, -1), future: [...state.future, current] }));
    restore(previous);
  },
  redo: () => {
    const next = get().future.at(-1);
    if (!next) return;

    const current = snapshot();
    set((state) => ({ past: [...state.past, current].slice(-MAX_HISTORY), future: state.future.slice(0, -1) }));
    restore(next);
  },
  clear: () => set(() => ({ past: [], future: [] })),
}));
