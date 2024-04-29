import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';
import axios from 'axios';
import { useState } from 'react';
import { ROOM_SIZE, TERRAIN_MASK, TERRAIN_MASK_SWAMP, TERRAIN_MASK_WALL } from '@/utils/constants';
import { getTile } from '@/utils/helpers';
import { ScreepsGameRoomTerrain } from '@/types';
import { useSettings } from '@/stores/Settings';
import { useTileTerrain } from '@/stores/TileTerrain';
import StyledDialog from '../../dialog/StyledDialog';
import { useTileStructures } from '@/stores/TileStructures';
import { useStructurePositions } from '@/stores/StructurePositions';
import DialogTitle from '../../dialog/DialogTitle';

export default function ImportRoom() {
  const { palette } = Mui.useTheme();

  const shard = useSettings((state) => state.settings.shard);
  const room = useSettings((state) => state.settings.room);
  const setShard = useSettings((state) => state.setShard);
  const setRoom = useSettings((state) => state.setRoom);
  const resetTileStructures = useTileStructures((state) => state.reset);
  const resetStructurePositions = useStructurePositions((state) => state.reset);
  const resetTileTerrain = useTileTerrain((state) => state.reset);
  const setTileTerrain = useTileTerrain((state) => state.setTileTerrain);

  const [wipeStructuresChecked, setWipeStructuresChecked] = useState(true);
  const [modalOpen, setOpen] = useState(false);
  const [formError, setFormError] = useState<Error | null>(null);
  const roomTiles = Array.from(Array(ROOM_SIZE));

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Mui.Button onMouseDown={handleOpen} variant='outlined' endIcon={<Icons.DownloadForOfflineOutlined />}>
        Import Room
      </Mui.Button>
      <StyledDialog fullWidth maxWidth='sm' open={modalOpen} onClose={handleClose}>
        <DialogTitle onClose={handleClose}>Import Room</DialogTitle>
        <Mui.DialogContent dividers sx={{ backgroundColor: palette.divider }}>
          <Mui.FormLabel component='div' sx={{ mb: 2 }}>
            Import room objects from Screeps World.
          </Mui.FormLabel>
          <Mui.Grid container rowSpacing={2} columnSpacing={2}>
            <Mui.Grid item xs={6}>
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
            <Mui.Grid item xs={6}>
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
          <Mui.Button
            variant='outlined'
            onMouseDown={() => {
              setFormError(null);

              if (!room.length) {
                setFormError(new Error('Room is required'));
                return;
              }

              if (!shard.length) {
                setFormError(new Error('Shard is required'));
                return;
              }

              axios
                .get(`https://screeps.com/api/game/room-terrain?encoded=1&room=${room}&shard=${shard}`)
                .then(({ data }: { data: ScreepsGameRoomTerrain }) => {
                  if (data.ok) {
                    if (wipeStructuresChecked) {
                      resetTileStructures();
                      resetStructurePositions();
                    }
                    resetTileTerrain();
                    const bytes = Array.from(data.terrain[0].terrain);
                    if (bytes.length) {
                      roomTiles.forEach((_, y) => {
                        roomTiles.forEach((_, x) => {
                          const terrain = +bytes.shift()!;
                          if (terrain === TERRAIN_MASK_WALL || terrain === TERRAIN_MASK_SWAMP) {
                            const tile = getTile(x, y);
                            setTileTerrain(tile, TERRAIN_MASK[terrain]);
                          }
                        });
                      });
                    }
                  }
                  handleClose();
                })
                .catch(setFormError);
            }}
          >
            Import Room
          </Mui.Button>
        </Mui.DialogActions>
      </StyledDialog>
    </>
  );
}
