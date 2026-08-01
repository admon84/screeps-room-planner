import { create } from 'zustand';
import { GameObject } from '@/utils/gameObjects';
import { STRUCTURE_BRUSHES } from '@/utils/constants';
import { typesToRemoveForType } from '@/utils/helpers';

type State = {
  objects: GameObject[];
  addObject: (object: GameObject) => void;
  removeObjectsAt: (x: number, y: number) => void;
  removeStructuresAt: (x: number, y: number) => void;
  setObjects: (objects: GameObject[]) => void;
  reset: () => void;
};

/**
 * Drops every object at (x, y) whose type is in `types`; `types === null` clears the tile entirely.
 * Untyped objects are always dropped -- they cannot be rendered and only arrive from bad input.
 */
const clearTypesAt = (objects: GameObject[], x: number, y: number, types: Set<string> | null) =>
  objects.filter((o) => {
    if (o.x !== x || o.y !== y) return true;
    if (!o.type) return false;
    return types !== null && !types.has(o.type);
  });

export const useGameObjectStore = create<State>((set) => ({
  objects: [],
  addObject: (object) =>
    set((state) => {
      // A typeless object would render as nothing and break applyState, so refuse it outright
      // rather than storing something the renderer cannot draw.
      if (!object.type) return state;

      const displaced = new Set(typesToRemoveForType(object.type));
      return { objects: [...clearTypesAt(state.objects, object.x, object.y, displaced), object] };
    }),
  removeObjectsAt: (x, y) => set((state) => ({ objects: clearTypesAt(state.objects, x, y, null) })),
  // Terrain walls evict structures but leave sources and minerals in place.
  removeStructuresAt: (x, y) =>
    set((state) => ({ objects: clearTypesAt(state.objects, x, y, new Set(Object.keys(STRUCTURE_BRUSHES))) })),
  setObjects: (objects) => set(() => ({ objects })),
  reset: () => set(() => ({ objects: [] })),
}));

/** Placement counts keyed by structure type, for the drawer's `placed / total` badges. */
export const countPlacedByType = (objects: GameObject[]) =>
  objects.reduce<Record<string, number>>((counts, o) => {
    if (o.type) counts[o.type] = (counts[o.type] ?? 0) + 1;
    return counts;
  }, {});
