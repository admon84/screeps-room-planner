import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';
import { getTileForShort } from '../utils/helpers';
import { RoomStructuresJson } from '../utils/types';
import { useTileTerrain } from '../state/TileTerrain';
import { useState } from 'react';
import StyledDialog from '../common/StyledDialog';
import { useTileStructures } from '../state/TileStructures';
import { useStructurePositions } from '../state/StructurePositions';
import DialogTitle from '../common/DialogTitle';
import { useTheme } from '@mui/material';

export default function LoadStructuresJson(props: { toggleModalOpen: () => void }) {
  const { palette } = useTheme();

  const addTileStructure = useTileStructures((state) => state.addStructure);
  const resetTileStructures = useTileStructures((state) => state.reset);
  const resetStructurePositions = useStructurePositions((state) => state.reset);
  const addStructurePosition = useStructurePositions((state) => state.addStructure);
  const resetTileTerrain = useTileTerrain((state) => state.reset);

  const [wipeTerrainChecked, setWipeTerrainChecked] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [userJson, setUserJson] = useState<string | null>(null);

  const toggleModalOpen = () => setModalOpen(!modalOpen);

  return (
    <>
      <Mui.Button onMouseDown={toggleModalOpen} variant='outlined' endIcon={<Icons.SourceOutlined />}>
        Load Structures
      </Mui.Button>
      <StyledDialog open={modalOpen} onClose={toggleModalOpen}>
        <DialogTitle onClose={toggleModalOpen}>Load Structures</DialogTitle>
        <Mui.DialogContent dividers sx={{ backgroundColor: palette.divider }}>
          <Mui.FormLabel component='div' sx={{ mb: 2 }}>
            Import room structures from JSON
          </Mui.FormLabel>
          <Mui.FormControl variant='outlined'>
            <Mui.TextField
              error={!!formError}
              defaultValue={userJson}
              fullWidth
              label='JSON'
              maxRows={16}
              minRows={4}
              multiline
              onChange={(e) => {
                setFormError(null);
                setUserJson(e.target.value);
              }}
              placeholder='{"rcl":8,"structures":{"spawn":[{"x":0,"y":0}]}}'
              sx={{ width: '100%', minWidth: '400px' }}
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

              props.toggleModalOpen();
              toggleModalOpen();
            }}
          >
            Load Terrain
          </Mui.Button>
        </Mui.DialogActions>
      </StyledDialog>
    </>
  );
}
