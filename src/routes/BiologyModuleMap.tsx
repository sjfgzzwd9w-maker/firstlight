import { useNavigate } from 'react-router-dom';
import SkillPath from '../components/SkillPath';
import Mascot from '../components/Mascot';
import { useProfile } from '../context/ProfileContext';
import { BIOLOGY_TOPICS, BIOLOGY_TOPICS_PART2 } from '../lib/engine/topics';

export default function BiologyModuleMap() {
  const { profile } = useProfile();
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-10 max-w-3xl mx-auto w-full text-center">
      <Mascot mood="thinking" line="Pick a skill to practice — I'll meet you there!" />
      <h1 className="mt-6 text-2xl sm:text-3xl font-extrabold text-white">Biology</h1>
      <p className="mt-2 text-white/60">
        Topics unlock as you build up each skill. Tap a topic to start a session.
      </p>

      <div className="mt-8 w-full">
        <h2 className="mb-4 text-left text-sm font-semibold uppercase tracking-wide text-white/50">
          Part 1 · Cells & Molecular Biology
        </h2>
        <SkillPath
          topics={BIOLOGY_TOPICS}
          progress={profile.topics}
          onSelect={(topicId) => navigate(`/learn/biology/session?topic=${topicId}`)}
        />
      </div>

      <div className="mt-12 w-full">
        <h2 className="mb-4 text-left text-sm font-semibold uppercase tracking-wide text-white/50">
          Part 2 · Genetics, Evolution &amp; Ecology
        </h2>
        <SkillPath
          topics={BIOLOGY_TOPICS_PART2}
          progress={profile.topics}
          onSelect={(topicId) => navigate(`/learn/biology/session?topic=${topicId}`)}
        />
      </div>
    </div>
  );
}
