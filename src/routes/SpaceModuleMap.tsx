import { useNavigate } from 'react-router-dom';
import SkillPath from '../components/SkillPath';
import Mascot from '../components/Mascot';
import TopicProgressSidebar from '../components/TopicProgressSidebar';
import { useProfile } from '../context/ProfileContext';
import { SPACE_TOPICS, SPACE_TOPICS_PART2, SPACE_TOPICS_ALL } from '../lib/engine/topics';

export default function SpaceModuleMap() {
  const { profile } = useProfile();
  const navigate = useNavigate();

  const goToSession = (topicId: string) => navigate(`/learn/space/session?topic=${topicId}`);

  return (
    <div className="bg-cosmos flex-1 flex flex-col items-center px-6 py-10 max-w-5xl mx-auto w-full text-center">
      <Mascot mood="thinking" line="Suit up, astronaut. Let's explore the cosmos — pick a unit!" />
      <h1 className="glow-cosmos mt-6 text-2xl sm:text-3xl font-extrabold text-nebula-400">Space</h1>
      <p className="mt-2 text-white/60">
        From our Solar System and the Moon to galaxies, black holes, and the search for life —
        explore the universe unit by unit.
      </p>

      <div className="mt-8 flex w-full flex-col-reverse gap-8 lg:flex-row lg:items-start">
        <div className="flex-1">
          <div className="w-full">
            <h2 className="mb-4 text-left text-sm font-semibold uppercase tracking-wide text-star-400">
              Unit 1 · Our Solar System &amp; Sky
            </h2>
            <SkillPath topics={SPACE_TOPICS} progress={profile.topics} onSelect={goToSession} />
          </div>

          <div className="mt-12 w-full">
            <h2 className="mb-4 text-left text-sm font-semibold uppercase tracking-wide text-star-400">
              Unit 2 · Exploration &amp; the Universe
            </h2>
            <SkillPath topics={SPACE_TOPICS_PART2} progress={profile.topics} onSelect={goToSession} />
          </div>
        </div>

        <TopicProgressSidebar title="Space Progress" topics={SPACE_TOPICS_ALL} progress={profile.topics} />
      </div>
    </div>
  );
}
