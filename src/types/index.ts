export type Point = { x: number; y: number };

export type RoomStructures = { [structure: string]: string[] };

export type RoomStructuresJson = {
  rcl?: number;
  room?: string;
  shard?: string;
  structures: RoomStructures;
};

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

export type StructuresNearbyData = { dx: number; dy: number; structures: string[] };

export interface Metrics {
  fps: number;
  gameObjectCounter?: number;
  rendererCounter?: number;
  devicePixelRatio?: number;
  renderer?: {
    size: number;
    maxSvgSize: number;
  };
}
