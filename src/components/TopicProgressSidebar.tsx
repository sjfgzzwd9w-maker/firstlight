import type { Topic, TopicProgress } from '../types';
import { MAX_TIER } from '../types';

type TopicProgressSidebarProps = {
  title: string;
  topics: Topic[];
  progress: Record<string, TopicProgress>;
};

/** Shows every topic for a subject with a progress bar — covered, in progress, and still locked. */
export default function TopicProgressSidebar({ title, topics, progress }: TopicProgressSidebarProps) {
  const masteredCount = topics.filter((t) => progress[t.id]?.mastered).length;

  return (
    <aside className="w-full lg:w-72 shrink-0 rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-white/50">{title}</h2>
      <p className="mt-1 text-xs text-white/40">
        {masteredCount} / {topics.length} topics mastered
      </p>
      <ul className="mt-3 flex flex-col gap-3">
        {topics.map((topic) => {
          const p = progress[topic.id];
          const started = !!p && (p.answeredIds.length > 0 || p.tier > 1 || p.mastered);
          const pct = p?.mastered ? 100 : started ? Math.round(((p!.tier - 1) / MAX_TIER) * 100) : 0;
          const status = p?.mastered ? '★ Mastered' : started ? `Tier ${p!.tier}/${MAX_TIER}` : 'Not started';

          return (
            <li key={topic.id}>
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-medium text-white">{topic.name}</span>
                <span className={`shrink-0 ${p?.mastered ? 'text-star-400' : 'text-white/40'}`}>{status}</span>
              </div>
              <div className="mt-1 h-1.5 w-full rounded-full bg-white/10">
                <div
                  className="h-1.5 rounded-full bg-gradient-to-r from-nebula-500 to-comet-400"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
