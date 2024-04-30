import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';
import { useTileTerrain } from '@/stores/TileTerrain';
import { useTileStructures } from '@/stores/TileStructures';
import { useStructurePositions } from '@/stores/StructurePositions';
import ImportRoom from '../actions/ImportRoom';
import ImportJsonStructures from '../actions/ImportFromJson';
import GetRoomJson from '../actions/GetRoomJson';
import ActionButton from '../actions/ActionButton';

export default function RoomActions() {
  const resetTileStructures = useTileStructures((state) => state.reset);
  const resetStructurePositions = useStructurePositions((state) => state.reset);
  const resetTileTerrain = useTileTerrain((state) => state.reset);

  return (
    <Mui.Stack direction='column' spacing={1}>
      <ImportRoom />
      <ImportJsonStructures />
      {/* <LoadExampleBunker /> */}
      <ActionButton
        onClick={() => {
          resetTileStructures();
          resetStructurePositions();
        }}
        startIcon={<Icons.FormatColorReset />}
        buttonText='Reset Structures'
        dialogMessage='Do you want to clear all structures from the map?'
      />
      <ActionButton
        onClick={resetTileTerrain}
        startIcon={<Icons.LayersClear />}
        buttonText='Reset Terrain'
        dialogMessage='Do you want to reset the room terrain back to plains?'
      />
      <GetRoomJson />
    </Mui.Stack>
  );
}
