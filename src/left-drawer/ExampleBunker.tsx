import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';
import { MAX_RCL, SAMPLE_JSON } from '../utils/constants';
import { getRoomTile } from '../utils/helpers';
import { useSettings } from '../contexts/SettingsContext';
import { useRoomGrid } from '../contexts/RoomGridContext';
import { useRoomStructures } from '../contexts/RoomStructuresContext';
import { useRoomTerrain } from '../contexts/RoomTerrainContext';

export default function ExampleBunker(props: { toggleModalOpen: () => void }) {
  const { setRcl } = useSettings();
  const { addRoomGridStructure, resetRoomGrid } = useRoomGrid();
  const { addRoomStructure, resetRoomStructures } = useRoomStructures();
  const { resetRoomTerrain } = useRoomTerrain();

  return (
    <Mui.Button
      onMouseDown={() => {
        resetRoomGrid();
        resetRoomStructures();
        resetRoomTerrain();
        setRcl(MAX_RCL);

        Object.entries(SAMPLE_JSON.structures).forEach(([structure, positions]) => {
          positions.forEach((pos) => {
            const tile = getRoomTile(pos.x, pos.y);
            addRoomGridStructure(tile, structure);
            addRoomStructure(structure, pos);
          });
        });
        props.toggleModalOpen();
      }}
      variant='outlined'
      endIcon={<Icons.AutoFixHigh />}
    >
      Load Example Bunker
    </Mui.Button>
  );
}
