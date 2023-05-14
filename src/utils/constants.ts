export const MAX_RCL = 8;

export const ROOM_SIZE = 50;

export const STRUCTURE_EXTENSION = 'extension';
export const STRUCTURE_RAMPART = 'rampart';
export const STRUCTURE_ROAD = 'road';
export const STRUCTURE_SPAWN = 'spawn';
export const STRUCTURE_LINK = 'link';
export const STRUCTURE_WALL = 'constructedWall';
export const STRUCTURE_CONTROLLER = 'controller';
export const STRUCTURE_STORAGE = 'storage';
export const STRUCTURE_TOWER = 'tower';
export const STRUCTURE_OBSERVER = 'observer';
export const STRUCTURE_POWER_SPAWN = 'powerSpawn';
export const STRUCTURE_EXTRACTOR = 'extractor';
export const STRUCTURE_LAB = 'lab';
export const STRUCTURE_TERMINAL = 'terminal';
export const STRUCTURE_CONTAINER = 'container';
export const STRUCTURE_NUKER = 'nuker';
export const STRUCTURE_FACTORY = 'factory';

export const TERRAIN_MASK_PLAIN = 0;
export const TERRAIN_MASK_WALL = 1;
export const TERRAIN_MASK_SWAMP = 2;

export const TERRAIN_PLAIN = 'plain';
export const TERRAIN_WALL = 'wall';
export const TERRAIN_SWAMP = 'swamp';

export const TERRAIN_MASK = {
  [TERRAIN_MASK_PLAIN]: TERRAIN_PLAIN,
  [TERRAIN_MASK_SWAMP]: TERRAIN_SWAMP,
  [TERRAIN_MASK_WALL]: TERRAIN_WALL,
};

export const CONTROLLER_STRUCTURES: Record<string, Record<number, number>> = {
  [STRUCTURE_CONTROLLER]: { 0: 1, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1 },
  [STRUCTURE_SPAWN]: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 2, 8: 3 },
  [STRUCTURE_EXTENSION]: { 2: 5, 3: 10, 4: 20, 5: 30, 6: 40, 7: 50, 8: 60 },
  [STRUCTURE_LINK]: { 5: 2, 6: 3, 7: 4, 8: 6 },
  [STRUCTURE_ROAD]: { 0: 2500, 1: 2500, 2: 2500, 3: 2500, 4: 2500, 5: 2500, 6: 2500, 7: 2500, 8: 2500 },
  [STRUCTURE_WALL]: { 2: 2500, 3: 2500, 4: 2500, 5: 2500, 6: 2500, 7: 2500, 8: 2500 },
  [STRUCTURE_RAMPART]: { 2: 2500, 3: 2500, 4: 2500, 5: 2500, 6: 2500, 7: 2500, 8: 2500 },
  [STRUCTURE_STORAGE]: { 4: 1, 5: 1, 6: 1, 7: 1, 8: 1 },
  [STRUCTURE_TOWER]: { 3: 1, 4: 1, 5: 2, 6: 2, 7: 3, 8: 6 },
  [STRUCTURE_OBSERVER]: { 8: 1 },
  [STRUCTURE_POWER_SPAWN]: { 8: 1 },
  [STRUCTURE_EXTRACTOR]: { 6: 1, 7: 1, 8: 1 },
  [STRUCTURE_TERMINAL]: { 6: 1, 7: 1, 8: 1 },
  [STRUCTURE_LAB]: { 6: 3, 7: 6, 8: 10 },
  [STRUCTURE_CONTAINER]: { 0: 5, 1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 5, 7: 5, 8: 5 },
  [STRUCTURE_NUKER]: { 8: 1 },
  [STRUCTURE_FACTORY]: { 7: 1, 8: 1 },
};

