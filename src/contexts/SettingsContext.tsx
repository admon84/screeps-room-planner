import { useContext, useState, createContext, PropsWithChildren, useMemo } from 'react';
import { MAX_RCL } from '../utils/constants';

type State = {
  codeDrawerOpen: boolean;
  brush: string | null;
  rcl: number;
  room: string;
  shard: string;
};

type Context = {
  settings: State;
  setBrush: (brush: string) => void;
  setRcl: (rcl: number) => void;
  setRoom: (room: string) => void;
  setShard: (shard: string) => void;
  toggleCodeDrawer: () => void;
  resetBrush: () => void;
};

const SettingsContext = createContext<Context | null>(null);

const initialState: State = {
  codeDrawerOpen: false,
  brush: null,
  rcl: MAX_RCL,
  room: 'E3S1',
  shard: 'shard0',
};

export const SettingsProvider = ({ children }: PropsWithChildren) => {
  const [settings, setSettings] = useState(initialState);

  const value = useMemo(() => {
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

    return { settings, setBrush, setRcl, setRoom, setShard, toggleCodeDrawer, resetBrush };
  }, [settings]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
