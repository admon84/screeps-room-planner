import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';
import { useState } from 'react';
import { useTileTerrain } from '@/stores/TileTerrain';
import { useTileStructures } from '@/stores/TileStructures';
import { useStructurePositions } from '@/stores/StructurePositions';
import LoadExampleBunker from '../actions/load-example-bunker/LoadExampleBunker';
import ImportRoom from '../actions/import-room/ImportRoom';
import ImportJsonStructures from '../actions/import-json-structures/ImportJsonStructures';
import GetRoomJson from '../actions/get-room-json/GetRoomJson';
import ActionButton from '../actions/action-button/ActionButton';

export default function RoomActions() {
  const resetTileStructures = useTileStructures((state) => state.reset);
  const resetStructurePositions = useStructurePositions((state) => state.reset);
  const resetTileTerrain = useTileTerrain((state) => state.reset);

  return (
    <Mui.Stack direction='column' spacing={1}>
      <ImportRoom />

      <ImportJsonStructures />

      <LoadExampleBunker />

      <ActionButton
        onClick={() => {
          resetTileStructures();
          resetStructurePositions();
        }}
        endIcon={<Icons.FormatColorReset />}
        buttonText='Reset Structures'
        dialogMessage='Do you want to clear all structures from the map?'
      />

      <ActionButton
        onClick={resetTileTerrain}
        endIcon={<Icons.LayersClear />}
        buttonText='Reset Terrain'
        dialogMessage='Do you want to reset the room terrain back to plains?'
      />

      <GetRoomJson />
    </Mui.Stack>
  );
}
