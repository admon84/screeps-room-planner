import { useContext, useState, createContext, PropsWithChildren } from 'react';
import { MAX_RCL } from '../utils/constants';

type State = {
  settings: {
    codeDrawerOpen: boolean;
    brush: string | null;
    rcl: number;
    room: string;
    shard: string;
  };
  setBrush: (brush: string) => void;
  setRcl: (rcl: number) => void;
  setRoom: (room: string) => void;
  setShard: (shard: string) => void;
  toggleCodeDrawer: () => void;
  resetBrush: () => void;
};

const SettingsContext = createContext<State | null>(null);

const initialState: State['settings'] = {
  codeDrawerOpen: false,
  brush: '' || null,
  rcl: MAX_RCL,
  room: 'E3S1',
  shard: 'shard0',
};

export const SettingsProvider = ({ children }: PropsWithChildren) => {
  const [settings, setSettings] = useState(initialState);

  const setBrush = (brush: string) => {
    setSettings((current) => ({ ...current, brush }));
  };

  const setRcl = (rcl: number) => {
    setSettings((current) => ({ ...current, rcl }));
  };

  const setRoom = (room: string) => {
    setSettings((current) => ({ ...current, room }));
  };

  const setShard = (shard: string) => {
    setSettings((current) => ({ ...current, shard }));
  };

  const toggleCodeDrawer = () => {
    setSettings((current) => ({ ...current, codeDrawerOpen: !current.codeDrawerOpen }));
  };

  const resetBrush = () => {
    setSettings((current) => ({ ...current, brush: null }));
  };

  return (
    <SettingsContext.Provider value={{ settings, setBrush, setRcl, setRoom, setShard, toggleCodeDrawer, resetBrush }}>
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