export const STRUCTURE_BRUSHES: Record<string, string> = {
  [STRUCTURE_CONTROLLER]: STRUCTURE_CONTROLLER,
  [STRUCTURE_SPAWN]: STRUCTURE_SPAWN,
  [STRUCTURE_CONTAINER]: STRUCTURE_CONTAINER,
  [STRUCTURE_EXTENSION]: STRUCTURE_EXTENSION,
  [STRUCTURE_TOWER]: STRUCTURE_TOWER,
  [STRUCTURE_STORAGE]: STRUCTURE_STORAGE,
  [STRUCTURE_LINK]: STRUCTURE_LINK,
  [STRUCTURE_TERMINAL]: STRUCTURE_TERMINAL,
  [STRUCTURE_LAB]: STRUCTURE_LAB,
  [STRUCTURE_EXTRACTOR]: STRUCTURE_EXTRACTOR,
  [STRUCTURE_FACTORY]: STRUCTURE_FACTORY,
  [STRUCTURE_OBSERVER]: STRUCTURE_OBSERVER,
  [STRUCTURE_POWER_SPAWN]: 'power spawn',
  [STRUCTURE_NUKER]: STRUCTURE_NUKER,
  [STRUCTURE_RAMPART]: STRUCTURE_RAMPART,
  [STRUCTURE_WALL]: 'wall',
  [STRUCTURE_ROAD]: STRUCTURE_ROAD,
};

export const EXTENSION_ENERGY_CAPACITY = {
  0: 50,
  1: 50,
  2: 50,
  3: 50,
  4: 50,
  5: 50,
  6: 50,
  7: 100,
  8: 200,
};

