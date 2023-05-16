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
import { useRoomGrid } from '../contexts/RoomGridContext';
import { useRoomStructures } from '../contexts/RoomStructuresContext';
import { useRoomTerrain } from '../contexts/RoomTerrainContext';

export default function RoomGrid() {
  const {
    settings: { brush, rcl },
    resetBrush,
  } = useSettings();
  const { roomGrid, addRoomGridStructure, removeRoomGridStructure } = useRoomGrid();
  const { getPlacedStructureCount, addRoomStructure, removeRoomStructure } = useRoomStructures();
  const { roomTerrain } = useRoomTerrain();
  const roomTiles = [...Array(ROOM_SIZE)];

  const addStructure = (tile: number) => {
    if (!brush) return;
    const placed = getPlacedStructureCount(brush);
    const terrain = roomTerrain[tile];
    if (structureCanBePlaced(brush, rcl, placed, terrain)) {
      // remove existing structures at this position except ramparts
      structuresToRemove(brush).forEach((structure) => removeStructure(tile, structure));
      // add structures
      addRoomStructure(brush, getRoomPosition(tile));
      addRoomGridStructure(tile, brush);
      // deselect active brush when 0 remaining
      if (!structureCanBePlaced(brush, rcl, placed + 1, terrain)) {
        resetBrush();
      }
    }
  };

  const removeStructure = (tile: number, structure: string) => {
    removeRoomGridStructure(tile, structure);
    removeRoomStructure(structure, getRoomPosition(tile));
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
        if (positionIsValid(x, y) && roomGrid[tile] && roomGrid[tile].includes(STRUCTURE_ROAD)) {
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
        {roomTiles.map((_, y) =>
          roomTiles.map((_, x) => {
            const tile = getRoomTile(x, y);
            const terrain = roomTerrain[tile];
            const placedStructures = roomGrid[tile] || [];
            const placedCount = brush ? getPlacedStructureCount(brush) : 0;
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
          })
        )}
      </Box>
    </Paper>
  );
}
