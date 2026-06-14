import { useNavigate } from 'react-router-dom';
import SkillPath from '../components/SkillPath';
import Mascot from '../components/Mascot';
import TopicProgressSidebar from '../components/TopicProgressSidebar';
import { useProfile } from '../context/ProfileContext';
import {
  CHEMISTRY_TOPICS,
  CHEMISTRY_TOPICS_PART2,
  CHEMISTRY_TOPICS_PART3,
  CHEMISTRY_TOPICS_ALL,
} from '../lib/engine/topics';

export default function ChemistryModuleMap() {
  const { profile } = useProfile();
  const navigate = useNavigate();

  const goToSession = (topicId: string) => navigate(`/learn/chemistry/session?topic=${topicId}`);

  return (
    <div className="bg-lab flex-1 flex flex-col items-center px-6 py-10 max-w-5xl mx-auto w-full text-center">
      <Mascot mood="thinking" line="Lab coat on. Let's mix some knowledge — pick a unit!" />
      <h1 className="glow-lab mt-6 text-2xl sm:text-3xl font-extrabold text-lab-300">Chemistry</h1>
      <p className="mt-2 text-white/60">
        From measurement and matter to atoms, nuclear chemistry, and electron configurations —
        build your skills unit by unit.
      </p>

      <div className="mt-8 flex w-full flex-col-reverse gap-8 lg:flex-row lg:items-start">
        <div className="flex-1">
          <div className="w-full">
            <h2 className="mb-4 text-left text-sm font-semibold uppercase tracking-wide text-lab-400">
              Unit 1 · Measurement &amp; Matter
            </h2>
            <SkillPath topics={CHEMISTRY_TOPICS} progress={profile.topics} onSelect={goToSession} />
          </div>

          <div className="mt-12 w-full">
            <h2 className="mb-4 text-left text-sm font-semibold uppercase tracking-wide text-lab-400">
              Unit 2 · Atomic &amp; Nuclear Chemistry
            </h2>
            <SkillPath topics={CHEMISTRY_TOPICS_PART2} progress={profile.topics} onSelect={goToSession} />
          </div>

          <div className="mt-12 w-full">
            <h2 className="mb-4 text-left text-sm font-semibold uppercase tracking-wide text-lab-400">
              Unit 3 · Orbitals &amp; Electron Configuration
            </h2>
            <SkillPath topics={CHEMISTRY_TOPICS_PART3} progress={profile.topics} onSelect={goToSession} />
          </div>
        </div>

        <TopicProgressSidebar title="Chemistry Progress" topics={CHEMISTRY_TOPICS_ALL} progress={profile.topics} />
      </div>
    </div>
  );
}
