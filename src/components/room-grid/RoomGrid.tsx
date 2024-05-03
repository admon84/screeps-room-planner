import * as Helpers from '@/utils/helpers';
import * as Constants from '@/utils/constants';
import { Box, Paper } from '@mui/material';
import { StructuresNearbyData } from '@/types';
import { useSettings } from '@/stores/Settings';
import { useTileStructures } from '@/stores/TileStructures';
import { useTileObjects } from '@/stores/TileObjects';
import { useStructurePositions } from '@/stores/StructurePositions';
import { useTileTerrain } from '@/stores/TileTerrain';
import { useHoverTile } from '@/stores/HoverTile';
import { useCallback } from 'react';
import RoomGridTile from './RoomGridTile';

export default function RoomGrid() {
  const zoom = useSettings((state) => state.settings.zoom);
  const rcl = useSettings((state) => state.settings.rcl);
  const resetBrush = useSettings((state) => state.resetBrush);
  const sources = useTileObjects((state) => state.sources);
  const minerals = useTileObjects((state) => state.minerals);
  const addSource = useTileObjects((state) => state.addSource);
  const addMineral = useTileObjects((state) => state.addMineral);
  const removeSource = useTileObjects((state) => state.removeSource);
  const removeMineral = useTileObjects((state) => state.removeMineral);
  const tileStructures = useTileStructures((state) => state.structures);
  const getStructures = useTileStructures((state) => state.getStructures);
  const addTileStructure = useTileStructures((state) => state.addStructure);
  const removeTileStructure = useTileStructures((state) => state.removeStructure);
  const getPlacedCount = useStructurePositions((state) => state.getPlacedCount);
  const addStructurePosition = useStructurePositions((state) => state.addStructure);
  const removeStructurePosition = useStructurePositions((state) => state.removeStructure);
  const tileTerrainMap = useTileTerrain((state) => state.terrain);
  const setTileTerrain = useTileTerrain((state) => state.setTileTerrain);
  const hoverTile = useHoverTile((state) => state.tile);

  const hoverPoint = Helpers.getPointForTile(hoverTile ?? 0);

  const addBrush = useCallback((tile: number, brush: string, brushType: Constants.BrushType) => {
    if (brushType === Constants.BrushType.Structure) {
      // logic for adding structure brush to tile
      const placed = getPlacedCount(brush);
      const terrain = tileTerrainMap[tile];
      if (Helpers.structureCanBePlaced(brush, rcl, terrain, placed)) {
        const shortPos = Helpers.getShortForTile(tile);

        // remove existing structures at this position except ramparts
        Helpers.structuresToRemove(brush).forEach((s) => {
          removeTileStructure(tile, s);
          removeStructurePosition(s, shortPos);
        });

        // remove existing objects
        removeObjects(tile, brush);

        // add structures
        addStructurePosition(brush, shortPos);
        addTileStructure(tile, brush);
        // deselect active structure when 0 remaining
        if (!Helpers.structureCanBePlaced(brush, rcl, terrain, placed + 1)) {
          resetBrush();
        }
      }
    } else if (brushType === Constants.BrushType.Object) {
      // logic for adding object brush to tile
      const shortPos = Helpers.getShortForTile(tile);

      // remove existing structures at this position
      Object.keys(Constants.STRUCTURE_BRUSHES).forEach((s) => {
        if (s === Constants.STRUCTURE_EXTRACTOR && brush !== Constants.SOURCE) {
          return;
        }
        removeTileStructure(tile, s);
        removeStructurePosition(s, shortPos);
      });

      // remove existing objects
      removeObjects(tile, brush);

      // add objects
      if (brush === Constants.SOURCE) {
        addSource(tile);
      } else {
        addMineral(tile, brush);
      }
    } else if (brushType === Constants.BrushType.Terrain) {
      // logic for adding terrain brush to tile
      const shortPos = Helpers.getShortForTile(tile);

      // remove existing structures at the position when adding terrain wall
      if (brush === Constants.TERRAIN_WALL) {
        Object.keys(Constants.STRUCTURE_BRUSHES).forEach((s) => {
          removeTileStructure(tile, s);
          removeStructurePosition(s, shortPos);
        });
      }

      // update terrain
      setTileTerrain(tile, brush);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeStructure = useCallback((tile: number, brush: string) => {
    removeTileStructure(tile, brush);
    removeStructurePosition(brush, Helpers.getShortForTile(tile));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeObjects = useCallback(
    (tile: number, brush: string) => {
      removeSource(tile);
      if (brush !== Constants.STRUCTURE_EXTRACTOR) {
        removeMineral(tile);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const getStructuresNearby = useCallback((tile: number) => {
    const data: StructuresNearbyData[] = [];
    const origin = Helpers.getPointForTile(tile);
    for (const dx of [-1, 0, 1]) {
      for (const dy of [-1, 0, 1]) {
        if (dx === 0 && dy === 0) continue;
        const [x, y] = [origin.x + dx, origin.y + dy];
        if (Helpers.isRoomPosition(x, y)) {
          data.push({ dx, dy, structures: getStructures(Helpers.getTile(x, y)) });
        }
      }
    }
    return data;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Paper
      elevation={6}
      sx={{
        borderRadius: 0,
        width: '100%',
        maxWidth: { xs: '100%', md: `calc(${zoom * 25 + 50}vw - 300px)` },
      }}
    >
      <Box display='grid' gridTemplateColumns='repeat(50, minmax(2%, 1fr))' gap={0}>
        {Object.keys(tileStructures)
          .map((tile) => +tile)
          .map((tile) => {
            const point = Helpers.getPointForTile(tile);
            return (
              <RoomGridTile
                key={tile}
                tile={tile}
                terrain={tileTerrainMap[tile]}
                structures={tileStructures[tile]}
                getStructuresNearby={getStructuresNearby}
                addBrush={addBrush}
                removeStructure={removeStructure}
                removeObjects={removeObjects}
                renderNearHoverTile={Helpers.getDistance(point, hoverPoint) === 1}
                hasSource={sources[tile]}
                hasMineralType={minerals[tile]}
              />
            );
          })}
      </Box>
    </Paper>
  );
}
