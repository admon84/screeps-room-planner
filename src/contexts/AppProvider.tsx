import { PropsWithChildren } from 'react';

import { SettingsProvider } from './SettingsContext';
import { TileStructuresProvider } from './TileStructuresContext';
import { StructurePositionsProvider } from './StructurePositionsContext';
import { TileTerrainProvider } from './TileTerrainContext';

export const AppProvider = ({ children }: PropsWithChildren) => {
  return (
    <SettingsProvider>
      <TileStructuresProvider>
        <StructurePositionsProvider>
          <TileTerrainProvider>{children}</TileTerrainProvider>
        </StructurePositionsProvider>
      </TileStructuresProvider>
    </SettingsProvider>
  );
};
