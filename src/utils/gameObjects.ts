import { v4 as uuidv4 } from 'uuid';
import * as Constants from './constants';

export interface GameObject {
  x: number;
  y: number;
  type?: string | null;
  room?: string;
  _id?: string;
  _isDisabled?: boolean;
}

export function createObjectWithId<T extends GameObject>(object: T): GameObject {
  return {
    ...object,
    _id: object._id || uuidv4().replace(/-/g, ''),
  };
}

export function createObjectFromType<T extends GameObject>(object: T): GameObject {
  if (object.type && Object.keys(Constants.OBJECT_BRUSHES).includes(object.type)) {
    if (object.type === Constants.SOURCE) {
      return createSource(object);
    }
    return createMineral({ ...object, type: Constants.MINERAL, mineralType: object.type });
  }

  switch (object.type) {
    case Constants.STRUCTURE_CONTROLLER:
      return createController(object);
    case Constants.STRUCTURE_ROAD:
      return createRoad(object);
    case Constants.STRUCTURE_CONTAINER:
      return createContainer(object);
    case Constants.STRUCTURE_TOWER:
      return createTower(object);
    case Constants.STRUCTURE_EXTENSION:
      return createExtension(object);
    case Constants.STRUCTURE_LAB:
      return createLab(object);
    case Constants.STRUCTURE_LINK:
      return createLink(object);
    case Constants.STRUCTURE_NUKER:
      return createNuker(object);
    case Constants.STRUCTURE_OBSERVER:
      return createObserver(object);
    case Constants.STRUCTURE_POWER_SPAWN:
      return createPowerSpawn(object);
    case Constants.STRUCTURE_SPAWN:
      return createSpawn(object);
    case Constants.STRUCTURE_STORAGE:
      return createStorage(object);
    case Constants.STRUCTURE_TERMINAL:
      return createTerminal(object);
    case Constants.STRUCTURE_EXTRACTOR:
      return createExtractor(object);
    case Constants.STRUCTURE_FACTORY:
      return createFactory(object);
    case Constants.STRUCTURE_WALL:
      return createWall(object);
    case Constants.STRUCTURE_RAMPART:
      return createRampart(object);
    case 'deposit':
      return createDeposit(object);
    case 'ruin':
      return createRuin(object);
    case 'tombstone':
      return createTombstone(object);
    case 'powerBank':
      return createPowerBank(object);
    case 'invaderCore':
      return createInvaderCore(object);
  }
  return object;
}

interface Controller extends GameObject {
  level?: number;
  progress?: number;
  user?: string;
  downgradeTime?: number;
  isPowerEnabled?: boolean;
}

export function createController({
  x,
  y,
  room = Constants.ROOM_NAME,
  level = Constants.MAX_RCL,
  user = Constants.USER_ID,
  progress = 0,
  downgradeTime = 1000000,
  isPowerEnabled = true,
  _id,
  _isDisabled = false,
}: Controller) {
  return createObjectWithId({
    type: Constants.STRUCTURE_CONTROLLER,
    x,
    y,
    room,
    level,
    user,
    downgradeTime,
    isPowerEnabled,
    _id,
    _isDisabled,
    progress,
  });
}

interface Road extends GameObject {
  hits?: number;
  hitsMax?: number;
  nextDecayTime?: number;
}

export function createRoad({
  x,
  y,
  room = Constants.ROOM_NAME,
  hits = 5000,
  hitsMax = 5000,
  nextDecayTime = 0,
  _id,
  _isDisabled = false,
}: Road) {
  return createObjectWithId({
    type: Constants.STRUCTURE_ROAD,
    x,
    y,
    room,
    hits,
    hitsMax,
    nextDecayTime,
    _id,
    _isDisabled,
  });
}

interface Container extends GameObject {
  hits?: number;
  hitsMax?: number;
  nextDecayTime?: number;
  storeCapacity?: number;
  store?: { energy: number; H: number };
}

export function createContainer({
  x,
  y,
  room,
  hits = 250000,
  hitsMax = 250000,
  nextDecayTime = 108,
  _id,
  _isDisabled = false,
  storeCapacity = 2000,
  store = { energy: 1000, H: 500 },
}: Container) {
  return createObjectWithId({
    type: Constants.STRUCTURE_CONTAINER,
    x,
    y,
    room,
    hits,
    hitsMax,
    nextDecayTime,
    _id,
    _isDisabled,
    storeCapacity,
    store,
  });
}

