import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import Landing from './routes/Landing';
import MathModuleMap from './routes/MathModuleMap';
import ScienceModuleMap from './routes/ScienceModuleMap';
import CodingModuleMap from './routes/CodingModuleMap';
import RoboticsModuleMap from './routes/RoboticsModuleMap';
import LearnSession from './routes/LearnSession';
import Profile from './routes/Profile';
import Settings from './routes/Settings';
import Notes from './routes/Notes';

function NavBar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
      isActive ? 'bg-nebula-500 text-white' : 'text-space-700 bg-white/5 hover:bg-white/10'
    }`;

  return (
    <header className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full">
      <NavLink to="/" className="flex items-center gap-2 text-lg font-bold text-star-400">
        <span aria-hidden="true">✦</span> Stardance Learn
      </NavLink>
      <nav className="flex gap-2">
        <NavLink to="/learn/math" className={linkClass}>
          Math
        </NavLink>
        <NavLink to="/learn/science" className={linkClass}>
          Science
        </NavLink>
        <NavLink to="/learn/coding" className={linkClass}>
          Coding
        </NavLink>
        <NavLink to="/learn/robotics" className={linkClass}>
          Robotics
        </NavLink>
        <NavLink to="/notes" className={linkClass}>
          Notes
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
  const isSession = location.pathname.endsWith('/session');

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-space-950 via-space-900 to-space-950">
      {!isSession && <NavBar />}
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/learn/math" element={<MathModuleMap />} />
          <Route path="/learn/math/session" element={<LearnSession />} />
          <Route path="/learn/science" element={<ScienceModuleMap />} />
          <Route path="/learn/science/session" element={<LearnSession />} />
          <Route path="/learn/coding" element={<CodingModuleMap />} />
          <Route path="/learn/coding/session" element={<LearnSession />} />
          <Route path="/learn/robotics" element={<RoboticsModuleMap />} />
          <Route path="/learn/robotics/session" element={<LearnSession />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}
