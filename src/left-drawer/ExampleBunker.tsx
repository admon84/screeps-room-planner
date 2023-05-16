import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';
import { MAX_RCL, SAMPLE_JSON } from '../utils/constants';
import { getRoomTile } from '../utils/helpers';
import { useSettings } from '../contexts/SettingsContext';
import { useTileStructure } from '../contexts/TileStructureContext';
import { useStructurePositions } from '../contexts/StructurePositionsContext';
import { useTileTerrain } from '../contexts/TileTerrainContext';

export default function ExampleBunker(props: { toggleModalOpen: () => void }) {
  const { setRcl } = useSettings();
  const { addTileStructure, resetTileStructures } = useTileStructure();
  const { addStructurePosition, resetStructurePositions } = useStructurePositions();
  const { resetTileTerrain } = useTileTerrain();

  return (
    <Mui.Button
      onMouseDown={() => {
        resetTileStructures();
        resetStructurePositions();
        resetTileTerrain();
        setRcl(MAX_RCL);

        Object.entries(SAMPLE_JSON.structures).forEach(([structure, positions]) => {
          positions.forEach((pos) => {
            const tile = getRoomTile(pos.x, pos.y);
            addTileStructure(tile, structure);
            addStructurePosition(structure, pos);
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
