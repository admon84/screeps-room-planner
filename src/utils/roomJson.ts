import * as Constants from './constants';
import { getPointForShort, isRoomPosition } from './helpers';
import { createObjectFromType, GameObject } from './gameObjects';
import { Point, TerrainTile } from '../types';

/**
 * The wire format behind the Edit Room JSON dialog: the screeps-tools building-planner format,
 * `{ name, shard, rcl, buildings, roomFeatures }` with bare `[{x, y}]` position arrays. Buildable
 * structures live under `buildings`; the controller, sources, mineral letters and terrain live under
 * `roomFeatures`. Import is lenient -- it also accepts the pre-2023 `{ "pos": [...] }` entry wrapper
 * and this app's legacy `{ structures: { type: ["x-y"] } }` format -- but only the canonical shape is
 * ever emitted. Serialization and parsing live together so export keys and import routing cannot
 * drift apart.
 *
 * Validation covers what the renderer needs to draw an object: a known type and an in-room position.
 * Per-RCL caps (`CONTROLLER_STRUCTURES`), object caps (`MAX_OBJECTS`), tile exclusivity and duplicate
 * positions are deliberately not enforced -- applying is a raw `setObjects` replace, the same as the
 * example bunker, and the brush drawer's `placed / total` badges already surface an over-cap plan.
 */
export type RoomJsonParseResult =
  { ok: true; objects: GameObject[]; rcl?: number; terrain?: TerrainTile[] } | { ok: false; error: string };

const SHORT_POINT_PATTERN = /^\d+-\d+$/;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isWholeNumber = (value: unknown): value is number => typeof value === 'number' && Number.isInteger(value);

const isKnownType = (type: string) => type in Constants.STRUCTURE_BRUSHES || type in Constants.OBJECT_BRUSHES;

const isTerrainType = (type: string) => type === Constants.TERRAIN_WALL || type === Constants.TERRAIN_SWAMP;

// Exporting a mineral under its resource letter makes `mineral` a plausible-looking key that
// `createObjectFromType` cannot route, so it earns a message of its own.
const getTypeError = (type: string) => {
  if (type === Constants.MINERAL) return 'Use the resource letter (H, O, U, L, K, Z, X) instead of "mineral"';
  if (!isKnownType(type)) return `Unknown type "${type}" (expected a structure name or resource object)`;
  return null;
};

/**
 * Key an object is exported under. Minerals export as their resource letter rather than `mineral`
 * so the value feeds straight back into `createObjectFromType` on import.
 */
const getExportKey = (object: GameObject) =>
  object.type === Constants.MINERAL ? (object as { mineralType?: string }).mineralType : object.type;

// The 16 types screeps-tools keeps under `buildings`; the controller joins sources, minerals and
// terrain under `roomFeatures`.
const isBuildableStructure = (type: string) =>
  type in Constants.CONTROLLER_STRUCTURES && type !== Constants.STRUCTURE_CONTROLLER;

const sortKeys = (record: Record<string, Point[]>) =>
  Object.fromEntries(
    Object.keys(record)
      .sort()
      .map((key) => [key, record[key]])
  );

/**
 * Serializes the plan in the canonical screeps-tools shape. `name` and `shard` are not decoration:
 * upstream's importer dereferences `roomFeatures` unguarded when either is missing, so all of
 * `name`, `shard` and `roomFeatures` must be present for our export to paste there without throwing.
 * Types are sorted so the text does not reshuffle by paint order.
 */
export const buildRoomJson = (
  objects: GameObject[],
  terrain: TerrainTile[],
  rcl: number,
  name: string,
  shard: string
) => {
  const buildings: Record<string, Point[]> = {};
  const roomFeatures: Record<string, Point[]> = {};

  for (const object of objects) {
    const key = getExportKey(object);
    if (!key) continue;

    const group = isBuildableStructure(key) ? buildings : roomFeatures;
    (group[key] ??= []).push({ x: object.x, y: object.y });
  }
  for (const { type, x, y } of terrain) {
    (roomFeatures[type] ??= []).push({ x, y });
  }

  const json = JSON.stringify(
    { name, shard, rcl, buildings: sortKeys(buildings), roomFeatures: sortKeys(roomFeatures) },
    null,
    2
  );
  // Upstream's own formatting trick: collapse each position onto one line, keeping the text readable
  // in a textarea without putting a whole structure type's positions on a single endless line.
  return json.replace(/\{\n\s+"x": (\d+),\n\s+"y": (\d+)\n\s+\}/g, '{"x":$1,"y":$2}');
};

