import * as Constants from './constants';
import { getPointForShort, getShortForTile, getTileForPoint, isRoomPosition } from './helpers';
import { createObjectFromType, GameObject } from './gameObjects';
import { RoomStructures } from '../types';

/**
 * The `{ rcl, structures }` wire format behind the Edit Room JSON dialog. Both halves live here so
 * the export key and the import routing cannot drift apart.
 *
 * Validation covers what the renderer needs to draw an object: a known type and an in-room position.
 * Per-RCL caps (`CONTROLLER_STRUCTURES`), object caps (`MAX_OBJECTS`), tile exclusivity and duplicate
 * positions are deliberately not enforced -- applying is a raw `setObjects` replace, the same as the
 * example bunker, and the brush drawer's `placed / total` badges already surface an over-cap plan.
 */
export type RoomJsonParseResult = { ok: true; objects: GameObject[]; rcl?: number } | { ok: false; error: string };

const SHORT_POINT_PATTERN = /^\d+-\d+$/;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isKnownType = (type: string) => type in Constants.STRUCTURE_BRUSHES || type in Constants.OBJECT_BRUSHES;

/**
 * Key an object is exported under. Minerals export as their resource letter rather than `mineral`
 * so the value feeds straight back into `createObjectFromType` on import.
 */
const getExportKey = (object: GameObject) =>
  object.type === Constants.MINERAL ? (object as { mineralType?: string }).mineralType : object.type;

const getRoomStructures = (objects: GameObject[]) =>
  objects.reduce<RoomStructures>((structures, object) => {
    const key = getExportKey(object);
    if (!key) return structures;

    if (!structures[key]) structures[key] = [];
    structures[key].push(getShortForTile(getTileForPoint(object)));
    return structures;
  }, {});

/**
 * Serializes the plan for editing. Deliberately not `JSON.stringify(value, null, 2)`, which puts each
 * of a few hundred road coordinates on its own line; one line per structure type stays valid JSON and
 * stays readable in a textarea. Types are sorted so the text does not reshuffle by paint order.
 */
export const buildRoomJson = (objects: GameObject[], rcl: number) => {
  const structures = getRoomStructures(objects);
  const lines = Object.keys(structures)
    .sort()
    .map((type) => `    ${JSON.stringify(type)}: ${JSON.stringify(structures[type])}`);
  const body = lines.length ? `\n${lines.join(',\n')}\n  ` : '';

  return `{\n  "rcl": ${rcl},\n  "structures": {${body}}\n}`;
};

/**
 * Validates and decodes editor text. Never throws and never touches a store, so a caller can apply the
 * result knowing a rejected edit changed nothing. Unknown top-level keys are ignored rather than
 * rejected, so JSON produced elsewhere still pastes.
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
    return { ok: false, error: 'Expected a JSON object with "rcl" and "structures"' };
  }

  let rcl: number | undefined;
  if (parsed.rcl !== undefined) {
    if (
      typeof parsed.rcl !== 'number' ||
      !Number.isInteger(parsed.rcl) ||
      parsed.rcl < 1 ||
      parsed.rcl > Constants.MAX_RCL
    ) {
      const value = JSON.stringify(parsed.rcl);
      return {
        ok: false,
        error: `Invalid "rcl" value ${value} (expected a whole number from 1 to ${Constants.MAX_RCL})`,
      };
    }
    rcl = parsed.rcl;
  }

  if (!isPlainObject(parsed.structures)) {
    return { ok: false, error: 'Expected a "structures" object mapping types to "x-y" position arrays' };
  }

  const objects: GameObject[] = [];
  for (const [type, positions] of Object.entries(parsed.structures)) {
    // Exporting a mineral under its resource letter makes `mineral` a plausible-looking key that
    // `createObjectFromType` cannot route, so it earns a message of its own.
    if (type === Constants.MINERAL) {
      return { ok: false, error: 'Use the resource letter (H, O, U, L, K, Z, X) instead of "mineral"' };
    }
    if (!isKnownType(type)) {
      return { ok: false, error: `Unknown type "${type}" (expected a structure name or resource object)` };
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
};
