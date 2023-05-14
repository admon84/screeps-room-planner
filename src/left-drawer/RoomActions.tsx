import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';
import { useState } from 'react';

import StyledDialog from '../common/StyledDialog';
import { useRoomTerrain } from '../contexts/RoomTerrainContext';
import { useRoomGrid } from '../contexts/RoomGridContext';
import { useRoomStructures } from '../contexts/RoomStructuresContext';
import ExampleBunker from './ExampleBunker';
import LoadTerrain from './LoadTerrain';
import DialogTitle from '../common/DialogTitle';
import LoadStructuresJson from './LoadStructuresJson';

export default function RoomActions() {
  const { palette } = Mui.useTheme();
  const { resetRoomGrid } = useRoomGrid();
  const { resetRoomStructures } = useRoomStructures();
  const { resetRoomTerrain } = useRoomTerrain();

  const [modalOpen, setModalOpen] = useState(false);

  const toggleModalOpen = () => setModalOpen(!modalOpen);

  return (
    <>
      <Mui.Button onMouseDown={toggleModalOpen} variant='outlined' endIcon={<Icons.Widgets />}>
        Room Actions
      </Mui.Button>
      <StyledDialog open={modalOpen} onClose={toggleModalOpen}>
        <DialogTitle onClose={toggleModalOpen}>Room Actions</DialogTitle>
        <Mui.DialogContent dividers sx={{ backgroundColor: palette.divider }}>
          <Mui.Stack direction='column' spacing={1}>
            <LoadTerrain toggleModalOpen={toggleModalOpen} />

            <LoadStructuresJson toggleModalOpen={toggleModalOpen} />

            <ExampleBunker toggleModalOpen={toggleModalOpen} />

            <Mui.Button
              onMouseDown={() => {
                resetRoomGrid();
                resetRoomStructures();
                toggleModalOpen();
              }}
              variant='outlined'
              endIcon={<Icons.FormatColorReset />}
            >
              Wipe Structures
            </Mui.Button>

            <Mui.Button
              onMouseDown={() => {
                resetRoomTerrain();
                toggleModalOpen();
              }}
              variant='outlined'
              endIcon={<Icons.LayersClear />}
            >
              Wipe Terrain
            </Mui.Button>
          </Mui.Stack>
        </Mui.DialogContent>
      </StyledDialog>
    </>
  );
}
