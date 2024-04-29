import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';
import { getTileForShort } from '@/utils/helpers';
import { RoomStructuresJson } from '@/types';
import { useTileTerrain } from '@/stores/TileTerrain';
import { useState } from 'react';
import StyledDialog from '../../dialog/StyledDialog';
import { useTileStructures } from '@/stores/TileStructures';
import { useStructurePositions } from '@/stores/StructurePositions';
import DialogTitle from '../../dialog/DialogTitle';
import { useTheme } from '@mui/material';

export default function ImportJsonStructures() {
  const { palette } = useTheme();

  const addTileStructure = useTileStructures((state) => state.addStructure);
  const resetTileStructures = useTileStructures((state) => state.reset);
  const resetStructurePositions = useStructurePositions((state) => state.reset);
  const addStructurePosition = useStructurePositions((state) => state.addStructure);
  const resetTileTerrain = useTileTerrain((state) => state.reset);

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

  return (
    <>
      <Mui.Button onMouseDown={handleOpen} variant='outlined' endIcon={<Icons.SourceOutlined />}>
        Load Structures
      </Mui.Button>
      <StyledDialog fullWidth maxWidth='sm' open={modalOpen} onClose={handleClose}>
        <DialogTitle onClose={handleClose}>Load Structures</DialogTitle>
        <Mui.DialogContent dividers sx={{ backgroundColor: palette.divider }}>
          <Mui.FormLabel component='div' sx={{ mb: 2 }}>
            Import room structures from JSON
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
              placeholder='{"rcl":8,"structures":{"spawn":[{"x":0,"y":0}]}}'
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
          <Mui.Button
            variant='outlined'
            onMouseDown={() => {
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

              if (wipeTerrainChecked) {
                resetTileTerrain();
              }
              resetTileStructures();
              resetStructurePositions();

              Object.entries(json.structures).forEach(([structure, positions]) => {
                positions.forEach((shortPoint) => {
                  const tile = getTileForShort(shortPoint);
                  addTileStructure(tile, structure);
                  addStructurePosition(structure, shortPoint);
                });
              });

              handleClose();
            }}
          >
            Load Terrain
          </Mui.Button>
        </Mui.DialogActions>
      </StyledDialog>
    </>
  );
}
