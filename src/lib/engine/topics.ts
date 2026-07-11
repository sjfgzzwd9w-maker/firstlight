import type { Subject, Topic } from '../../types';

export const MATH_TOPICS: Topic[] = [
  {
    id: 'linear-equations',
    name: 'Linear Equations',
    description: 'Solve for x with one variable',
    subject: 'math',
  },
  {
    id: 'systems-of-equations',
    name: 'Systems of Equations',
    description: 'Solve for two variables at once',
    subject: 'math',
  },
  {
    id: 'quadratics',
    name: 'Quadratics',
    description: 'Work with x-squared and roots',
    subject: 'math',
  },
  {
    id: 'exponents-polynomials',
    name: 'Exponents & Polynomials',
    description: 'Simplify and expand expressions',
    subject: 'math',
  },
  {
    id: 'functions-graphing',
    name: 'Functions & Graphing',
    description: 'Evaluate functions and read graphs',
    subject: 'math',
  },
];

export const MATH_TOPICS_PART2: Topic[] = [
  {
    id: 'piecewise-functions',
    name: 'Piecewise Functions & Function Types',
    description: 'Identify function families and evaluate piecewise-defined functions',
    subject: 'math',
    resources: [
      { label: 'Piecewise function (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Piecewise' },
      { label: 'Desmos Calculator', url: 'https://www.desmos.com/calculator' },
    ],
  },
  {
    id: 'systems-advanced-equations',
    name: 'Systems & Advanced Equations',
    description: 'Solve systems by graphing and algebra, plus radical, rational & nonlinear equations',
    subject: 'math',
    resources: [
      { label: 'System of equations (Wikipedia)', url: 'https://en.wikipedia.org/wiki/System_of_equations' },
      { label: 'Desmos Calculator', url: 'https://www.desmos.com/calculator' },
    ],
  },
  {
    id: 'statistics',
    name: 'Statistics & Data Analysis',
    description: 'Mean, median, standard deviation, z-scores & interpreting data',
    subject: 'math',
    resources: [
      { label: 'Standard deviation (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Standard_deviation' },
      { label: 'Desmos Scientific Calculator', url: 'https://www.desmos.com/scientific' },
    ],
  },
  {
    id: 'trigonometry',
    name: 'Trigonometry',
    description: 'Right-triangle trig, special angles, and the Law of Sines & Cosines',
    subject: 'math',
    resources: [
      { label: 'Trigonometry (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Trigonometry' },
      { label: 'Desmos Scientific Calculator', url: 'https://www.desmos.com/scientific' },
    ],
  },
];

/** All math topics in learning order, used for the progress sidebar. */
export const MATH_TOPICS_ALL: Topic[] = [...MATH_TOPICS, ...MATH_TOPICS_PART2];

export const BIOLOGY_TOPICS: Topic[] = [
  {
    id: 'nature-of-science',
    name: 'Nature of Science',
    description: 'The scientific method, hypotheses, and experiments',
    subject: 'biology',
  },
  {
    id: 'characteristics-of-life',
    name: 'Characteristics of Life',
    description: 'What makes something alive?',
    subject: 'biology',
  },
  {
    id: 'macromolecules',
    name: 'Macromolecules',
    description: 'Carbohydrates, lipids, proteins & nucleic acids',
    subject: 'biology',
  },
  {
    id: 'cell-theory',
    name: 'Cell Theory',
    description: 'Cell structures and their functions',
    subject: 'biology',
  },
  {
    id: 'cell-transport',
    name: 'Cell Transport',
    description: 'Diffusion, osmosis, and moving across membranes',
    subject: 'biology',
  },
  {
    id: 'cellular-processes',
    name: 'Cellular Processes',
    description: 'Photosynthesis and cellular respiration',
    subject: 'biology',
  },
  {
    id: 'ecosystem-energy-flow',
    name: 'Ecosystems & Energy Flow',
    description: 'Food chains, food webs, and energy pyramids',
    subject: 'biology',
  },
  {
    id: 'dna',
    name: 'DNA',
    description: 'Structure and replication of DNA',
    subject: 'biology',
  },
  {
    id: 'protein-synthesis',
    name: 'Transcription & Protein Synthesis',
    description: 'From DNA to RNA to proteins',
    subject: 'biology',
  },
  {
    id: 'mutations',
    name: 'Mutations',
    description: 'Changes in DNA and their effects',
    subject: 'biology',
  },
  {
    id: 'cell-division',
    name: 'Mitosis & Meiosis',
    description: 'How cells divide and reproduce',
    subject: 'biology',
  },
];

