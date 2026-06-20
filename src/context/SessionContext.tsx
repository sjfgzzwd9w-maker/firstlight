import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

const BREAK_THRESHOLD_MS = 45 * 60 * 1000;  // 45 minutes active learning
const BREAK_DURATION_MS  =  5 * 60 * 1000;  // 5-minute mandatory break
const STORAGE_KEY = 'stardance:session:v1';

interface SessionState {
  activeMs: number;       // accumulated active-learning milliseconds
  breakUntil: number | null; // timestamp when break ends (null = not on break)
}

interface SessionContextValue {
  breakRequired: boolean;
  breakUntil: number | null;
  /** Call when the learner answers a question (tick active time). */
  tickActivity: (ms: number) => void;
  /** Call to start the mandatory break countdown. */
  startBreak: () => void;
  /** Called by PomodoroGateway when break countdown expires. */
  endBreak: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

function loadState(): SessionState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as SessionState;
  } catch { /* ignore */ }
  return { activeMs: 0, breakUntil: null };
}

function saveState(s: SessionState) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>(loadState);
  const lastTickRef = useRef<number>(Date.now());

  // Persist any state change immediately
  useEffect(() => { saveState(state); }, [state]);

  // Auto-clear expired breaks
  useEffect(() => {
    if (!state.breakUntil) return;
    const remaining = state.breakUntil - Date.now();
    if (remaining <= 0) {
      setState((s) => ({ ...s, breakUntil: null }));
      return;
    }
    const t = setTimeout(() => {
      setState((s) => ({ ...s, breakUntil: null }));
    }, remaining);
    return () => clearTimeout(t);
  }, [state.breakUntil]);

  const tickActivity = useCallback((ms: number) => {
    setState((s) => {
      if (s.breakUntil) return s; // don't accumulate during breaks
      const next = s.activeMs + ms;
      return { ...s, activeMs: next };
    });
    lastTickRef.current = Date.now();
  }, []);

  const startBreak = useCallback(() => {
    setState((s) => ({
      ...s,
      activeMs: 0, // reset the 45-min clock after break
      breakUntil: Date.now() + BREAK_DURATION_MS,
    }));
  }, []);

  const endBreak = useCallback(() => {
    setState((s) => ({ ...s, breakUntil: null }));
  }, []);

  const breakRequired = !state.breakUntil && state.activeMs >= BREAK_THRESHOLD_MS;

  return (
    <SessionContext.Provider value={{ breakRequired, breakUntil: state.breakUntil, tickActivity, startBreak, endBreak }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
