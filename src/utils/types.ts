export type RoomPosition = { x: number; y: number };

export type RoomStructures = { [structure: string]: RoomPosition[] };

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

export type NearbyRoadsData = { [tile: number]: { dx: number; dy: number } };