export const BIOLOGY_TOPICS_PART2: Topic[] = [
  {
    id: 'genetics',
    name: 'Genetics',
    description: 'The history of genetics and how traits are inherited',
    subject: 'biology',
  },
  {
    id: 'evolution',
    name: 'Evolution & Natural Selection',
    description: 'How species change over time',
    subject: 'biology',
  },
  {
    id: 'classification',
    name: 'Classification of Living Things',
    description: 'Taxonomy: sorting life from domain to species',
    subject: 'biology',
  },
  {
    id: 'body-and-plant-systems',
    name: 'Body & Plant Systems',
    description: 'Organ systems in animals and plants and what they do',
    subject: 'biology',
  },
  {
    id: 'ecology',
    name: 'Ecology & Ecosystems',
    description: 'How organisms interact with each other and their environment',
    subject: 'biology',
  },
];

export const PYTHON_TOPICS: Topic[] = [
  {
    id: 'python-basics',
    name: 'Python Basics',
    description: 'print(), variables, comments & input',
    subject: 'python',
  },
  {
    id: 'data-types',
    name: 'Numbers & Data Types',
    description: 'int, float, str, bool & type conversion',
    subject: 'python',
  },
  {
    id: 'strings',
    name: 'Strings',
    description: 'Slicing, formatting & string methods',
    subject: 'python',
  },
  {
    id: 'operators-conditionals',
    name: 'Operators & Conditionals',
    description: 'Arithmetic, comparisons, booleans & if/elif/else',
    subject: 'python',
  },
  {
    id: 'loops',
    name: 'Loops',
    description: 'for, while, range, break & continue',
    subject: 'python',
  },
];

export const PYTHON_TOPICS_PART2: Topic[] = [
  {
    id: 'lists-tuples',
    name: 'Lists & Tuples',
    description: 'Ordered collections, indexing & slicing',
    subject: 'python',
  },
  {
    id: 'dicts-sets',
    name: 'Dictionaries & Sets',
    description: 'Key-value pairs and unique collections',
    subject: 'python',
  },
  {
    id: 'functions',
    name: 'Functions',
    description: 'def, arguments, return values & scope',
    subject: 'python',
  },
  {
    id: 'comprehensions-lambda',
    name: 'Comprehensions & Lambda',
    description: 'Compact loops, lambda, map & filter',
    subject: 'python',
  },
  {
    id: 'errors-exceptions',
    name: 'Errors & Exceptions',
    description: 'try/except/finally and raising errors',
    subject: 'python',
  },
];

export const PYTHON_TOPICS_PART3: Topic[] = [
  {
    id: 'modules-files',
    name: 'Modules & Files',
    description: 'Imports, the standard library & file I/O',
    subject: 'python',
  },
  {
    id: 'oop',
    name: 'Object-Oriented Programming',
    description: 'Classes, objects, inheritance & dunder methods',
    subject: 'python',
  },
];

/** All Python topics in learning order, used for the progress sidebar. */
export const PYTHON_TOPICS_ALL: Topic[] = [...PYTHON_TOPICS, ...PYTHON_TOPICS_PART2, ...PYTHON_TOPICS_PART3];

export const ROBOTICS_TOPICS: Topic[] = [
  {
    id: 'robotics-intro',
    name: 'What Is a Robot?',
    description: "Robots, their parts, and where you'll find them",
    subject: 'robotics',
    resources: [
      { label: 'Robot (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Robot' },
      { label: 'NASA', url: 'https://www.nasa.gov' },
    ],
  },
  {
    id: 'robot-parts',
    name: 'Sensors, Actuators & Brains',
    description: 'The basic building blocks every robot needs',
    subject: 'robotics',
    resources: [
      { label: 'Sensor (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Sensor' },
      { label: 'Actuator (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Actuator' },
    ],
  },
  {
    id: 'power-energy',
    name: 'Power & Energy',
    description: 'Batteries, motors, and where a robot gets its energy',
    subject: 'robotics',
    resources: [
      { label: 'Electric battery (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Electric_battery' },
      { label: 'Electric motor (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Electric_motor' },
    ],
  },
  {
    id: 'simple-machines',
    name: 'Simple Machines & Movement',
    description: 'Levers, gears, wheels, and the physics of motion',
    subject: 'robotics',
    resources: [
      { label: 'Simple machine (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Simple_machine' },
      { label: 'Gear (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Gear' },
    ],
  },
];

