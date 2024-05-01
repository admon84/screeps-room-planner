import '@screeps/renderer-metadata';

declare global {
  const RENDERER_METADATA: any;
}

console.log('renderer metadata:', RENDERER_METADATA);

export const worldConfigs = {
  ATTACK_PENETRATION: 10,
  CELL_SIZE: 100,
  RENDER_SIZE: {
    width: 2048,
    height: 2048,
  },
  VIEW_BOX: 5000,
  BADGE_URL: 'https://screeps.com/api/user/badge-svg?username=%1',
  metadata: RENDERER_METADATA,
  gameData: {
    player: '561e4d4645f3f7244a7622e8',
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
