import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';
import { useState } from 'react';
import StyledDialog from '../common/StyledDialog';
import { useTileTerrain } from '../state/TileTerrain';
import { useTileStructures } from '../state/TileStructures';
import { useStructurePositions } from '../state/StructurePositions';
import ExampleBunker from './ExampleBunker';
import LoadTerrain from './LoadTerrain';
import DialogTitle from '../common/DialogTitle';
import LoadStructuresJson from './LoadStructuresJson';

export default function RoomActions() {
  const { palette } = Mui.useTheme();

  const resetTileStructures = useTileStructures((state) => state.reset);
  const resetStructurePositions = useStructurePositions((state) => state.reset);
  const resetTileTerrain = useTileTerrain((state) => state.reset);

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
                resetTileStructures();
                resetStructurePositions();
                toggleModalOpen();
              }}
              variant='outlined'
              endIcon={<Icons.FormatColorReset />}
            >
              Wipe Structures
            </Mui.Button>

            <Mui.Button
              onMouseDown={() => {
                resetTileTerrain();
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