export const ROBOTICS_TOPICS_PART2: Topic[] = [
  {
    id: 'circuits-electronics',
    name: 'Circuits & Electronics',
    description: 'Voltage, current, switches, and breadboards',
    subject: 'robotics',
    resources: [
      { label: 'Electronic circuit (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Electronic_circuit' },
      { label: 'Arduino', url: 'https://www.arduino.cc' },
    ],
  },
  {
    id: 'sensors-input',
    name: 'Advanced Sensors & Input',
    description: 'How robots see, hear, and feel the world around them',
    subject: 'robotics',
    resources: [
      { label: 'Proximity sensor (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Proximity_sensor' },
      { label: 'Photoresistor (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Photoresistor' },
    ],
  },
  {
    id: 'programming-basics-robotics',
    name: 'Programming Robots',
    description: 'Loops, conditionals, and pseudocode for robot behavior',
    subject: 'robotics',
    resources: [
      { label: 'Arduino', url: 'https://www.arduino.cc' },
      { label: 'Code.org', url: 'https://code.org' },
    ],
  },
];

export const ROBOTICS_TOPICS_PART3: Topic[] = [
  {
    id: 'control-systems',
    name: 'Control & Feedback',
    description: 'Open-loop vs. closed-loop control and line-following logic',
    subject: 'robotics',
    resources: [
      { label: 'Control theory (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Control_theory' },
      { label: 'PID controller (Wikipedia)', url: 'https://en.wikipedia.org/wiki/PID_controller' },
    ],
  },
  {
    id: 'kinematics-movement',
    name: 'Movement & Kinematics',
    description: 'Degrees of freedom, wheels, legs, and robot arms',
    subject: 'robotics',
    resources: [
      { label: 'Kinematics (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Kinematics' },
      { label: 'Robotic arm (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Robotic_arm' },
    ],
  },
  {
    id: 'ai-robotics-future',
    name: 'AI, Ethics & the Future',
    description: 'Machine learning in robots, safety, and real-world impact',
    subject: 'robotics',
    resources: [
      { label: 'Artificial intelligence (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Artificial_intelligence' },
      { label: 'Ethics of AI (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Ethics_of_artificial_intelligence' },
    ],
  },
];

export const ROBOTICS_TOPICS_PART4: Topic[] = [
  {
    id: 'vex-gear-ratios',
    name: 'Gears & Gear Ratios',
    description: 'Mechanical advantage, torque vs. speed, and calculating gear ratios',
    subject: 'robotics',
    resources: [
      { label: 'Gear train (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Gear_train' },
      { label: 'VEX Robotics', url: 'https://www.vexrobotics.com' },
    ],
  },
  {
    id: 'vex-drivetrains',
    name: 'Drivetrains & Wheels',
    description: 'Tank drive, omni & mecanum wheels, and how wheel size affects speed and distance',
    subject: 'robotics',
    resources: [
      { label: 'Mecanum wheel (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Mecanum_wheel' },
      { label: 'VEX Robotics', url: 'https://www.vexrobotics.com' },
    ],
  },
  {
    id: 'vex-motors-power',
    name: 'Motors & Power Management',
    description: 'VEX Smart Motors, gear cartridges, RPM vs. torque, and managing battery power',
    subject: 'robotics',
    resources: [
      { label: 'Torque (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Torque' },
      { label: 'VEX Robotics', url: 'https://www.vexrobotics.com' },
    ],
  },
  {
    id: 'vex-build-design',
    name: 'Building, Design & Strategy',
    description: 'Chassis design, center of gravity, autonomous routines, and competition strategy',
    subject: 'robotics',
    resources: [
      { label: 'VEX Robotics Competition (Wikipedia)', url: 'https://en.wikipedia.org/wiki/VEX_Robotics_Competition' },
      { label: 'VEX Robotics', url: 'https://www.vexrobotics.com' },
    ],
  },
];

/** All robotics topics in learning order, used for the progress sidebar. */
export const ROBOTICS_TOPICS_ALL: Topic[] = [
  ...ROBOTICS_TOPICS,
  ...ROBOTICS_TOPICS_PART2,
  ...ROBOTICS_TOPICS_PART3,
  ...ROBOTICS_TOPICS_PART4,
];

