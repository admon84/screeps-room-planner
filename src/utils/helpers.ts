import * as Constants from './constants';
import { Point } from './types';

export const getDistance = (a: Point, b: Point) => Math.max(Math.abs(b.x - a.x), Math.abs(b.y - a.y));

export const getTile = (x: number, y: number) => y * Constants.ROOM_SIZE + x;

export const getTileForPoint = ({ x, y }: Point) => getTile(x, y);

export const getPointForTile = (tile: number) => ({
  x: tile % Constants.ROOM_SIZE,
  y: Math.floor(tile / Constants.ROOM_SIZE),
});

export const getShortForTile = (tile: number) => {
  const { x, y } = getPointForTile(tile);
  return `${x}-${y}`;
};

export const getPointForShort = (shortPoint: string) => {
  const [x, y] = shortPoint.split('-');
  return { x: +x, y: +y };
};

export const getTileForShort = (shortPoint: string) => {
  const { x, y } = getPointForShort(shortPoint);
  return getTile(x, y);
};

export const positionIsValid = (x: number, y: number) =>
  x >= 0 && x < Constants.ROOM_SIZE && y >= 0 && y < Constants.ROOM_SIZE;

export const getStructureProps = (key: string, rcl = Constants.MAX_RCL) => ({
  key,
  image: getStructureIconPath(key, rcl),
  name: Constants.STRUCTURE_BRUSHES[key],
  total: Constants.CONTROLLER_STRUCTURES[key][rcl] || 0,
});

const getStructureIconPath = (key: string, rcl = Constants.MAX_RCL) => {
  const path = window.location.pathname.replace(/\/$/, '');
  if (key === Constants.STRUCTURE_CONTROLLER) {
    return `${path}/images/controller/${rcl}.png`;
  } else if (key === Constants.STRUCTURE_EXTENSION) {
    return `${path}/images/extension/` + (rcl === 8 || rcl === 7 ? `${rcl}.png` : '3.png');
  }
  return `${path}/images/structures/${key}.png`;
};

export const getStructureBrushes = (rcl = Constants.MAX_RCL) =>
  Object.keys(Constants.STRUCTURE_BRUSHES).map((key) => getStructureProps(key, rcl));

export const getRequiredRCL = (structure: string) =>
  Math.min(...Object.keys(Constants.CONTROLLER_STRUCTURES[structure]).map((v) => +v));

export const structureCanBePlaced = (structure: string, rcl: number, placed: number, terrain: string) => {
  if (![Constants.STRUCTURE_ROAD, Constants.STRUCTURE_CONTROLLER, Constants.STRUCTURE_EXTRACTOR].includes(structure)) {
    if (terrain === Constants.TERRAIN_WALL) return false;
  }
  const total = Constants.CONTROLLER_STRUCTURES[structure][rcl];
  return !!total && (!placed || placed < total);
};

export const structuresToRemove = (brush: string, skipBrush = false) =>
  brush === Constants.STRUCTURE_RAMPART
    ? []
    : Object.keys(Constants.STRUCTURE_BRUSHES).reduce(
        (acc: string[], structure) =>
          (skipBrush && brush === structure) ||
          structure === Constants.STRUCTURE_RAMPART ||
          (brush === Constants.STRUCTURE_CONTAINER && structure === Constants.STRUCTURE_ROAD) ||
          (brush === Constants.STRUCTURE_ROAD && structure === Constants.STRUCTURE_CONTAINER)
            ? acc
            : [...acc, structure],
        []
      );
