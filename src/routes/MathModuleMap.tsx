import { useNavigate } from 'react-router-dom';
import SkillPath from '../components/SkillPath';
import Mascot from '../components/Mascot';
import TopicProgressSidebar from '../components/TopicProgressSidebar';
import { useProfile } from '../context/ProfileContext';
import { MATH_TOPICS, MATH_TOPICS_PART2, MATH_TOPICS_ALL } from '../lib/engine/topics';

export default function MathModuleMap() {
  const { profile } = useProfile();
  const navigate = useNavigate();

  const goToSession = (topicId: string) => navigate(`/learn/math/session?topic=${topicId}`);

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-10 max-w-5xl mx-auto w-full text-center">
      <Mascot mood="thinking" line="Pick a skill to practice — I'll meet you there!" />
      <h1 className="mt-6 text-2xl sm:text-3xl font-extrabold text-white">Math · Algebra 2</h1>
      <p className="mt-2 text-white/60">
        Topics unlock as you build up each skill. Some advanced topics let you use a graphing or
        scientific calculator (like Desmos) for the trickier calculations.
      </p>

      <div className="mt-8 flex w-full flex-col-reverse gap-8 lg:flex-row lg:items-start">
        <div className="flex-1">
          <div className="w-full">
            <h2 className="mb-4 text-left text-sm font-semibold uppercase tracking-wide text-white/50">
              Part 1 · Foundations
            </h2>
            <SkillPath topics={MATH_TOPICS} progress={profile.topics} onSelect={goToSession} />
          </div>

          <div className="mt-12 w-full">
            <h2 className="mb-4 text-left text-sm font-semibold uppercase tracking-wide text-white/50">
              Part 2 · Advanced Algebra 2
            </h2>
            <SkillPath topics={MATH_TOPICS_PART2} progress={profile.topics} onSelect={goToSession} />
          </div>
        </div>

        <TopicProgressSidebar title="Math Progress" topics={MATH_TOPICS_ALL} progress={profile.topics} />
      </div>
    </div>
  );
}
