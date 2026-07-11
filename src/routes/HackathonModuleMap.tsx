import { useNavigate } from 'react-router-dom';
import SkillPath from '../components/SkillPath';
import Mascot from '../components/Mascot';
import TopicProgressSidebar from '../components/TopicProgressSidebar';
import { useProfile } from '../context/ProfileContext';
import { HACKATHON_TOPICS, HACKATHON_TOPICS_PART2, HACKATHON_TOPICS_ALL } from '../lib/engine/topics';

export default function HackathonModuleMap() {
  const { profile } = useProfile();
  const navigate = useNavigate();

  const goToSession = (topicId: string) =>
    navigate(`/learn/hackathon/session?topic=${topicId}`);

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-10 max-w-5xl mx-auto w-full text-center">
      <Mascot mood="excited" line="Suit up — your hackathon journey starts here. Let's build something!" />
      <h1 className="mt-6 text-2xl sm:text-3xl font-extrabold text-white">🏆 Hackathon Pathway</h1>
      <p className="mt-2 text-white/60">
        From your first line of code to standing on a stage pitching your idea — everything you
        need to go from beginner to confident hackathon competitor.
      </p>

      <div className="mt-8 flex w-full flex-col-reverse gap-8 lg:flex-row lg:items-start">
        <div className="flex-1">
          <div className="w-full">
            <h2 className="mb-4 text-left text-sm font-semibold uppercase tracking-wide text-star-400">
              Unit 1 · Getting Started
            </h2>
            <SkillPath topics={HACKATHON_TOPICS} progress={profile.topics} onSelect={goToSession} />
          </div>

          <div className="mt-12 w-full">
            <h2 className="mb-4 text-left text-sm font-semibold uppercase tracking-wide text-star-400">
              Unit 2 · Competing &amp; Growing
            </h2>
            <SkillPath
              topics={HACKATHON_TOPICS_PART2}
              progress={profile.topics}
              onSelect={goToSession}
              previousTopicId={HACKATHON_TOPICS[HACKATHON_TOPICS.length - 1].id}
            />
          </div>
        </div>

        <TopicProgressSidebar
          title="Hackathon Progress"
          topics={HACKATHON_TOPICS_ALL}
          progress={profile.topics}
        />
      </div>
    </div>
  );
}
