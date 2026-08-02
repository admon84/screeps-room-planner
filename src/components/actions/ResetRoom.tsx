import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';
import { useState } from 'react';
import { useGameObjectStore } from '@/stores/useGameObjectsStore';
import { useHistoryStore } from '@/stores/useHistoryStore';
import { useTerrainStore } from '@/stores/useTerrainStore';
import StyledDialog from '../dialog/StyledDialog';
import DialogTitle from '../dialog/DialogTitle';

export default function ResetRoom() {
  const { palette } = Mui.useTheme();

  const resetObjects = useGameObjectStore((state) => state.reset);
  const resetTerrain = useTerrainStore((state) => state.reset);
  const commit = useHistoryStore((state) => state.commit);

  const [modalOpen, setOpen] = useState(false);
  const [structuresChecked, setStructuresChecked] = useState(true);
  const [terrainChecked, setTerrainChecked] = useState(true);

  // Re-armed on open so an earlier unticking does not linger into the next reset.
  const handleOpen = () => {
    setStructuresChecked(true);
    setTerrainChecked(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleReset = () => {
    commit(); // one snapshot covers both stores, so the whole reset undoes in a single step
    if (structuresChecked) {
      resetObjects();
    }
    if (terrainChecked) {
      resetTerrain();
    }

    handleClose();
  };

  return (
    <>
      <Mui.Button onClick={handleOpen} variant='outlined' startIcon={<Icons.GridOffOutlined />}>
        Reset
      </Mui.Button>
      <StyledDialog fullWidth maxWidth='sm' open={modalOpen} onClose={handleClose}>
        <DialogTitle onClose={handleClose}>Reset Room</DialogTitle>
        <Mui.DialogContent dividers sx={{ backgroundColor: palette.divider }}>
          <Mui.FormLabel component='div' sx={{ mb: 1 }}>
            Choose what to clear. This can be undone.
          </Mui.FormLabel>
          <Mui.Stack direction='column'>
            <Mui.FormControlLabel
              label='Structures and objects'
              control={
                <Mui.Checkbox checked={structuresChecked} onChange={(e) => setStructuresChecked(e.target.checked)} />
              }
            />
            <Mui.FormControlLabel
              label='Terrain'
              control={<Mui.Checkbox checked={terrainChecked} onChange={(e) => setTerrainChecked(e.target.checked)} />}
            />
          </Mui.Stack>
        </Mui.DialogContent>
        <Mui.DialogActions sx={{ backgroundColor: palette.divider, justifyContent: 'space-between' }}>
          <Mui.Button onClick={handleClose}>Cancel</Mui.Button>
          <Mui.Button
            variant='contained'
            onClick={handleReset}
            disabled={!structuresChecked && !terrainChecked}
            startIcon={<Icons.GridOffOutlined />}
          >
            Reset
          </Mui.Button>
        </Mui.DialogActions>
      </StyledDialog>
    </>
  );
}
