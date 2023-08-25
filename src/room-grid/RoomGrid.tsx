import { Box, Paper } from '@mui/material';
import { StructuresNearbyData, RoomPosition } from '../utils/types';
import { GRID_SIZE, STRUCTURE_ROAD } from '../utils/constants';
import {
  getRoomPoint,
  getRoomPosition,
  getRoomTile,
  positionIsValid,
  structureCanBePlaced,
  structuresToRemove,
} from '../utils/helpers';
import RoomGridTile from './RoomGridTile';
import { useSettings } from '../state/Settings';
import { useTileStructures } from '../state/TileStructures';
import { useStructurePositions } from '../state/StructurePositions';
import { useTileTerrain } from '../state/TileTerrain';
import { useHoverTile } from '../state/HoverTile';
import { useCallback } from 'react';

export default function RoomGrid() {
  console.log(`-- RENDERING ROOM GRID --`);
  const rcl = useSettings((state) => state.rcl);
  const unsetBrush = useSettings((state) => state.unsetBrush);
  const tileStructures = useTileStructures((state) => state.structures);
  const getStructures = useTileStructures((state) => state.getStructures);
  const addTileStructure = useTileStructures((state) => state.addStructure);
  const removeTileStructure = useTileStructures((state) => state.removeStructure);

  const getPlacedCount = useStructurePositions((state) => state.getPlacedCount);
  const addStructurePosition = useStructurePositions((state) => state.addStructure);
  const removeStructurePosition = useStructurePositions((state) => state.removeStructure);
  const tileTerrainMap = useTileTerrain((state) => state.terrain);
  const gridTiles = Array.from(Array(GRID_SIZE).keys());
  const hoverTile = useHoverTile((state) => state.tile);
  const hoverPoint = getRoomPoint(hoverTile ?? 0);

  const getDistance = (a: RoomPosition, b: RoomPosition) => Math.max(Math.abs(b.x - a.x), Math.abs(b.y - a.y));

  const addStructure = useCallback((tile: number, structure: string) => {
    const placed = getPlacedCount(structure);
    const terrain = tileTerrainMap[tile];
    if (structureCanBePlaced(structure, rcl, placed, terrain)) {
      // remove existing structures at this position except ramparts
      structuresToRemove(structure).forEach((structure) => {
        removeStructure(tile, structure);
      });
      // add structures
      addStructurePosition(structure, getRoomPosition(tile));
      addTileStructure(tile, structure);
      // deselect active structure when 0 remaining
      if (!structureCanBePlaced(structure, rcl, placed + 1, terrain)) {
        unsetBrush();
      }
    }
  }, []);

  const removeStructure = useCallback((tile: number, structure: string) => {
    removeTileStructure(tile, structure);
    removeStructurePosition(structure, getRoomPosition(tile));
  }, []);

  const getStructuresNearby = useCallback((tile: number) => {
    const structuresNearby: StructuresNearbyData[] = [];
    const origin = getRoomPoint(tile);
    for (const dx of [-1, 0, 1]) {
      for (const dy of [-1, 0, 1]) {
        if (dx === 0 && dy === 0) continue;
        const [x, y] = [origin.x + dx, origin.y + dy];
        if (positionIsValid(x, y)) {
          const nearTile = getRoomTile(x, y);
          structuresNearby.push({ dx, dy, structures: getStructures(nearTile) });
        }
      }
    }
    return structuresNearby;
  }, []);

  return (
    <Paper
      elevation={6}
      sx={{
        borderRadius: 0,
        minWidth: '500px',
        maxWidth: 'calc(100vh - 6.25rem)',
        width: '100%',
      }}
    >
      <Box display='grid' gridTemplateColumns='repeat(50, minmax(2%, 1fr))' gap={0}>
        {gridTiles.map((tile) => {
          const point = getRoomPoint(tile);

          return (
            <RoomGridTile
              key={tile}
              tile={tile}
              rcl={rcl}
              terrain={tileTerrainMap[tile]}
              isNearHoverTile={getDistance(point, hoverPoint) === 1}
              structures={tileStructures[tile]}
              getStructuresNearby={getStructuresNearby}
              addStructure={addStructure}
              removeStructure={removeStructure}
            />
          );
        })}
      </Box>
    </Paper>
  );
}
