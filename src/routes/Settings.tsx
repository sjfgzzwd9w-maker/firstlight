import Mascot from '../components/Mascot';
import { useProfile } from '../context/ProfileContext';
import { isWebGPUAvailable } from '../lib/webllm/client';
import type { ModelSize } from '../types';

const MODEL_OPTIONS: { id: ModelSize; label: string; description: string }[] = [
  { id: '1b', label: 'Fast (1B)', description: '~0.9GB download · works on most devices' },
  { id: '3b', label: 'Smarter (3B)', description: '~2.2GB download · better explanations, needs a stronger device' },
];

export default function Settings() {
  const { profile, updateAge, setVoiceEnabled, setModelSize } = useProfile();
  const webGPU = isWebGPUAvailable();

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-10 max-w-md mx-auto w-full text-center">
      <Mascot mood="thinking" />
      <h1 className="mt-6 text-2xl font-extrabold text-white">Settings</h1>

      <section className="mt-8 w-full text-left">
        <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wide">Age</h2>
        <div className="mt-3 flex items-center justify-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <button
            type="button"
            onClick={() => updateAge(Math.max(5, (profile.age ?? 10) - 1))}
            className="h-10 w-10 rounded-full bg-white/10 text-xl text-white hover:bg-white/20"
            aria-label="Decrease age"
          >
            −
          </button>
          <span className="text-2xl font-bold text-star-400 w-12">{profile.age ?? '—'}</span>
          <button
            type="button"
            onClick={() => updateAge(Math.min(18, (profile.age ?? 10) + 1))}
            className="h-10 w-10 rounded-full bg-white/10 text-xl text-white hover:bg-white/20"
            aria-label="Increase age"
          >
            +
          </button>
        </div>
        <p className="mt-2 text-xs text-white/40">Used to tailor explanations and mascot tone.</p>
      </section>

      <section className="mt-6 w-full text-left">
        <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wide">Voice</h2>
        <button
          type="button"
          onClick={() => setVoiceEnabled(!profile.voiceEnabled)}
          className="mt-3 flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 text-white"
        >
          <span>Read questions &amp; feedback aloud</span>
          <span className="text-2xl">{profile.voiceEnabled ? '🔊' : '🔇'}</span>
        </button>
      </section>

      <section className="mt-6 w-full text-left">
        <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wide">AI Tutor Model</h2>
        {!webGPU && (
          <p className="mt-2 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-xs text-yellow-300">
            Your browser doesn't support WebGPU, so AI-generated questions and explanations are
            unavailable. The app still works fully using the built-in question bank.
          </p>
        )}
        <div className="mt-3 flex flex-col gap-2">
          {MODEL_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              disabled={!webGPU}
              onClick={() => setModelSize(opt.id)}
              className={`rounded-2xl border p-4 text-left transition-colors ${
                profile.modelSize === opt.id
                  ? 'border-nebula-500 bg-nebula-500/15'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              } ${!webGPU ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <div className="font-semibold text-white">{opt.label}</div>
              <div className="text-xs text-white/50">{opt.description}</div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
