import '@screeps/renderer-metadata';
import type { ProcessorMetadata, TextProcessorPayload } from '@screeps/renderer';
import { ROOM_SIZE, USER_ID } from './constants';

// The bundled metadata styles the mineral letter as `Roboto, serif`. Roboto is never loaded here, so
// the letter falls back to the generic serif face; every other label in the metadata uses
// `Roboto, sans-serif`. Retarget it at the app font before the metadata is compiled.
const MINERAL_FONT_FAMILY = '"Inter", "Helvetica", "Arial", sans-serif';

const applyMineralFont = (metadata: typeof RENDERER_METADATA) => {
  const textProcessor = metadata.objects.mineral?.processors?.find(
    (processor: ProcessorMetadata<TextProcessorPayload>) => processor.type === 'text'
  );
  const style = textProcessor?.payload?.style;

  if (style && typeof style === 'object' && 'fontFamily' in style) {
    style.fontFamily = MINERAL_FONT_FAMILY;
  }

  return metadata;
};

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
  metadata: applyMineralFont(RENDERER_METADATA),
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
