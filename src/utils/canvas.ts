import { CELL_SIZE } from './worldConfigs';
import { Point } from '@/types';

const CELL_OFFSET = CELL_SIZE / 2;

export function createHighlight(worldPos: Point = { x: 0, y: 0 }, color = 0xffffff, alpha = 0.4) {
  const highlight = new PIXI.Graphics();
  highlight.beginFill(color, 1);
  highlight.drawRect(worldPos.x, worldPos.y, CELL_SIZE, CELL_SIZE);
  highlight.endFill();
  highlight.alpha = alpha;
  return highlight;
}

export function convertGlobalToRoomPosition(globalPos: Point, stage: PIXI.Container) {
  const localPoint = stage.toLocal(new PIXI.Point(globalPos.x, globalPos.y));
  localPoint.x += CELL_OFFSET;
  localPoint.y += CELL_OFFSET;
  return {
    x: Math.floor(localPoint.x / CELL_SIZE),
    y: Math.floor(localPoint.y / CELL_SIZE),
  };
}

export function convertRoomToWorldPosition(roomPos: Point) {
  return {
    x: roomPos.x * CELL_SIZE - CELL_OFFSET,
    y: roomPos.y * CELL_SIZE - CELL_OFFSET,
  };
}

export function convertGlobalToCanvasPosition(globalPos: Point, stage: PIXI.Container) {
  const roomPos = convertGlobalToRoomPosition(globalPos, stage);
  return convertRoomToWorldPosition(roomPos);
}
