import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';
import { useState } from 'react';
import { getPointForShort, isRoomPosition } from '@/utils/helpers';
import { createObjectFromType, GameObject } from '@/utils/gameObjects';
import { RoomStructuresJson } from '@/types';
import { useGameObjectStore } from '@/stores/useGameObjectsStore';
import { useTerrainStore } from '@/stores/useTerrainStore';
import StyledDialog from '../dialog/StyledDialog';
import DialogTitle from '../dialog/DialogTitle';

export default function ImportJsonStructures() {
  const { palette } = Mui.useTheme();

  const setObjects = useGameObjectStore((state) => state.setObjects);
  const resetTerrain = useTerrainStore((state) => state.reset);

  const [wipeTerrainChecked, setWipeTerrainChecked] = useState(true);
  const [modalOpen, setOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [userJson, setUserJson] = useState<string | null>(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLoadTerrain = () => {
    setFormError(null);

    if (!userJson) {
      setFormError('JSON is required');
      return;
    }

    let json: RoomStructuresJson | null = null;

    try {
      json = JSON.parse(userJson);
    } catch {
      setFormError('Unable to parse JSON (must be valid and stringified)');
      return;
    }

    if (!json || !json.structures) {
      setFormError('Expected "structures" property is missing');
      return;
    }

    // Coordinates are validated before anything is stored: a bad short parses to NaN, which the
    // renderer surfaces as a draw crash rather than a type error.
    const objects: GameObject[] = [];
    for (const [type, positions] of Object.entries(json.structures)) {
      if (!Array.isArray(positions)) {
        setFormError(`Expected an array of "x-y" positions for "${type}"`);
        return;
      }
      for (const shortPoint of positions) {
        const { x, y } = getPointForShort(String(shortPoint));
        if (!isRoomPosition(x, y)) {
          setFormError(`Invalid position "${shortPoint}" for "${type}" (expected "x-y" inside the room)`);
          return;
        }
        objects.push(createObjectFromType({ type, x, y }));
      }
    }

    if (wipeTerrainChecked) {
      resetTerrain();
    }
    setObjects(objects);

    handleClose();
  };

  return (
    <>
      <Mui.Button onClick={handleOpen} variant='outlined' startIcon={<Icons.DataObject />}>
        Import Json
      </Mui.Button>
      <StyledDialog fullWidth maxWidth='sm' open={modalOpen} onClose={handleClose}>
        <DialogTitle onClose={handleClose}>Import JSON</DialogTitle>
        <Mui.DialogContent dividers sx={{ backgroundColor: palette.divider }}>
          <Mui.FormLabel component='div' sx={{ mb: 2 }}>
            Import room structures from JSON. Positions use the &quot;x-y&quot; format produced by Get Room Json.
          </Mui.FormLabel>
          <Mui.FormControl variant='outlined' fullWidth>
            <Mui.TextField
              error={!!formError}
              defaultValue={userJson}
              fullWidth
              label='JSON'
              maxRows={12}
              minRows={6}
              multiline
              onChange={(e) => {
                setFormError(null);
                setUserJson(e.target.value);
              }}
              placeholder='{"rcl":8,"structures":{"spawn":["25-25"]}}'
            />
          </Mui.FormControl>
          {formError && (
            <Mui.Box sx={{ backgroundColor: palette.divider, mt: 2 }}>
              <Mui.Alert color='error' variant='outlined' sx={{ px: 1, py: 0 }}>
                {formError}
              </Mui.Alert>
            </Mui.Box>
          )}
        </Mui.DialogContent>
        <Mui.DialogActions sx={{ backgroundColor: palette.divider, justifyContent: 'space-between' }}>
          <Mui.FormControlLabel
            label='Wipe Terrain'
            control={
              <Mui.Checkbox
                defaultChecked={wipeTerrainChecked}
                onChange={(e) => setWipeTerrainChecked(e.target.checked)}
              />
            }
          />
          <Mui.Button variant='outlined' onClick={handleLoadTerrain} startIcon={<Icons.DataObject />}>
            Import Json
          </Mui.Button>
        </Mui.DialogActions>
      </StyledDialog>
    </>
  );
}
