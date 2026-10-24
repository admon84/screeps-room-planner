import { ROOM_SIZE } from './constants';
import { Point } from '../types';

/**
 * Outline of a set of tiles as an SVG path in renderer units (100 per tile, tile x spans
 * x*100..x*100+100), with the rounded outer corners the game draws for natural walls, swamps and
 * ramparts. A port of `getRenderPath` from @screeps/renderer (src/lib/pathHelper.js, ISC), minus the
 * md5 change detection the renderer needs and an export does not.
 *
 * `context` tiles count as neighbours for the corner rounding but are not drawn: the outline of
 * built walls with the natural walls as context meets the rock with straight edges, so drawing both
 * sets separately looks like the renderer's single merged outline.
 */
export function getRenderPath(tiles: Point[], diagonalConnect = false, context: Point[] = []): string {
  const filled: boolean[][] = Array.from({ length: ROOM_SIZE + 1 }, () =>
    new Array<boolean>(ROOM_SIZE + 1).fill(false)
  );
  const visited: boolean[][] = Array.from({ length: ROOM_SIZE + 1 }, () =>
    new Array<boolean>(ROOM_SIZE + 1).fill(false)
  );
  const near: boolean[][] = Array.from({ length: ROOM_SIZE + 1 }, () => new Array<boolean>(ROOM_SIZE + 1).fill(false));
  const inRoom = (x: number, y: number) => x >= 0 && y >= 0 && x < ROOM_SIZE && y < ROOM_SIZE;
  for (const { x, y } of tiles) if (inRoom(x, y)) filled[x][y] = true;
  for (const { x, y } of context) if (inRoom(x, y)) near[x][y] = true;
  // own: the tiles this outline draws (traversal); a: anything solid next to them (corner shapes).
  const own = (x: number, y: number) => inRoom(x, y) && filled[x][y];
  const a = (x: number, y: number) => inRoom(x, y) && (filled[x][y] || near[x][y]);
  const last = ROOM_SIZE - 1;
  let path = '';

  const topLeftDownR = (x: number, y: number) => {
    path += x > 0 && y > 0 && !a(x - 1, y) ? 'a 50 50 0 0 0 -50 -50 h 50 ' : 'v -50 ';
  };
  const topLeftUpR = (x: number, y: number) => {
    path += y > 0 && x > 0 && !a(x, y - 1) ? 'v -50 a 50 50 0 0 0 50 50 ' : 'h 50 ';
  };
  const topLeftR = (x: number, y: number) => {
    path += x === 0 || a(x - 1, y) || y === 0 || a(x, y - 1) ? 'v -50 h 50 ' : 'a 50 50 0 0 1 50 -50 ';
  };
  const topRightUpR = (x: number, y: number) => {
    path += y > 0 && x < last && !a(x, y - 1) ? 'a 50 50 0 0 0 50 -50 v 50 ' : 'h 50 ';
  };
  const topRightDownR = (x: number, y: number) => {
    path += x < last && y > 0 && !a(x + 1, y) ? 'h 50 a 50 50 0 0 0 -50 50 ' : 'v 50 ';
  };
  const topRightR = (x: number, y: number) => {
    path += x === last || a(x + 1, y) || y === 0 || a(x, y - 1) ? 'h 50 v 50 ' : 'a 50 50 0 0 1 50 50 ';
  };
  const bottomRightR = (x: number, y: number) => {
    const square =
      x === last || a(x + 1, y) || y === last || a(x, y + 1) || (a(x + 1, y + 1) && (a(x + 1, y) || diagonalConnect));
    path += square ? 'v 50 h -50 ' : 'a 50 50 0 0 1 -50 50 ';
  };
  const bottomLeftR = (x: number, y: number) => {
    const square =
      x === 0 || a(x - 1, y) || y === last || a(x, y + 1) || (a(x - 1, y + 1) && (a(x - 1, y) || diagonalConnect));
    path += square ? 'h -50 v -50 ' : 'a 50 50 0 0 1 -50 -50 ';
  };
  const cornerTL = (x: number, y: number) =>
    x === 0 || y === 0 || (a(x - 1, y - 1) && (diagonalConnect || a(x - 1, y) || a(x, y - 1)));
  const cornerTR = (x: number, y: number) =>
    x === last || y === 0 || (a(x + 1, y - 1) && (diagonalConnect || a(x + 1, y) || a(x, y - 1)));

  const recurs = (x: number, y: number, dx: boolean) => {
    if (visited[x][y]) {
      path += dx ? 'v 100 ' : 'h -100 ';
      return;
    }
    if (dx) {
      if (cornerTL(x, y)) topLeftUpR(x, y);
      else path += 'h 50 ';
      if (x < last && own(x + 1, y)) {
        if (cornerTR(x, y)) topRightUpR(x, y);
        else path += 'h 50 ';
        recurs(x + 1, y, true);
        path += 'h -100 ';
      } else {
        if (cornerTR(x, y)) {
          topRightUpR(x, y);
          topRightDownR(x, y);
        } else {
          topRightR(x, y);
        }
        bottomRightR(x, y);
        path += 'h -50 ';
      }
    } else {
      if (cornerTR(x, y)) topRightDownR(x, y);
      else path += 'v 50 ';
      if (y < last && own(x, y + 1)) {
        path += 'v 50 ';
        recurs(x, y + 1, false);
        path += 'v -50 ';
      } else {
        bottomRightR(x, y);
        bottomLeftR(x, y);
      }
      if (x === 0 || y === 0 || a(x - 1, y - 1)) topLeftDownR(x, y);
      else path += 'v -50 ';
    }
    visited[x][y] = true;
  };

  for (let x = 0; x < ROOM_SIZE; x += 1) {
    for (let y = 0; y < ROOM_SIZE; y += 1) {
      if (!own(x, y) || visited[x][y]) continue;
      path += `M ${x * 100} ${y * 100 + 50} `;
      visited[x][y] = true;
      let horizontal = 0;
      do horizontal += 1;
      while (x + horizontal < ROOM_SIZE && own(x + horizontal, y));
      let vertical = 0;
      do vertical += 1;
      while (y + vertical < ROOM_SIZE && own(x, y + vertical));

      if (cornerTL(x, y)) {
        topLeftDownR(x, y);
        topLeftUpR(x, y);
      } else {
        topLeftR(x, y);
      }
      if (vertical < horizontal) {
        if (x < last && own(x + 1, y)) {
          if (cornerTR(x, y)) topRightUpR(x, y);
          else path += 'h 50 ';
          recurs(x + 1, y, true);
          path += 'h -50 ';
        } else {
          if (cornerTR(x, y)) {
            topRightUpR(x, y);
            topRightDownR(x, y);
          } else {
            topRightR(x, y);
          }
          bottomRightR(x, y);
        }
        bottomLeftR(x, y);
      } else {
        if (cornerTR(x, y)) {
          topRightUpR(x, y);
          topRightDownR(x, y);
        } else {
          topRightR(x, y);
        }
        if (y < last && own(x, y + 1)) {
          path += 'v 50 ';
          recurs(x, y + 1, false);
          path += 'v -50 ';
        } else {
          bottomRightR(x, y);
          bottomLeftR(x, y);
        }
      }
      path += 'Z ';
    }
  }
  return path.trim();
}