interface Tower extends GameObject {
  hits?: number;
  hitsMax?: number;
  energy?: number;
  energyCapacity?: number;
}

export function createTower({
  x,
  y,
  room,
  hits = 3000,
  hitsMax = 3000,
  energy = 1000,
  energyCapacity = 1000,
  _id,
  _isDisabled = false,
}: Tower) {
  return createObjectWithId({
    type: Constants.STRUCTURE_TOWER,
    x,
    y,
    room,
    hits,
    hitsMax,
    energy,
    energyCapacity,
    _id,
    _isDisabled,
  });
}

interface Extension extends GameObject {
  hits?: number;
  hitsMax?: number;
  storeCapacityResource?: { energy: number };
  store?: { energy: number };
}

export function createExtension({
  x,
  y,
  room,
  hits = 1000,
  hitsMax = 1000,
  storeCapacityResource = { energy: 200 },
  store = { energy: 100 },
  _id,
  _isDisabled = false,
}: Extension) {
  return createObjectWithId({
    type: Constants.STRUCTURE_EXTENSION,
    x,
    y,
    room,
    hits,
    hitsMax,
    storeCapacityResource,
    store,
    _id,
    _isDisabled,
  });
}

interface Lab extends GameObject {
  hits?: number;
  hitsMax?: number;
  storeCapacityResource?: { energy: number; L: number };
  store?: { energy: number; L: number };
}

export function createLab({
  x,
  y,
  room,
  hits = 500,
  hitsMax = 500,
  storeCapacityResource = { energy: 200, L: 100 },
  store = { energy: 100, L: 50 },
  _id,
  _isDisabled = false,
}: Lab) {
  return createObjectWithId({
    type: Constants.STRUCTURE_LAB,
    x,
    y,
    room,
    hits,
    hitsMax,
    storeCapacityResource,
    store,
    _id,
    _isDisabled,
  });
}

interface Link extends GameObject {
  hits?: number;
  hitsMax?: number;
  cooldown?: number;
  storeCapacityResource?: { energy: number };
  store?: { energy: number };
}

export function createLink({
  x,
  y,
  room,
  hits = 1000,
  hitsMax = 1000,
  cooldown = 0,
  storeCapacityResource = { energy: 800 },
  store = { energy: 400 },
  _id,
  _isDisabled = false,
}: Link) {
  return createObjectWithId({
    type: Constants.STRUCTURE_LINK,
    x,
    y,
    room,
    hits,
    hitsMax,
    cooldown,
    storeCapacityResource,
    store,
    _id,
    _isDisabled,
  });
}

interface Nuker extends GameObject {
  hits?: number;
  hitsMax?: number;
  cooldownTime?: number;
  storeCapacityResource?: { energy: number; G: number };
  store?: { energy: number; G: number };
}

export function createNuker({
  x,
  y,
  room,
  hits = 1000,
  hitsMax = 1000,
  cooldownTime = 18,
  storeCapacityResource = { energy: 300000, G: 5000 },
  store = { energy: 150000, G: 2500 },
  _id,
  _isDisabled = false,
}: Nuker) {
  return createObjectWithId({
    type: Constants.STRUCTURE_NUKER,
    x,
    y,
    room,
    hits,
    hitsMax,
    cooldownTime,
    storeCapacityResource,
    store,
    _id,
    _isDisabled,
  });
}

interface Observer extends GameObject {
  hits?: number;
  hitsMax?: number;
  observeRoom?: string | null;
}

export function createObserver({
  x,
  y,
  room,
  hits = 500,
  hitsMax = 500,
  observeRoom = null,
  _id,
  _isDisabled = false,
}: Observer) {
  return createObjectWithId({
    type: Constants.STRUCTURE_OBSERVER,
    x,
    y,
    room,
    hits,
    hitsMax,
    observeRoom,
    _id,
    _isDisabled,
  });
}

interface PowerBank extends GameObject {
  hits?: number;
  hitsMax?: number;
  store?: { power: number };
  decayTime?: number;
}

