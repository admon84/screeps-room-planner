import { create } from 'zustand';

type State = {
  shortcutsOpen: boolean;
  setShortcutsOpen: (open: boolean) => void;
};

/**
 * Lets the window keydown listener in `useCameraControls` open the shortcuts dialog without the
 * hook and the dialog needing a shared parent to prop-drill through.
 */
export const useUiStore = create<State>((set) => ({
  shortcutsOpen: false,
  setShortcutsOpen: (open) => set(() => ({ shortcutsOpen: open })),
}));
