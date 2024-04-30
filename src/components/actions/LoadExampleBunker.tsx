import * as Icons from '@mui/icons-material';
import { MAX_RCL, EXAMPLE_BUNKER } from '@/utils/constants';
import { getTileForShort } from '@/utils/helpers';
import { useSettings } from '@/stores/Settings';
import { useTileStructures } from '@/stores/TileStructures';
import { useStructurePositions } from '@/stores/StructurePositions';
import { useTileTerrain } from '@/stores/TileTerrain';
import ActionButton from './ActionButton';

export default function LoadExampleBunker() {
  const setRCL = useSettings((state) => state.setRCL);
  const addTileStructure = useTileStructures((state) => state.addStructure);
  const resetTileStructures = useTileStructures((state) => state.reset);
  const resetStructurePositions = useStructurePositions((state) => state.reset);
  const addStructurePosition = useStructurePositions((state) => state.addStructure);
  const resetTileTerrain = useTileTerrain((state) => state.reset);

  return (
    <ActionButton
      onClick={() => {
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
      }}
      startIcon={<Icons.AutoFixHigh />}
      buttonText='Load Example Bunker'
      dialogMessage='Do you want to clear all structures and load the example bunker?'
    />
  );
}
