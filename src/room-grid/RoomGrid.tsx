import * as Helpers from '../utils/helpers';
import { Box, Paper } from '@mui/material';
import { StructuresNearbyData } from '../utils/types';
import { useSettings } from '../state/Settings';
import { useTileStructures } from '../state/TileStructures';
import { useTileObjects } from '../state/TileObjects';
import { useStructurePositions } from '../state/StructurePositions';
import { useTileTerrain } from '../state/TileTerrain';
import { useHoverTile } from '../state/HoverTile';
import { useCallback } from 'react';
import RoomGridTile from './RoomGridTile';
import { BrushType, SOURCE } from '../utils/constants';

export default function RoomGrid() {
  const zoom = useSettings((state) => state.settings.zoom);
  const rcl = useSettings((state) => state.settings.rcl);
  const resetBrush = useSettings((state) => state.resetBrush);
  const sources = useTileObjects((state) => state.sources);
  const mineral = useTileObjects((state) => state.mineral);
  const addSource = useTileObjects((state) => state.addSource);
  const addMineral = useTileObjects((state) => state.addMineral);
  const removeSource = useTileObjects((state) => state.removeSource);
  const resetMineral = useTileObjects((state) => state.resetMineral);
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

  const addBrush = useCallback((tile: number, brush: string, brushType: BrushType) => {
    if (brushType === BrushType.Structure) {
      const placed = getPlacedCount(brush);
      const terrain = tileTerrainMap[tile];
      if (Helpers.structureCanBePlaced(brush, rcl, placed, terrain)) {
        const shortPos = Helpers.getShortForTile(tile);
        // remove existing structures at this position except ramparts
        Helpers.structuresToRemove(brush).forEach((s) => {
          removeTileStructure(tile, s);
          removeStructurePosition(s, shortPos);
        });
        // remove existing objects
        removeObjects(tile);
        // add structures
        addStructurePosition(brush, shortPos);
        addTileStructure(tile, brush);
        // deselect active structure when 0 remaining
        if (!Helpers.structureCanBePlaced(brush, rcl, placed + 1, terrain)) {
          resetBrush();
        }
      }
    } else if (brushType === BrushType.Object) {
      const shortPos = Helpers.getShortForTile(tile);
      // remove existing structures at this position
      Helpers.structuresToRemove(brush).forEach((s) => {
        removeTileStructure(tile, s);
        removeStructurePosition(s, shortPos);
      });
      // remove existing objects
      removeObjects(tile);
      // add objects
      if (brush === SOURCE) {
        addSource(tile);
      } else {
        addMineral(tile, brush);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeBrush = useCallback((tile: number, brush: string) => {
    removeTileStructure(tile, brush);
    removeStructurePosition(brush, Helpers.getShortForTile(tile));
    removeObjects(tile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeObjects = useCallback((tile: number) => {
    if (sources.includes(tile)) {
      removeSource(tile);
    }
    if (mineral && mineral.tile === tile) {
      resetMineral();
    }
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
        width: '100%',
        maxWidth: { xs: '100%', md: `calc(${zoom * 25 + 50}vw - 300px)` },
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
                terrain={tileTerrainMap[tile]}
                structures={tileStructures[tile]}
                getStructuresNearby={getStructuresNearby}
                addBrush={addBrush}
                removeBrush={removeBrush}
                renderNearHoverTile={Helpers.getDistance(tilePoint, hoverPoint) === 1}
                hasSource={sources.includes(tile)}
                hasMineralType={mineral && mineral.tile === tile ? mineral.type : null}
              />
            );
          })}
      </Box>
    </Paper>
  );
}
