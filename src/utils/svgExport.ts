import * as Constants from './constants';
import { getRenderPath } from './renderPath';
import { GameObject } from './gameObjects';
import { Point, TerrainTile } from '../types';

/**
 * Builds a standalone vector picture of the plan in the game's own look. The recipe for each object
 * follows @screeps/renderer and @screeps/renderer-metadata (both ISC): the same sprites from
 * public/assets with their sizes, offsets and player tint, the terrain and rampart outlines
 * (getRenderPath), the exit markers, the store fill, and the lighting layer (a grey ambient plus
 * soft glows, multiplied over the scene). Ground, swamp and wall textures are approximated with
 * SVG turbulence instead of the renderer's bitmaps.
 *
 * Units are the renderer's: 100 per tile, tile (x, y) covers x*100..x*100+100. Sprites are centred on
 * the tile like PIXI sprites with anchor 0.5; a PIXI tint is a per-channel multiply, which an
 * feColorMatrix in sRGB reproduces. Every layer and every object is a named group (`id`, Inkscape
 * label, `<title>`), so the picture can be taken apart in an editor or the browser inspector.
 */

const CELL = 100;
const SIZE = Constants.ROOM_SIZE * CELL;
const PLAYER = 0x8fbb93; // renderer playerColor for the owner with userOwnerColor (the planner's setting)
const ROAD = '#aaaaaa';
// The renderer's ground texture averages #565656; under the lighting layer's 50 % ambient it reads
// as the planner's #2b2b2b.
const GROUND = '#565656';
const ENERGY = '#ffe56d';
const POWER = '#f41f33';
const MINERAL_COLORS: Record<string, [string, string]> = {
  L: ['#89F4A5', '#3F6147'],
  U: ['#88D6F7', '#1B617F'],
  K: ['#9370FF', '#331A80'],
  Z: ['#F2D28B', '#594D33'],
  X: ['#FF7A7A', '#4F2626'],
  O: ['#CCCCCC', '#4D4D4D'],
  H: ['#CCCCCC', '#4D4D4D'],
};
// tower-rotatable: 115 wide from a 128 px texture, turning about a pivot 32 px below its top edge,
// the middle of the turret housing; the barrel points away from the pivot (as the planner shows).
const TOWER_SCALE = 115 / 128;
const TOWER_PIVOT = 32 * TOWER_SCALE;

const LABELS: Record<string, string> = {
  constructedWall: 'Wall',
  container: 'Container',
  extension: 'Extension',
  extractor: 'Extractor',
  factory: 'Factory',
  lab: 'Lab',
  link: 'Link',
  nuker: 'Nuker',
  observer: 'Observer',
  powerSpawn: 'Power spawn',
  rampart: 'Rampart',
  road: 'Road',
  spawn: 'Spawn',
  storage: 'Storage',
  terminal: 'Terminal',
  tower: 'Tower',
};

type Sprite = {
  texture: string;
  width: number;
  height?: number;
  tint?: number;
  dy?: number;
  alpha?: number;
  blend?: boolean;
  /** Animated only: the cooldown flash, opacity up to this peak in 20 % of a tick and back to 0. */
  flash?: number;
};

const hex = (color: number) => `#${color.toString(16).padStart(6, '0')}`;
const label = (type: string) => LABELS[type] ?? type;

/** A named group: id for scripts and CSS, Inkscape label for its Layers panel, title for tooltips. */
function group(id: string, name: string, content: string, extra = '', layer = false) {
  const mode = layer ? ' inkscape:groupmode="layer"' : '';
  return `<g id="${id}" inkscape:label="${name}"${mode}${extra}><title>${name}</title>${content}</g>`;
}

