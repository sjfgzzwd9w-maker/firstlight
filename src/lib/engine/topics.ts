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

export const ALL_TOPICS: Topic[] = [...MATH_TOPICS, ...BIOLOGY_TOPICS];

/** Friendly name used in LLM prompts for each subject. */
export const SUBJECT_LABELS: Record<Subject, string> = {
  math: 'Algebra',
  biology: 'Biology',
};

/** Module-map route to return to (Exit / Continue) for each subject. */
export const SUBJECT_PATHS: Record<Subject, string> = {
  math: '/learn/math',
  biology: '/learn/science',
};
