import { useNavigate } from 'react-router-dom';
import SkillPath from '../components/SkillPath';
import Mascot from '../components/Mascot';
import TopicProgressSidebar from '../components/TopicProgressSidebar';
import { useProfile } from '../context/ProfileContext';
import {
  ROBOTICS_TOPICS,
  ROBOTICS_TOPICS_PART2,
  ROBOTICS_TOPICS_PART3,
  ROBOTICS_TOPICS_PART4,
  ROBOTICS_TOPICS_ALL,
} from '../lib/engine/topics';

export default function RoboticsModuleMap() {
  const { profile } = useProfile();
  const navigate = useNavigate();

  const goToSession = (topicId: string) => navigate(`/learn/robotics/session?topic=${topicId}`);

  return (
    <div className="bg-robotics flex-1 flex flex-col items-center px-6 py-10 max-w-5xl mx-auto w-full text-center">
      <Mascot mood="thinking" line="Systems online. Let's build something amazing — pick a module!" />
      <h1 className="glow-circuit mt-6 text-2xl sm:text-3xl font-extrabold text-circuit-300">Robotics</h1>
      <p className="mt-2 text-white/60">
        From "what is a robot?" to AI and ethics — build your skills module by module, just like a real engineer.
      </p>

      <div className="mt-8 flex w-full flex-col-reverse gap-8 lg:flex-row lg:items-start">
        <div className="flex-1">
          <div className="w-full">
            <h2 className="mb-4 text-left text-sm font-semibold uppercase tracking-wide text-circuit-400">
              Part 1 · Getting Started
            </h2>
            <SkillPath topics={ROBOTICS_TOPICS} progress={profile.topics} onSelect={goToSession} />
          </div>

          <div className="mt-12 w-full">
            <h2 className="mb-4 text-left text-sm font-semibold uppercase tracking-wide text-circuit-400">
              Part 2 · Building Blocks
            </h2>
            <SkillPath topics={ROBOTICS_TOPICS_PART2} progress={profile.topics} onSelect={goToSession} />
          </div>

          <div className="mt-12 w-full">
            <h2 className="mb-4 text-left text-sm font-semibold uppercase tracking-wide text-circuit-400">
              Part 3 · Going Further
            </h2>
            <SkillPath topics={ROBOTICS_TOPICS_PART3} progress={profile.topics} onSelect={goToSession} />
          </div>

          <div className="mt-12 w-full">
            <h2 className="mb-4 text-left text-sm font-semibold uppercase tracking-wide text-circuit-400">
              Part 4 · VEX Build Lab
            </h2>
            <SkillPath topics={ROBOTICS_TOPICS_PART4} progress={profile.topics} onSelect={goToSession} />
          </div>
        </div>

        <TopicProgressSidebar title="Robotics Progress" topics={ROBOTICS_TOPICS_ALL} progress={profile.topics} />
      </div>
    </div>
  );
}