function spritesFor(type: string, rcl: number): Sprite[] {
  switch (type) {
    case 'extension': {
      const border = rcl >= 8 ? 'extension-border200' : rcl === 7 ? 'extension-border100' : 'extension-border50';
      const size = rcl >= 8 ? 100 : rcl === 7 ? 80 : 68;
      return [
        { texture: border, width: 100, tint: PLAYER },
        { texture: 'extension', width: size },
      ];
    }
    case 'tower':
      return [{ texture: 'tower-base', width: 200, tint: PLAYER }]; // the turret is drawn by towerTurret
    case 'storage':
      return [
        { texture: 'storage-border', width: 200, tint: PLAYER },
        { texture: 'storage', width: 200 },
      ];
    case 'terminal':
      return [
        { texture: 'terminal-border', width: 200, tint: PLAYER },
        { texture: 'terminal', width: 200 },
        { texture: 'terminal-arrows', width: 200 },
      ];
    case 'link':
      return [
        { texture: 'link-border', width: 100, tint: PLAYER },
        { texture: 'link', width: 100 },
      ];
    case 'lab':
      // The mineral dome: 128 px texture at scale 0.6875, anchored at its bottom 25 below the centre.
      return [
        { texture: 'lab', width: 200, tint: PLAYER },
        { texture: 'lab-mineral', width: 88, tint: 0x777777, dy: 25 - 44 },
      ];
    case 'nuker':
      return [
        { texture: 'nuker-border', width: 300, tint: PLAYER, dy: -40 },
        { texture: 'nuker', width: 300, dy: -40 },
      ];
    case 'factory':
      return [
        { texture: 'factory-border', width: 200, tint: PLAYER },
        { texture: 'factory', width: 200 },
        { texture: 'factory-highlight', width: 200, alpha: 0.4, flash: 1 },
        { texture: 'factory-lvl0', width: 200 },
      ];
    case 'extractor':
      return [{ texture: 'extractor', width: 200, tint: PLAYER }];
    case 'constructedWall':
      return [{ texture: 'constructedWall', width: 100, blend: true }];
    default:
      return [];
  }
}

const TEXTURES = [
  'extension-border50',
  'extension-border100',
  'extension-border200',
  'extension',
  'tower-base',
  'tower-rotatable',
  'storage-border',
  'storage',
  'terminal-border',
  'terminal',
  'terminal-arrows',
  'link-border',
  'link',
  'lab',
  'lab-mineral',
  'nuker-border',
  'nuker',
  'factory-border',
  'factory',
  'factory-highlight',
  'factory-lvl0',
  'extractor',
  'constructedWall',
  'controller',
  'controller-level',
];

const toBase64 = (text: string) => btoa(String.fromCharCode(...new TextEncoder().encode(text)));
const assetUrl = (name: string) => `${import.meta.env?.BASE_URL ?? '/'}assets/${name}.svg`;

async function loadTextures(needed: Set<string>): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  await Promise.all(
    [...needed].map(async (name) => {
      const response = await fetch(assetUrl(name));
      if (!response.ok) throw new Error(`Missing sprite ${name}.svg`);
      out.set(name, `data:image/svg+xml;base64,${toBase64(await response.text())}`);
    })
  );
  return out;
}

/** The player's badge from the official API (the planner's BADGE_URL), or null; a missing badge is not an error. */
async function loadBadge(playerName: string): Promise<string | null> {
  if (!playerName) return null;
  try {
    const response = await fetch(`/screeps-api/api/user/badge-svg?username=${encodeURIComponent(playerName)}`);
    const text = response.ok ? await response.text() : '';
    return text.includes('<svg') ? `data:image/svg+xml;base64,${toBase64(text)}` : null;
  } catch {
    return null;
  }
}

/**
 * Store fill drawn the way renderer-metadata draws it, for a share `f` (0..1) of every store: the
 * energy circle of spawns and extensions, storage/factory/container bars, the terminal square, the
 * link diamond, the lab's mineral dome and energy strip, the nuker's energy triangle and ghodium bar, the power spawn's power
 * arc. The tower's bar rides on its turret (towerTurret). Power in storage and the
 * terminal's other resources need a real store and are left out.
 */