export function createPowerBank({
  x,
  y,
  room,
  hits = 2000000,
  hitsMax = 2000000,
  store = { power: 2371 },
  decayTime = 5008,
  _id,
  _isDisabled = false,
}: PowerBank) {
  return createObjectWithId({
    type: 'powerBank',
    x,
    y,
    room,
    hits,
    hitsMax,
    store,
    decayTime,
    _id,
    _isDisabled,
  });
}

interface PowerSpawn extends GameObject {
  hits?: number;
  hitsMax?: number;
  storeCapacityResource?: { energy: number; power: number };
  store?: { energy: number; power: number };
}

export function createPowerSpawn({
  x,
  y,
  room,
  hits = 5000,
  hitsMax = 5000,
  storeCapacityResource = { energy: 5000, power: 100 },
  store = { energy: 2500, power: 50 },
  _id,
  _isDisabled = false,
}: PowerSpawn) {
  return createObjectWithId({
    type: Constants.STRUCTURE_POWER_SPAWN,
    x,
    y,
    room,
    hits,
    hitsMax,
    storeCapacityResource,
    store,
    _id,
    _isDisabled,
  });
}

interface Source extends GameObject {
  energy?: number;
  energyCapacity?: number;
  ticksToRegeneration?: number;
  nextRegenerationTime?: number;
}

export function createSource({
  x,
  y,
  room,
  energy = 1500,
  energyCapacity = 3000,
  ticksToRegeneration = 300,
  nextRegenerationTime = 309,
  _id,
  _isDisabled = false,
}: Source) {
  return createObjectWithId({
    type: Constants.SOURCE,
    x,
    y,
    room,
    energy,
    energyCapacity,
    ticksToRegeneration,
    _id,
    _isDisabled,
    nextRegenerationTime,
  });
}

interface Mineral extends GameObject {
  mineralType?: string;
  mineralAmount?: number;
  ticksToRegeneration?: number | null;
}

export function createMineral({
  x,
  y,
  room,
  mineralType,
  mineralAmount,
  ticksToRegeneration = null,
  _id,
  _isDisabled = false,
}: Mineral) {
  return createObjectWithId({
    type: Constants.MINERAL,
    x,
    y,
    room,
    mineralType,
    mineralAmount,
    ticksToRegeneration,
    _id,
    _isDisabled,
  });
}

interface Spawn extends GameObject {
  name?: string;
  user?: string;
  hits?: number;
  hitsMax?: number;
  spawning?: { name: string; needTime: number; remainingTime: number } | null;
  off?: boolean;
  effects?: Record<string, number>;
  storeCapacityResource?: { energy: number };
  store?: { energy: number };
}

export function createSpawn({
  x,
  y,
  room = Constants.ROOM_NAME,
  user = Constants.USER_ID,
  name,
  hits = 5000,
  hitsMax = 5000,
  spawning = null,
  off = false,
  storeCapacityResource = { energy: 300 },
  store = { energy: 150 },
  _id,
  _isDisabled = false,
}: Spawn) {
  return createObjectWithId({
    type: Constants.STRUCTURE_SPAWN,
    x,
    y,
    room,
    user,
    name,
    hits,
    hitsMax,
    spawning,
    off,
    storeCapacityResource,
    store,
    _id,
    _isDisabled,
  });
}

interface Storage extends GameObject {
  hits?: number;
  hitsMax?: number;
  storeCapacity?: number;
  store?: { energy: number; L: number };
}

export function createStorage({
  x,
  y,
  room,
  hits = 10000,
  hitsMax = 10000,
  storeCapacity = 1000000,
  store = { energy: 500000, L: 300000 },
  _id,
  _isDisabled = false,
}: Storage) {
  return createObjectWithId({
    type: Constants.STRUCTURE_STORAGE,
    x,
    y,
    room,
    hits,
    hitsMax,
    storeCapacity,
    store,
    _id,
    _isDisabled,
  });
}

interface Terminal extends GameObject {
  hits?: number;
  hitsMax?: number;
  storeCapacity?: number;
  store?: { energy: number };
}

export function createTerminal({
  x,
  y,
  room,
  hits = 3000,
  hitsMax = 3000,
  storeCapacity = 300000,
  store = { energy: 150000 },
  _id,
  _isDisabled = false,
}: Terminal) {
  return createObjectWithId({
    type: Constants.STRUCTURE_TERMINAL,
    x,
    y,
    room,
    hits,
    hitsMax,
    storeCapacity,
    store,
    _id,
    _isDisabled,
  });
}

