import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';
import { MAX_RCL, SAMPLE_JSON } from '../utils/constants';
import { getRoomTile } from '../utils/helpers';
import { useSettings } from '../contexts/SettingsContext';
import { useRoomGrid } from '../contexts/RoomGridContext';
import { useRoomStructures } from '../contexts/RoomStructuresContext';
import { useRoomTerrain } from '../contexts/RoomTerrainContext';

export default function ExampleBunker(props: { toggleModalOpen: () => void }) {
  const { updateSettings } = useSettings();
  const { updateRoomGrid } = useRoomGrid();
  const { updateRoomStructures } = useRoomStructures();
  const { updateRoomTerrain } = useRoomTerrain();

  return (
    <Mui.Button
      onMouseDown={() => {
        updateRoomGrid({ type: 'reset' });
        updateRoomStructures({ type: 'reset' });
        updateRoomTerrain({ type: 'reset' });
        updateSettings({ type: 'set_rcl', rcl: MAX_RCL });

        Object.entries(SAMPLE_JSON.structures).forEach(([structure, positions]) => {
          positions.forEach((pos) => {
            const tile = getRoomTile(pos.x, pos.y);
            updateRoomGrid({ type: 'add_structure', tile, structure });
            updateRoomStructures({ type: 'add_structure', structure, x: pos.x, y: pos.y });
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
