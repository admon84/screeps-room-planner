import * as Icons from '@mui/icons-material';
import { MAX_RCL, EXAMPLE_BUNKER, EXAMPLE_BUNKER_OFFSET } from '@/utils/constants';
import { getPointForShort } from '@/utils/helpers';
import { createObjectFromType } from '@/utils/gameObjects';
import { useSettings } from '@/stores/Settings';
import { useGameObjectStore } from '@/stores/useGameObjectsStore';
import { useTerrainStore } from '@/stores/useTerrainStore';
import ActionButton from './ActionButton';

export default function LoadExampleBunker() {
  const setRCL = useSettings((state) => state.setRCL);
  const setObjects = useGameObjectStore((state) => state.setObjects);
  const resetTerrain = useTerrainStore((state) => state.reset);

  return (
    <ActionButton
      onClick={() => {
        resetTerrain();
        setRCL(MAX_RCL);
        setObjects(
          Object.entries(EXAMPLE_BUNKER.structures).flatMap(([type, positions]) =>
            positions.map((shortPoint) => {
              const { x, y } = getPointForShort(shortPoint);
              return createObjectFromType({ type, x: x + EXAMPLE_BUNKER_OFFSET, y: y + EXAMPLE_BUNKER_OFFSET });
            })
          )
        );
      }}
      startIcon={<Icons.AutoFixHigh />}
      buttonText='Load Example Bunker'
      dialogMessage='Do you want to clear all structures and load the example bunker?'
    />
  );
}
