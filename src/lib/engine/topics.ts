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

export const ALL_TOPICS: Topic[] = [
  ...MATH_TOPICS_ALL,
  ...BIOLOGY_TOPICS,
  ...BIOLOGY_TOPICS_PART2,
  ...PYTHON_TOPICS_ALL,
  ...ROBOTICS_TOPICS_ALL,
];

/** Friendly name used in LLM prompts for each subject. */
export const SUBJECT_LABELS: Record<Subject, string> = {
  math: 'Algebra',
  biology: 'Biology',
  python: 'Python',
  robotics: 'Robotics',
};

/** Module-map route to return to (Exit / Continue) for each subject. */
export const SUBJECT_PATHS: Record<Subject, string> = {
  math: '/learn/math',
  biology: '/learn/science',
  python: '/learn/coding',
  robotics: '/learn/robotics',
};
