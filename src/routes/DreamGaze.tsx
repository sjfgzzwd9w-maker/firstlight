import Mascot from '../components/Mascot';

type ResourceItem = {
  title: string;
  blurb: string;
};

type ResourceCard = {
  emoji: string;
  title: string;
  glow: string;
  border: string;
  items: ResourceItem[];
};

type SpaceTrackSubject = {
  emoji: string;
  subject: string;
  path: string;
  why: string;
};

const SPACE_TRACK_SUBJECTS: SpaceTrackSubject[] = [
  {
    emoji: '🧮',
    subject: 'Math',
    path: 'Algebra 1 → Geometry → Algebra 2 → Precalculus → AP Calculus BC → (if available) Multivariable Calc / Linear Algebra',
    why: 'The language of orbital mechanics, propulsion, and signal processing.',
  },
  {
    emoji: '⚛️',
    subject: 'Physics',
    path: 'Physics (Honors) → AP Physics 1 → AP Physics C: Mechanics & E&M',
    why: 'Directly powers aerospace and energy systems — trajectories, propulsion, power generation.',
  },
  {
    emoji: '🧪',
    subject: 'Chemistry',
    path: 'Chemistry → AP Chemistry',
    why: 'Materials science, propellants, batteries, solar cells — the "energy" side of space projects.',
  },
  {
    emoji: '💻',
    subject: 'Computer Science',
    path: 'Intro CS → AP CS A (Java) → AP CS Principles / independent Python projects',
    why: 'Flight software, mission simulation, and satellite/telescope data analysis.',
  },
  {
    emoji: '🛠️',
    subject: 'Engineering & electives',
    path: 'Engineering Design / Robotics / Astronomy elective if offered',
    why: 'Hands-on CAD, prototyping, and systems thinking — what aerospace/energy labs look for.',
  },
];

const RESOURCE_CARDS: ResourceCard[] = [
  {
    emoji: '🎯',
    title: 'Clubs to explore freshman year',
    glow: 'shadow-[0_0_30px_rgba(170,59,255,0.25)]',
    border: 'border-nebula-500/40',
    items: [
      { title: 'Science Olympiad', blurb: 'Team STEM events — great entry point, builds toward leadership roles.' },
      { title: 'FBLA / DECA', blurb: 'For business & econ fans — strong state/national competition track record.' },
      { title: 'Speech & Debate / Mock Trial', blurb: 'High-signal leadership + communication, valued across every major.' },
      { title: 'HOSA', blurb: 'For pre-med/bio track — pairs well with research internships later.' },
      { title: 'Coding / AI club or Robotics (FRC/FTC)', blurb: 'Strong for CS/EECS — matches a STEM-heavy school culture.' },
      { title: 'Subject honor societies', blurb: 'Math, CS, NHS — easy freshman entry, can grow into officer roles.' },
    ],
  },
  {
    emoji: '🏆',
    title: 'Competitions to aim for',
    glow: 'shadow-[0_0_30px_rgba(34,211,238,0.25)]',
    border: 'border-circuit-400/40',
    items: [
      { title: 'Science Olympiad / Science Bowl', blurb: 'Team-based — perfect for freshmen and sophomores.' },
      { title: 'AMC 8 / AMC 10 → AIME', blurb: 'For strong math students — a recognizable signal for STEM majors.' },
      { title: 'Congressional App Challenge / Technovation', blurb: 'Beginner-friendly coding competitions — great first "project" credential.' },
      { title: 'Regeneron Science Talent Search / ISEF fairs', blurb: 'The 11th/12th grade payoff for research started via summer programs.' },
      { title: 'DECA / FBLA competitive events', blurb: 'For the business-minded — local to national progression.' },
    ],
  },
  {
    emoji: '🔬',
    title: 'Internships & summer programs',
    glow: 'shadow-[0_0_30px_rgba(16,185,129,0.25)]',
    border: 'border-lab-500/40',
    items: [
      { title: 'Summer after 9th: COSMOS', blurb: 'UC-run intensive STEM program open to rising 9th graders — a great first step.' },
      { title: 'Summer after 10th: UC Santa Cruz SIP', blurb: 'Or lab volunteering / a self-directed project you can show off.' },
      { title: 'Summer after 11th: the big ones', blurb: 'UCSF HIP, Stanford GRIPS, Sandia National Labs, UC Davis Young Scholars.' },
    ],
  },
];

const ROADMAP = [
  {
    grade: '9th grade',
    color: 'text-star-400',
    dot: 'bg-star-400',
    items: [
      'Join 2-3 clubs this fall — see what sticks by spring',
      'Pick a "spike" direction (CS/AI, bio/health, policy, business...) by year end',
      'Apply to COSMOS or a similar summer program',
      'Start tracking community service hours from day one',
    ],
  },
  {
    grade: '10th grade',
    color: 'text-comet-400',
    dot: 'bg-comet-400',
    items: [
      'Take on a leadership role in 1-2 clubs',
      'Start a self-directed project (an app, a research lit-review, a service initiative)',
      'Apply for summer research/internship programs (e.g. UCSC SIP)',
      'Enter your first individual competitions (AMC, app challenges, etc.)',
    ],
  },
  {
    grade: '11th grade',
    color: 'text-circuit-400',
    dot: 'bg-circuit-400',
    items: [
      'Apply to flagship summer programs (UCSF HIP, Stanford GRIPS, Sandia, UC Davis YSP)',
      'Push for officer/leadership positions',
      'Turn your project into a competition entry (Regeneron, ISEF, etc.)',
      'Keep grades + AP load strong — this is the year UCs weigh most',
    ],
  },
  {
    grade: '12th grade',
    color: 'text-nebula-400',
    dot: 'bg-nebula-400',
    items: [
      'Lead — mentor underclassmen in your clubs',
      'Wrap up your "spike" with a capstone result (award, publication, launch, event)',
      'Write your UC application essays around your spike + leadership story',
    ],
  },
];

