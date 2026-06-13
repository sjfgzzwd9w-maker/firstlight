export type MascotMood = 'happy' | 'excited' | 'thinking' | 'encouraging';

const MOOD_EYES: Record<MascotMood, ReactSvgEyes> = {
  happy: { left: 'M 36 46 a 4 4 0 0 0 8 0', right: 'M 56 46 a 4 4 0 0 0 8 0' },
  excited: { left: 'M 33 42 l 10 8 l -10 8', right: 'M 67 42 l -10 8 l 10 8' },
  thinking: { left: 'M 34 46 h 8', right: 'M 58 46 h 8' },
  encouraging: { left: 'M 36 50 a 4 4 0 0 1 8 0', right: 'M 56 50 a 4 4 0 0 1 8 0' },
};

type ReactSvgEyes = { left: string; right: string };

type MascotProps = {
  mood?: MascotMood;
  line?: string | null;
  className?: string;
};

export default function Mascot({ mood = 'happy', line, className = '' }: MascotProps) {
  const eyes = MOOD_EYES[mood];

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {line && (
        <div className="max-w-xs rounded-2xl bg-white/10 px-4 py-2 text-sm text-star-400 text-center shadow-lg">
          {line}
        </div>
      )}
      <svg
        viewBox="0 0 100 100"
        width="96"
        height="96"
        role="img"
        aria-label="Cosmo the mascot"
        className="drop-shadow-[0_0_18px_rgba(170,59,255,0.45)] animate-bounce-slow"
      >
        <circle cx="50" cy="50" r="42" fill="#322c63" stroke="#c084fc" strokeWidth="3" />
        <circle cx="50" cy="50" r="42" fill="url(#mascot-glow)" opacity="0.5" />
        <defs>
          <radialGradient id="mascot-glow" cx="35%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#ffe17a" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#aa3bff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d={eyes.left} stroke="#ffe17a" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d={eyes.right} stroke="#ffe17a" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M 40 64 Q 50 72 60 64" stroke="#5eead4" strokeWidth="4" strokeLinecap="round" fill="none" />
        <circle cx="22" cy="28" r="3" fill="#ffe17a" />
        <circle cx="80" cy="34" r="2" fill="#5eead4" />
        <circle cx="74" cy="74" r="2.5" fill="#c084fc" />
      </svg>
    </div>
  );
}
