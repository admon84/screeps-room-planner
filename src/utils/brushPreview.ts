import * as Constants from '@/utils/constants';
import * as Helpers from '@/utils/helpers';
import { countPlacedByType } from '@/stores/useGameObjectsStore';
import type { GameObject } from '@/utils/gameObjects';
import type { Point, TerrainTile } from '@/types';

export type Brush = { key: string; type: Constants.BrushType };

/**
 * Display name plus either a sprite URL or a terrain swatch colour, routed by brush type -- terrain
 * `wall` and the `constructedWall` structure read alike but resolve to different assets.
 */
export const getBrushProps = ({ key, type }: Brush): { name: string; image?: string; swatch?: string } => {
  switch (type) {
    case Constants.BrushType.Terrain: {
      const { name, backgroundColor } = Helpers.getTerrainProps(key);
      return { name, swatch: backgroundColor };
    }
    case Constants.BrushType.Object: {
      const { name, image } = Helpers.getObjectProps(key);
      return { name, image };
    }
    default: {
      const { name, image } = Helpers.getStructureProps(key);
      return { name, image };
    }
  }
};

const getTerrainTypeAt = (terrain: TerrainTile[], { x, y }: Point) =>
  terrain.find((t) => t.x === x && t.y === y)?.type ?? Constants.TERRAIN_PLAIN;

/**
 * Whether painting `brush` on a tile would be accepted, mirroring the refusal checks in Canvas's
 * `paintAt`. Terrain always paints, so only a repaint of the same type reads as a no-op.
 */
export const brushCanBePlacedAt = (
  brush: Brush,
  pos: Point,
  { objects, terrain, rcl, blockEdges }: { objects: GameObject[]; terrain: TerrainTile[]; rcl: number; blockEdges: boolean }
) => {
  switch (brush.type) {
    case Constants.BrushType.Terrain:
      return getTerrainTypeAt(terrain, pos) !== brush.key;
    case Constants.BrushType.Object: {
      const storedType = Helpers.getObjectTypeForBrush(brush.key);
      const occupiesTile = objects.some((o) => o.x === pos.x && o.y === pos.y && o.type === storedType);
      return occupiesTile || Helpers.objectCanBePlaced(brush.key, countPlacedByType(objects)[storedType] ?? 0);
    }
    default:
      if (blockEdges && Helpers.isEdgeTile(pos.x, pos.y)) return false;
      return Helpers.structureCanBePlaced(
        brush.key,
        rcl,
        getTerrainTypeAt(terrain, pos),
        countPlacedByType(objects)[brush.key] ?? 0
      );
  }
};