export default function DreamGaze() {
  return (
    <div className="flex-1 flex flex-col items-center px-6 py-10 max-w-4xl mx-auto w-full text-center">
      <Mascot mood="excited" line="Let's chart your path to the stars — Berkeley & UCLA, here we come!" />
      <h1 className="mt-6 text-3xl sm:text-4xl font-extrabold text-white">🔭 Dream Gaze Resources</h1>
      <p className="mt-3 max-w-2xl text-white/60">
        A 9th-grader's game plan for clubs, competitions, and internships that build toward a strong
        UC Berkeley / UCLA application — based on patterns from competitive Bay Area high schools.
      </p>

      <div className="mt-8 w-full rounded-2xl border border-star-500/40 bg-white/5 p-6 text-left">
        <h2 className="text-lg font-bold text-star-400">✨ The Big Idea: find your "spike"</h2>
        <p className="mt-2 text-sm text-white/70">
          UC admissions explicitly weighs <span className="text-white">special talents &amp; achievements</span> and{' '}
          <span className="text-white">leadership / community service</span>. Quality beats quantity —{' '}
          <span className="text-white">3-5 deep commitments</span> with real impact beat a long list of
          memberships. Top admits usually show a clear <span className="text-white">"spike"</span> — a
          defined area of depth — by junior year. 9th grade is the time to explore and start narrowing.
        </p>
      </div>

      <div className="mt-10 w-full">
        <h2 className="text-left text-xl font-bold text-circuit-400">🚀 Space Career Track: Subjects to Master</h2>
        <p className="mt-2 text-left text-sm text-white/60">
          Dreaming of working on a space mission — propulsion, spacecraft systems, or the power
          that keeps it all running? Here's the course progression that builds toward it.
        </p>

        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-circuit-400/40 bg-white/5 p-5 text-left shadow-[0_0_30px_rgba(34,211,238,0.15)]">
          {SPACE_TRACK_SUBJECTS.map((item) => (
            <div key={item.subject} className="flex flex-col gap-1 border-b border-white/10 pb-3 last:border-0 last:pb-0 sm:flex-row sm:gap-4">
              <div className="flex items-center gap-2 sm:w-48 sm:shrink-0">
                <span className="text-2xl">{item.emoji}</span>
                <p className="text-sm font-bold text-white">{item.subject}</p>
              </div>
              <div>
                <p className="text-sm text-white/80">{item.path}</p>
                <p className="mt-1 text-xs text-white/50">{item.why}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-nebula-500/40 bg-white/5 p-5 text-left">
            <h3 className="text-sm font-bold text-nebula-400">UC Berkeley majors to aim for</h3>
            <p className="mt-2 text-sm text-white/70">
              Mechanical Engineering, EECS, Engineering Physics, Nuclear Engineering (energy systems)
            </p>
          </div>
          <div className="rounded-2xl border border-star-500/40 bg-white/5 p-5 text-left">
            <h3 className="text-sm font-bold text-star-400">UCLA majors to aim for</h3>
            <p className="mt-2 text-sm text-white/70">
              Mechanical &amp; Aerospace Engineering (MAE), Electrical Engineering, Physics &amp; Astronomy (Astrophysics)
            </p>
          </div>
        </div>

        <p className="mt-4 text-left text-xs text-white/40">
          Good news: this course plan already satisfies — and exceeds — the UC system's a-g math &amp; science requirements.
        </p>
      </div>

      <div className="mt-10 grid w-full grid-cols-1 gap-5 md:grid-cols-3">
        {RESOURCE_CARDS.map((card) => (
          <div
            key={card.title}
            className={`flex flex-col gap-3 rounded-2xl border ${card.border} bg-white/5 p-5 text-left ${card.glow}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{card.emoji}</span>
              <h3 className="text-base font-bold text-white">{card.title}</h3>
            </div>
            <ul className="flex flex-col gap-3">
              {card.items.map((item) => (
                <li key={item.title}>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-white/60">{item.blurb}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 w-full">
        <h2 className="text-left text-sm font-semibold uppercase tracking-wide text-white/50">
          Your year-by-year roadmap
        </h2>
        <div className="mt-4 flex flex-col gap-4">
          {ROADMAP.map((stage) => (
            <div key={stage.grade} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-left">
              <div className="flex flex-col items-center">
                <span className={`h-3 w-3 rounded-full ${stage.dot}`} aria-hidden="true" />
              </div>
              <div>
                <h3 className={`text-base font-bold ${stage.color}`}>{stage.grade}</h3>
                <ul className="mt-2 flex flex-col gap-1.5 text-sm text-white/70">
                  {stage.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span aria-hidden="true">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 mb-4 max-w-xl rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/60">
        🌟 Remember: extracurriculars don't replace grades — but they're a huge part of how two strong
        applicants stand apart. Pick things you're genuinely curious about, and the "spike" will follow.
      </div>
    </div>
  );
}
