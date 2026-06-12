import { useSyncExternalStore } from 'react';
import { useRole } from './useRole';

// Founder God Mode — a founder-controlled master switch.
// ON  → all courses/modules/quizzes/simulations/certifications/AI-mentor/premium unlocked.
// OFF → the founder sees the REAL student experience (gates + paywall apply).
// Persisted in localStorage; synced across components + tabs.
const KEY = 'aladiah-founder-mode';
const listeners = new Set<() => void>();

const readRaw = (): boolean => {
  try { return (localStorage.getItem(KEY) ?? 'on') !== 'off'; } catch { return true; }
};
const emit = () => listeners.forEach((l) => l());

/** Fresh, non-reactive read (for use inside async callbacks). */
export const founderModeOn = (): boolean => readRaw();

export function setFounderMode(on: boolean) {
  try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch { /* ignore */ }
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener('storage', cb);
  return () => { listeners.delete(cb); window.removeEventListener('storage', cb); };
}

/**
 * Founder God Mode state. `godMode` is only ever true for the founder.
 * Non-founders always get { godMode: false }.
 */
export function useFounderMode() {
  const { isFounder } = useRole();
  const enabled = useSyncExternalStore(subscribe, readRaw, () => true);
  return {
    isFounder,
    enabled,                       // raw toggle state (founder's preference)
    godMode: isFounder && enabled, // effective: unlock everything
    toggle: () => setFounderMode(!readRaw()),
    setOn: (on: boolean) => setFounderMode(on),
  };
}
