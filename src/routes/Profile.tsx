import { useNavigate } from 'react-router-dom';
import Mascot from '../components/Mascot';
import { useProfile } from '../context/ProfileContext';
import {
  ALL_TOPICS,
  MATH_TOPICS_ALL,
  BIOLOGY_TOPICS,
  CHEMISTRY_TOPICS_ALL,
  PYTHON_TOPICS_ALL,
  ROBOTICS_TOPICS_ALL,
  SPACE_TOPICS_ALL,
  PHYSICS_TOPICS_ALL,
  HACKATHON_TOPICS_ALL,
  SUBJECT_PATHS,
} from '../lib/engine/topics';
import { totalXp } from '../lib/storage/progress';
import { isDueForReview, formatReviewIn } from '../lib/spaced-repetition';
import { MAX_TIER } from '../types';
import type { Topic } from '../types';

export default function Profile() {
  const { profile } = useProfile();
  const navigate = useNavigate();
  const xp = totalXp(profile);

  const totalMissed = ALL_TOPICS.reduce(
    (sum, t) => sum + (profile.topics[t.id]?.missedIds?.length ?? 0),
    0,
  );

  const badges: string[] = [];
  for (const topic of [
    ...MATH_TOPICS_ALL,
    ...BIOLOGY_TOPICS,
    ...CHEMISTRY_TOPICS_ALL,
    ...PYTHON_TOPICS_ALL,
    ...ROBOTICS_TOPICS_ALL,
    ...SPACE_TOPICS_ALL,
    ...PHYSICS_TOPICS_ALL,
    ...HACKATHON_TOPICS_ALL,
  ]) {
    const p = profile.topics[topic.id];
    if (!p) continue;
    if (p.mastered) badges.push(`${topic.name} Master ⭐`);
    else if (p.tier >= 3) badges.push(`${topic.name} Adept 🔹`);
  }

  // CogniSync: spaced repetition — find topics due (or coming due) for review
  type ReviewItem = { topic: Topic; label: string; isDue: boolean };
  const reviewItems: ReviewItem[] = [];
  for (const topic of ALL_TOPICS) {
    const p = profile.topics[topic.id];
    if (!p?.nextReviewAt) continue;
    const due = isDueForReview(p);
    const label = due ? 'Due now' : formatReviewIn(p.nextReviewAt);
    // Show anything due within 7 days
    const inSevenDays = p.nextReviewAt - Date.now() < 7 * 24 * 60 * 60 * 1000;
    if (due || inSevenDays) reviewItems.push({ topic, label, isDue: due });
  }
  reviewItems.sort((a, b) => {
    const pa = profile.topics[a.topic.id]?.nextReviewAt ?? 0;
    const pb = profile.topics[b.topic.id]?.nextReviewAt ?? 0;
    return pa - pb;
  });

  const renderTopics = (topics: Topic[]) =>
    topics.map((topic) => {
      const p = profile.topics[topic.id];
      const pct = p ? Math.min(100, (p.tier / MAX_TIER) * 100) : 0;
      const due = p?.nextReviewAt ? isDueForReview(p) : false;
      return (
        <div key={topic.id} className={`rounded-2xl border bg-white/5 p-4 text-left ${due ? 'border-star-400/40' : 'border-white/10'}`}>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-white">{topic.name}</h3>
            {due && (
              // Alert mode — red exclusively for knowledge gaps / review deadlines
              <span className="shrink-0 rounded-full bg-alert-500/20 border border-alert-400/40 px-2 py-0.5 text-[10px] font-semibold text-alert-300">
                Review due
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-white/50">
            {p?.mastered ? 'Mastered' : `Tier ${p?.tier ?? 1} / ${MAX_TIER}`} · {p?.xp ?? 0} XP
          </p>
          <div className="mt-2 h-2 w-full rounded-full bg-white/10">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-nebula-500 to-comet-400"
              style={{ width: `${pct}%` }}
            />
          </div>
          {p?.nextReviewAt && !due && (
            <p className="mt-1.5 text-[10px] text-white/30">
              Next review: {formatReviewIn(p.nextReviewAt)}
            </p>
          )}
        </div>
      );
    });

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-10 max-w-2xl mx-auto w-full text-center">
      <Mascot mood="happy" />
      <h1 className="mt-6 text-2xl font-extrabold text-white">Your Progress</h1>
      <p className="mt-2 text-3xl font-bold text-star-400">{xp} XP</p>

      {totalMissed > 0 ? (
        <button
          type="button"
          onClick={() => navigate('/practice')}
          className="mt-5 flex items-center gap-3 rounded-2xl border border-star-400/40 bg-star-400/10 px-5 py-3 text-left transition-colors hover:bg-star-400/20"
        >
          <span className="text-2xl">🎯</span>
          <div>
            <p className="font-semibold text-star-400">Practice wrong answers</p>
            <p className="text-xs text-white/50">
              {totalMissed} question{totalMissed > 1 ? 's' : ''} waiting for a retry
            </p>
          </div>
          <span className="ml-auto text-white/40">→</span>
        </button>
      ) : (
        <p className="mt-3 text-xs text-white/30">
          🎯 Missed questions will appear here for practice
        </p>
      )}

      {/* CogniSync: Spaced-Rep Review Schedule */}
      {reviewItems.length > 0 && (
        <div className="mt-8 w-full">
          <h2 className="text-left text-lg font-semibold text-white">
            🔁 Review Schedule
            <span className="ml-2 text-xs font-normal text-white/40">CogniSync · Spaced Repetition</span>
          </h2>
          <div className="mt-3 flex flex-col gap-2">
            {reviewItems.map(({ topic, label, isDue }) => (
              <button
                key={topic.id}
                type="button"
                onClick={() => navigate(`${SUBJECT_PATHS[topic.subject]}/session?topic=${topic.id}`)}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-colors
                  ${isDue
                    ? 'border-alert-400/40 bg-alert-500/10 hover:bg-alert-500/15'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
              >
                <div>
                  <p className={`text-sm font-semibold ${isDue ? 'text-alert-300' : 'text-white'}`}>{topic.name}</p>
                  <p className="text-xs text-white/50">{topic.subject.charAt(0).toUpperCase() + topic.subject.slice(1)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${isDue ? 'text-alert-300 font-bold' : 'text-white/40'}`}>{label}</span>
                  <span className="text-white/30">→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

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

      <h2 className="mt-8 w-full text-left text-lg font-semibold text-white">Space</h2>
      <div className="mt-3 w-full grid grid-cols-1 gap-3 sm:grid-cols-2">{renderTopics(SPACE_TOPICS_ALL)}</div>

      <h2 className="mt-8 w-full text-left text-lg font-semibold text-white">⚛️ Physics</h2>
      <div className="mt-3 w-full grid grid-cols-1 gap-3 sm:grid-cols-2">{renderTopics(PHYSICS_TOPICS_ALL)}</div>

      <h2 className="mt-8 w-full text-left text-lg font-semibold text-white">🏆 Hackathon</h2>
      <div className="mt-3 w-full grid grid-cols-1 gap-3 sm:grid-cols-2">{renderTopics(HACKATHON_TOPICS_ALL)}</div>

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
