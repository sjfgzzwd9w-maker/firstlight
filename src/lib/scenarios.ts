import type { Subject } from '../types';

export type Scenario = {
  emoji: string;
  headline: string;
  context: string;
};

const SCENARIOS: Record<Subject, Scenario[]> = {
  math: [
    {
      emoji: '📊',
      headline: "The numbers don't lie — but do you know how to read them?",
      context: "A startup founder just handed you a spreadsheet. The whole pitch depends on getting this math right. No pressure.",
    },
    {
      emoji: '🏗️',
      headline: 'An engineer needs your formula.',
      context: "The construction crew is waiting. Your calculation determines how much steel goes in the foundation. Every decimal matters.",
    },
    {
      emoji: '🎮',
      headline: 'The game engine just threw an error.',
      context: "Your indie game is almost done. The physics are off — something in the math is broken. Trace it back.",
    },
    {
      emoji: '📈',
      headline: 'Investors are watching the graph.',
      context: "You're presenting to a room full of venture capitalists. The trend analysis needs to be flawless. Prove you understand the data.",
    },
    {
      emoji: '🧩',
      headline: 'Pattern detected. Can you solve it?',
      context: "The pattern recognition system flagged an anomaly. It's mathematical. You're the only one who can interpret it.",
    },
  ],
  biology: [
    {
      emoji: '🔬',
      headline: 'The sample is reacting — but how?',
      context: "You're in a research lab. The petri dish is doing something unexpected. Understanding the biology here could change everything.",
    },
    {
      emoji: '🧬',
      headline: "The patient's results just came back.",
      context: "A doctor is waiting for your interpretation. The cellular markers don't match the expected profile. Think carefully.",
    },
    {
      emoji: '🌿',
      headline: "Something's happening in the ecosystem.",
      context: "Field researchers have documented unusual behavior. You need to explain the biological mechanism before the study closes.",
    },
    {
      emoji: '💉',
      headline: 'The vaccine trial needs your expertise.',
      context: "The research team is analyzing immune response data. Your understanding of biology will determine if the trial advances.",
    },
    {
      emoji: '🦠',
      headline: 'The outbreak model needs updating.',
      context: "A fast-moving situation. Epidemiologists need someone who understands how cells work. That's you, right now.",
    },
  ],
  chemistry: [
    {
      emoji: '⚗️',
      headline: 'The reaction is happening faster than expected.',
      context: "You're in the lab. The compound is behaving differently than the model predicted. Identify what's driving this.",
    },
    {
      emoji: '🔥',
      headline: 'The formula for this material needs to be exact.',
      context: "An aerospace company is developing heat-resistant panels. One wrong element ratio and the whole batch fails. Know your chemistry.",
    },
    {
      emoji: '💊',
      headline: 'The pharmaceutical team needs an answer.',
      context: "A drug compound is in development. The molecular structure determines everything — from dosage to side effects. Get it right.",
    },
    {
      emoji: '🌊',
      headline: 'Water treatment has hit a problem.',
      context: "A city's water supply is showing unusual readings. The chemistry team needs to identify the interaction before it spreads.",
    },
    {
      emoji: '🧪',
      headline: 'Experiment Day. No mistakes allowed.',
      context: "Your hypothesis is about to be tested. The other researchers are watching. Show you understand what's happening at the molecular level.",
    },
  ],
  python: [
    {
      emoji: '💻',
      headline: "The script is broken and the client is waiting.",
      context: "Your automation code just failed in production. 10,000 records aren't being processed. You have 15 minutes to fix it.",
    },
    {
      emoji: '🤖',
      headline: 'Time to teach the machine something.',
      context: "You're building an AI model for a startup. The data pipeline needs to be clean. Write the logic that makes it work.",
    },
    {
      emoji: '🚀',
      headline: 'The MVP demo is in 2 hours.',
      context: "You're building something investors will see for the first time. The backend logic needs to be tight. No shortcuts that break later.",
    },
    {
      emoji: '🐛',
      headline: 'Bug found. The whole team is blocked.',
      context: "Three engineers are waiting on you. The bug is in the logic somewhere. Read the code carefully and find it.",
    },
    {
      emoji: '📦',
      headline: 'Data in. Insights out.',
      context: "A company handed you a messy dataset. Your Python code will turn it into something they can actually use. Begin.",
    },
  ],
  robotics: [
    {
      emoji: '🤖',
      headline: 'The robot missed its target — again.',
      context: "Three failed runs. The competition starts in 20 minutes. Something in the sensor or motor logic is off. Find it.",
    },
    {
      emoji: '🏆',
      headline: 'The judges are walking toward your bot.',
      context: "Everything you've built is about to be tested in front of judges. Know your system cold — because they'll ask anything.",
    },
    {
      emoji: '⚙️',
      headline: 'The arm dropped the component.',
      context: "Assembly line simulation, round three. The robotic arm keeps making the same mistake. Diagnose the movement error.",
    },
    {
      emoji: '🌐',
      headline: 'The autonomous system needs a decision.',
      context: "Your robot is navigating an unknown environment. It has to make a choice using its sensors. What's the correct logic?",
    },
    {
      emoji: '🔧',
      headline: 'Last-minute calibration before launch.',
      context: "The robot is built. The code is uploaded. But something still feels off in the response. Quick — check your fundamentals.",
    },
  ],
  space: [
    {
      emoji: '🚀',
      headline: 'Mission Control needs your answer before re-entry.',
      context: "The crew is 4 minutes from atmospheric entry. There's a discrepancy in the orbital data. You're the only one qualified to interpret it.",
    },
    {
      emoji: '🌌',
      headline: 'The telescope data is coming in.',
      context: "A 30-minute observation window just opened. The data is raw. You need to identify what you're looking at before the satellite moves on.",
    },
    {
      emoji: '🛰️',
      headline: 'The satellite is drifting off course.',
      context: "Ground control is watching your screen. The orbital mechanics don't match predictions. You need to identify why — now.",
    },
    {
      emoji: '👨‍🚀',
      headline: "You're briefing tomorrow's crew.",
      context: "Six astronauts are in front of you. What you tell them about space science will be the last briefing before launch. Make it count.",
    },
    {
      emoji: '🌍',
      headline: 'Earth-based phenomena observed from orbit.',
      context: "The crew radioed in something unusual visible from the station. Your job is to identify it and explain the science behind it.",
    },
  ],
  physics: [
    {
      emoji: '🎢',
      headline: 'The roller coaster failed its safety test.',
      context: "The engineering team found a physics error in the design. The park opens in 48 hours. Find the mistake before anyone gets on.",
    },
    {
      emoji: '🌉',
      headline: 'The bridge design needs your sign-off.',
      context: "Three hundred tons of traffic every day. The structural engineer is asking you to verify the physics. If you're wrong, people get hurt.",
    },
    {
      emoji: '⚡',
      headline: 'The circuit is pulling too much current.',
      context: "Something is wrong with the power system. The physics of the circuit tells you exactly where the failure is — if you know where to look.",
    },
    {
      emoji: '🏎️',
      headline: 'The race car needs better aerodynamics.',
      context: "Lap times are 0.3 seconds off target. The engineering team believes it's drag. The physics will tell you if they're right.",
    },
    {
      emoji: '🔭',
      headline: 'The experiment results are in.',
      context: "The physics lab just completed a critical measurement. The data needs interpretation. Your understanding of the theory will make or break the analysis.",
    },
  ],
  hackathon: [
    {
      emoji: '⏱️',
      headline: 'You have 24 hours. The clock is running.',
      context: "Your hackathon team just formed. You need to go from zero to demo in one day. Every concept you know will be tested under pressure.",
    },
    {
      emoji: '🏆',
      headline: 'The judges just walked in.',
      context: "You've been building for 20 hours. Now it's pitch time. The sharpest teams are already up. Show them you know what you're doing.",
    },
    {
      emoji: '💡',
      headline: "It's 2am and the idea still isn't clicking.",
      context: "Midnight slump. Your team is running out of steam. This is where good thinking separates winners from everyone else.",
    },
    {
      emoji: '🤝',
      headline: 'A mentor stopped by your table.',
      context: "The best mentors at hackathons ask questions that expose gaps. This one is pointed directly at you. Know your answer.",
    },
    {
      emoji: '🛠️',
      headline: 'Something broke right before the demo.',
      context: "30 minutes to presentation. Your core feature stopped working. The solution requires quick thinking — and a solid foundation.",
    },
    {
      emoji: '🎤',
      headline: "It's your turn to pitch.",
      context: "30 seconds of attention from investors and judges. What you say — and how clearly you say it — determines everything. Prove you're ready.",
    },
  ],
};

/** Pick a scenario for the current subject, rotating so it never repeats back-to-back. */
export function getScenario(subject: Subject, questionIndex: number): Scenario {
  const pool = SCENARIOS[subject] ?? SCENARIOS.math;
  return pool[questionIndex % pool.length];
}