interface Extractor extends GameObject {
  hits?: number;
  hitsMax?: number;
  cooldown?: number;
}

export function createExtractor({
  x,
  y,
  room,
  hits = 500,
  hitsMax = 500,
  cooldown = 9,
  _id,
  _isDisabled = false,
}: Extractor) {
  return createObjectWithId({
    type: Constants.STRUCTURE_EXTRACTOR,
    x,
    y,
    room,
    hits,
    hitsMax,
    cooldown,
    _id,
    _isDisabled,
  });
}

interface Factory extends GameObject {
  level?: number;
  storeCapacity?: number;
  store?: { energy: number; power: number; H: number; O: number };
  cooldownTime?: number;
  effects?: Record<string, { power: number; level: number; endTime: number }>;
}

export function createFactory({
  x,
  y,
  room,
  level,
  storeCapacity = 2000,
  store = {
    energy: 1000,
    power: 500,
    H: 250,
    O: 250,
  },
  cooldownTime = 9,
  effects = {
    '0': {
      power: 19,
      level: 1,
      endTime: 15,
    },
  },
  _id,
  _isDisabled = false,
}: Factory) {
  return createObjectWithId({
    type: Constants.STRUCTURE_FACTORY,
    x,
    y,
    room,
    level,
    storeCapacity,
    store,
    cooldownTime,
    effects,
    _id,
    _isDisabled,
  });
}

interface Deposit extends GameObject {
  depositType?: string;
  harvested?: number;
  ticksToRegeneration?: number | null;
}

export function createDeposit({
  x,
  y,
  room,
  depositType,
  harvested = 0,
  ticksToRegeneration = null,
  _id,
  _isDisabled = false,
}: Deposit) {
  return createObjectWithId({
    type: 'deposit',
    x,
    y,
    room,
    depositType,
    harvested,
    ticksToRegeneration,
    _id,
    _isDisabled,
  });
}

interface Ruin extends GameObject {
  structureType?: string;
  destroyTime?: number;
  store?: { energy: number };
  decayTime?: number;
}

export function createRuin({
  x,
  y,
  room,
  structureType,
  destroyTime = 0,
  store = { energy: 0 },
  decayTime = 0,
  _id,
  _isDisabled = false,
}: Ruin) {
  return createObjectWithId({
    type: 'ruin',
    x,
    y,
    room,
    structureType,
    destroyTime,
    store,
    decayTime,
    _id,
    _isDisabled,
  });
}

interface Tombstone extends GameObject {
  user?: string;
  store?: { energy: number };
  deathTime?: number;
  decayTime?: number;
}

export function createTombstone({
  x,
  y,
  room,
  user = Constants.USER_ID,
  store = { energy: 0 },
  deathTime = 0,
  decayTime = 0,
  _id,
  _isDisabled = false,
}: Tombstone) {
  return createObjectWithId({
    type: 'tombstone',
    x,
    y,
    room,
    user,
    store,
    deathTime,
    decayTime,
    _id,
    _isDisabled,
  });
}

interface InvaderCore extends GameObject {
  level?: number;
}

export function createInvaderCore({ x, y, room, level, _id, _isDisabled = false }: InvaderCore) {
  return createObjectWithId({
    type: 'invaderCore',
    x,
    y,
    room,
    level,
    _id,
    _isDisabled,
  });
}

interface Wall extends GameObject {
  hits?: number;
  hitsMax?: number;
}

export function createWall({ x, y, room, hits = 300000000, hitsMax = 300000000, _id, _isDisabled = false }: Wall) {
  return createObjectWithId({
    type: Constants.STRUCTURE_WALL,
    x,
    y,
    room,
    hits,
    hitsMax,
    _id,
    _isDisabled,
  });
}

interface Rampart extends GameObject {
  user?: string;
  hits?: number;
  hitsMax?: number;
  nextDecayTime?: number;
}

export function createRampart({
  x,
  y,
  room,
  user = Constants.USER_ID,
  nextDecayTime = 5000,
  hits = 300000000,
  hitsMax = 300000000,
  _id,
  _isDisabled = false,
}: Rampart) {
  return createObjectWithId({
    type: Constants.STRUCTURE_RAMPART,
    x,
    y,
    room,
    user,
    hits,
    hitsMax,
    nextDecayTime,
    _id,
    _isDisabled,
  });
}
