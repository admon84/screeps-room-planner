import {
  CONTROLLER_STRUCTURES,
  EXTENSION_ENERGY_CAPACITY,
  RAMPART_HITS_MAX,
  STRUCTURE_CONTROLLER,
  STRUCTURE_EXTENSION,
  STRUCTURE_RAMPART,
  USER_ID,
} from './constants';
import { GameObject } from './gameObjects';

type DerivedObject = GameObject & {
  level?: number;
  hits?: number;
  hitsMax?: number;
  store?: Record<string, number>;
  storeCapacityResource?: Record<string, number>;
};

// Always overwrites _isDisabled (never sets it conditionally) so structures re-enable when the RCL
// steps back up. Extension capacity must be an exact 50/100/200 -- the renderer's border sprites
// gate on strict equality.
export const deriveObjectsForRcl = (objects: GameObject[], rcl: number): GameObject[] => {
  const counts: Record<string, number> = {};
  return objects.map((object) => {
    const { type } = object;
    const caps = type ? CONTROLLER_STRUCTURES[type] : undefined;
    if (!type || !caps) return object;
    const index = counts[type] ?? 0;
    counts[type] = index + 1;
    const derived: DerivedObject = { ...object, _isDisabled: index >= (caps[rcl] ?? 0) };
    if (type === STRUCTURE_EXTENSION) {
      const energy = EXTENSION_ENERGY_CAPACITY[rcl];
      derived.storeCapacityResource = { energy };
      derived.store = { energy };
    } else if (type === STRUCTURE_CONTROLLER) {
      derived.level = rcl;
    } else if (type === STRUCTURE_RAMPART && RAMPART_HITS_MAX[rcl]) {
      derived.hits = RAMPART_HITS_MAX[rcl];
      derived.hitsMax = RAMPART_HITS_MAX[rcl];
    }
    return derived;
  });
};

// `playerName` only feeds `username`, which the renderer's setBadgeUrls processor substitutes into
// BADGE_URL on every applyState -- so the badge follows the name with no cache to bust. The user's
// key and `_id` stay USER_ID: every placed object carries `user: USER_ID`, and renaming the id would
// orphan them all. Falls back to USER_ID because an empty username yields a badge URL that 404s.
export const createGameState = (objects: any[] = [], playerName = USER_ID) => ({
  objects,
  users: {
    '0': {
      username: 'Player 1',
    },
    '1': {
      username: 'Player 2',
    },
    '2': {
      username: 'Invader',
    },
    '3': {
      username: 'Source Keeper',
    },
    [USER_ID]: {
      ok: 1,
      _id: USER_ID,
      email: '',
      username: playerName.trim() || USER_ID,
      cpu: 100,
      badge: {
        type: 0,
        color1: '#272727',
        color2: '#272727',
        color3: '#272727',
        param: -9,
        flip: true,
      },
      password: true,
      lastRespawnDate: 1489085471747,
      gcl: 50000000,
      credits: 3000,
      subscription: false,
      money: 0,
      subscriptionTokens: 4,
    },
  },
  info: {},
  gameTime: 1,
  flags: [],
  visual: '',
});
