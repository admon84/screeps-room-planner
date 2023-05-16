import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';
import { MAX_RCL, SAMPLE_JSON } from '../utils/constants';
import { getRoomTile } from '../utils/helpers';
import { useSettings } from '../contexts/SettingsContext';
import { useTileStructures } from '../contexts/TileStructuresContext';
import { useStructurePositions } from '../contexts/StructurePositionsContext';
import { useTileTerrain } from '../contexts/TileTerrainContext';

export default function ExampleBunker(props: { toggleModalOpen: () => void }) {
  const { updateSettings } = useSettings();
  const { updateTileStructures } = useTileStructures();
  const { updateStructurePositions } = useStructurePositions();
  const { updateTileTerrain } = useTileTerrain();

  return (
    <Mui.Button
      onMouseDown={() => {
        updateTileStructures({ type: 'reset' });
        updateStructurePositions({ type: 'reset' });
        updateTileTerrain({ type: 'reset' });
        updateSettings({ type: 'set_rcl', rcl: MAX_RCL });

        Object.entries(SAMPLE_JSON.structures).forEach(([structure, positions]) => {
          positions.forEach((pos) => {
            const tile = getRoomTile(pos.x, pos.y);
            updateTileStructures({ type: 'add_structure', tile, structure });
            updateStructurePositions({ type: 'add_structure', structure, position: pos });
          });
        });
        props.toggleModalOpen();
      }}
      variant='outlined'
      endIcon={<Icons.AutoFixHigh />}
    >
      Load Example Bunker
    </Mui.Button>
  );
}