export const CHEMISTRY_TOPICS: Topic[] = [
  {
    id: 'chem-metric-measurement',
    name: 'Metric System & Conversions',
    description: 'Metric prefixes, base units, and converting between them',
    subject: 'chemistry',
    resources: [
      { label: 'Metric system (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Metric_system' },
      { label: 'Unit of measurement (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Unit_of_measurement' },
    ],
  },
  {
    id: 'chem-sci-notation-sigfigs',
    name: 'Scientific Notation & Significant Figures',
    description: 'Writing very large or small numbers and counting significant digits',
    subject: 'chemistry',
    resources: [
      { label: 'Scientific notation (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Scientific_notation' },
      { label: 'Significant figures (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Significant_figures' },
    ],
  },
  {
    id: 'chem-density-dimensional-analysis',
    name: 'Density & Dimensional Analysis',
    description: 'Calculating density and converting units with conversion factors',
    subject: 'chemistry',
    resources: [
      { label: 'Density (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Density' },
      { label: 'Dimensional analysis (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Dimensional_analysis' },
    ],
  },
  {
    id: 'chem-matter-classification',
    name: 'Classifying Matter & Changes',
    description: 'Physical vs. chemical changes and properties, and the types of matter',
    subject: 'chemistry',
    resources: [
      { label: 'Matter (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Matter' },
      { label: 'Chemical change (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Chemical_change' },
    ],
  },
];

export const CHEMISTRY_TOPICS_PART2: Topic[] = [
  {
    id: 'chem-atomic-history',
    name: 'History of the Atom',
    description: 'Atomic models from Dalton to the modern model, plus the Gold Foil and Cathode Ray Tube experiments',
    subject: 'chemistry',
    resources: [
      { label: 'Atomic theory (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Atomic_theory' },
      { label: "Rutherford's gold foil experiment (Wikipedia)", url: "https://en.wikipedia.org/wiki/Rutherford's_gold_foil_experiment" },
    ],
  },
  {
    id: 'chem-atomic-structure-isotopes',
    name: 'Atomic Structure, Numbers & Isotopes',
    description: 'Protons, neutrons, electrons, atomic number, mass number, and isotopes',
    subject: 'chemistry',
    resources: [
      { label: 'Atom (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Atom' },
      { label: 'Isotope (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Isotope' },
    ],
  },
  {
    id: 'chem-nuclear-radioactivity',
    name: 'Radioactivity & Nuclear Equations',
    description: 'Alpha, beta and gamma particles, writing nuclear equations, and decay series',
    subject: 'chemistry',
    resources: [
      { label: 'Radioactive decay (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Radioactive_decay' },
      { label: 'Decay chain (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Decay_chain' },
    ],
  },
  {
    id: 'chem-half-life',
    name: 'Half-Life Calculations',
    description: 'Figuring out how much of a radioactive sample remains after a number of half-lives',
    subject: 'chemistry',
    resources: [
      { label: 'Half-life (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Half-life' },
      { label: 'Desmos Scientific Calculator', url: 'https://www.desmos.com/scientific' },
    ],
  },
];

export const CHEMISTRY_TOPICS_PART3: Topic[] = [
  {
    id: 'chem-orbitals-quantum',
    name: 'Orbitals & Quantum Numbers',
    description: 'Types of orbitals (s, p, d, f), orbital numbers, and orbital diagrams',
    subject: 'chemistry',
    resources: [
      { label: 'Atomic orbital (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Atomic_orbital' },
      { label: 'Quantum number (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Quantum_number' },
    ],
  },
  {
    id: 'chem-electron-configuration',
    name: 'Electron Configuration',
    description: "The Aufbau principle, Hund's rule and Pauli exclusion — writing configurations from the periodic table",
    subject: 'chemistry',
    resources: [
      { label: 'Electron configuration (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Electron_configuration' },
      { label: 'Aufbau principle (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Aufbau_principle' },
    ],
  },
  {
    id: 'chem-ion-noble-gas-config',
    name: 'Ion & Noble Gas Configurations',
    description: 'Electron configurations for ions and noble-gas shorthand notation',
    subject: 'chemistry',
    resources: [
      { label: 'Electron configuration (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Electron_configuration' },
      { label: 'Noble gas (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Noble_gas' },
    ],
  },
  {
    id: 'chem-spectra',
    name: 'Absorption & Emission Spectra',
    description: 'How electrons absorb and emit light as they jump between energy levels',
    subject: 'chemistry',
    resources: [
      { label: 'Emission spectrum (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Emission_spectrum' },
      { label: 'Absorption spectrum (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Absorption_spectrum' },
    ],
  },
];