// prettier-ignore
export const SAMPLE_JSON = {
  rcl: 8,
  structures: {
    container: [{ x: 5, y: 5 },{ x: 7, y: 5 },{ x: 7, y: 7 },{ x: 5, y: 7 },{ x: 7, y: 9 }],
    extension: [{ x: 5, y: 1 },{ x: 7, y: 1 },{ x: 7, y: 3 },{ x: 8, y: 3 },{ x: 8, y: 2 },{ x: 9, y: 2 },{ x: 9, y: 3 },{ x: 9, y: 4 },{ x: 9, y: 5 },{ x: 10, y: 4 },{ x: 10, y: 3 },{ x: 10, y: 6 },{ x: 11, y: 6 },{ x: 11, y: 5 },{ x: 6, y: 10 },{ x: 6, y: 11 },{ x: 5, y: 11 },{ x: 4, y: 10 },{ x: 4, y: 9 },{ x: 5, y: 9 },{ x: 3, y: 10 },{ x: 3, y: 9 },{ x: 2, y: 9 },{ x: 2, y: 8 },{ x: 3, y: 8 },{ x: 3, y: 7 },{ x: 1, y: 7 },{ x: 1, y: 6 },{ x: 2, y: 6 },{ x: 1, y: 5 },{ x: 2, y: 4 },{ x: 3, y: 4 },{ x: 3, y: 5 },{ x: 2, y: 3 },{ x: 3, y: 3 },{ x: 3, y: 2 },{ x: 4, y: 2 },{ x: 4, y: 3 },{ x: 5, y: 3 },{ x: 2, y: 1 },{ x: 1, y: 2 },{ x: 1, y: 10 },{ x: 2, y: 11 },{ x: 11, y: 2 },{ x: 10, y: 1 },{ x: 0, y: 3 },{ x: 0, y: 4 },{ x: 3, y: 0 },{ x: 4, y: 0 },{ x: 12, y: 3 },{ x: 12, y: 4 },{ x: 9, y: 0 },{ x: 8, y: 0 },{ x: 0, y: 8 },{ x: 0, y: 9 },{ x: 3, y: 12 },{ x: 4, y: 12 },{ x: 1, y: 1 },{ x: 11, y: 1 },{ x: 1, y: 11 }],
    factory: [{ x: 9, y: 7 }],
    link: [{ x: 7, y: 6 },{ x: 12, y: 7 },{ x: 7, y: 12 }],
    lab: [{ x: 10, y: 8 },{ x: 10, y: 9 },{ x: 9, y: 10 },{ x: 8, y: 10 },{ x: 8, y: 11 },{ x: 9, y: 11 },{ x: 10, y: 11 },{ x: 11, y: 8 },{ x: 11, y: 9 },{ x: 11, y: 10 }],
    nuker: [{ x: 6, y: 1 }],
    observer: [{ x: 6, y: 2 }],
    powerSpawn: [{ x: 6, y: 4 }],
    road: [{ x: 6, y: 9 },{ x: 7, y: 8 },{ x: 8, y: 7 },{ x: 9, y: 6 },{ x: 7, y: 4 },{ x: 6, y: 3 },{ x: 5, y: 5 },{ x: 3, y: 6 },{ x: 5, y: 7 },{ x: 7, y: 7 },{ x: 7, y: 5 },{ x: 7, y: 2 },{ x: 8, y: 1 },{ x: 9, y: 1 },{ x: 10, y: 2 },{ x: 11, y: 3 },{ x: 11, y: 3 },{ x: 11, y: 4 },{ x: 10, y: 5 },{ x: 10, y: 7 },{ x: 9, y: 8 },{ x: 8, y: 9 },{ x: 7, y: 10 },{ x: 9, y: 9 },{ x: 10, y: 10 },{ x: 11, y: 11 },{ x: 12, y: 10 },{ x: 12, y: 9 },{ x: 12, y: 8 },{ x: 11, y: 7 },{ x: 12, y: 6 },{ x: 12, y: 5 },{ x: 10, y: 12 },{ x: 9, y: 12 },{ x: 8, y: 12 },{ x: 7, y: 11 },{ x: 6, y: 12 },{ x: 5, y: 12 },{ x: 4, y: 11 },{ x: 3, y: 11 },{ x: 5, y: 10 },{ x: 2, y: 10 },{ x: 1, y: 9 },{ x: 1, y: 8 },{ x: 2, y: 7 },{ x: 2, y: 5 },{ x: 1, y: 4 },{ x: 1, y: 3 },{ x: 2, y: 2 },{ x: 3, y: 1 },{ x: 4, y: 1 },{ x: 5, y: 2 },{ x: 0, y: 5 },{ x: 0, y: 6 },{ x: 0, y: 7 },{ x: 5, y: 0 },{ x: 6, y: 0 },{ x: 7, y: 0 },{ x: 2, y: 12 },{ x: 1, y: 12 },{ x: 0, y: 11 },{ x: 0, y: 10 },{ x: 0, y: 2 },{ x: 0, y: 1 },{ x: 1, y: 0 },{ x: 2, y: 0 },{ x: 10, y: 0 },{ x: 11, y: 0 },{ x: 12, y: 1 },{ x: 12, y: 2 },{ x: 4, y: 5 },{ x: 5, y: 8 },{ x: 8, y: 5 },{ x: 5, y: 4 },{ x: 4, y: 7 }],
    rampart: [{ x: 10, y: 0 },{ x: 11, y: 0 },{ x: 12, y: 1 },{ x: 12, y: 2 },{ x: 12, y: 5 },{ x: 12, y: 6 },{ x: 12, y: 8 },{ x: 12, y: 9 },{ x: 12, y: 10 },{ x: 10, y: 12 },{ x: 9, y: 12 },{ x: 8, y: 12 },{ x: 6, y: 12 },{ x: 5, y: 12 },{ x: 2, y: 12 },{ x: 1, y: 12 },{ x: 0, y: 11 },{ x: 0, y: 10 },{ x: 0, y: 7 },{ x: 0, y: 6 },{ x: 0, y: 5 },{ x: 0, y: 2 },{ x: 0, y: 1 },{ x: 1, y: 0 },{ x: 2, y: 0 },{ x: 5, y: 0 },{ x: 6, y: 0 },{ x: 7, y: 0 },{ x: 11, y: 11 },{ x: 3, y: 2 },{ x: 4, y: 2 },{ x: 4, y: 3 },{ x: 5, y: 3 },{ x: 3, y: 3 },{ x: 3, y: 4 },{ x: 3, y: 5 },{ x: 2, y: 4 },{ x: 2, y: 3 },{ x: 1, y: 5 },{ x: 1, y: 6 },{ x: 2, y: 6 },{ x: 1, y: 7 },{ x: 2, y: 8 },{ x: 2, y: 9 },{ x: 3, y: 9 },{ x: 3, y: 8 },{ x: 3, y: 7 },{ x: 3, y: 10 },{ x: 4, y: 10 },{ x: 4, y: 9 },{ x: 5, y: 9 },{ x: 6, y: 10 },{ x: 6, y: 11 },{ x: 5, y: 11 },{ x: 7, y: 1 },{ x: 5, y: 1 },{ x: 7, y: 3 },{ x: 8, y: 3 },{ x: 8, y: 3 },{ x: 9, y: 3 },{ x: 9, y: 4 },{ x: 9, y: 5 },{ x: 10, y: 4 },{ x: 10, y: 3 },{ x: 8, y: 2 },{ x: 9, y: 2 },{ x: 10, y: 6 },{ x: 11, y: 6 },{ x: 11, y: 5 },{ x: 8, y: 8 },{ x: 8, y: 10 },{ x: 8, y: 11 },{ x: 9, y: 11 },{ x: 10, y: 11 },{ x: 11, y: 10 },{ x: 11, y: 9 },{ x: 11, y: 8 },{ x: 9, y: 10 },{ x: 10, y: 9 },{ x: 10, y: 8 },{ x: 4, y: 8 },{ x: 6, y: 7 },{ x: 5, y: 6 },{ x: 4, y: 4 },{ x: 8, y: 4 },{ x: 6, y: 5 },{ x: 6, y: 4 },{ x: 4, y: 6 },{ x: 8, y: 6 },{ x: 6, y: 6 },{ x: 7, y: 6 },{ x: 6, y: 1 },{ x: 6, y: 2 },{ x: 8, y: 5 },{ x: 5, y: 4 },{ x: 4, y: 7 },{ x: 3, y: 1 },{ x: 4, y: 1 },{ x: 5, y: 2 },{ x: 6, y: 3 },{ x: 7, y: 2 },{ x: 8, y: 1 },{ x: 9, y: 1 },{ x: 10, y: 2 },{ x: 11, y: 3 },{ x: 11, y: 4 },{ x: 10, y: 5 },{ x: 9, y: 6 },{ x: 11, y: 7 },{ x: 10, y: 7 },{ x: 9, y: 7 },{ x: 9, y: 8 },{ x: 9, y: 9 },{ x: 10, y: 10 },{ x: 8, y: 9 },{ x: 8, y: 7 },{ x: 7, y: 7 },{ x: 7, y: 8 },{ x: 5, y: 8 },{ x: 5, y: 7 },{ x: 5, y: 5 },{ x: 4, y: 5 },{ x: 7, y: 5 },{ x: 7, y: 4 },{ x: 7, y: 11 },{ x: 7, y: 10 },{ x: 6, y: 9 },{ x: 6, y: 8 },{ x: 5, y: 10 },{ x: 4, y: 11 },{ x: 3, y: 11 },{ x: 2, y: 10 },{ x: 1, y: 9 },{ x: 1, y: 8 },{ x: 2, y: 7 },{ x: 3, y: 6 },{ x: 2, y: 5 },{ x: 1, y: 4 },{ x: 1, y: 3 },{ x: 2, y: 2 },{ x: 11, y: 2 },{ x: 10, y: 1 },{ x: 2, y: 1 },{ x: 1, y: 2 },{ x: 1, y: 10 },{ x: 2, y: 11 },{ x: 9, y: 0 },{ x: 8, y: 0 },{ x: 4, y: 0 },{ x: 3, y: 0 },{ x: 0, y: 3 },{ x: 0, y: 4 },{ x: 0, y: 8 },{ x: 0, y: 9 },{ x: 3, y: 12 },{ x: 4, y: 12 },{ x: 12, y: 3 },{ x: 12, y: 4 },{ x: 11, y: 1 },{ x: 1, y: 11 },{ x: 1, y: 1 },{ x: 7, y: 9 },{ x: 12, y: 7 },{ x: 7, y: 12 },{ x: 11, y: 12 },{ x: 12, y: 11 }],
    spawn: [{ x: 8, y: 6 },{ x: 6, y: 8 },{ x: 4, y: 6 }],
    storage: [{ x: 6, y: 6 }],
    terminal: [{ x: 8, y: 8 }],
    tower: [{ x: 6, y: 5 },{ x: 5, y: 6 },{ x: 6, y: 7 },{ x: 8, y: 4 },{ x: 4, y: 4 },{ x: 4, y: 8 }],
  },
};