function fillShapes(type: string, cx: number, cy: number, f: number, rcl: number): string {
  if (f <= 0) return '';
  const bar = (w: number, full: number, bottom: number, color = ENERGY) =>
    `<rect x="${cx - w / 2}" y="${cy + bottom - full * f}" width="${w}" height="${full * f}" fill="${color}"/>`;
  switch (type) {
    case 'extension': {
      const size = rcl >= 8 ? 100 : rcl === 7 ? 80 : 68;
      return `<circle cx="${cx}" cy="${cy}" r="${size * 0.32 * f}" fill="${ENERGY}"/>`;
    }
    case 'spawn':
      return `<circle cx="${cx}" cy="${cy}" r="${38 * f}" fill="${ENERGY}"/>`;
    case 'powerSpawn': {
      const r = 50;
      const end = -Math.PI / 2 + 2 * Math.PI * Math.min(f, 0.9999);
      const large = f > 0.5 ? 1 : 0;
      const arc = `<path d="M ${cx} ${cy - r} A ${r} ${r} 0 ${large} 1 ${cx + r * Math.cos(end)} ${cy + r * Math.sin(end)}" fill="none" stroke="${POWER}" stroke-width="10"/>`;
      return `<circle cx="${cx}" cy="${cy}" r="${38 * f}" fill="${ENERGY}"/>${arc}`;
    }
    case 'storage':
      return bar(110, 140, 70);
    case 'factory':
      return bar(50, 50, 25, '#fadf7e');
    case 'container':
      return bar(40, 50, 25);
    case 'terminal': {
      const size = 76 * f;
      return `<rect x="${cx - size / 2}" y="${cy - size / 2}" width="${size}" height="${size}" fill="${ENERGY}"/>`;
    }
    case 'link': {
      const r = 25 * f; // link-energy is a 50x50 diamond scaled by the energy share
      return `<path d="M ${cx} ${cy - r} L ${cx + r} ${cy} L ${cx} ${cy + r} L ${cx - r} ${cy} Z" fill="${ENERGY}"/>`;
    }
    case 'lab': {
      // Minerals: a white dome over the grey one, growing with the mineral share (bottom stays at +25).
      const d = 88 * f;
      const w = 67 * f;
      return (
        `<use href="#s-lab-mineral" xlink:href="#s-lab-mineral" transform="translate(${cx - d / 2} ${cy + 25 - d}) scale(${d} ${d})"/>` +
        `<rect x="${cx - w / 2}" y="${cy + 32}" width="${w}" height="10" fill="${ENERGY}"/>`
      );
    }
    case 'nuker': {
      const w = 86 * f;
      const h = 118 * f;
      const g = 80 * f;
      return (
        `<path d="M ${cx - w / 2} ${cy + 10} L ${cx} ${cy + 10 - h} L ${cx + w / 2} ${cy + 10} Z" fill="${ENERGY}"/>` +
        `<rect x="${cx - g / 2}" y="${cy + 35}" width="${g}" height="15" fill="#ffffff"/>`
      );
    }
    default:
      return '';
  }
}

type Glow = { size: number; alpha: number; tint?: string; flicker?: [number, number] };

/** The lighting-layer sprites renderer-metadata gives each object (glow texture: white, linear falloff). */
function glowsFor(type: string, f: number, rcl: number, extra?: string): Glow[] {
  const full = f > 0;
  switch (type) {
    case 'extension': {
      const big = rcl >= 8 ? 250 : rcl === 7 ? 220 : 200;
      return full
        ? [
            { size: 100, alpha: 1 },
            { size: big, alpha: 0.7 },
          ]
        : [];
    }
    case 'spawn':
    case 'tower':
      return [...(full ? [{ size: 100, alpha: 1 }] : []), { size: 600, alpha: 0.5 }];
    case 'storage':
      return [...(full ? [{ size: 200, alpha: 1, tint: ENERGY }] : []), { size: 800, alpha: 0.5 }];
    case 'terminal':
      return [...(full ? [{ size: 200, alpha: 1 }] : []), { size: 800, alpha: 0.5 }];
    case 'factory':
      return [...(full ? [{ size: 200, alpha: 1, tint: '#fadf7e' }] : []), { size: 800, alpha: 0.5 }];
    case 'link':
      return full
        ? [
            { size: 100, alpha: 1 },
            { size: 400, alpha: 0.5 },
          ]
        : [];
    case 'container':
      return full ? [{ size: 100, alpha: 1, tint: ENERGY }] : [];
    case 'lab':
      return full
        ? [
            { size: 150, alpha: 1 },
            { size: 500, alpha: 0.3 },
          ]
        : [];
    case 'nuker':
      return [
        { size: 100, alpha: 1 },
        { size: 800, alpha: 0.5 },
      ];
    case 'powerSpawn':
      return [
        { size: 150, alpha: 1 },
        { size: 256, alpha: 0.5 },
      ];
    case 'observer':
      return [{ size: 800, alpha: 0.5 }];
    case 'controller':
      return [
        { size: 1200, alpha: 0.5 },
        { size: 500, alpha: 1 },
      ];
    case 'source':
      return [
        { size: 800, alpha: 0.5, tint: '#ffff50', flicker: [0.6, 0.8] },
        { size: 150, alpha: 1 },
      ];
    case 'mineral':
      return [
        { size: 200, alpha: 1, tint: extra },
        { size: 700, alpha: 0.7, tint: extra, flicker: [0.4, 1] },
      ];
    default:
      return [];
  }
}

