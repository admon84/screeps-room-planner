export type Point = { x: number; y: number };

/**
 * Sparse terrain in the shape `@screeps/renderer` consumes: only non-plain tiles are listed, so a
 * missing entry means plain.
 */
export type TerrainTile = { room: string; x: number; y: number; type: string };

export type RoomStructures = { [structure: string]: string[] };

export interface StructureBrush {
  key: string;
  image: string;
  name: string;
  total: number;
}

export type ScreepsGameRoomTerrain = {
  ok: number;
  terrain: Array<{ _id: string; room: string; terrain: string; type: 'terrain' }>;
};

/**
 * One entry from `game/room-objects`. The API sends many more per-type fields (store contents, hits,
 * cooldowns); only the ones the planner places or renders are declared.
 */
export type ScreepsRoomObject = {
  _id: string;
  room: string;
  type: string;
  x: number;
  y: number;
  level?: number;
  mineralType?: string;
  mineralAmount?: number;
};

export type ScreepsGameRoomObjects = {
  ok: number;
  objects: ScreepsRoomObject[];
};

export type ScreepsShardsInfo = {
  ok: number;
  shards: Array<{ name: string }>;
};

export type StructuresNearbyData = { dx: number; dy: number; structures: string[] };

export interface Metrics {
  fps: number;
  gameObjectCounter?: number;
  rendererCounter?: number;
  devicePixelRatio?: number;
  stageSize?: number;
  renderer?: {
    size: number;
    maxSvgSize?: number;
    WebGL?: string;
    GPU?: string;
  };
}
