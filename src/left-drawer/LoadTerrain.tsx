import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';
import axios from 'axios';
import { useState } from 'react';
import { ROOM_SIZE, TERRAIN_MASK, TERRAIN_MASK_SWAMP, TERRAIN_MASK_WALL } from '../utils/constants';
import { getTile } from '../utils/helpers';
import { ScreepsGameRoomTerrain } from '../utils/types';
import { useSettings } from '../state/Settings';
import { useTileTerrain } from '../state/TileTerrain';
import StyledDialog from '../common/StyledDialog';
import { useTileStructures } from '../state/TileStructures';
import { useStructurePositions } from '../state/StructurePositions';
import DialogTitle from '../common/DialogTitle';

export default function LoadTerrain(props: { toggleModalOpen: () => void }) {
  const { palette } = Mui.useTheme();

  const shard = useSettings((state) => state.shard);
  const room = useSettings((state) => state.room);
  const setShard = useSettings((state) => state.setShard);
  const setRoom = useSettings((state) => state.setRoom);
  const resetTileStructures = useTileStructures((state) => state.reset);
  const resetStructurePositions = useStructurePositions((state) => state.reset);
  const resetTileTerrain = useTileTerrain((state) => state.reset);
  const setTileTerrain = useTileTerrain((state) => state.setTileTerrain);

  const [wipeStructuresChecked, setWipeStructuresChecked] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formError, setFormError] = useState<Error | null>(null);
  const roomTiles = Array.from(Array(ROOM_SIZE));

  const toggleModalOpen = () => setModalOpen(!modalOpen);

  return (
    <>
      <Mui.Button onMouseDown={toggleModalOpen} variant='outlined' endIcon={<Icons.DownloadForOfflineOutlined />}>
        Load Terrain
      </Mui.Button>
      <StyledDialog open={modalOpen} onClose={toggleModalOpen}>
        <DialogTitle onClose={toggleModalOpen}>Load Terrain</DialogTitle>
        <Mui.DialogContent dividers sx={{ backgroundColor: palette.divider }}>
          <Mui.FormLabel component='div' sx={{ mb: 2 }}>
            Import a room from Screeps: World
          </Mui.FormLabel>
          <Mui.Grid container rowSpacing={2} columnSpacing={2}>
            <Mui.Grid item xs={6}>
              <Mui.FormControl variant='outlined'>
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
              <Mui.FormControl variant='outlined'>
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
                  props.toggleModalOpen();
                  toggleModalOpen();
                })
                .catch(setFormError);
            }}
          >
            Load Terrain
          </Mui.Button>
        </Mui.DialogActions>
      </StyledDialog>
    </>
  );
}
