import { useNavigate } from 'react-router-dom';
import SubjectCard from '../components/SubjectCard';
import AgeGate from '../components/AgeGate';
import Mascot from '../components/Mascot';
import { useProfile } from '../context/ProfileContext';

export default function Landing() {
  const { profile, setUserAge } = useProfile();
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-12 max-w-5xl mx-auto w-full text-center">
      {profile.age === null && <AgeGate onSubmit={setUserAge} />}

      <Mascot mood="happy" />
      <h1 className="mt-6 text-3xl sm:text-4xl font-extrabold text-white">
        What do you want to master today?
      </h1>
      <p className="mt-3 max-w-xl text-white/60">
        Pick a subject, answer a few questions, and Cosmo will guide you from the basics to the
        advanced stuff — leveling up or down as you go.
      </p>

      <div className="mt-10 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SubjectCard
          emoji="🧮"
          title="Math"
          description="Algebra 2: equations, quadratics, polynomials & more"
          onClick={() => navigate('/learn/math')}
        />
        <SubjectCard
          emoji="🧬"
          title="Biology"
          description="Cells, DNA, genetics, evolution & ecosystems"
          onClick={() => navigate('/learn/biology')}
        />
        <SubjectCard
          emoji="🧪"
          title="Chemistry"
          description="Measurement, atoms, nuclear chemistry & electron configurations"
          onClick={() => navigate('/learn/chemistry')}
        />
        <SubjectCard
          emoji="💻"
          title="Coding"
          description="Python: variables, loops, functions, OOP & debugging — zero to hero"
          onClick={() => navigate('/learn/coding')}
        />
        <SubjectCard
          emoji="🤖"
          title="Robotics"
          description="Robots, sensors, circuits, control systems & AI — build real-world skills"
          onClick={() => navigate('/learn/robotics')}
        />
        <SubjectCard emoji="🚀" title="Space" description="Coming soon" comingSoon />
      </div>
    </div>
  );
}
