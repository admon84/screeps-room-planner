import { PropsWithChildren } from 'react';

import { SettingsProvider } from './SettingsContext';
import { RoomGridProvider } from './RoomGridContext';
import { RoomStructuresProvider } from './RoomStructuresContext';
import { RoomTerrainProvider } from './RoomTerrainContext';

export const AppProvider = ({ children }: PropsWithChildren) => {
  return (
    <SettingsProvider>
      <RoomGridProvider>
        <RoomStructuresProvider>
          <RoomTerrainProvider>{children}</RoomTerrainProvider>
        </RoomStructuresProvider>
      </RoomGridProvider>
    </SettingsProvider>
  );
};
