import { useNavigate } from 'react-router-dom';
import SkillPath from '../components/SkillPath';
import Mascot from '../components/Mascot';
import TopicProgressSidebar from '../components/TopicProgressSidebar';
import { useProfile } from '../context/ProfileContext';
import { PYTHON_TOPICS, PYTHON_TOPICS_PART2, PYTHON_TOPICS_PART3, PYTHON_TOPICS_ALL } from '../lib/engine/topics';

export default function CodingModuleMap() {
  const { profile } = useProfile();
  const navigate = useNavigate();

  const goToSession = (topicId: string) => navigate(`/learn/coding/session?topic=${topicId}`);

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-10 max-w-5xl mx-auto w-full text-center">
      <Mascot mood="thinking" line="Pick a skill to practice — I'll meet you there!" />
      <h1 className="mt-6 text-2xl sm:text-3xl font-extrabold text-white">Coding · Python</h1>
      <p className="mt-2 text-white/60">
        From your first print() to classes and debugging — topics unlock as you build up each skill.
      </p>

      <div className="mt-8 flex w-full flex-col-reverse gap-8 lg:flex-row lg:items-start">
        <div className="flex-1">
          <div className="w-full">
            <h2 className="mb-4 text-left text-sm font-semibold uppercase tracking-wide text-white/50">
              Part 1 · Fundamentals
            </h2>
            <SkillPath topics={PYTHON_TOPICS} progress={profile.topics} onSelect={goToSession} />
          </div>

          <div className="mt-12 w-full">
            <h2 className="mb-4 text-left text-sm font-semibold uppercase tracking-wide text-white/50">
              Part 2 · Data Structures &amp; Functions
            </h2>
            <SkillPath topics={PYTHON_TOPICS_PART2} progress={profile.topics} onSelect={goToSession} />
          </div>

          <div className="mt-12 w-full">
            <h2 className="mb-4 text-left text-sm font-semibold uppercase tracking-wide text-white/50">
              Part 3 · Going Further
            </h2>
            <SkillPath topics={PYTHON_TOPICS_PART3} progress={profile.topics} onSelect={goToSession} />
          </div>
        </div>

        <TopicProgressSidebar title="Python Progress" topics={PYTHON_TOPICS_ALL} progress={profile.topics} />
      </div>
    </div>
  );
}