/** A stable pseudo-random turret angle per tile: the renderer starts every turret at a random angle. */
const turretAngle = (x: number, y: number) => (((x * 73 + y * 151) % 360) + 360) % 360;

/** Road joints the way the renderer's road processor draws them: a dot plus a bar to each earlier neighbour. */
function roadShapes(roads: Point[]): string {
  const at = new Set(roads.map(({ x, y }) => y * Constants.ROOM_SIZE + x));
  const r = 0.15 * CELL;
  let out = '';
  for (const { x, y } of roads) {
    const cx = x * CELL + CELL / 2;
    const cy = y * CELL + CELL / 2;
    out += `<circle cx="${cx}" cy="${cy}" r="${r}"/>`;
    for (const [dx, dy] of [
      [-1, -1],
      [0, -1],
      [1, -1],
      [-1, 0],
    ]) {
      if (!at.has((y + dy) * Constants.ROOM_SIZE + x + dx)) continue;
      out += `<line x1="${cx}" y1="${cy}" x2="${cx + dx * CELL}" y2="${cy + dy * CELL}" stroke-width="${2 * r}"/>`;
    }
  }
  return out;
}

/** Exit markers: one small grey triangle per open edge tile, as renderer-metadata tiles exit-*.svg. */
function exitShapes(terrain: TerrainTile[]): string {
  const wall = new Set(terrain.filter((t) => t.type === Constants.TERRAIN_WALL).map((t) => t.y * 50 + t.x));
  const last = Constants.ROOM_SIZE - 1;
  let out = '';
  const tri = (x: number, y: number, d: string) => {
    if (!wall.has(y * 50 + x)) out += `<path transform="translate(${x * CELL} ${y * CELL})" d="${d}"/>`;
  };
  for (let i = 0; i <= last; i++) {
    tri(i, 0, 'M 50 20 l 30 50 h -60 Z');
    tri(i, last, 'M 50 80 l 30 -50 h -60 Z');
    tri(0, i, 'M 20 50 l 50 30 v -60 Z');
    tri(last, i, 'M 80 50 l -50 30 v -60 Z');
  }
  return out;
}

export interface RoomSvgInput {
  objects: GameObject[];
  terrain: TerrainTile[];
  rcl: number;
  room?: string;
  shard?: string;
  width?: number;
  /** Share of every store to draw as filled, 0 (empty, the default) to 1 (full). */
  fill?: number;
  /** The game's lighting layer (glows on a darkened room). On by default. */
  lighting?: boolean;
  /** SMIL animations: turrets and extractors turn, the factory flashes, swamps drift, sources pulse, glows flicker. */
  animate?: boolean;
  /** Player whose badge goes on spawns and the controller (official API); none falls back to grey. */
  playerName?: string;
}

