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

      <div className="mt-10 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        <SubjectCard
          emoji="🧮"
          title="Math"
          description="Algebra 2: equations, quadratics, polynomials & more"
          onClick={() => navigate('/learn/math')}
        />
        <SubjectCard
          emoji="🔬"
          title="Science"
          description="Biology: cells, DNA, ecosystems & more"
          onClick={() => navigate('/learn/science')}
        />
        <SubjectCard emoji="🚀" title="Space" description="Coming soon" comingSoon />
        <SubjectCard emoji="💻" title="Coding" description="Coming soon" comingSoon />
      </div>
    </div>
  );
}
