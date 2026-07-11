import { useEffect, useState } from 'react';
import { useSession } from '../context/SessionContext';

const ACTIVITIES = [
  { icon: '🚶', label: 'Take a short walk — even 2 minutes helps.' },
  { icon: '💧', label: 'Drink a full glass of water.' },
  { icon: '🙆', label: 'Stretch your arms, neck, and back.' },
  { icon: '👁️', label: 'Look at something 20 feet away for 20 seconds (20-20-20 rule).' },
  { icon: '🌬️', label: 'Take 5 deep breaths — in for 4, hold for 4, out for 4.' },
];

export default function PomodoroGateway() {
  const { breakRequired, breakUntil, startBreak, endBreak } = useSession();
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    if (breakRequired) startBreak();
  }, [breakRequired, startBreak]);

  useEffect(() => {
    if (!breakUntil) { setSecondsLeft(null); return; }
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((breakUntil - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining === 0) endBreak();
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [breakUntil, endBreak]);

  if (!breakUntil && !breakRequired) return null;

  const mins = secondsLeft !== null ? Math.floor(secondsLeft / 60) : 5;
  const secs = secondsLeft !== null ? secondsLeft % 60 : 0;
  const progress = secondsLeft !== null ? 1 - secondsLeft / (5 * 60) : 0;

  return (
    /* Action mode — warm amber overlay signals "switch from input to rest" */
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-action px-6">
      <div className="max-w-lg w-full text-center">
        {/* Header */}
        <div className="text-5xl mb-4">🧠</div>
        <h1 className="text-2xl font-extrabold text-action-200">Brain Break Time!</h1>
        <p className="mt-2 text-action-200/60 text-sm">
          You've been studying for 45 minutes. Science says a short break now
          will lock in more of what you just learned.
        </p>

        {/* Countdown ring — action amber gradient */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <div className="relative w-28 h-28">
            <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(212,134,30,0.15)" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="52"
                fill="none"
                stroke="url(#actionGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${(1 - progress) * 2 * Math.PI * 52}`}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="actionGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#d4861e" />
                  <stop offset="100%" stopColor="#e8a84c" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-action-200 tabular-nums">
                {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
              </span>
              <span className="text-xs text-action-200/40">remaining</span>
            </div>
          </div>
          <p className="text-xs text-action-200/40">Unlocks automatically when the timer ends</p>
        </div>

        <button
          type="button"
          onClick={endBreak}
          className="mt-6 text-xs text-action-200/50 underline hover:text-action-200"
        >
          Skip break
        </button>

        {/* Activity suggestions — warm-surface cards */}
        <div className="mt-8 grid grid-cols-1 gap-2 text-left">
          {ACTIVITIES.map((a) => (
            <div
              key={a.label}
              className="flex items-start gap-3 rounded-xl border border-action-500/30 bg-action-surface px-4 py-3"
            >
              <span className="text-xl">{a.icon}</span>
              <p className="text-sm text-action-200/80">{a.label}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-action-200/30">
          CogniSync · Principle 2: Make Breaks — your brain consolidates memory during rest, not during screen time.
        </p>
      </div>
    </div>
  );
}
