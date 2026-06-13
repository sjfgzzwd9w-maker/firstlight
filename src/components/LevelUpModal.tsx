type LevelUpModalProps = {
  kind: 'levelUp' | 'levelDown' | 'mastered';
  topicName: string;
  tier: number;
  onContinue: () => void;
};

const COPY: Record<LevelUpModalProps['kind'], { title: string; emoji: string; accent: string }> = {
  levelUp: { title: 'Level up!', emoji: '🎉', accent: 'text-star-400' },
  levelDown: { title: "Let's practice a bit more", emoji: '💪', accent: 'text-comet-400' },
  mastered: { title: 'Topic mastered!', emoji: '🌟', accent: 'text-star-400' },
};

export default function LevelUpModal({ kind, topicName, tier, onContinue }: LevelUpModalProps) {
  const copy = COPY[kind];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-space-950/80 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm rounded-3xl border border-nebula-500/30 bg-space-900 p-6 text-center shadow-2xl animate-pop">
        <div className="text-5xl">{copy.emoji}</div>
        <h2 className={`mt-3 text-2xl font-extrabold ${copy.accent}`}>{copy.title}</h2>
        <p className="mt-2 text-white/70">
          {kind === 'mastered'
            ? `You've mastered ${topicName}!`
            : kind === 'levelUp'
              ? `${topicName} is now at tier ${tier} of 5.`
              : `${topicName} is back to tier ${tier} of 5 — you'll get it!`}
        </p>
        <button
          type="button"
          onClick={onContinue}
          className="mt-6 w-full rounded-full bg-nebula-500 py-3 font-semibold text-white hover:bg-nebula-400 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
