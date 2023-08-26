import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';
import { MAX_RCL, EXAMPLE_BUNKER } from '../utils/constants';
import { getTileForShort } from '../utils/helpers';
import { useSettings } from '../state/Settings';
import { useTileStructures } from '../state/TileStructures';
import { useStructurePositions } from '../state/StructurePositions';
import { useTileTerrain } from '../state/TileTerrain';

export default function ExampleBunker(props: { toggleModalOpen: () => void }) {
  const setRCL = useSettings((state) => state.setRCL);
  const addTileStructure = useTileStructures((state) => state.addStructure);
  const resetTileStructures = useTileStructures((state) => state.reset);
  const resetStructurePositions = useStructurePositions((state) => state.reset);
  const addStructurePosition = useStructurePositions((state) => state.addStructure);
  const resetTileTerrain = useTileTerrain((state) => state.reset);

  return (
    <Mui.Button
      onMouseDown={() => {
        resetTileStructures();
        resetStructurePositions();
        resetTileTerrain();
        setRCL(MAX_RCL);

        Object.entries(EXAMPLE_BUNKER.structures).forEach(([structure, positions]) => {
          positions.forEach((shortPoint) => {
            const tile = getTileForShort(shortPoint);
            addTileStructure(tile, structure);
            addStructurePosition(structure, shortPoint);
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
