import { Box, Paper } from '@mui/material';
import { NearbyRoadsData } from '../utils/types';
import { ROOM_SIZE, STRUCTURE_ROAD } from '../utils/constants';
import {
  getRoomPosition,
  getRoomTile,
  positionIsValid,
  structureCanBePlaced,
  structuresToRemove,
} from '../utils/helpers';
import RoomGridTile from './RoomGridTile';
import { useSettings } from '../contexts/SettingsContext';
import { useTileStructures } from '../contexts/TileStructuresContext';
import { useStructurePositions } from '../contexts/StructurePositionsContext';
import { useTileTerrain } from '../contexts/TileTerrainContext';

export default function RoomGrid() {
  const {
    settings: { brush, rcl },
    updateSettings,
  } = useSettings();
  const { tileStructures, updateTileStructures } = useTileStructures();
  const { getPlacedCount, updateStructurePositions } = useStructurePositions();
  const { tileTerrain } = useTileTerrain();
  const roomTiles = [...Array(ROOM_SIZE * ROOM_SIZE)].map((_, i) => i);

  const addStructure = (tile: number) => {
    if (!brush) return;
    const placed = getPlacedCount(brush);
    const terrain = tileTerrain[tile];
    if (structureCanBePlaced(brush, rcl, placed, terrain)) {
      // remove existing structures at this position except ramparts
      structuresToRemove(brush).forEach((structure) => removeStructure(tile, structure));
      // add structures
      updateStructurePositions({ type: 'add_structure', structure: brush, position: getRoomPosition(tile) });
      updateTileStructures({ type: 'add_structure', tile, structure: brush });
      // deselect active brush when 0 remaining
      if (!structureCanBePlaced(brush, rcl, placed + 1, terrain)) {
        updateSettings({ type: 'unset_brush' });
      }
    }
  };

  const removeStructure = (tile: number, structure: string) => {
    updateTileStructures({ type: 'remove_structure', tile, structure });
    updateStructurePositions({ type: 'remove_structure', structure, position: getRoomPosition(tile) });
  };

  const getNearbyRoads = (tile: number) => {
    const origin = getRoomPosition(tile);
    const positions: NearbyRoadsData = {};
    for (const dx of [-1, 0, 1]) {
      for (const dy of [-1, 0, 1]) {
        if (dx === 0 && dy === 0) {
          continue;
        }
        const [x, y] = [origin.x + dx, origin.y + dy];
        const tile = getRoomTile(x, y);
        if (positionIsValid(x, y) && tileStructures[tile] && tileStructures[tile].includes(STRUCTURE_ROAD)) {
          positions[tile] = { dx, dy };
        }
      }
    }
    return positions;
  };

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
        {roomTiles.map((tile) => {
          const terrain = tileTerrain[tile];
          const placedStructures = tileStructures[tile] || [];
          const placedCount = brush ? getPlacedCount(brush) : 0;
          const brushCanBePlaced =
            !!brush &&
            brush !== STRUCTURE_ROAD &&
            !placedStructures.includes(brush) &&
            structureCanBePlaced(brush, rcl, placedCount, terrain);
          return (
            <RoomGridTile
              key={tile}
              tile={tile}
              rcl={rcl}
              brush={brush}
              terrain={terrain}
              brushCanBePlaced={brushCanBePlaced}
              placedStructures={placedStructures}
              nearbyRoads={getNearbyRoads(tile)}
              addStructure={addStructure}
              removeStructure={removeStructure}
            />
          );
        })}
      </Box>
    </Paper>
  );
}
