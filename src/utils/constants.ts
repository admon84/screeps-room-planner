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

export const USER_ID = 'dissi';
export const ROOM_NAME = 'sim';

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