/** Positions for one type entry: a bare `[{x, y}]` array, or `{ "pos": [...] }` from pre-2023 exports. */
const getPointsForEntry = (type: string, entry: unknown): { points: Point[] } | { error: string } => {
  const positions = Array.isArray(entry) ? entry : isPlainObject(entry) && Array.isArray(entry.pos) ? entry.pos : null;
  if (!positions) {
    return { error: `Expected an array of {"x","y"} positions for "${type}"` };
  }

  const points: Point[] = [];
  for (const position of positions) {
    const { x, y } = isPlainObject(position) ? position : { x: undefined, y: undefined };
    if (!isWholeNumber(x) || !isWholeNumber(y)) {
      const value = JSON.stringify(position);
      return { error: `Invalid position ${value} for "${type}" (expected whole-number "x" and "y")` };
    }
    if (!isRoomPosition(x, y)) {
      const bound = Constants.ROOM_SIZE - 1;
      return { error: `Position {"x":${x},"y":${y}} for "${type}" is outside the room (0-${bound})` };
    }
    points.push({ x, y });
  }
  return { points };
};

/**
 * Validates and decodes editor text, auto-detecting the format by top-level key. Never throws and
 * never touches a store, so a caller can apply the result knowing a rejected edit changed nothing.
 * Unknown top-level keys are ignored rather than rejected, so JSON produced elsewhere still pastes.
 *
 * `terrain` is defined only when the payload carries a `roomFeatures` key: present without
 * `wall`/`swamp` means "plains everywhere", while absent entirely means "leave terrain alone" -- so
 * pasting a `buildings`-only payload cannot silently wipe an imported room's terrain.
 */
export const parseRoomJson = (text: string): RoomJsonParseResult => {
  if (!text.trim()) {
    return { ok: false, error: 'JSON is required' };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    // The engine message carries the offending position, which is the whole point in an editor.
    return { ok: false, error: `Invalid JSON: ${(error as Error).message}` };
  }

  if (!isPlainObject(parsed)) {
    return { ok: false, error: 'Expected a JSON object with "buildings" and "roomFeatures"' };
  }

  let rcl: number | undefined;
  if (parsed.rcl !== undefined) {
    if (!isWholeNumber(parsed.rcl) || parsed.rcl < 1 || parsed.rcl > Constants.MAX_RCL) {
      const value = JSON.stringify(parsed.rcl);
      return {
        ok: false,
        error: `Invalid "rcl" value ${value} (expected a whole number from 1 to ${Constants.MAX_RCL})`,
      };
    }
    rcl = parsed.rcl;
  }

  const objects: GameObject[] = [];

  if ('buildings' in parsed || 'roomFeatures' in parsed) {
    if ('buildings' in parsed) {
      if (!isPlainObject(parsed.buildings)) {
        return { ok: false, error: 'Expected a "buildings" object mapping types to {"x","y"} position arrays' };
      }

      for (const [type, entry] of Object.entries(parsed.buildings)) {
        const typeError = getTypeError(type);
        if (typeError) {
          return { ok: false, error: typeError };
        }

        const result = getPointsForEntry(type, entry);
        if ('error' in result) {
          return { ok: false, error: result.error };
        }
        for (const { x, y } of result.points) {
          objects.push(createObjectFromType({ type, x, y }));
        }
      }
    }

    let terrain: TerrainTile[] | undefined;
    if ('roomFeatures' in parsed) {
      if (!isPlainObject(parsed.roomFeatures)) {
        return { ok: false, error: 'Expected a "roomFeatures" object mapping types to {"x","y"} position arrays' };
      }

      terrain = [];
      for (const [type, entry] of Object.entries(parsed.roomFeatures)) {
        if (!isTerrainType(type)) {
          const typeError = getTypeError(type);
          if (typeError) {
            return { ok: false, error: typeError };
          }
        }

        const result = getPointsForEntry(type, entry);
        if ('error' in result) {
          return { ok: false, error: result.error };
        }
        for (const { x, y } of result.points) {
          if (isTerrainType(type)) {
            terrain.push({ room: Constants.ROOM_NAME, x, y, type });
          } else {
            objects.push(createObjectFromType({ type, x, y }));
          }
        }
      }
    }

    return { ok: true, objects, rcl, terrain };
  }

  if ('structures' in parsed) {
    if (!isPlainObject(parsed.structures)) {
      return { ok: false, error: 'Expected a "structures" object mapping types to "x-y" position arrays' };
    }

    for (const [type, positions] of Object.entries(parsed.structures)) {
      const typeError = getTypeError(type);
      if (typeError) {
        return { ok: false, error: typeError };
      }
      if (!Array.isArray(positions)) {
        return { ok: false, error: `Expected an array of "x-y" positions for "${type}"` };
      }

      for (const position of positions) {
        if (typeof position !== 'string' || !SHORT_POINT_PATTERN.test(position)) {
          const value = JSON.stringify(position);
          return { ok: false, error: `Invalid position ${value} for "${type}" (expected an "x-y" string)` };
        }

        const { x, y } = getPointForShort(position);
        if (!isRoomPosition(x, y)) {
          const bound = Constants.ROOM_SIZE - 1;
          return { ok: false, error: `Position "${position}" for "${type}" is outside the room (0-${bound})` };
        }

        objects.push(createObjectFromType({ type, x, y }));
      }
    }

    return { ok: true, objects, rcl };
  }

  return {
    ok: false,
    error:
      'Expected a "buildings" or "roomFeatures" object ({"x","y"} positions), or a legacy "structures" object ("x-y" strings)',
  };
};
