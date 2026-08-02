import type { Container } from 'pixi.js';
import { CELL_SIZE } from './worldConfigs';
import { Point } from '@/types';

const CELL_OFFSET = CELL_SIZE / 2;

type GestureState = {
  buttons: number;
  shiftKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
};

const BUTTONS_LEFT = 1;
const BUTTONS_RIGHT = 2;
const BUTTONS_MIDDLE = 4;

/**
 * Ctrl+left is indistinguishable from a right-click on macOS -- the browser reports `buttons === 2`
 * for both -- so erase has to be tested before panning or it never fires there. Cmd+left is the
 * unambiguous alternative on that platform.
 */
export const isEraseGesture = ({ buttons, ctrlKey, metaKey }: GestureState) =>
  (!!ctrlKey || !!metaKey) && (buttons === BUTTONS_LEFT || buttons === BUTTONS_RIGHT);

export const isPanGesture = (state: GestureState) => {
  if (isEraseGesture(state)) return false;
  const { buttons, shiftKey } = state;
  return buttons === BUTTONS_RIGHT || buttons === BUTTONS_MIDDLE || (!!shiftKey && buttons === BUTTONS_LEFT);
};

export const isPaintGesture = (state: GestureState) =>
  state.buttons === BUTTONS_LEFT && !isEraseGesture(state) && !isPanGesture(state);

export function createHighlight(worldPos: Point = { x: 0, y: 0 }, color = 0xffffff, alpha = 0.4) {
  const highlight = new PIXI.Graphics();
  highlight.beginFill(color, 1);
  highlight.drawRect(worldPos.x, worldPos.y, CELL_SIZE, CELL_SIZE);
  highlight.endFill();
  highlight.alpha = alpha;
  return highlight;
}

export function convertGlobalToRoomPosition(globalPos: Point, stage: Container) {
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

export function convertGlobalToCanvasPosition(globalPos: Point, stage: Container) {
  const roomPos = convertGlobalToRoomPosition(globalPos, stage);
  return convertRoomToWorldPosition(roomPos);
}
