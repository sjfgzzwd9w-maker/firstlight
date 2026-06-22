/** One emoji + short label per topic, shown as a mini-header on the QuestionCard.
 *  Falls back to the topic's own name if not listed here.
 */
export const TOPIC_CONTEXT: Record<string, { emoji: string; label: string }> = {
  // ── Math ───────────────────────────────────────────────────────────────────
  'linear-equations':          { emoji: '📐', label: 'Finding the unknown — real engineers do this daily' },
  'systems-of-equations':      { emoji: '⚖️', label: 'Two unknowns, two rules — balance them both' },
  'quadratics':                { emoji: '🎯', label: 'The curve that describes falling objects, profits, and more' },
  'exponents-polynomials':     { emoji: '🔢', label: 'Repeated growth — the math behind compound interest and signals' },
  'functions-graphing':        { emoji: '📈', label: 'Every app, model, and graph is a function underneath' },
  'piecewise-functions':       { emoji: '🔀', label: 'Real systems have rules that change — piecewise captures that' },
  'systems-advanced-equations': { emoji: '🧮', label: 'When multiple constraints collide — solve them together' },
  'statistics':                { emoji: '📊', label: 'Data is everywhere; knowing what it says is the skill' },
  'trigonometry':              { emoji: '🔭', label: 'Angles and waves — used in physics, audio, and game engines' },

  // ── Biology ────────────────────────────────────────────────────────────────
  'nature-of-science':         { emoji: '🔬', label: 'How scientists ask and answer questions about life' },
  'characteristics-of-life':   { emoji: '🌱', label: 'What separates living from non-living — it is not obvious' },
  'macromolecules':            { emoji: '🧬', label: 'The four molecules that build every living thing on Earth' },
  'cell-theory':               { emoji: '🦠', label: 'The smallest unit of life — and why it took centuries to find' },
  'cell-transport':            { emoji: '🚪', label: 'How cells decide what gets in and what stays out' },
  'cellular-processes':        { emoji: '⚡', label: 'How your cells make and spend energy right now' },
  'ecosystem-energy-flow':     { emoji: '🌍', label: 'Every ecosystem runs on energy — trace where it goes' },
  'dna':                       { emoji: '🧬', label: 'The blueprint inside every one of your 37 trillion cells' },
  'protein-synthesis':         { emoji: '🏭', label: 'From DNA code to working protein — the cell is a factory' },
  'mutations':                 { emoji: '🔄', label: 'Copy errors in DNA — some are harmless, some reshape life' },
  'cell-division':             { emoji: '✂️', label: 'Growth, repair, and reproduction all start here' },
  'genetics':                  { emoji: '👪', label: 'Why you look like your parents — and sometimes you do not' },
  'evolution':                 { emoji: '🦋', label: 'Four billion years of change — the mechanism that drives all life' },
  'classification':            { emoji: '🗂️', label: 'Over 8 million species — scientists need a system' },
  'body-and-plant-systems':    { emoji: '🫀', label: 'Your body runs multiple systems in parallel, all coordinated' },
  'ecology':                   { emoji: '🌿', label: 'Every species is connected — remove one, the web shifts' },

  // ── Python ─────────────────────────────────────────────────────────────────
  'python-basics':             { emoji: '🐍', label: 'The first real code you write — and it already does real things' },
  'data-types':                { emoji: '🔢', label: 'Numbers, text, true/false — computers see only these' },
  'strings':                   { emoji: '✍️', label: 'Text is data. Search engines, chatbots, and apps run on this' },
  'operators-conditionals':    { emoji: '🔀', label: 'Make decisions in code — the if/else that powers every app' },
  'loops':                     { emoji: '🔁', label: 'Repeat without repeating yourself — the core of automation' },
  'lists-tuples':              { emoji: '📋', label: 'Store many values, work with all of them at once' },
  'dicts-sets':                { emoji: '🗂️', label: 'Key-value pairs — how databases, APIs, and configs work' },
  'functions':                 { emoji: '📦', label: 'Write once, use everywhere — functions are reusable tools' },
  'comprehensions-lambda':     { emoji: '⚡', label: 'Compact power — write less code that does more' },
  'errors-exceptions':         { emoji: '🛡️', label: 'Every real program breaks sometimes — handle it gracefully' },
  'modules-files':             { emoji: '📁', label: 'Programs that read, write, and share data with the world' },
  'oop':                       { emoji: '🏗️', label: 'Build systems with objects — how large codebases stay organized' },

  // ── Robotics ───────────────────────────────────────────────────────────────
  'robotics-intro':            { emoji: '🤖', label: 'What makes a robot tick — and why it matters for your future' },
  'robot-parts':               { emoji: '🔧', label: 'Know the hardware — every component has a job' },
  'power-energy':              { emoji: '🔋', label: 'No power, no robot — understanding energy in systems' },
  'simple-machines':           { emoji: '⚙️', label: 'Levers, gears, and pulleys — physics made mechanical' },
  'circuits-electronics':      { emoji: '⚡', label: 'Current, voltage, resistance — the language of electronics' },
  'sensors-input':             { emoji: '👁️', label: 'How robots sense the world — sight, touch, distance' },
  'programming-basics-robotics': { emoji: '💻', label: 'Make it move — the code that turns intention into action' },
  'control-systems':           { emoji: '🎮', label: 'Feedback loops — how robots correct themselves in real time' },
  'kinematics-movement':       { emoji: '🏃', label: 'Position, velocity, acceleration — the math of motion' },
  'ai-robotics-future':        { emoji: '🧠', label: 'Where robots are going — machine learning meets hardware' },
  'vex-gear-ratios':           { emoji: '⚙️', label: 'Speed vs. torque — the engineering tradeoff behind every drive' },
  'vex-drivetrains':           { emoji: '🚗', label: 'How your bot moves — wheels, tracks, and steering logic' },
  'vex-motors-power':          { emoji: '🔋', label: 'Power limits are real — design around them or lose' },
  'vex-build-design':          { emoji: '📐', label: 'Structural decisions made at build time define performance later' },

  // ── Chemistry ──────────────────────────────────────────────────────────────
  'chem-metric-measurement':           { emoji: '📏', label: 'Science lives and dies on precise measurement' },
  'chem-sci-notation-sigfigs':         { emoji: '🔢', label: 'Huge and tiny numbers — how scientists write them accurately' },
  'chem-density-dimensional-analysis': { emoji: '⚖️', label: 'Unit conversions that let you cross from grams to moles' },
  'chem-matter-classification':        { emoji: '🧪', label: 'Everything is matter — and chemists sort it carefully' },
  'chem-atomic-history':               { emoji: '⏳', label: '2500 years of atomic theory — each model was an upgrade' },
  'chem-atomic-structure-isotopes':    { emoji: '⚛️', label: 'Protons, neutrons, electrons — the three-part recipe for all matter' },
  'chem-nuclear-radioactivity':        { emoji: '☢️', label: 'Unstable atoms decay — energy and medicine both depend on this' },
  'chem-half-life':                    { emoji: '⏱️', label: 'Predictable decay — used to date fossils, track drugs, run reactors' },
  'chem-orbitals-quantum':             { emoji: '🌀', label: 'Electrons do not orbit like planets — quantum mechanics shows why' },
  'chem-electron-configuration':       { emoji: '🔲', label: "How electrons fill shells — this determines every element's behavior" },
  'chem-ion-noble-gas-config':         { emoji: '⚡', label: 'Charged atoms and the stable configuration they all want' },
  'chem-spectra':                      { emoji: '🌈', label: 'Each element has a unique light fingerprint — astronomers read stars with this' },

  // ── Space ──────────────────────────────────────────────────────────────────
  'solar-system':              { emoji: '🌍', label: 'Eight planets, countless objects — know your neighborhood' },
  'moon-phases':               { emoji: '🌙', label: 'The Moon has driven navigation and calendars for millennia' },
  'gravity-orbits':            { emoji: '🔭', label: 'Gravity is the force that holds galaxies together — and keeps you on Earth' },
  'stars-stellar-evolution':   { emoji: '⭐', label: 'Stars are born, live billions of years, and die dramatically' },
  'light-spectrum':            { emoji: '🌈', label: 'Light carries information — astronomers read the universe through it' },
  'space-exploration-history': { emoji: '🚀', label: '60 years of space missions — each one expanded what humans can do' },
  'rockets-spaceflight':       { emoji: '🛸', label: 'Physics made escape-proof — understand the math of launch' },
  'satellites-technology':     { emoji: '🛰️', label: 'GPS, weather, internet — satellites run your daily life from orbit' },
  'galaxies-universe':         { emoji: '🌌', label: 'Beyond our galaxy — the scale of the universe is hard to believe' },
  'black-holes-extreme':       { emoji: '🕳️', label: 'Where physics breaks — black holes test everything we know' },
  'exoplanets-life':           { emoji: '👽', label: 'Are we alone? Exoplanets are where the search begins' },

  // ── Physics ────────────────────────────────────────────────────────────────
  'physics-measurement':       { emoji: '📏', label: 'Precision matters — all physics starts with careful measurement' },
  'kinematics-1d':             { emoji: '🏃', label: 'Motion in a straight line — the foundation of all mechanics' },
  'kinematics-2d':             { emoji: '🎯', label: 'Projectile motion — used in sports, artillery, and spacecraft' },
  'newtons-laws':              { emoji: '🍎', label: 'Three laws that explain every push and pull in the universe' },
  'forces-equilibrium':        { emoji: '⚖️', label: 'When forces balance — bridges, scales, and buildings depend on this' },
  'work-energy-power':         { emoji: '⚡', label: 'Energy cannot be created or destroyed — only converted' },
  'momentum-impulse':          { emoji: '🎱', label: 'Collisions carry history — momentum is conserved always' },
  'waves-sound':               { emoji: '🔊', label: 'Waves carry energy and information — sound, light, and Wi-Fi all wave' },
  'electricity-circuits':      { emoji: '💡', label: 'Current, voltage, resistance — everything powered runs on this' },
  'magnetism':                 { emoji: '🧲', label: 'Electric and magnetic forces are the same force — just different perspectives' },

  // ── Hackathon ──────────────────────────────────────────────────────────────
  'hackathon-beginner-skills': { emoji: '🛠️', label: 'The skills that let you start — even with no experience' },
  'hackathon-thinking':        { emoji: '🧩', label: 'Problem-solving beats coding talent every time at hackathons' },
  'hackathon-mastery':         { emoji: '🎯', label: 'The gap between good and winning is how sharp your skills are' },
  'hackathon-finding':         { emoji: '🗺️', label: 'Hackathons are everywhere — know where and how to find them' },
  'hackathon-participating':   { emoji: '🏆', label: 'Showing up is step one — here is how to actually compete' },
  'hackathon-learning':        { emoji: '📈', label: 'Win or lose, every hackathon should make you sharper' },
};

/** Get the context label for a topic, falling back to the topic name if not mapped. */
export function getTopicContext(topicId: string, topicName: string): { emoji: string; label: string } {
  return TOPIC_CONTEXT[topicId] ?? { emoji: '💡', label: topicName };
}
