import { create } from 'zustand';
import { GameObject } from '@/utils/gameObjects';

type State = {
  objects: GameObject[];
  addObject: (object: GameObject) => void;
  removeObject: (object: GameObject) => void;
};

export const useGameObjectStore = create<State>((set) => ({
  objects: [],
  addObject: (object) =>
    set((state) => {
      const existingObject = state.objects.find((o) => o.x === object.x && o.y === object.y);

      if (existingObject) {
        return state;
      }

      // If there's no existing object, add the new object
      return {
        objects: [...state.objects, object],
      };
    }),
  removeObject: (object) =>
    set((state) => ({
      objects: state.objects.filter(
        (o) => !(o.x === object.x && o.y === object.y) || (o.type && object.type && o.type !== object.type)
      ),
    })),
}));