/** All chemistry topics in learning order, used for the progress sidebar. */
export const CHEMISTRY_TOPICS_ALL: Topic[] = [
  ...CHEMISTRY_TOPICS,
  ...CHEMISTRY_TOPICS_PART2,
  ...CHEMISTRY_TOPICS_PART3,
];

export const SPACE_TOPICS: Topic[] = [
  {
    id: 'solar-system',
    name: 'The Solar System',
    description: 'The Sun, planets, moons, and dwarf planets',
    subject: 'space',
    resources: [
      { label: 'NASA Solar System Exploration', url: 'https://solarsystem.nasa.gov' },
      { label: 'Solar System (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Solar_System' },
    ],
  },
  {
    id: 'moon-phases',
    name: 'The Moon & Lunar Phases',
    description: 'Phases, eclipses, and tides',
    subject: 'space',
    resources: [
      { label: 'NASA Moon', url: 'https://moon.nasa.gov' },
      { label: 'Lunar phase (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Lunar_phase' },
    ],
  },
  {
    id: 'gravity-orbits',
    name: 'Gravity & Orbits',
    description: "Kepler's laws, orbits, and how things stay up",
    subject: 'space',
    resources: [
      { label: 'Orbit (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Orbit' },
      { label: "Kepler's laws (Wikipedia)", url: "https://en.wikipedia.org/wiki/Kepler's_laws_of_planetary_motion" },
    ],
  },
  {
    id: 'stars-stellar-evolution',
    name: 'Stars & Stellar Evolution',
    description: 'How stars are born, live, and die',
    subject: 'space',
    resources: [
      { label: 'NASA: Stars', url: 'https://science.nasa.gov/universe/stars/' },
      { label: 'Stellar evolution (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Stellar_evolution' },
    ],
  },
  {
    id: 'light-spectrum',
    name: 'Light & the Electromagnetic Spectrum',
    description: 'How astronomers use light to study space',
    subject: 'space',
    resources: [
      { label: 'NASA: Electromagnetic Spectrum', url: 'https://science.nasa.gov/ems/' },
      { label: 'Electromagnetic spectrum (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Electromagnetic_spectrum' },
    ],
  },
];

export const SPACE_TOPICS_PART2: Topic[] = [
  {
    id: 'space-exploration-history',
    name: 'History of Space Exploration',
    description: 'From Sputnik to the ISS and beyond',
    subject: 'space',
    resources: [
      { label: 'NASA History', url: 'https://www.nasa.gov/history/' },
      { label: 'Space exploration (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Space_exploration' },
    ],
  },
  {
    id: 'rockets-spaceflight',
    name: 'Rockets & Spaceflight',
    description: 'How rockets work and reach space',
    subject: 'space',
    resources: [
      { label: 'NASA', url: 'https://www.nasa.gov' },
      { label: 'Rocket (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Rocket' },
    ],
  },
  {
    id: 'satellites-technology',
    name: 'Satellites & Space Technology',
    description: 'Satellites, telescopes, and GPS',
    subject: 'space',
    resources: [
      { label: 'NASA', url: 'https://www.nasa.gov' },
      { label: 'Satellite (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Satellite' },
    ],
  },
  {
    id: 'galaxies-universe',
    name: 'Galaxies & the Universe',
    description: 'The Milky Way, galaxy types, and the Big Bang',
    subject: 'space',
    resources: [
      { label: 'NASA: Galaxies', url: 'https://science.nasa.gov/universe/galaxies/' },
      { label: 'Galaxy (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Galaxy' },
    ],
  },
  {
    id: 'black-holes-extreme',
    name: 'Black Holes & Extreme Objects',
    description: 'Neutron stars, black holes, and extreme gravity',
    subject: 'space',
    resources: [
      { label: 'NASA: Black Holes', url: 'https://science.nasa.gov/universe/black-holes/' },
      { label: 'Black hole (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Black_hole' },
    ],
  },
  {
    id: 'exoplanets-life',
    name: 'Exoplanets & the Search for Life',
    description: 'Other worlds and the hunt for life beyond Earth',
    subject: 'space',
    resources: [
      { label: 'NASA Exoplanet Exploration', url: 'https://exoplanets.nasa.gov' },
      { label: 'Exoplanet (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Exoplanet' },
    ],
  },
];

