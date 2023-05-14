import { PropsWithChildren } from 'react';

import { SettingsProvider } from './SettingsContext';
import { RoomGridProvider } from './RoomGridContext';
import { RoomStructuresProvider } from './RoomStructuresContext';
import { RoomTerrainProvider } from './RoomTerrainContext';
import { HoverTileProvider } from './HoverTileContext';

export const AppProvider = ({ children }: PropsWithChildren) => (
  <SettingsProvider>
    <HoverTileProvider>
      <RoomGridProvider>
        <RoomStructuresProvider>
          <RoomTerrainProvider>{children}</RoomTerrainProvider>
        </RoomStructuresProvider>
      </RoomGridProvider>
    </HoverTileProvider>
  </SettingsProvider>
);
