import { PropsWithChildren } from 'react';

import { SettingsProvider } from './SettingsContext';
import { TileStructureProvider } from './TileStructureContext';
import { StructurePositionsProvider } from './StructurePositionsContext';
import { TileTerrainProvider } from './TileTerrainContext';

export const AppProvider = ({ children }: PropsWithChildren) => {
  return (
    <SettingsProvider>
      <TileStructureProvider>
        <StructurePositionsProvider>
          <TileTerrainProvider>{children}</TileTerrainProvider>
        </StructurePositionsProvider>
      </TileStructureProvider>
    </SettingsProvider>
  );
};