/** All space topics in learning order, used for the progress sidebar. */
export const SPACE_TOPICS_ALL: Topic[] = [...SPACE_TOPICS, ...SPACE_TOPICS_PART2];

export const PHYSICS_TOPICS: Topic[] = [
  {
    id: 'physics-measurement',
    name: 'Measurement & Scientific Notation',
    description: 'SI units, significant figures, and scientific notation',
    subject: 'physics',
    resources: [
      { label: 'SI Units (Wikipedia)', url: 'https://en.wikipedia.org/wiki/International_System_of_Units' },
      { label: 'Scientific notation (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Scientific_notation' },
    ],
  },
  {
    id: 'kinematics-1d',
    name: 'Motion in 1D',
    description: 'Velocity, acceleration, and the kinematic equations',
    subject: 'physics',
    resources: [
      { label: 'Kinematics (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Kinematics' },
      { label: 'Desmos Calculator', url: 'https://www.desmos.com/calculator' },
    ],
  },
  {
    id: 'kinematics-2d',
    name: 'Vectors & Projectile Motion',
    description: 'Vector components, 2D motion, and projectile trajectories',
    subject: 'physics',
    resources: [
      { label: 'Projectile motion (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Projectile_motion' },
      { label: 'Desmos Calculator', url: 'https://www.desmos.com/calculator' },
    ],
  },
];

export const PHYSICS_TOPICS_PART2: Topic[] = [
  {
    id: 'newtons-laws',
    name: "Newton's Laws of Motion",
    description: 'Inertia, F = ma, and action-reaction pairs',
    subject: 'physics',
    resources: [
      { label: "Newton's laws (Wikipedia)", url: 'https://en.wikipedia.org/wiki/Newton%27s_laws_of_motion' },
      { label: 'PhET Forces Sim', url: 'https://phet.colorado.edu/en/simulations/forces-and-motion-basics' },
    ],
  },
  {
    id: 'forces-equilibrium',
    name: 'Friction, Normal Force & Equilibrium',
    description: 'Static and kinetic friction, free-body diagrams, and balanced forces',
    subject: 'physics',
    resources: [
      { label: 'Friction (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Friction' },
      { label: 'Mechanical equilibrium (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Mechanical_equilibrium' },
    ],
  },
  {
    id: 'work-energy-power',
    name: 'Work, Energy & Power',
    description: 'Kinetic and potential energy, conservation of energy, and power',
    subject: 'physics',
    resources: [
      { label: 'Conservation of energy (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Conservation_of_energy' },
      { label: 'PhET Energy Skate Park', url: 'https://phet.colorado.edu/en/simulations/energy-skate-park' },
    ],
  },
  {
    id: 'momentum-impulse',
    name: 'Momentum, Impulse & Collisions',
    description: 'Conservation of momentum, impulse, elastic and inelastic collisions',
    subject: 'physics',
    resources: [
      { label: 'Momentum (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Momentum' },
      { label: 'PhET Collision Lab', url: 'https://phet.colorado.edu/en/simulations/collision-lab' },
    ],
  },
];

export const PHYSICS_TOPICS_PART3: Topic[] = [
  {
    id: 'waves-sound',
    name: 'Waves & Sound',
    description: 'Wave properties, interference, the Doppler effect, and resonance',
    subject: 'physics',
    resources: [
      { label: 'Wave (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Wave' },
      { label: 'PhET Wave Interference', url: 'https://phet.colorado.edu/en/simulations/wave-interference' },
    ],
  },
  {
    id: 'electricity-circuits',
    name: 'Electricity & Circuits',
    description: "Ohm's law, series and parallel circuits, and electric power",
    subject: 'physics',
    resources: [
      { label: "Ohm's law (Wikipedia)", url: 'https://en.wikipedia.org/wiki/Ohm%27s_law' },
      { label: 'PhET Circuit Construction Kit', url: 'https://phet.colorado.edu/en/simulations/circuit-construction-kit-dc' },
    ],
  },
  {
    id: 'magnetism',
    name: 'Magnetism & Electromagnetism',
    description: 'Magnetic fields, induction, transformers, and motors',
    subject: 'physics',
    resources: [
      { label: 'Electromagnetism (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Electromagnetism' },
      { label: 'Faraday\'s law (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Faraday%27s_law_of_induction' },
    ],
  },
];

