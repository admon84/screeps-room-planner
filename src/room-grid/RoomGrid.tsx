import * as Helpers from '../utils/helpers';
import { Box, Paper } from '@mui/material';
import { StructuresNearbyData } from '../utils/types';
import { useSettings } from '../state/Settings';
import { useTileStructures } from '../state/TileStructures';
import { useStructurePositions } from '../state/StructurePositions';
import { useTileTerrain } from '../state/TileTerrain';
import { useHoverTile } from '../state/HoverTile';
import { useCallback } from 'react';
import RoomGridTile from './RoomGridTile';

export default function RoomGrid() {
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
  const hoverTile = useHoverTile((state) => state.tile);

  const hoverPoint = Helpers.getPointForTile(hoverTile ?? 0);

  const addStructure = useCallback((tile: number, structure: string) => {
    const placed = getPlacedCount(structure);
    const terrain = tileTerrainMap[tile];
    if (Helpers.structureCanBePlaced(structure, rcl, placed, terrain)) {
      // remove existing structures at this position except ramparts
      Helpers.structuresToRemove(structure).forEach((s) => {
        removeStructure(tile, s);
      });
      // add structures
      addStructurePosition(structure, Helpers.getShortForTile(tile));
      addTileStructure(tile, structure);
      // deselect active structure when 0 remaining
      if (!Helpers.structureCanBePlaced(structure, rcl, placed + 1, terrain)) {
        unsetBrush();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeStructure = useCallback((tile: number, structure: string) => {
    removeTileStructure(tile, structure);
    removeStructurePosition(structure, Helpers.getShortForTile(tile));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStructuresNearby = useCallback((tile: number) => {
    const structuresNearby: StructuresNearbyData[] = [];
    const origin = Helpers.getPointForTile(tile);
    for (const dx of [-1, 0, 1]) {
      for (const dy of [-1, 0, 1]) {
        if (dx === 0 && dy === 0) continue;
        const [x, y] = [origin.x + dx, origin.y + dy];
        if (Helpers.positionIsValid(x, y)) {
          structuresNearby.push({ dx, dy, structures: getStructures(Helpers.getTile(x, y)) });
        }
      }
    }
    return structuresNearby;
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        {Object.keys(tileStructures)
          .map((tile) => +tile)
          .map((tile) => {
            const tilePoint = Helpers.getPointForTile(tile);
            return (
              <RoomGridTile
                key={tile}
                tile={tile}
                rcl={rcl}
                terrain={tileTerrainMap[tile]}
                structures={tileStructures[tile]}
                getStructuresNearby={getStructuresNearby}
                addStructure={addStructure}
                removeStructure={removeStructure}
                renderNearHoverTile={Helpers.getDistance(tilePoint, hoverPoint) === 1}
              />
            );
          })}
      </Box>
    </Paper>
  );
}
