import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';
import { useState } from 'react';
import {
  ROOM_NAME,
  SCREEPS_ROOM_TERRAIN_URL,
  TERRAIN_MASK,
  TERRAIN_MASK_SWAMP,
  TERRAIN_MASK_WALL,
} from '@/utils/constants';
import { getPointForTile } from '@/utils/helpers';
import { ScreepsGameRoomTerrain, TerrainTile } from '@/types';
import { useSettings } from '@/stores/Settings';
import { useGameObjectStore } from '@/stores/useGameObjectsStore';
import { useTerrainStore } from '@/stores/useTerrainStore';
import StyledDialog from '../dialog/StyledDialog';
import DialogTitle from '../dialog/DialogTitle';

export default function ImportRoom() {
  const { palette } = Mui.useTheme();

  const shard = useSettings((state) => state.settings.shard);
  const room = useSettings((state) => state.settings.room);
  const setShard = useSettings((state) => state.setShard);
  const setRoom = useSettings((state) => state.setRoom);
  const resetObjects = useGameObjectStore((state) => state.reset);
  const setTerrain = useTerrainStore((state) => state.setTerrain);

  const [wipeStructuresChecked, setWipeStructuresChecked] = useState(true);
  const [modalOpen, setOpen] = useState(false);
  const [formError, setFormError] = useState<Error | null>(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleImportRoom = async () => {
    setFormError(null);

    if (!room.length) {
      setFormError(new Error('Room is required'));
      return;
    }

    if (!shard.length) {
      setFormError(new Error('Shard is required'));
      return;
    }

    // The Screeps API sends permissive CORS headers, so this is called directly from the browser --
    // there is no proxy to translate a transport failure into a message, hence the try/catch.
    let data: ScreepsGameRoomTerrain & { error?: string };
    try {
      const response = await fetch(
        `${SCREEPS_ROOM_TERRAIN_URL}?encoded=1&room=${encodeURIComponent(room)}&shard=${encodeURIComponent(shard)}`
      );
      data = await response.json();
    } catch (error) {
      setFormError(new Error('Could not reach the Screeps API', { cause: error }));
      return;
    }

    if (data.error) {
      setFormError(new Error(data.error));
      return;
    }

    if (data.ok) {
      if (wipeStructuresChecked) {
        resetObjects();
      }

      // The API returns one terrain-mask digit per tile in row-major order. Skipping plains yields
      // exactly the sparse array the renderer wants, so it replaces the store in a single write.
      const bytes = data.terrain[0].terrain;
      const tiles: TerrainTile[] = [];
      for (let tile = 0; tile < bytes.length; tile++) {
        const mask = +bytes[tile];
        if (mask === TERRAIN_MASK_WALL || mask === TERRAIN_MASK_SWAMP) {
          tiles.push({ room: ROOM_NAME, ...getPointForTile(tile), type: TERRAIN_MASK[mask] });
        }
      }
      setTerrain(tiles);
    }

    handleClose();
  };

  return (
    <>
      <Mui.Button onClick={handleOpen} variant='outlined' startIcon={<Icons.CloudDownload />}>
        Import Room
      </Mui.Button>
      <StyledDialog fullWidth maxWidth='sm' open={modalOpen} onClose={handleClose}>
        <DialogTitle onClose={handleClose}>Import Room</DialogTitle>
        <Mui.DialogContent dividers sx={{ backgroundColor: palette.divider }}>
          <Mui.FormLabel component='div' sx={{ mb: 2 }}>
            Import room objects from Screeps World.
          </Mui.FormLabel>
          <Mui.Grid container rowSpacing={2} columnSpacing={2}>
            <Mui.Grid size={6}>
              <Mui.FormControl variant='outlined' fullWidth>
                <Mui.TextField
                  label='Shard'
                  defaultValue={shard}
                  onChange={(e) => {
                    setFormError(null);
                    setShard(e.target.value);
                  }}
                />
              </Mui.FormControl>
            </Mui.Grid>
            <Mui.Grid size={6}>
              <Mui.FormControl variant='outlined' fullWidth>
                <Mui.TextField
                  label='Room'
                  defaultValue={room}
                  onChange={(e) => {
                    setFormError(null);
                    setRoom(e.target.value);
                  }}
                />
              </Mui.FormControl>
            </Mui.Grid>
          </Mui.Grid>
          {formError && (
            <Mui.Box sx={{ backgroundColor: palette.divider, mt: 2 }}>
              <Mui.Alert color='error' variant='outlined' sx={{ px: 1, py: 0 }}>
                {formError.message}
              </Mui.Alert>
            </Mui.Box>
          )}
        </Mui.DialogContent>
        <Mui.DialogActions sx={{ backgroundColor: palette.divider, justifyContent: 'space-between' }}>
          <Mui.FormControlLabel
            label='Wipe Structures'
            control={
              <Mui.Checkbox
                defaultChecked={wipeStructuresChecked}
                onChange={(e) => setWipeStructuresChecked(e.target.checked)}
              />
            }
          />
          <Mui.Button variant='contained' onClick={handleImportRoom} startIcon={<Icons.CloudDownload />}>
            Import Room
          </Mui.Button>
        </Mui.DialogActions>
      </StyledDialog>
    </>
  );
}