/** All physics topics in learning order, used for the progress sidebar. */
export const PHYSICS_TOPICS_ALL: Topic[] = [
  ...PHYSICS_TOPICS,
  ...PHYSICS_TOPICS_PART2,
  ...PHYSICS_TOPICS_PART3,
];

export const HACKATHON_TOPICS: Topic[] = [
  {
    id: 'hackathon-beginner-skills',
    name: 'Skills Every Beginner Needs',
    description: 'Coding basics, design thinking, and the tools that make you ready',
    subject: 'hackathon',
    resources: [
      { label: 'freeCodeCamp', url: 'https://www.freecodecamp.org' },
      { label: 'The Odin Project', url: 'https://www.theodinproject.com' },
    ],
  },
  {
    id: 'hackathon-thinking',
    name: 'Thinking Like a Problem Solver',
    description: 'Ideation, breaking down problems, and finding ideas worth building',
    subject: 'hackathon',
    resources: [
      { label: "IDEO Design Thinking", url: 'https://designthinking.ideo.com' },
      { label: 'Stanford d.school', url: 'https://dschool.stanford.edu' },
    ],
  },
  {
    id: 'hackathon-mastery',
    name: 'Mastering Your Skills',
    description: 'Deliberate practice, building a portfolio, and leveling up fast',
    subject: 'hackathon',
    resources: [
      { label: 'GitHub', url: 'https://github.com' },
      { label: 'Devpost', url: 'https://devpost.com' },
    ],
  },
];

export const HACKATHON_TOPICS_PART2: Topic[] = [
  {
    id: 'hackathon-finding',
    name: 'Finding Hackathons as a Teen',
    description: 'MLH, Devpost, school events, and how to search for the right fit',
    subject: 'hackathon',
    resources: [
      { label: 'Major League Hacking (MLH)', url: 'https://mlh.io' },
      { label: 'Devpost Hackathons', url: 'https://devpost.com/hackathons' },
    ],
  },
  {
    id: 'hackathon-participating',
    name: 'How to Participate & Win',
    description: 'Team formation, ideation sprints, time management, and pitching',
    subject: 'hackathon',
    resources: [
      { label: 'MLH Hackathon Guide', url: 'https://guide.mlh.io' },
      { label: 'Devpost Tips', url: 'https://info.devpost.com/blog' },
    ],
  },
  {
    id: 'hackathon-learning',
    name: 'What to Learn from Every Hackathon',
    description: 'Retrospectives, turning projects into portfolio pieces, and networking',
    subject: 'hackathon',
    resources: [
      { label: 'GitHub Student Pack', url: 'https://education.github.com/pack' },
      { label: 'LinkedIn for Students', url: 'https://www.linkedin.com/pulse/topics/student/' },
    ],
  },
];

/** All hackathon topics in learning order. */
export const HACKATHON_TOPICS_ALL: Topic[] = [
  ...HACKATHON_TOPICS,
  ...HACKATHON_TOPICS_PART2,
];

export const ALL_TOPICS: Topic[] = [
  ...MATH_TOPICS_ALL,
  ...BIOLOGY_TOPICS,
  ...BIOLOGY_TOPICS_PART2,
  ...CHEMISTRY_TOPICS_ALL,
  ...PYTHON_TOPICS_ALL,
  ...ROBOTICS_TOPICS_ALL,
  ...SPACE_TOPICS_ALL,
  ...PHYSICS_TOPICS_ALL,
  ...HACKATHON_TOPICS_ALL,
];

/** Friendly name used in LLM prompts for each subject. */
export const SUBJECT_LABELS: Record<Subject, string> = {
  math: 'Algebra',
  biology: 'Biology',
  python: 'Python',
  robotics: 'Robotics',
  chemistry: 'Chemistry',
  space: 'Space Science',
  physics: 'Physics',
  hackathon: 'Hackathon',
  // Placeholder — no Music content/routes yet, planned for a future subject.
  music: 'Music',
};

/** Module-map route to return to (Exit / Continue) for each subject. */
export const SUBJECT_PATHS: Record<Subject, string> = {
  math: '/learn/math',
  biology: '/learn/biology',
  python: '/learn/coding',
  robotics: '/learn/robotics',
  chemistry: '/learn/chemistry',
  space: '/learn/space',
  physics: '/learn/physics',
  hackathon: '/learn/hackathon',
  // Placeholder — Music has no module map route yet.
  music: '/learn/music',
};
