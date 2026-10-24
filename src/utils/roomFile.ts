import { buildRoomJson, parseRoomJson } from './roomJson';
import { buildRoomSvg } from './svgExport';
import { isValidRoomName, normalizeRoomName } from './screepsApi';
import { useSettings } from '@/stores/Settings';
import { useGameObjectStore } from '@/stores/useGameObjectsStore';
import { useHistoryStore } from '@/stores/useHistoryStore';
import { useTerrainStore } from '@/stores/useTerrainStore';

/** Hands a generated file to the browser's download flow. */
export function downloadFile(filename: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Revoked on the next task: some browsers start the download only after the click handler returns.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/** `E11S12-rcl8`, or `room-rcl8` before a room name is set. */
function baseName() {
  const { room, rcl } = useSettings.getState().settings;
  const name = room && isValidRoomName(room) ? room : 'room';
  return `${name}-rcl${rcl}`;
}

export function saveRoomJson() {
  const { rcl, room, shard } = useSettings.getState().settings;
  const json = buildRoomJson(
    useGameObjectStore.getState().objects,
    useTerrainStore.getState().terrain,
    rcl,
    room,
    shard
  );
  downloadFile(`${baseName()}.json`, `${json}\n`, 'application/json');
}

/** `fill`: share of every store drawn as filled (0 empty .. 1 full); `animate` adds SMIL motion. */
export async function saveRoomSvg(fill = 0, animate = false) {
  const { rcl, room, shard, playerName } = useSettings.getState().settings;
  const svg = await buildRoomSvg({
    objects: useGameObjectStore.getState().objects,
    terrain: useTerrainStore.getState().terrain,
    rcl,
    room,
    shard,
    fill,
    animate,
    playerName,
  });
  const suffix = (fill >= 1 ? '-full' : fill > 0 ? `-${Math.round(fill * 100)}` : '') + (animate ? '-animated' : '');
  downloadFile(`${baseName()}${suffix}.svg`, svg, 'image/svg+xml');
}

/**
 * Applies room JSON text the way the Edit dialog does (one undo step for objects, terrain and RCL),
 * and also takes over a valid `name` and `shard` from the file. Returns an error message, or null.
 */
export function applyRoomJsonText(text: string): string | null {
  const result = parseRoomJson(text);
  if (!result.ok) return result.error;

  const { setRCL, setRoom, setShard } = useSettings.getState();
  useHistoryStore.getState().commit();
  useGameObjectStore.getState().setObjects(result.objects);
  if (result.terrain !== undefined) useTerrainStore.getState().setTerrain(result.terrain);
  if (result.rcl !== undefined) setRCL(result.rcl);

  // parseRoomJson has already accepted the text as JSON, so this cannot throw.
  const parsed = JSON.parse(text) as { name?: unknown; shard?: unknown };
  if (typeof parsed.name === 'string' && isValidRoomName(normalizeRoomName(parsed.name))) {
    setRoom(normalizeRoomName(parsed.name));
  }
  if (typeof parsed.shard === 'string' && parsed.shard.trim()) setShard(parsed.shard.trim());
  return null;
}
