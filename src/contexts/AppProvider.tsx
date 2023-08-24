import { PropsWithChildren } from 'react';

import { SettingsProvider } from './SettingsContext';

export const AppProvider = ({ children }: PropsWithChildren) => {
  return <SettingsProvider>{children}</SettingsProvider>;
};
