import { useState } from 'react';
import Mascot from './Mascot';

type AgeGateProps = {
  onSubmit: (age: number) => void;
};

export default function AgeGate({ onSubmit }: AgeGateProps) {
  const [age, setAge] = useState<number>(10);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-space-950/80 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm rounded-3xl border border-nebula-500/30 bg-space-900 p-6 text-center shadow-2xl animate-pop">
        <Mascot mood="excited" />
        <h2 className="mt-4 text-xl font-bold text-white">Welcome to Stardance Learn!</h2>
        <p className="mt-2 text-sm text-white/60">
          How old are you? This helps Cosmo pick the right starting point and explain things just for you.
        </p>
        <div className="mt-5 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setAge((a) => Math.max(5, a - 1))}
            className="h-10 w-10 rounded-full bg-white/10 text-xl text-white hover:bg-white/20"
            aria-label="Decrease age"
          >
            −
          </button>
          <span className="text-3xl font-bold text-star-400 w-16">{age}</span>
          <button
            type="button"
            onClick={() => setAge((a) => Math.min(18, a + 1))}
            className="h-10 w-10 rounded-full bg-white/10 text-xl text-white hover:bg-white/20"
            aria-label="Increase age"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={() => onSubmit(age)}
          className="mt-6 w-full rounded-full bg-nebula-500 py-3 font-semibold text-white hover:bg-nebula-400 transition-colors"
        >
          Let's go!
        </button>
      </div>
    </div>
  );
}
