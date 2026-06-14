import Mascot from '../components/Mascot';
import { useProfile } from '../context/ProfileContext';
import {
  MATH_TOPICS_ALL,
  BIOLOGY_TOPICS,
  CHEMISTRY_TOPICS_ALL,
  PYTHON_TOPICS_ALL,
  ROBOTICS_TOPICS_ALL,
} from '../lib/engine/topics';
import { totalXp } from '../lib/storage/progress';
import { MAX_TIER } from '../types';
import type { Topic } from '../types';

export default function Profile() {
  const { profile } = useProfile();
  const xp = totalXp(profile);

  const badges: string[] = [];
  for (const topic of [
    ...MATH_TOPICS_ALL,
    ...BIOLOGY_TOPICS,
    ...CHEMISTRY_TOPICS_ALL,
    ...PYTHON_TOPICS_ALL,
    ...ROBOTICS_TOPICS_ALL,
  ]) {
    const p = profile.topics[topic.id];
    if (!p) continue;
    if (p.mastered) badges.push(`${topic.name} Master ⭐`);
    else if (p.tier >= 3) badges.push(`${topic.name} Adept 🔹`);
  }

  const renderTopics = (topics: Topic[]) =>
    topics.map((topic) => {
      const p = profile.topics[topic.id];
      const pct = p ? Math.min(100, (p.tier / MAX_TIER) * 100) : 0;
      return (
        <div key={topic.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
          <h3 className="font-semibold text-white">{topic.name}</h3>
          <p className="mt-1 text-xs text-white/50">
            {p?.mastered ? 'Mastered' : `Tier ${p?.tier ?? 1} / ${MAX_TIER}`} · {p?.xp ?? 0} XP
          </p>
          <div className="mt-2 h-2 w-full rounded-full bg-white/10">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-nebula-500 to-comet-400"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      );
    });

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-10 max-w-2xl mx-auto w-full text-center">
      <Mascot mood="happy" />
      <h1 className="mt-6 text-2xl font-extrabold text-white">Your Progress</h1>
      <p className="mt-2 text-3xl font-bold text-star-400">{xp} XP</p>

      <h2 className="mt-8 w-full text-left text-lg font-semibold text-white">Math · Algebra 2</h2>
      <div className="mt-3 w-full grid grid-cols-1 gap-3 sm:grid-cols-2">{renderTopics(MATH_TOPICS_ALL)}</div>

      <h2 className="mt-8 w-full text-left text-lg font-semibold text-white">Biology</h2>
      <div className="mt-3 w-full grid grid-cols-1 gap-3 sm:grid-cols-2">{renderTopics(BIOLOGY_TOPICS)}</div>

      <h2 className="mt-8 w-full text-left text-lg font-semibold text-white">Chemistry</h2>
      <div className="mt-3 w-full grid grid-cols-1 gap-3 sm:grid-cols-2">{renderTopics(CHEMISTRY_TOPICS_ALL)}</div>

      <h2 className="mt-8 w-full text-left text-lg font-semibold text-white">Coding · Python</h2>
      <div className="mt-3 w-full grid grid-cols-1 gap-3 sm:grid-cols-2">{renderTopics(PYTHON_TOPICS_ALL)}</div>

      <h2 className="mt-8 w-full text-left text-lg font-semibold text-white">Robotics</h2>
      <div className="mt-3 w-full grid grid-cols-1 gap-3 sm:grid-cols-2">{renderTopics(ROBOTICS_TOPICS_ALL)}</div>

      <div className="mt-8 w-full">
        <h2 className="text-lg font-semibold text-white">Badges</h2>
        {badges.length === 0 ? (
          <p className="mt-2 text-sm text-white/50">
            Keep going — your first badge unlocks once you reach Tier 3 in a topic!
          </p>
        ) : (
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-nebula-500/20 border border-nebula-500/40 px-3 py-1 text-sm text-star-400"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
