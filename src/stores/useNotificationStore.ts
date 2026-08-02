import { create } from 'zustand';

export type Severity = 'error' | 'warning' | 'info' | 'success';

export type Notification = { message: string; severity: Severity; key: number };

type State = {
  notification: Notification | null;
  notify: (message: string, severity?: Severity) => void;
  dismiss: () => void;
};

let nextKey = 0;

/**
 * A single slot rather than a queue: a repeated message from the paint loop overwrites itself
 * instead of stacking up. `key` looks redundant next to the object identity, but the Snackbar needs
 * it as a React `key` to remount and restart its auto-hide timer on a repeat of the same message.
 */
export const useNotificationStore = create<State>((set) => ({
  notification: null,
  notify: (message, severity = 'info') => set(() => ({ notification: { message, severity, key: nextKey++ } })),
  dismiss: () => set(() => ({ notification: null })),
}));
