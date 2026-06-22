import { useEffect, useRef, useState } from 'react';
import type { Scenario } from '../lib/scenarios';

type ScenarioCardProps = {
  scenario: Scenario;
  topicName: string;
  tier: number;
  questionIndex: number;
  onReady: () => void;
};

const AUTO_ADVANCE_S = 120; // 2 minutes — only fires if user walks away

export default function ScenarioCard({ scenario, topicName, tier, questionIndex, onReady }: ScenarioCardProps) {
  const [dismissed, setDismissed] = useState(false);
  const [minsLeft, setMinsLeft] = useState(2);
  const startRef = useRef(Date.now());

  // Auto-advance fallback — only kicks in after 2 minutes of no interaction
  useEffect(() => {
    const id = setInterval(() => {
      const elapsed = (Date.now() - startRef.current) / 1000;
      const remaining = Math.max(0, AUTO_ADVANCE_S - elapsed);
      setMinsLeft(Math.ceil(remaining / 60));
      if (remaining === 0) {
        clearInterval(id);
        if (!dismissed) onReady();
      }
    }, 5000); // check every 5s — no need for sub-second precision at this scale
    return () => clearInterval(id);
  }, [onReady, dismissed]);

  const handleReady = () => {
    setDismissed(true);
    onReady();
  };

  const tierLabel =
    tier <= 1 ? 'Beginner Challenge'
    : tier <= 2 ? 'Intermediate Challenge'
    : tier <= 3 ? 'Advanced Challenge'
    : tier <= 4 ? 'Expert Challenge'
    : 'Mastery Challenge';

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 w-full max-w-xl mx-auto animate-pop">
      {/* Question counter */}
      <p className="text-xs font-semibold uppercase tracking-widest text-deep-text/30 mb-8">
        Question {questionIndex + 1} · {topicName} · {tierLabel}
      </p>

      {/* Emoji — animated */}
      <div className="text-7xl mb-6 animate-bounce-slow select-none" aria-hidden>
        {scenario.emoji}
      </div>

      {/* Headline */}
      <h2 className="text-2xl font-extrabold text-deep-text text-center leading-tight mb-4">
        {scenario.headline}
      </h2>

      {/* Context */}
      <p className="text-base text-deep-text/60 text-center leading-relaxed max-w-sm">
        {scenario.context}
      </p>

      {/* Divider */}
      <div className="mt-8 w-full max-w-xs flex items-center gap-3">
        <div className="flex-1 h-px bg-deep-700" />
        <span className="text-xs text-deep-text/30 uppercase tracking-wide">your challenge</span>
        <div className="flex-1 h-px bg-deep-700" />
      </div>

      {/* Primary CTA — user must tap this to continue */}
      <button
        type="button"
        onClick={handleReady}
        className="mt-8 flex items-center gap-3 rounded-full bg-sage-500 px-8 py-3.5 font-semibold text-white transition-all hover:bg-sage-400 hover:scale-105 active:scale-95"
      >
        <span>Accept the challenge</span>
        <span className="text-lg">→</span>
      </button>

      {/* Unobtrusive fallback note — no progress bar, no urgency */}
      <p className="mt-5 text-[10px] text-deep-text/20">
        Auto-continues in {minsLeft} min if you step away
      </p>
    </div>
  );
}
