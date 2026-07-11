import { useNavigate } from 'react-router-dom';
import SkillPath from '../components/SkillPath';
import Mascot from '../components/Mascot';
import TopicProgressSidebar from '../components/TopicProgressSidebar';
import { useProfile } from '../context/ProfileContext';
import { PHYSICS_TOPICS, PHYSICS_TOPICS_PART2, PHYSICS_TOPICS_PART3, PHYSICS_TOPICS_ALL } from '../lib/engine/topics';

export default function PhysicsModuleMap() {
  const { profile } = useProfile();
  const navigate = useNavigate();

  const goToSession = (topicId: string) => navigate(`/learn/physics/session?topic=${topicId}`);

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-10 max-w-5xl mx-auto w-full text-center">
      <Mascot mood="thinking" line="Physics is the language of the universe — let's start speaking it!" />
      <h1 className="mt-6 text-2xl sm:text-3xl font-extrabold text-white">⚛️ Physics</h1>
      <p className="mt-2 text-white/60">
        From measuring the world to forces, energy, waves, and electromagnetism — master the
        fundamentals that power everything from rockets to circuits.
      </p>

      <div className="mt-8 flex w-full flex-col-reverse gap-8 lg:flex-row lg:items-start">
        <div className="flex-1">
          <div className="w-full">
            <h2 className="mb-4 text-left text-sm font-semibold uppercase tracking-wide text-star-400">
              Unit 1 · Motion &amp; Measurement
            </h2>
            <SkillPath topics={PHYSICS_TOPICS} progress={profile.topics} onSelect={goToSession} />
          </div>

          <div className="mt-12 w-full">
            <h2 className="mb-4 text-left text-sm font-semibold uppercase tracking-wide text-star-400">
              Unit 2 · Forces &amp; Energy
            </h2>
            <SkillPath
              topics={PHYSICS_TOPICS_PART2}
              progress={profile.topics}
              onSelect={goToSession}
              previousTopicId={PHYSICS_TOPICS[PHYSICS_TOPICS.length - 1].id}
            />
          </div>

          <div className="mt-12 w-full">
            <h2 className="mb-4 text-left text-sm font-semibold uppercase tracking-wide text-star-400">
              Unit 3 · Waves, Sound &amp; Electromagnetism
            </h2>
            <SkillPath
              topics={PHYSICS_TOPICS_PART3}
              progress={profile.topics}
              onSelect={goToSession}
              previousTopicId={PHYSICS_TOPICS_PART2[PHYSICS_TOPICS_PART2.length - 1].id}
            />
          </div>
        </div>

        <TopicProgressSidebar title="Physics Progress" topics={PHYSICS_TOPICS_ALL} progress={profile.topics} />
      </div>
    </div>
  );
}
