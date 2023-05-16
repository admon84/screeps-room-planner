import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';
import { useState } from 'react';

import StyledDialog from '../common/StyledDialog';
import { useTileTerrain } from '../contexts/TileTerrainContext';
import { useTileStructures } from '../contexts/TileStructuresContext';
import { useStructurePositions } from '../contexts/StructurePositionsContext';
import ExampleBunker from './ExampleBunker';
import LoadTerrain from './LoadTerrain';
import DialogTitle from '../common/DialogTitle';
import LoadStructuresJson from './LoadStructuresJson';

export default function RoomActions() {
  const { palette } = Mui.useTheme();
  const { updateTileStructures } = useTileStructures();
  const { updateStructurePositions } = useStructurePositions();
  const { updateTileTerrain } = useTileTerrain();

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
                updateTileStructures({ type: 'reset' });
                updateStructurePositions({ type: 'reset' });
                toggleModalOpen();
              }}
              variant='outlined'
              endIcon={<Icons.FormatColorReset />}
            >
              Wipe Structures
            </Mui.Button>

            <Mui.Button
              onMouseDown={() => {
                updateTileTerrain({ type: 'reset' });
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
