import {
  CONTROLLER_STRUCTURES,
  MAX_RCL,
  ROOM_SIZE,
  STRUCTURE_CONTROLLER,
  STRUCTURE_EXTENSION,
  STRUCTURE_EXTRACTOR,
  STRUCTURE_BRUSHES,
  STRUCTURE_ROAD,
  TERRAIN_WALL,
  STRUCTURE_RAMPART,
  STRUCTURE_CONTAINER,
} from './constants';

export const getStructureProps = (key: string, rcl = MAX_RCL) => ({
  key,
  image: getStructureIconPath(key, rcl),
  name: STRUCTURE_BRUSHES[key],
  total: CONTROLLER_STRUCTURES[key][rcl] || 0,
});

const getStructureIconPath = (key: string, rcl = MAX_RCL) => {
  const path = window.location.pathname.replace(/\/$/, '');
  if (key === STRUCTURE_CONTROLLER) {
    return `${path}/images/controller/${rcl}.png`;
  } else if (key === STRUCTURE_EXTENSION) {
    return `${path}/images/extension/` + (rcl === 8 || rcl === 7 ? `${rcl}.png` : '3.png');
  }
  return `${path}/images/structures/${key}.png`;
};

export const getStructureBrushes = (rcl = MAX_RCL) =>
  Object.keys(STRUCTURE_BRUSHES).map((key) => getStructureProps(key, rcl));

export const getRequiredRCL = (structure: string) =>
  Math.min(...Object.keys(CONTROLLER_STRUCTURES[structure]).map((v) => +v));

export const getRoomTile = (x: number, y: number) => y * ROOM_SIZE + x;

export const getPoint = (tile: number) => ({ x: tile % ROOM_SIZE, y: Math.floor(tile / ROOM_SIZE) });

export const getShortPoint = (tile: number) => {
  const { x, y } = getPoint(tile);
  return `${x}-${y}`;
};

export const getPointFromString = (shortPoint: string) => {
  const [x, y] = shortPoint.split('-');
  return { x: +x, y: +y };
};

export const positionIsValid = (x: number, y: number) => x >= 0 && x < ROOM_SIZE && y >= 0 && y < ROOM_SIZE;

export const structureCanBePlaced = (structure: string, rcl: number, placed: number, terrain: string) => {
  if (![STRUCTURE_ROAD, STRUCTURE_CONTROLLER, STRUCTURE_EXTRACTOR].includes(structure)) {
    if (terrain === TERRAIN_WALL) return false;
  }
  const total = CONTROLLER_STRUCTURES[structure][rcl];
  return !!total && (!placed || placed < total);
};

export const structuresToRemove = (brush: string, skipBrush = false) =>
  brush === STRUCTURE_RAMPART
    ? []
    : Object.keys(STRUCTURE_BRUSHES).reduce(
        (acc: string[], structure) =>
          (skipBrush && brush === structure) ||
          structure === STRUCTURE_RAMPART ||
          (brush === STRUCTURE_CONTAINER && structure === STRUCTURE_ROAD) ||
          (brush === STRUCTURE_ROAD && structure === STRUCTURE_CONTAINER)
            ? acc
            : [...acc, structure],
        []
      );