export async function buildRoomSvg({
  objects,
  terrain,
  rcl,
  room = '',
  shard = '',
  width = 1000,
  fill = 0,
  lighting = true,
  animate = false,
  playerName = '',
}: RoomSvgInput) {
  const share = Math.min(1, Math.max(0, fill));
  const byType = (type: string) => objects.filter((object) => object.type === type);
  const walls = terrain.filter((tile) => tile.type === Constants.TERRAIN_WALL);
  const swamps = terrain.filter((tile) => tile.type === Constants.TERRAIN_SWAMP);
  const constructedWalls = byType(Constants.STRUCTURE_WALL);
  const ramparts = byType(Constants.STRUCTURE_RAMPART);
  const roads = byType(Constants.STRUCTURE_ROAD);
  const controllers = byType(Constants.STRUCTURE_CONTROLLER);

  const needed = new Set<string>();
  for (const object of objects) for (const sprite of spritesFor(object.type ?? '', rcl)) needed.add(sprite.texture);
  if (byType('tower').length) needed.add('tower-rotatable');
  if (controllers.length) ['controller', 'controller-level'].forEach((t) => needed.add(t));
  const [textures, badge] = await Promise.all([
    loadTextures(new Set([...needed].filter((t) => TEXTURES.includes(t)))),
    byType('spawn').length || byType('powerSpawn').length || controllers.length
      ? loadBadge(playerName)
      : Promise.resolve(null),
  ]);

  const tints = new Set<number>();
  const defs: string[] = [];
  for (const [name, uri] of textures) {
    defs.push(
      `<image id="s-${name}" href="${uri}" xlink:href="${uri}" width="1" height="1" preserveAspectRatio="none"/>`
    );
  }
  if (badge) defs.push(`<image id="s-badge" href="${badge}" xlink:href="${badge}" width="1" height="1"/>`);

  const spriteUse = (texture: string, x: number, y: number, w: number, h: number, attrs = '', inner = '') =>
    `<use href="#s-${texture}" xlink:href="#s-${texture}" transform="translate(${x} ${y}) scale(${w} ${h})"${attrs}` +
    (inner ? `>${inner}</use>` : '/>');
  const place = (cx: number, cy: number, sprite: Sprite) => {
    const w = sprite.width;
    const h = sprite.height ?? w;
    if (sprite.tint !== undefined) tints.add(sprite.tint);
    const attrs = [
      sprite.tint !== undefined ? ` filter="url(#tint-${sprite.tint.toString(16)})"` : '',
      sprite.alpha !== undefined ? ` opacity="${sprite.alpha}"` : '',
      sprite.blend ? ' style="mix-blend-mode:screen"' : '',
    ].join('');
    // One flash per tick, a tick taken as one second (renderer-metadata's cooldown Sequence).
    const flash =
      animate && sprite.flash !== undefined
        ? `<animate attributeName="opacity" values="0;${sprite.flash};0" keyTimes="0;0.2;1" dur="1s" repeatCount="indefinite"/>`
        : '';
    return spriteUse(sprite.texture, cx - w / 2, cy + (sprite.dy ?? 0) - h / 2, w, h, attrs, flash);
  };
  const badgeAt = (cx: number, cy: number, r: number, fallback: string) =>
    badge
      ? spriteUse('badge', cx - r, cy - r, 2 * r, 2 * r)
      : `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fallback}"/>`;

  /** Turret plus the tower's energy bar, turned to its start angle (and turning when animated). */
  const towerTurret = (x: number, y: number, cx: number, cy: number) => {
    const angle = turretAngle(x, y);
    const h = 66.7 * share * TOWER_SCALE;
    const barShape =
      share > 0
        ? `<rect x="${cx - 45 * TOWER_SCALE}" y="${cy - TOWER_PIVOT}" width="${90 * TOWER_SCALE}" height="${h}" rx="${Math.min(12, h / 2)}" fill="${ENERGY}"/>`
        : '';
    const spin = animate
      ? `<animateTransform attributeName="transform" type="rotate" from="${angle} ${cx} ${cy}" to="${angle + 360} ${cx} ${cy}" dur="20s" repeatCount="indefinite"/>`
      : '';
    const turret = place(cx, cy, { texture: 'tower-rotatable', width: 115, dy: 64 * TOWER_SCALE - TOWER_PIVOT });
    return `<g transform="rotate(${angle} ${cx} ${cy})">${turret}${barShape}${spin}</g>`;
  };

  // ---- defs: textures for ground, swamp and wall ---------------------------------------------
  const noise = (id: string, frequency: number, seed: number, matrix: string) =>
    `<filter id="${id}" filterUnits="userSpaceOnUse" x="0" y="0" width="${SIZE}" height="${SIZE}">` +
    `<feTurbulence type="fractalNoise" baseFrequency="${frequency}" numOctaves="3" seed="${seed}"/>` +
    `<feColorMatrix type="matrix" values="${matrix}"/></filter>`;
  defs.push(noise('noise-wall', 0.03, 5, '1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1'));
  // Swamp texture: the renderer tints a fine noise #66ff00 at 30 %; a flat #3d7f1f veil (the tinted
  // texture's mean) plus a faint fine grain keeps the colour without blotches.
  defs.push(noise('noise-swamp-a', 0.06, 7, '0 0 0 0 0.2  0 0 0 0 0.5  0 0 0 0 0  1 0 0 0 -0.35'));
  defs.push(noise('noise-swamp-b', 0.08, 11, '0 0 0 0 0.2  0 0 0 0 0.5  0 0 0 0 0  1 0 0 0 -0.35'));
  const swampPath = swamps.length ? getRenderPath(swamps) : '';
  const wallTiles = [...walls, ...constructedWalls];
  const wallPath = wallTiles.length ? getRenderPath(wallTiles) : '';
  if (swampPath) defs.push(`<clipPath id="clip-swamp"><path d="${swampPath}"/></clipPath>`);
  if (wallPath) defs.push(`<clipPath id="clip-wall"><path d="${wallPath}"/></clipPath>`);

  const layers: string[] = [];

  // ---- terrain -----------------------------------------------------------------------------------
  layers.push(group('ground', 'Ground', `<rect width="${SIZE}" height="${SIZE}" fill="${GROUND}"/>`, '', true));
  if (swampPath) {
    const drift = (dx: number) =>
      animate
        ? `<animateTransform attributeName="transform" type="translate" values="0 0; ${dx} ${dx}; 0 0" dur="${Math.abs(dx) / 10}s" repeatCount="indefinite"/>`
        : '';
    layers.push(
      group(
        'swamps',
        'Swamps',
        `<path d="${swampPath}" fill="#4a501e" stroke="#4a501e" stroke-width="50" stroke-linejoin="round" opacity="0.4"/>` +
          `<g clip-path="url(#clip-swamp)">` +
          `<rect width="${SIZE}" height="${SIZE}" fill="#3d7f1f" opacity="0.3"/>` +
          `<g opacity="0.25">` +
          `<g><rect x="-400" y="-400" width="${SIZE + 800}" height="${SIZE + 800}" filter="url(#noise-swamp-a)"/>${drift(150)}</g>` +
          `<g><rect x="-400" y="-400" width="${SIZE + 800}" height="${SIZE + 800}" filter="url(#noise-swamp-b)"/>${drift(-135)}</g>` +
          `</g></g>`,
        '',
        true
      )
    );
  }
  layers.push(
    group(
      'exits',
      'Exits',
      `<g fill="#777" opacity="0.5" style="mix-blend-mode:screen">${exitShapes(terrain)}</g>`,
      '',
      true
    )
  );
  if (roads.length) {
    layers.push(group('roads', 'Roads', `<g fill="${ROAD}" stroke="${ROAD}">${roadShapes(roads)}</g>`, '', true));
  }
  if (wallPath) {
    // One outline in the renderer; here natural rock and built walls are separate shapes (each with
    // the other as corner context, so together they read as the merged outline) and separate groups.
    const rockPath = walls.length ? getRenderPath(walls, false, constructedWalls) : '';
    const builtPath = constructedWalls.length ? getRenderPath(constructedWalls, false, walls) : '';
    const outline = (d: string) => `<path d="${d}" fill="#111" stroke="#000" stroke-width="10" paint-order="stroke"/>`;
    const texture = `<rect width="${SIZE}" height="${SIZE}" filter="url(#noise-wall)" opacity="0.12" clip-path="url(#clip-wall)" style="mix-blend-mode:screen"/>`;
    layers.push(
      group(
        'walls',
        'Walls',
        (rockPath ? group('terrain-walls', 'Terrain walls', outline(rockPath)) : '') +
          (builtPath
            ? group(
                'constructed-walls',
                'Constructed walls',
                outline(builtPath) +
                  constructedWalls
                    .map(({ x, y }) =>
                      group(
                        `constructedWall-${x}-${y}`,
                        `Wall (${x},${y})`,
                        spritesFor('constructedWall', rcl)
                          .map((sprite) => place(x * CELL + CELL / 2, y * CELL + CELL / 2, sprite))
                          .join('')
                      )
                    )
                    .join('')
              )
            : '') +
          group('wall-texture', 'Wall texture', texture),
        '',
        true
      )
    );
  }

  // ---- objects -------------------------------------------------------------------------------------
  const order = [
    'extractor',
    'container',
    'extension',
    'spawn',
    'powerSpawn',
    'observer',
    'lab',
    'link',
    'factory',
    'storage',
    'terminal',
    'nuker',
    'tower',
  ];
  const structures = objects
    .filter((o) => order.includes(o.type ?? ''))
    .sort((a, b) => order.indexOf(a.type ?? '') - order.indexOf(b.type ?? ''));
  const parts: string[] = [];
  for (const object of structures) {
    const { x, y } = object;
    const type = object.type ?? '';
    const cx = x * CELL + CELL / 2;
    const cy = y * CELL + CELL / 2;
    let body = '';
    if (type === 'spawn') {
      body =
        `<circle cx="${cx}" cy="${cy}" r="70" fill="#cccccc"/><circle cx="${cx}" cy="${cy}" r="59" fill="#181818"/>` +
        badgeAt(cx, cy, 38, '#555555');
    } else if (type === 'powerSpawn') {
      body =
        `<circle cx="${cx}" cy="${cy}" r="75" fill="#222" stroke="#cccccc" stroke-width="7"/>` +
        `<circle cx="${cx}" cy="${cy}" r="68" fill="#222" stroke="${POWER}" stroke-width="10"/>` +
        `<circle cx="${cx}" cy="${cy}" r="59" fill="#181818"/>` +
        badgeAt(cx, cy, 38, '#555555');
    } else if (type === 'observer') {
      body =
        `<ellipse cx="${cx}" cy="${cy}" rx="45" ry="40" fill="#111111" stroke="${hex(PLAYER)}" stroke-width="5"/>` +
        `<ellipse cx="${cx}" cy="${cy}" rx="20" ry="20" fill="${hex(PLAYER)}"/>`;
    } else if (type === 'container') {
      body = `<rect x="${cx - 30}" y="${cy - 35}" width="60" height="70" fill="#181818"/><rect x="${cx - 20}" y="${cy - 25}" width="40" height="50" fill="#555555"/>`;
    } else {
      body = spritesFor(type, rcl)
        .map((sprite) => place(cx, cy, sprite))
        .join('');
      if (type === 'factory') body += `<rect x="${cx - 25}" y="${cy - 25}" width="50" height="50" fill="#555555"/>`;
      if (type === 'tower') body += towerTurret(x, y, cx, cy);
      // A working extractor turns once every 4 s (renderer-metadata: RotateBy 2π over 4 while on cooldown).
      if (type === 'extractor' && animate) {
        body = `<g>${body}<animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="360 ${cx} ${cy}" dur="4s" repeatCount="indefinite"/></g>`;
      }
    }
    body += type === 'tower' ? '' : fillShapes(type, cx, cy, share, rcl);
    parts.push(group(`${type}-${x}-${y}`, `${label(type)} (${x},${y})`, body));
  }

  for (const { x, y } of byType(Constants.SOURCE)) {
    const cx = x * CELL + CELL / 2;
    const cy = y * CELL + CELL / 2;
    const pulse = animate
      ? `<animate attributeName="fill" values="${ENERGY};#ffffff;#ffcd6d;#ffde84;${ENERGY}" dur="2s" repeatCount="indefinite"/>`
      : '';
    const blink = animate
      ? `<animate attributeName="stroke" values="#595026;#0e0c04;#595026" dur="4s" repeatCount="indefinite"/>`
      : '';
    parts.push(
      group(
        `source-${x}-${y}`,
        `Source (${x},${y})`,
        `<rect x="${cx - 20}" y="${cy - 20}" width="40" height="40" rx="15" fill="#111111" stroke="#595026" stroke-width="15">${blink}</rect>` +
          `<rect x="${cx - 30}" y="${cy - 30}" width="60" height="60" rx="15" fill="${ENERGY}">${pulse}</rect>`
      )
    );
  }
  const mineralColor = (object: GameObject) =>
    MINERAL_COLORS[(object as GameObject & { mineralType?: string }).mineralType ?? 'O'] ?? MINERAL_COLORS.O;
  for (const object of byType(Constants.MINERAL)) {
    const cx = object.x * CELL + CELL / 2;
    const cy = object.y * CELL + CELL / 2;
    const letter = (object as GameObject & { mineralType?: string }).mineralType ?? '?';
    const [fg, bg] = mineralColor(object);
    parts.push(
      group(
        `mineral-${object.x}-${object.y}`,
        `Mineral ${letter} (${object.x},${object.y})`,
        `<circle cx="${cx}" cy="${cy}" r="54" fill="${bg}" stroke="${fg}" stroke-width="10"/>` +
          `<text x="${cx}" y="${cy}" fill="${fg}" font-family="Roboto, Arial, sans-serif" font-size="82" font-weight="bold" text-anchor="middle" dominant-baseline="central">${letter}</text>`
      )
    );
  }
  for (const { x, y } of controllers) {
    const cx = x * CELL + CELL / 2;
    const cy = y * CELL + CELL / 2;
    let body = `<circle cx="${cx}" cy="${cy}" r="92" fill="#ffffff" opacity="0.05"/>`;
    if (textures.has('controller')) {
      tints.add(0x000000);
      body += spriteUse('controller', cx - 100, cy - 100, 200, 200, ' filter="url(#tint-0)"');
    }
    if (textures.has('controller-level')) {
      for (let level = 0; level < rcl; level += 1) {
        body += `<use href="#s-controller-level" xlink:href="#s-controller-level" transform="translate(${cx} ${cy}) rotate(${level * 45}) translate(-50 -100) scale(100)"/>`;
      }
    }
    body += badgeAt(cx, cy, 37, '#222222');
    parts.push(group(`controller-${x}-${y}`, `Controller (${x},${y}), RCL ${rcl}`, body));
  }
  layers.push(group('objects', 'Structures and objects', parts.join(''), '', true));

  // ---- lighting: grey ambient + screened glows, multiplied over everything below -------------------
  if (lighting) {
    const gradients = new Set<string>();
    const lights: string[] = [];
    const addGlows = (glows: Glow[], cx: number, cy: number) => {
      for (const glow of glows) {
        const tint = (glow.tint ?? '#ffffff').toLowerCase();
        gradients.add(tint);
        const flicker =
          animate && glow.flicker
            ? `<animate attributeName="opacity" values="${glow.alpha * glow.flicker[0]};${glow.alpha * glow.flicker[1]};${glow.alpha * glow.flicker[0]}" dur="1.6s" repeatCount="indefinite"/>`
            : '';
        lights.push(
          `<circle cx="${cx}" cy="${cy}" r="${glow.size / 2}" fill="url(#glow-${tint.slice(1)})" opacity="${glow.alpha}" style="mix-blend-mode:screen">${flicker}</circle>`
        );
      }
    };
    for (const object of objects) {
      const cx = object.x * CELL + CELL / 2;
      const cy = object.y * CELL + CELL / 2;
      const extra = object.type === Constants.MINERAL ? mineralColor(object)[0] : undefined;
      addGlows(glowsFor(object.type ?? '', share, rcl, extra), cx, cy);
    }
    for (const tint of gradients) {
      defs.push(
        `<radialGradient id="glow-${tint.slice(1)}"><stop offset="0" stop-color="${tint}" stop-opacity="1"/><stop offset="1" stop-color="${tint}" stop-opacity="0"/></radialGradient>`
      );
    }
    layers.push(
      group(
        'lighting',
        'Lighting',
        `<rect width="${SIZE}" height="${SIZE}" fill="#808080"/>${lights.join('')}`,
        ' style="isolation:isolate;mix-blend-mode:multiply"',
        true
      )
    );
  }

  // ---- effects: ramparts above the lighting, as in the renderer's effects layer -------------------
  if (ramparts.length) {
    // The game's 40 % additive overlay all but vanishes on light structures; the picture draws a
    // light green veil and only the outer contour. getRenderPath outlines a block column by column,
    // so a plain stroke would also draw the seams between them: the mask keeps the outer half only.
    const d = getRenderPath(ramparts);
    defs.push(
      `<mask id="rampart-outside" maskUnits="userSpaceOnUse" x="0" y="0" width="${SIZE}" height="${SIZE}">` +
        `<rect width="${SIZE}" height="${SIZE}" fill="#fff"/><path d="${d}" fill="#000"/></mask>`
    );
    layers.push(
      group(
        'ramparts',
        'Ramparts',
        `<path d="${d}" fill="#44ff44" fill-opacity="0.18"/>` +
          `<path d="${d}" fill="none" stroke="#44ff44" stroke-opacity="0.85" stroke-width="24" stroke-linejoin="round" mask="url(#rampart-outside)"/>`,
        '',
        true
      )
    );
  }

  for (const tint of tints) {
    const r = ((tint >> 16) & 255) / 255;
    const g = ((tint >> 8) & 255) / 255;
    const b = (tint & 255) / 255;
    defs.push(
      `<filter id="tint-${tint.toString(16)}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${r} 0 0 0 0 0 ${g} 0 0 0 0 0 ${b} 0 0 0 0 0 1 0"/></filter>`
    );
  }

  const title = [room, shard ? `(${shard})` : '', `RCL ${rcl}`].filter(Boolean).join(' ');
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" viewBox="0 0 ${SIZE} ${SIZE}" width="${width}" height="${width}">`,
    `<title>${title}</title>`,
    `<desc>Screeps room plan. Sprites and drawing recipes from @screeps/renderer and @screeps/renderer-metadata (ISC).</desc>`,
    `<defs>${defs.join('')}</defs>`,
    layers.join('\n'),
    '</svg>',
  ].join('\n');
}
