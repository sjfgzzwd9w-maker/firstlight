import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import Landing from './routes/Landing';
import MathModuleMap from './routes/MathModuleMap';
import BiologyModuleMap from './routes/BiologyModuleMap';
import ChemistryModuleMap from './routes/ChemistryModuleMap';
import CodingModuleMap from './routes/CodingModuleMap';
import RoboticsModuleMap from './routes/RoboticsModuleMap';
import SpaceModuleMap from './routes/SpaceModuleMap';
import PhysicsModuleMap from './routes/PhysicsModuleMap';
import HackathonModuleMap from './routes/HackathonModuleMap';
import LearnSession from './routes/LearnSession';
import PracticeSession from './routes/PracticeSession';
import Profile from './routes/Profile';
import Settings from './routes/Settings';
import Notes from './routes/Notes';
import DreamGaze from './routes/DreamGaze';
import PomodoroGateway from './components/PomodoroGateway';
import { SessionProvider } from './context/SessionContext';
import { useProfile } from './context/ProfileContext';
import { ALL_TOPICS } from './lib/engine/topics';

function NavBar() {
  const { profile } = useProfile();

  const totalMissed = ALL_TOPICS.reduce(
    (sum, t) => sum + (profile.topics[t.id]?.missedIds?.length ?? 0),
    0,
  );

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
      isActive ? 'bg-nebula-500 text-white' : 'text-white/70 bg-white/5 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <header className="flex flex-wrap items-center justify-between gap-y-2 px-6 py-4 max-w-5xl mx-auto w-full">
      <NavLink to="/" className="flex items-center gap-2 text-lg font-bold text-star-400">
        <span aria-hidden="true">✦</span> First Light
      </NavLink>
      <nav className="flex flex-wrap justify-end gap-2">
        {totalMissed > 0 && (
          <NavLink to="/practice" className={linkClass}>
            🎯 Practice
            <span className="ml-1.5 inline-flex items-center justify-center h-4 min-w-4 rounded-full bg-star-400 px-1 text-[10px] font-bold text-space-950">
              {totalMissed}
            </span>
          </NavLink>
        )}
        <NavLink to="/notes" className={linkClass}>
          Notes
        </NavLink>
        <NavLink to="/dream-gaze" className={linkClass}>
          🔭 Dream Gaze
        </NavLink>
        <NavLink to="/profile" className={linkClass}>
          Profile
        </NavLink>
        <NavLink to="/settings" className={linkClass}>
          Settings
        </NavLink>
      </nav>
    </header>
  );
}

export default function App() {
  const location = useLocation();
  const isSession =
    location.pathname.endsWith('/session') || location.pathname === '/practice';

  return (
    <SessionProvider>
      <PomodoroGateway />
    {/* Full-page background switches modes: Deep Work (blue-slate) in sessions, Space (purple) everywhere else */}
    <div className={`min-h-screen flex flex-col ${isSession ? 'bg-deep-work' : 'bg-gradient-to-b from-space-950 via-space-900 to-space-950'}`}>
      {!isSession && <NavBar />}
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/learn/math" element={<MathModuleMap />} />
          <Route path="/learn/math/session" element={<LearnSession />} />
          <Route path="/learn/biology" element={<BiologyModuleMap />} />
          <Route path="/learn/biology/session" element={<LearnSession />} />
          <Route path="/learn/chemistry" element={<ChemistryModuleMap />} />
          <Route path="/learn/chemistry/session" element={<LearnSession />} />
          <Route path="/learn/coding" element={<CodingModuleMap />} />
          <Route path="/learn/coding/session" element={<LearnSession />} />
          <Route path="/learn/robotics" element={<RoboticsModuleMap />} />
          <Route path="/learn/robotics/session" element={<LearnSession />} />
          <Route path="/learn/space" element={<SpaceModuleMap />} />
          <Route path="/learn/space/session" element={<LearnSession />} />
          <Route path="/learn/physics" element={<PhysicsModuleMap />} />
          <Route path="/learn/physics/session" element={<LearnSession />} />
          <Route path="/learn/hackathon" element={<HackathonModuleMap />} />
          <Route path="/learn/hackathon/session" element={<LearnSession />} />
          <Route path="/practice" element={<PracticeSession />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/dream-gaze" element={<DreamGaze />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
    </SessionProvider>
  );
}
