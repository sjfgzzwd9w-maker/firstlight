import { useNavigate } from 'react-router-dom';
import SkillPath from '../components/SkillPath';
import Mascot from '../components/Mascot';
import { useProfile } from '../context/ProfileContext';
import { MATH_TOPICS } from '../lib/engine/topics';

export default function MathModuleMap() {
  const { profile } = useProfile();
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-10 max-w-3xl mx-auto w-full text-center">
      <Mascot mood="thinking" line="Pick a skill to practice — I'll meet you there!" />
      <h1 className="mt-6 text-2xl sm:text-3xl font-extrabold text-white">Math · Algebra 2</h1>
      <p className="mt-2 text-white/60">
        Topics unlock as you build up each skill. Tap a topic to start a session.
      </p>

      <div className="mt-8 w-full">
        <SkillPath
          topics={MATH_TOPICS}
          progress={profile.topics}
          onSelect={(topicId) => navigate(`/learn/math/session?topic=${topicId}`)}
        />
      </div>
    </div>
  );
}
