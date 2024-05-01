export enum BrushType {
  Structure = 1,
  Object,
  Terrain,
}

export enum BrushClass {
  Structure = 'structure',
  Object = 'object',
  Terrain = 'terrain',
}

export const MAX_RCL = 8;

export const ROOM_SIZE = 50;
export const ROOM_GRID = Array.from(Array(ROOM_SIZE * ROOM_SIZE).keys());

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

export const TERRAIN_BRUSH_PROPS = {
  [TERRAIN_PLAIN]: {
    backgroundColor: '#3f4045',
    boxShadow: 'inset rgba(0, 0, 0, 0.05) 0 0 0 1px',
  },
  [TERRAIN_SWAMP]: {
    backgroundColor: '#292b18',
    boxShadow: `inset #252715 0 0 0 1px`,
  },
  [TERRAIN_WALL]: {
    backgroundColor: '#111111',
    boxShadow: 'none',
  },
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

export const STRUCTURE_OBJECTS: Record<string, string> = {
  [STRUCTURE_CONTROLLER]: 'Controller',
  [STRUCTURE_SPAWN]: 'Spawn',
  [STRUCTURE_CONTAINER]: 'Container',
  [STRUCTURE_EXTENSION]: 'Extension',
  [STRUCTURE_TOWER]: 'Tower',
  [STRUCTURE_STORAGE]: 'Storage',
  [STRUCTURE_LINK]: 'Link',
  [STRUCTURE_TERMINAL]: 'Terminal',
  [STRUCTURE_LAB]: 'Lab',
  [STRUCTURE_EXTRACTOR]: 'Extractor',
  [STRUCTURE_FACTORY]: 'Factory',
  [STRUCTURE_OBSERVER]: 'Observer',
  [STRUCTURE_POWER_SPAWN]: 'PowerSpawn',
  [STRUCTURE_NUKER]: 'Nuker',
  [STRUCTURE_RAMPART]: 'Rampart',
  [STRUCTURE_WALL]: 'Wall',
  [STRUCTURE_ROAD]: 'Road',
};

export const STRUCTURE_DESCRIPTIONS: Record<string, string> = {
  [STRUCTURE_CONTROLLER]:
    'Claim this structure to take control over the room. The controller cannot be damaged or destroyed.',
  [STRUCTURE_SPAWN]: 'Spawn is your colony station. This structure can create, renew, and recycle creeps.',
  [STRUCTURE_CONTAINER]: 'A small container that can be used to store resources. This is a walkable structure.',
  [STRUCTURE_EXTENSION]: 'Contains energy which can be spent on spawning larger creeps.',
  [STRUCTURE_TOWER]: 'Remotely attacks or heals creeps, or repairs structures.',
  [STRUCTURE_STORAGE]: 'A structure that can store huge amount of resource units.',
  [STRUCTURE_LINK]: 'Remotely transfers energy to another Link in the same room.',
  [STRUCTURE_TERMINAL]:
    'Sends resources to a terminal in another room. The destination terminal can belong to any player.',
  [STRUCTURE_LAB]: 'Produces mineral compounds from base minerals, boosts and unboosts creeps.',
  [STRUCTURE_EXTRACTOR]: 'Allows harvesting a mineral deposit.',
  [STRUCTURE_FACTORY]: 'Produces trade commodities from base minerals and other commodities.',
  [STRUCTURE_OBSERVER]: 'Provides visibility into a distant room from your script.',
  [STRUCTURE_POWER_SPAWN]: 'Processes power into your account, and spawns power creeps with special unique powers.',
  [STRUCTURE_NUKER]: 'Launches a nuke to another room dealing huge damage to the landing area.',
  [STRUCTURE_RAMPART]: 'Blocks movement of hostile creeps, and defends your creeps and structures on the same tile.',
  [STRUCTURE_WALL]: 'Blocks movement of all creeps.',
  [STRUCTURE_ROAD]: 'Decreases creep movement cost. Using roads allows creating creeps with less MOVE body parts.',
};

export const SOURCE = 'source';
export const SOURCE_DESCRIPTION = 'An energy source object. Can be harvested by creeps with a WORK body part.';

export const MINERAL = 'mineral';
export const MINERAL_DESCRIPTION =
  'A mineral deposit. Can be harvested by creeps with a WORK body part using the extractor structure.';
export const RESOURCE_HYDROGEN = 'H';
export const RESOURCE_OXYGEN = 'O';
export const RESOURCE_UTRIUM = 'U';
export const RESOURCE_LEMERGIUM = 'L';
export const RESOURCE_KEANIUM = 'K';
export const RESOURCE_ZYNTHIUM = 'Z';
export const RESOURCE_CATALYST = 'X';

export const OBJECT_BRUSHES: Record<string, string> = {
  [SOURCE]: SOURCE,
  [RESOURCE_HYDROGEN]: 'hydrogen',
  [RESOURCE_OXYGEN]: 'oxygen',
  [RESOURCE_UTRIUM]: 'utrium',
  [RESOURCE_LEMERGIUM]: 'lemergium',
  [RESOURCE_KEANIUM]: 'keanium',
  [RESOURCE_ZYNTHIUM]: 'zynthium',
  [RESOURCE_CATALYST]: 'catalyst',
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
export const EXAMPLE_BUNKER = {
  rcl: 8,
  structures: {
    container: ['5-5','7-5','7-7','5-7','7-9'],
    extension: ['5-1','7-1','7-3','8-3','8-2','9-2','9-3','9-4','9-5','10-4','10-3','10-6','11-6','11-5','6-10','6-11','5-11','4-10','4-9','5-9','3-10','3-9','2-9','2-8','3-8','3-7','1-7','1-6','2-6','1-5','2-4','3-4','3-5','2-3','3-3','3-2','4-2','4-3','5-3','2-1','1-2','1-10','2-11','11-2','10-1','0-3','0-4','3-0','4-0','12-3','12-4','9-0','8-0','0-8','0-9','3-12','4-12','1-1','11-1','1-11'],
    factory: ['9-7'],
    link: ['7-6','12-7','7-12'],
    lab: ['10-8','10-9','9-10','8-10','8-11','9-11','10-11','11-8','11-9','11-10'],
    nuker: ['6-1'],
    observer: ['6-2'],
    powerSpawn: ['6-4'],
    road: ['6-9','7-8','8-7','9-6','7-4','6-3','5-5','3-6','5-7','7-7','7-5','7-2','8-1','9-1','10-2','11-3','11-3','11-4','10-5','10-7','9-8','8-9','7-10','9-9','10-10','11-11','12-10','12-9','12-8','11-7','12-6','12-5','10-12','9-12','8-12','7-11','6-12','5-12','4-11','3-11','5-10','2-10','1-9','1-8','2-7','2-5','1-4','1-3','2-2','3-1','4-1','5-2','0-5','0-6','0-7','5-0','6-0','7-0','2-12','1-12','0-11','0-10','0-2','0-1','1-0','2-0','10-0','11-0','12-1','12-2','4-5','5-8','8-5','5-4','4-7'],
    rampart: ['10-0','11-0','12-1','12-2','12-5','12-6','12-8','12-9','12-10','10-12','9-12','8-12','6-12','5-12','2-12','1-12','0-11','0-10','0-7','0-6','0-5','0-2','0-1','1-0','2-0','5-0','6-0','7-0','11-11','3-2','4-2','4-3','5-3','3-3','3-4','3-5','2-4','2-3','1-5','1-6','2-6','1-7','2-8','2-9','3-9','3-8','3-7','3-10','4-10','4-9','5-9','6-10','6-11','5-11','7-1','5-1','7-3','8-3','8-3','9-3','9-4','9-5','10-4','10-3','8-2','9-2','10-6','11-6','11-5','8-8','8-10','8-11','9-11','10-11','11-10','11-9','11-8','9-10','10-9','10-8','4-8','6-7','5-6','4-4','8-4','6-5','6-4','4-6','8-6','6-6','7-6','6-1','6-2','8-5','5-4','4-7','3-1','4-1','5-2','6-3','7-2','8-1','9-1','10-2','11-3','11-4','10-5','9-6','11-7','10-7','9-7','9-8','9-9','10-10','8-9','8-7','7-7','7-8','5-8','5-7','5-5','4-5','7-5','7-4','7-11','7-10','6-9','6-8','5-10','4-11','3-11','2-10','1-9','1-8','2-7','3-6','2-5','1-4','1-3','2-2','11-2','10-1','2-1','1-2','1-10','2-11','9-0','8-0','4-0','3-0','0-3','0-4','0-8','0-9','3-12','4-12','12-3','12-4','11-1','1-11','1-1','7-9','12-7','7-12','11-12','12-11'],
    spawn: ['8-6','6-8','4-6'],
    storage: ['6-6'],
    terminal: ['8-8'],
    tower: ['6-5','5-6','6-7','8-4','4-4','4-8'],
  },
};

// prettier-ignore
export const EXAMPLE_TERRAIN = [
  {
      "room": "E7S13",
      "x": 0,
      "y": 0,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 1,
      "y": 0,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 2,
      "y": 0,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 3,
      "y": 0,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 4,
      "y": 0,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 25,
      "y": 0,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 26,
      "y": 0,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 27,
      "y": 0,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 28,
      "y": 0,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 29,
      "y": 0,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 30,
      "y": 0,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 31,
      "y": 0,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 32,
      "y": 0,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 33,
      "y": 0,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 34,
      "y": 0,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 35,
      "y": 0,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 36,
      "y": 0,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 37,
      "y": 0,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 38,
      "y": 0,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 0,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 0,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 0,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 0,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 0,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 0,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 0,
      "y": 1,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 1,
      "y": 1,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 2,
      "y": 1,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 3,
      "y": 1,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 4,
      "y": 1,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 25,
      "y": 1,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 26,
      "y": 1,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 27,
      "y": 1,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 28,
      "y": 1,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 29,
      "y": 1,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 30,
      "y": 1,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 31,
      "y": 1,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 32,
      "y": 1,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 33,
      "y": 1,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 34,
      "y": 1,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 35,
      "y": 1,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 36,
      "y": 1,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 37,
      "y": 1,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 1,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 1,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 1,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 1,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 1,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 1,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 0,
      "y": 2,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 1,
      "y": 2,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 2,
      "y": 2,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 3,
      "y": 2,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 4,
      "y": 2,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 5,
      "y": 2,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 2,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 2,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 2,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 2,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 2,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 2,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 0,
      "y": 3,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 1,
      "y": 3,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 2,
      "y": 3,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 3,
      "y": 3,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 4,
      "y": 3,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 5,
      "y": 3,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 3,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 3,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 3,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 3,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 3,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 3,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 0,
      "y": 4,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 1,
      "y": 4,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 2,
      "y": 4,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 3,
      "y": 4,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 4,
      "y": 4,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 5,
      "y": 4,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 30,
      "y": 4,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 31,
      "y": 4,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 4,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 4,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 4,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 4,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 4,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 4,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 0,
      "y": 5,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 1,
      "y": 5,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 2,
      "y": 5,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 3,
      "y": 5,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 4,
      "y": 5,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 5,
      "y": 5,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 30,
      "y": 5,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 31,
      "y": 5,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 5,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 5,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 5,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 5,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 5,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 5,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 0,
      "y": 6,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 1,
      "y": 6,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 2,
      "y": 6,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 3,
      "y": 6,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 4,
      "y": 6,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 30,
      "y": 6,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 31,
      "y": 6,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 6,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 6,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 6,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 6,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 6,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 6,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 0,
      "y": 7,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 1,
      "y": 7,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 2,
      "y": 7,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 3,
      "y": 7,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 7,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 7,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 7,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 7,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 7,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 7,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 0,
      "y": 8,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 1,
      "y": 8,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 2,
      "y": 8,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 8,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 8,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 8,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 8,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 8,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 8,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 0,
      "y": 9,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 1,
      "y": 9,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 17,
      "y": 9,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 18,
      "y": 9,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 9,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 9,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 9,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 9,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 9,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 9,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 0,
      "y": 10,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 16,
      "y": 10,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 17,
      "y": 10,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 18,
      "y": 10,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 19,
      "y": 10,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 10,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 10,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 10,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 10,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 10,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 10,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 16,
      "y": 11,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 17,
      "y": 11,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 18,
      "y": 11,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 19,
      "y": 11,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 11,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 11,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 11,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 11,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 11,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 11,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 17,
      "y": 12,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 18,
      "y": 12,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 19,
      "y": 12,
      "type": "swamp"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 12,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 12,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 12,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 12,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 12,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 18,
      "y": 13,
      "type": "swamp"
  },
  {
      "room": "E7S13",
      "x": 19,
      "y": 13,
      "type": "swamp"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 13,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 13,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 13,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 13,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 13,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 2,
      "y": 14,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 3,
      "y": 14,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 18,
      "y": 14,
      "type": "swamp"
  },
  {
      "room": "E7S13",
      "x": 19,
      "y": 14,
      "type": "swamp"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 14,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 14,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 14,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 14,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 14,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 2,
      "y": 15,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 3,
      "y": 15,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 4,
      "y": 15,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 18,
      "y": 15,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 19,
      "y": 15,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 15,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 15,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 15,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 15,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 15,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 2,
      "y": 16,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 3,
      "y": 16,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 4,
      "y": 16,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 18,
      "y": 16,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 19,
      "y": 16,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 20,
      "y": 16,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 16,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 16,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 16,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 16,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 16,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 16,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 2,
      "y": 17,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 3,
      "y": 17,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 18,
      "y": 17,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 19,
      "y": 17,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 20,
      "y": 17,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 17,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 17,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 17,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 17,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 17,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 17,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 19,
      "y": 18,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 43,
      "y": 18,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 18,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 18,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 18,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 18,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 18,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 18,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 42,
      "y": 19,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 43,
      "y": 19,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 19,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 19,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 19,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 19,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 19,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 19,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 30,
      "y": 20,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 31,
      "y": 20,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 33,
      "y": 20,
      "type": "swamp"
  },
  {
      "room": "E7S13",
      "x": 34,
      "y": 20,
      "type": "swamp"
  },
  {
      "room": "E7S13",
      "x": 35,
      "y": 20,
      "type": "swamp"
  },
  {
      "room": "E7S13",
      "x": 41,
      "y": 20,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 42,
      "y": 20,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 43,
      "y": 20,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 20,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 20,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 20,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 20,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 20,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 20,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 29,
      "y": 21,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 30,
      "y": 21,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 31,
      "y": 21,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 33,
      "y": 21,
      "type": "swamp"
  },
  {
      "room": "E7S13",
      "x": 34,
      "y": 21,
      "type": "swamp"
  },
  {
      "room": "E7S13",
      "x": 35,
      "y": 21,
      "type": "swamp"
  },
  {
      "room": "E7S13",
      "x": 40,
      "y": 21,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 41,
      "y": 21,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 42,
      "y": 21,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 43,
      "y": 21,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 21,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 21,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 21,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 21,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 21,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 21,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 29,
      "y": 22,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 30,
      "y": 22,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 31,
      "y": 22,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 34,
      "y": 22,
      "type": "swamp"
  },
  {
      "room": "E7S13",
      "x": 35,
      "y": 22,
      "type": "swamp"
  },
  {
      "room": "E7S13",
      "x": 39,
      "y": 22,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 40,
      "y": 22,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 41,
      "y": 22,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 42,
      "y": 22,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 43,
      "y": 22,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 22,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 22,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 22,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 22,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 22,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 22,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 39,
      "y": 23,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 40,
      "y": 23,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 41,
      "y": 23,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 42,
      "y": 23,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 43,
      "y": 23,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 23,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 23,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 23,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 23,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 23,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 23,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 40,
      "y": 24,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 41,
      "y": 24,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 42,
      "y": 24,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 43,
      "y": 24,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 24,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 24,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 24,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 24,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 24,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 24,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 41,
      "y": 25,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 42,
      "y": 25,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 43,
      "y": 25,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 25,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 25,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 25,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 25,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 25,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 25,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 41,
      "y": 26,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 42,
      "y": 26,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 43,
      "y": 26,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 26,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 26,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 26,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 26,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 26,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 26,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 42,
      "y": 27,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 43,
      "y": 27,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 27,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 27,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 27,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 27,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 27,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 27,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 42,
      "y": 28,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 43,
      "y": 28,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 28,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 28,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 28,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 28,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 28,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 28,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 41,
      "y": 29,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 42,
      "y": 29,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 43,
      "y": 29,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 29,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 29,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 29,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 29,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 29,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 29,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 41,
      "y": 30,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 42,
      "y": 30,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 43,
      "y": 30,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 30,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 30,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 30,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 30,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 30,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 30,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 0,
      "y": 31,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 40,
      "y": 31,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 41,
      "y": 31,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 42,
      "y": 31,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 43,
      "y": 31,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 31,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 31,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 31,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 31,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 31,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 31,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 0,
      "y": 32,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 1,
      "y": 32,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 40,
      "y": 32,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 41,
      "y": 32,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 42,
      "y": 32,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 43,
      "y": 32,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 32,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 32,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 32,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 32,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 32,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 32,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 0,
      "y": 33,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 1,
      "y": 33,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 2,
      "y": 33,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 39,
      "y": 33,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 40,
      "y": 33,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 41,
      "y": 33,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 42,
      "y": 33,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 43,
      "y": 33,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 33,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 33,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 33,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 33,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 33,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 33,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 0,
      "y": 34,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 1,
      "y": 34,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 2,
      "y": 34,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 3,
      "y": 34,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 39,
      "y": 34,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 40,
      "y": 34,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 41,
      "y": 34,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 42,
      "y": 34,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 43,
      "y": 34,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 34,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 34,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 34,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 34,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 34,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 34,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 0,
      "y": 35,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 1,
      "y": 35,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 2,
      "y": 35,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 3,
      "y": 35,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 4,
      "y": 35,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 39,
      "y": 35,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 40,
      "y": 35,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 41,
      "y": 35,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 42,
      "y": 35,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 43,
      "y": 35,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 35,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 35,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 35,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 35,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 35,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 35,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 0,
      "y": 36,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 1,
      "y": 36,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 2,
      "y": 36,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 3,
      "y": 36,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 4,
      "y": 36,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 39,
      "y": 36,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 40,
      "y": 36,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 41,
      "y": 36,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 42,
      "y": 36,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 43,
      "y": 36,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 36,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 36,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 36,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 36,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 36,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 36,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 0,
      "y": 37,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 1,
      "y": 37,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 2,
      "y": 37,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 3,
      "y": 37,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 4,
      "y": 37,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 5,
      "y": 37,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 41,
      "y": 37,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 42,
      "y": 37,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 43,
      "y": 37,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 37,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 37,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 37,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 37,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 37,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 37,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 0,
      "y": 38,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 1,
      "y": 38,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 2,
      "y": 38,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 3,
      "y": 38,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 4,
      "y": 38,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 5,
      "y": 38,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 42,
      "y": 38,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 43,
      "y": 38,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 38,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 38,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 38,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 38,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 38,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 38,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 0,
      "y": 39,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 1,
      "y": 39,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 2,
      "y": 39,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 3,
      "y": 39,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 4,
      "y": 39,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 5,
      "y": 39,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 6,
      "y": 39,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 43,
      "y": 39,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 39,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 39,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 39,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 39,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 39,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 39,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 0,
      "y": 40,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 1,
      "y": 40,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 2,
      "y": 40,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 3,
      "y": 40,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 4,
      "y": 40,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 5,
      "y": 40,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 6,
      "y": 40,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 42,
      "y": 40,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 43,
      "y": 40,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 40,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 40,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 40,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 40,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 40,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 40,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 0,
      "y": 41,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 1,
      "y": 41,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 2,
      "y": 41,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 3,
      "y": 41,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 4,
      "y": 41,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 5,
      "y": 41,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 6,
      "y": 41,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 7,
      "y": 41,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 19,
      "y": 41,
      "type": "swamp"
  },
  {
      "room": "E7S13",
      "x": 20,
      "y": 41,
      "type": "swamp"
  },
  {
      "room": "E7S13",
      "x": 42,
      "y": 41,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 43,
      "y": 41,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 41,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 41,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 41,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 41,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 41,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 41,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 0,
      "y": 42,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 1,
      "y": 42,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 2,
      "y": 42,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 3,
      "y": 42,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 4,
      "y": 42,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 5,
      "y": 42,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 6,
      "y": 42,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 7,
      "y": 42,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 8,
      "y": 42,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 21,
      "y": 42,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 22,
      "y": 42,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 41,
      "y": 42,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 42,
      "y": 42,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 43,
      "y": 42,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 42,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 42,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 42,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 42,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 42,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 42,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 0,
      "y": 43,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 1,
      "y": 43,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 2,
      "y": 43,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 3,
      "y": 43,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 4,
      "y": 43,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 5,
      "y": 43,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 6,
      "y": 43,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 7,
      "y": 43,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 8,
      "y": 43,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 9,
      "y": 43,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 10,
      "y": 43,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 21,
      "y": 43,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 22,
      "y": 43,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 39,
      "y": 43,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 40,
      "y": 43,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 41,
      "y": 43,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 42,
      "y": 43,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 43,
      "y": 43,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 43,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 43,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 43,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 43,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 43,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 43,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 0,
      "y": 44,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 1,
      "y": 44,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 2,
      "y": 44,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 3,
      "y": 44,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 4,
      "y": 44,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 5,
      "y": 44,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 6,
      "y": 44,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 7,
      "y": 44,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 8,
      "y": 44,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 9,
      "y": 44,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 10,
      "y": 44,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 11,
      "y": 44,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 12,
      "y": 44,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 21,
      "y": 44,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 22,
      "y": 44,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 38,
      "y": 44,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 39,
      "y": 44,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 40,
      "y": 44,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 41,
      "y": 44,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 42,
      "y": 44,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 43,
      "y": 44,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 44,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 44,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 44,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 44,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 44,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 44,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 0,
      "y": 45,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 1,
      "y": 45,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 2,
      "y": 45,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 3,
      "y": 45,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 4,
      "y": 45,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 5,
      "y": 45,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 6,
      "y": 45,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 7,
      "y": 45,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 8,
      "y": 45,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 9,
      "y": 45,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 10,
      "y": 45,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 11,
      "y": 45,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 12,
      "y": 45,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 13,
      "y": 45,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 14,
      "y": 45,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 24,
      "y": 45,
      "type": "swamp"
  },
  {
      "room": "E7S13",
      "x": 25,
      "y": 45,
      "type": "swamp"
  },
  {
      "room": "E7S13",
      "x": 37,
      "y": 45,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 38,
      "y": 45,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 39,
      "y": 45,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 40,
      "y": 45,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 41,
      "y": 45,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 42,
      "y": 45,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 43,
      "y": 45,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 45,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 45,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 45,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 45,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 45,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 45,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 0,
      "y": 46,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 1,
      "y": 46,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 2,
      "y": 46,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 3,
      "y": 46,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 4,
      "y": 46,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 5,
      "y": 46,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 6,
      "y": 46,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 7,
      "y": 46,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 8,
      "y": 46,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 9,
      "y": 46,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 10,
      "y": 46,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 11,
      "y": 46,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 12,
      "y": 46,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 13,
      "y": 46,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 14,
      "y": 46,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 15,
      "y": 46,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 24,
      "y": 46,
      "type": "swamp"
  },
  {
      "room": "E7S13",
      "x": 25,
      "y": 46,
      "type": "swamp"
  },
  {
      "room": "E7S13",
      "x": 36,
      "y": 46,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 37,
      "y": 46,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 38,
      "y": 46,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 39,
      "y": 46,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 40,
      "y": 46,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 41,
      "y": 46,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 42,
      "y": 46,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 43,
      "y": 46,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 46,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 46,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 46,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 46,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 46,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 46,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 0,
      "y": 47,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 1,
      "y": 47,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 2,
      "y": 47,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 3,
      "y": 47,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 4,
      "y": 47,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 5,
      "y": 47,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 6,
      "y": 47,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 7,
      "y": 47,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 8,
      "y": 47,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 9,
      "y": 47,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 10,
      "y": 47,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 11,
      "y": 47,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 12,
      "y": 47,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 13,
      "y": 47,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 14,
      "y": 47,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 15,
      "y": 47,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 16,
      "y": 47,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 35,
      "y": 47,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 36,
      "y": 47,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 37,
      "y": 47,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 38,
      "y": 47,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 39,
      "y": 47,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 40,
      "y": 47,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 41,
      "y": 47,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 42,
      "y": 47,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 43,
      "y": 47,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 47,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 47,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 47,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 47,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 47,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 47,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 0,
      "y": 48,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 1,
      "y": 48,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 2,
      "y": 48,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 3,
      "y": 48,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 4,
      "y": 48,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 5,
      "y": 48,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 6,
      "y": 48,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 7,
      "y": 48,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 8,
      "y": 48,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 9,
      "y": 48,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 10,
      "y": 48,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 11,
      "y": 48,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 12,
      "y": 48,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 13,
      "y": 48,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 14,
      "y": 48,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 15,
      "y": 48,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 16,
      "y": 48,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 17,
      "y": 48,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 26,
      "y": 48,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 34,
      "y": 48,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 35,
      "y": 48,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 36,
      "y": 48,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 37,
      "y": 48,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 38,
      "y": 48,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 39,
      "y": 48,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 40,
      "y": 48,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 41,
      "y": 48,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 42,
      "y": 48,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 43,
      "y": 48,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 48,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 48,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 48,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 48,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 48,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 48,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 0,
      "y": 49,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 1,
      "y": 49,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 2,
      "y": 49,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 3,
      "y": 49,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 4,
      "y": 49,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 5,
      "y": 49,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 6,
      "y": 49,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 7,
      "y": 49,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 8,
      "y": 49,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 9,
      "y": 49,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 10,
      "y": 49,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 11,
      "y": 49,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 12,
      "y": 49,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 13,
      "y": 49,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 14,
      "y": 49,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 15,
      "y": 49,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 16,
      "y": 49,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 17,
      "y": 49,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 18,
      "y": 49,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 25,
      "y": 49,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 26,
      "y": 49,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 27,
      "y": 49,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 33,
      "y": 49,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 34,
      "y": 49,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 35,
      "y": 49,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 36,
      "y": 49,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 37,
      "y": 49,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 38,
      "y": 49,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 39,
      "y": 49,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 40,
      "y": 49,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 41,
      "y": 49,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 42,
      "y": 49,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 43,
      "y": 49,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 44,
      "y": 49,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 45,
      "y": 49,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 46,
      "y": 49,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 47,
      "y": 49,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 48,
      "y": 49,
      "type": "wall"
  },
  {
      "room": "E7S13",
      "x": 49,
      "y": 49,
      "type": "wall"
  }
];

//prettier-ignore
export const EXAMPLE_STRUCTURES = [
  {
    "objects": [
      {
        "type": "container",
        "x": 22,
        "y": 21,
        "room": "sim",
        "hits": 250000,
        "hitsMax": 250000,
        "nextDecayTime": 108,
        "_id": "aa5f8a1bcd606a79457b44b6",
        "_isDisabled": false,
        "storeCapacity": 2000,
        "store": {
          "energy": 1000,
          "H": 500
        }
      },
      {
        "type": "extension",
        "x": 24,
        "y": 21,
        "room": "sim",
        "user": "54bff72ab32a10f73a57d017",
        "hits": 1000,
        "hitsMax": 1000,
        "_id": "1cec33b1b1caf747d5bc366e",
        "_isDisabled": false,
        "off": false,
        "store": {
          "energy": 100
        },
        "storeCapacityResource": {
          "energy": 200
        }
      },
      {
        "type": "keeperLair",
        "x": 26,
        "y": 21,
        "room": "sim",
        "ticksToSpawn": 1,
        "user": "3",
        "_id": "64a5603fe4a1539b77653f3a",
        "_isDisabled": false,
        "nextSpawnTime": 308
      },
      {
        "type": "lab",
        "x": 28,
        "y": 21,
        "room": "sim",
        "user": "54bff72ab32a10f73a57d017",
        "hits": 500,
        "hitsMax": 500,
        "cooldown": 0,
        "_id": "270a09d6e975fdc76560e5ce",
        "_isDisabled": false,
        "actionLog": {
          "runReaction": null,
          "reverseReaction": null
        },
        "store": {
          "energy": 1000,
          "L": 1500
        },
        "storeCapacityResource": {
          "energy": 2000,
          "L": 3000
        }
      },
      {
        "type": "link",
        "x": 30,
        "y": 23,
        "room": "sim",
        "user": "54bff72ab32a10f73a57d017",
        "hits": 1000,
        "hitsMax": 1000,
        "cooldown": 0,
        "_id": "1b6bb11192243f9f8049f16f",
        "_isDisabled": false,
        "actionLog": {
          "transferEnergy": null
        },
        "store": {
          "energy": 400
        },
        "storeCapacityResource": {
          "energy": 800
        }
      },
      {
        "type": "nuker",
        "x": 22,
        "y": 23,
        "room": "sim",
        "user": "54bff72ab32a10f73a57d017",
        "hits": 1000,
        "hitsMax": 1000,
        "cooldownTime": 18,
        "_id": "b23f8d8124cfe2d226e80bac",
        "_isDisabled": false,
        "store": {
          "energy": 150000,
          "G": 2500
        },
        "storeCapacityResource": {
          "energy": 300000,
          "G": 5000
        }
      },
      {
        "type": "observer",
        "x": 24,
        "y": 23,
        "room": "sim",
        "user": "54bff72ab32a10f73a57d017",
        "hits": 500,
        "hitsMax": 500,
        "_id": "3367f29c20d5ae30c3f9421e",
        "_isDisabled": false,
        "observeRoom": null
      },
      {
        "type": "powerBank",
        "x": 26,
        "y": 23,
        "room": "sim",
        "store": {
          "power": 2371
        },
        "hits": 2000000,
        "hitsMax": 2000000,
        "decayTime": 5008,
        "_id": "baa27054ed55487d5a39ee71",
        "_isDisabled": false
      },
      {
        "type": "powerSpawn",
        "x": 28,
        "y": 23,
        "room": "sim",
        "user": "54bff72ab32a10f73a57d017",
        "hits": 5000,
        "hitsMax": 5000,
        "_id": "469077c140233bd3ef656b5f",
        "_isDisabled": false,
        "store": {
          "energy": 2500,
          "power": 50
        },
        "storeCapacityResource": {
          "energy": 5000,
          "power": 100
        }
      },
      {
        "type": "source",        
        "x": 30,
        "y": 21,
        "room": "sim",
        "energy": 1500,
        "energyCapacity": 3000,
        "ticksToRegeneration": 300,
        "_id": "f99589276fc58130850de90e",
        "_isDisabled": false,
        "nextRegenerationTime": 309
      },
      {
        "type": "spawn",
        "x": 22,
        "y": 25,
        "room": "sim",
        "name": "Spawn1",
        "user": "54bff72ab32a10f73a57d017",
        "hits": 5000,
        "hitsMax": 5000,
        "spawning": null,
        "_id": "0dbfb5659fe6bac6a7ae0640",
        "_isDisabled": false,
        "off": false,
        "effects": {},
        "store": {
          "energy": 153
        },
        "storeCapacityResource": {
          "energy": 300
        }
      },
      {
        "type": "storage",
        "x": 24,
        "y": 25,
        "room": "sim",
        "user": "54bff72ab32a10f73a57d017",
        "hits": 10000,
        "hitsMax": 10000,
        "_id": "9371251d6b6ec30f40cffc5a",
        "_isDisabled": false,
        "storeCapacity": 1000000,
        "store": {
          "energy": 500000,
          "L": 300000
        }
      },
      {
        "type": "terminal",
        "x": 26,
        "y": 25,
        "room": "sim",
        "user": "54bff72ab32a10f73a57d017",
        "hits": 3000,
        "hitsMax": 3000,
        "_id": "9758750f6303635cf2993b08",
        "_isDisabled": false,
        "storeCapacity": 300000,
        "store": {
          "energy": 150000
        }
      },
      {
        "type": "tower",
        "x": 28,
        "y": 25,
        "room": "sim",
        "user": "54bff72ab32a10f73a57d017",
        "hits": 3000,
        "hitsMax": 3000,
        "_id": "22fa78bda5872a29a798bc69",
        "_isDisabled": false,
        "actionLog": {
          "attack": null,
          "heal": null,
          "repair": null
        },
        "store": {
          "energy": 500
        },
        "storeCapacityResource": {
          "energy": 1000
        }
      },
      {
        "type": "controller",
        "x": 30,
        "y": 25,
        "room": "sim",
        "level": 8,
        "_id": "408d9a5c019068b4135733e5",
        "_isDisabled": false,
        "progress": 0,
        "user": "54bff72ab32a10f73a57d017",
        "downgradeTime": 150009,
        "isPowerEnabled": true
      },
      {
        "type": "mineral",
        "x": 22,
        "y": 27,
        "room": "sim",
        "mineralType": "Z",
        "mineralAmount": 64686.92355929926,
        "ticksToRegeneration": null,
        "_id": "77d376cdce19d60d6bbd5b6a",
        "_isDisabled": false
      },
      {
        "type": "mineral",
        "x": 24,
        "y": 27,
        "room": "sim",
        "mineralType": "K",
        "mineralAmount": 38868.67639907885,
        "ticksToRegeneration": null,
        "_id": "1c1ea508d09f55035d2522d7",
        "_isDisabled": false
      },
      {
        "type": "mineral",
        "x": 26,
        "y": 27,
        "room": "sim",
        "mineralType": "U",
        "mineralAmount": 59802.73757842947,
        "ticksToRegeneration": null,
        "_id": "354d8bb200d7fc2f635ac878",
        "_isDisabled": false
      },
      {
        "type": "mineral",
        "x": 28,
        "y": 27,
        "room": "sim",
        "mineralType": "L",
        "mineralAmount": 44729.58752369256,
        "ticksToRegeneration": null,
        "_id": "7816ecc6a783bb5b1b04e6e6",
        "_isDisabled": false
      },
      {
        "type": "mineral",
        "x": 30,
        "y": 27,
        "room": "sim",
        "mineralType": "X",
        "mineralAmount": 46825.76501219951,
        "ticksToRegeneration": null,
        "_id": "ad1bc7315cd5829377940bd3",
        "_isDisabled": false
      },
      {
        "type": "mineral",
        "x": 22,
        "y": 29,
        "room": "sim",
        "mineralType": "H",
        "mineralAmount": 55618.2673564552,
        "ticksToRegeneration": null,
        "_id": "70b4cbbd9b889144565ea5d0",
        "_isDisabled": false
      },
      {
        "type": "mineral",
        "x": 24,
        "y": 29,
        "room": "sim",
        "mineralType": "O",
        "mineralAmount": 42284.14461137561,
        "ticksToRegeneration": null,
        "_id": "a5113d4ea12676e829e8179a",
        "_isDisabled": false
      },
      {
        "type": "extractor",
        "x": 24,
        "y": 29,
        "room": "sim",
        "user": "54bff72ab32a10f73a57d017",
        "hits": 500,
        "hitsMax": 500,
        "_id": "054572fe3186132bc8e7f4b6",
        "_isDisabled": false,
        "cooldown": 9
      },
      {
        "type": "factory",
        "x": 26,
        "y": 29,
        "level": 2,
        "room": "sim",
        "user": "54bff72ab32a10f73a57d017",
        "hits": 3000,
        "hitsMax": 3000,
        "_id": "9758750f6303635cf2993b09",
        "_isDisabled": false,
        "storeCapacity": 300000,
        "store": {
          "energy": 150000
        }
      },
      {
        "type": "deposit",
        "x": 22,
        "y": 31,
        "room": "sim",
        "depositType": "biomass",
        "ticksToRegeneration": null,
        "_id": "7816ecc6a783bb5b1b04e6a6",
        "_isDisabled": false
      },
      {
        "type": "deposit",
        "x": 24,
        "y": 31,
        "room": "sim",
        "depositType": "metal",
        "ticksToRegeneration": null,
        "_id": "7816ecc6a783bb5b1b04e6b6",
        "_isDisabled": false
      },
      {
        "type": "deposit",
        "x": 26,
        "y": 31,
        "room": "sim",
        "depositType": "mist",
        "ticksToRegeneration": null,
        "_id": "7816ecc6a783bb5b1b04e6c6",
        "_isDisabled": false
      },
      {
        "type": "deposit",
        "x": 28,
        "y": 31,
        "room": "sim",
        "depositType": "silicon",
        "ticksToRegeneration": null,
        "_id": "7816ecc6a783bb5b1b04e6d6",
        "_isDisabled": false
      },
      {
        "type": "deposit",
        "x": 22,
        "y": 33,
        "room": "sim",
        "harvested": 25000,
        "depositType": "biomass",
        "ticksToRegeneration": null,
        "_id": "7816ecc6a783bb5b1b04e7a6",
        "_isDisabled": false
      },
      {
        "type": "deposit",
        "x": 24,
        "y": 33,
        "room": "sim",
        "harvested": 50000,
        "depositType": "metal",
        "ticksToRegeneration": null,
        "_id": "7816ecc6a783bb5b1b04e7b6",
        "_isDisabled": false
      },
      {
        "type": "deposit",
        "x": 26,
        "y": 33,
        "room": "sim",
        "harvested": 100000,
        "depositType": "mist",
        "ticksToRegeneration": null,
        "_id": "7816ecc6a783bb5b1b04e7c6",
        "_isDisabled": false
      },
      {
        "type": "deposit",
        "x": 28,
        "y": 33,
        "room": "sim",
        "harvested": 150000,
        "depositType": "silicon",
        "cooldownTime": 140,
        "ticksToRegeneration": null,
        "_id": "7816ecc6a783bb5b1b04e7d6",
        "_isDisabled": false
      },
      {
        "type": "tombstone",
        "x": 35,
        "y": 31,
        "room": "sim",
        "user": "54bff72ab32a10f73a57d017",
        "_id": "tombstone1",
        "store": {
          "energy": 100
        },
        "deathTime": 12,
        "decayTime": 35
      },
      {
        "type": "tombstone",
        "x": 35,
        "y": 32,
        "room": "sim",
        "user": "54bff72ab32a10f73a57d017",
        "_id": "tombstone2",
        "store": {
          "energy": 0
        },
        "deathTime": 10,
        "decayTime": 16
      },
      {
        "type": "tombstone",
        "x": 35,
        "y": 33,
        "room": "sim",
        "user": "54bff72ab32a10f73a57d017",
        "_id": "tombstone3",
        "store": {
          "energy": 0
        },
        "deathTime": 10,
        "decayTime": 14
      },
      {
        "type": "tower",
        "x": 35,
        "y": 25,
        "room": "sim",
        "user": "2",
        "hits": 3000,
        "hitsMax": 3000,
        "_id": "22fa78bda5872a29a798bc70",
        "_isDisabled": false,
        "actionLog": {
          "attack": null,
          "heal": null,
          "repair": null
        },
        "store": {
          "energy": 500
        },
        "storeCapacityResource": {
          "energy": 1000
        }
      },
      {
        "type": "invaderCore",
        "x": 35,
        "y": 23,
        "level": 1,
        "room": "sim",
        "user": "2",
        "hits": 3000,
        "hitsMax": 3000,
        "_id": "22fa78bda5872a29a798bc71"
      },
      {
        "type": "ruin",
        "x": 37,
        "y": 31,
        "structureType": "invaderCore",
        "room": "sim",
        "_id": "ruin1",
        "user": "54bff72ab32a10f73a57d017",
        "store": {
          "energy": 100
        },
        "destroyTime": 12,
        "decayTime": 35
      },
      {
        "type": "ruin",
        "x": 37,
        "y": 32,
        "structureType": "invaderCore",
        "room": "sim",
        "_id": "ruin2",
        "user": "54bff72ab32a10f73a57d017",
        "destroyTime": 10,
        "decayTime": 16
      },
      {
        "type": "ruin",
        "x": 37,
        "y": 33,
        "structureType": "invaderCore",
        "room": "sim",
        "_id": "ruin3",
        "user": "54bff72ab32a10f73a57d017",
        "destroyTime": 10,
        "decayTime": 14
      }
    ],
    "users": {
      "0": {
        "username": "Player 1"
      },
      "1": {
        "username": "Player 2"
      },
      "2": {
        "username": "Invader"
      },
      "3": {
        "username": "Source Keeper"
      },
      "54bff72ab32a10f73a57d017": {
        "ok": 1,
        "_id": "54bff72ab32a10f73a57d017",
        "email": "chivcha.lov@gmail.com",
        "username": "player",
        "cpu": 30,
        "badge": {
          "type": 9,
          "color1": 31,
          "color2": 53,
          "color3": 74,
          "param": 0,
          "flip": false
        },
        "password": true,
        "lastRespawnDate": 1489085471747,
        "gcl": 50000000,
        "credits": 3000,
        "subscription": false,
        "money": 0,
        "subscriptionTokens": 4
      }
    },
    "info": {},
    "gameTime": 13,
    "flags": [],
    "visual": ""
  }
]
