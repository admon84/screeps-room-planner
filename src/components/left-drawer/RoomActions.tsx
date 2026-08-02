import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';
import { useGameObjectStore } from '@/stores/useGameObjectsStore';
import { useHistoryStore } from '@/stores/useHistoryStore';
import { useTerrainStore } from '@/stores/useTerrainStore';
import ImportRoom from '../actions/ImportRoom';
import ImportJsonStructures from '../actions/ImportFromJson';
import LoadExampleBunker from '../actions/LoadExampleBunker';
import GetRoomJson from '../actions/GetRoomJson';
import ActionButton from '../actions/ActionButton';

export default function RoomActions() {
  const resetObjects = useGameObjectStore((state) => state.reset);
  const resetTerrain = useTerrainStore((state) => state.reset);
  const commit = useHistoryStore((state) => state.commit);

  return (
    <Mui.Stack direction='column' spacing={1}>
      <ImportRoom />
      <ImportJsonStructures />
      <LoadExampleBunker />
      <ActionButton
        onClick={() => {
          commit();
          resetObjects();
        }}
        startIcon={<Icons.FormatColorReset />}
        buttonText='Reset Structures'
        dialogMessage='Do you want to clear all structures from the map?'
      />
      <ActionButton
        onClick={() => {
          commit();
          resetTerrain();
        }}
        startIcon={<Icons.LayersClear />}
        buttonText='Reset Terrain'
        dialogMessage='Do you want to reset the room terrain back to plains?'
      />
      <GetRoomJson />
    </Mui.Stack>
  );
}
