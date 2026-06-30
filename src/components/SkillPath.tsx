import type { Topic, TopicProgress } from '../types';
import { MAX_TIER } from '../types';

const UNLOCK_TIER = 3;

type SkillPathProps = {
  topics: Topic[];
  progress: Record<string, TopicProgress>;
  onSelect: (topicId: string) => void;
};

function isUnlocked(topics: Topic[], progress: Record<string, TopicProgress>, index: number): boolean {
  if (index === 0) return true;
  const prev = progress[topics[index - 1].id];
  return !!prev && (prev.mastered || prev.tier >= UNLOCK_TIER);
}

export default function SkillPath({ topics, progress, onSelect }: SkillPathProps) {
  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      {topics.map((topic, i) => {
        const p = progress[topic.id];
        const unlocked = isUnlocked(topics, progress, i);
        const align = i % 2 === 0 ? 'self-start' : 'self-end';

        return (
          <div key={topic.id} className={`${align} flex w-[80%] flex-col gap-2`}>
            <button
              type="button"
              disabled={!unlocked}
              onClick={() => onSelect(topic.id)}
              className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                unlocked
                  ? 'border-nebula-500/40 bg-white/5 hover:-translate-y-0.5 hover:bg-white/10'
                  : 'border-white/5 bg-white/[0.03] opacity-50 cursor-not-allowed'
              }`}
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${
                  p?.mastered
                    ? 'border-comet-400 text-comet-400'
                    : p
                    ? 'border-star-400 text-star-400'
                    : 'border-white/20 text-white/30'
                }`}
              >
                {!unlocked ? '🔒' : p?.mastered ? '★' : p ? `${p.tier}/${MAX_TIER}` : '·'}
              </div>
              <div>
                <h3 className="font-semibold text-white">{topic.name}</h3>
                <p className="text-xs text-white/50">{topic.description}</p>
                {p && (
                  <p className="mt-1 text-xs text-star-400">
                    {p.mastered ? 'Mastered' : `Tier ${p.tier} · ${p.xp} XP`}
                  </p>
                )}
              </div>
            </button>
            {topic.resources && topic.resources.length > 0 && (
              <div className="flex flex-wrap gap-2 px-2">
                {topic.resources.map((resource) => (
                  <a
                    key={resource.url}
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/60 transition-colors hover:border-comet-400/50 hover:text-comet-300"
                  >
                    {resource.label} ↗
                  </a>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
