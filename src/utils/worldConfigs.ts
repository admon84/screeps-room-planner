import '@screeps/renderer-metadata';
import { ROOM_SIZE, USER_ID } from './constants';

export const ATTACK_PENETRATION = 10;
export const CELL_SIZE = 100;
export const VIEW_BOX = 5000;
export const RENDER_SIZE = {
  width: 2048,
  height: 2048,
};

export const worldConfigs = {
  ATTACK_PENETRATION,
  CELL_SIZE,
  RENDER_SIZE,
  // The renderer's terrain/road path builder reads ROOM_SIZE off worldOptions to size its tile
  // array. Omitting it leaves the array empty and setTerrain() throws on the first tile write.
  ROOM_SIZE,
  VIEW_BOX,
  BADGE_URL: 'https://screeps.com/api/user/badge-svg?username=%1',
  metadata: RENDERER_METADATA,
  gameData: {
    player: USER_ID,
    showMyNames: {
      spawns: true,
      creeps: true,
    },
    showEnemyNames: {
      spawns: false,
      creeps: false,
    },
    showFlagsNames: true,
    showCreepSpeech: false,
    swampTexture: 'animated',
  },
  lighting: 'normal',
  forceCanvas: false,
};
