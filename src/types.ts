export type Question = {
  id: string;
  topicId: string;
  tier: number;
  question: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
  /** true for questions generated on-the-fly by the LLM (not from the seed bank) */
  generated?: boolean;
};

export type Subject = 'math' | 'biology' | 'python' | 'robotics' | 'chemistry' | 'space' | 'physics' | 'hackathon' | 'music';

export type TopicResource = {
  label: string;
  url: string;
};

export type Topic = {
  id: string;
  name: string;
  description: string;
  subject: Subject;
  /** Optional "learn more" links shown on the module map for this topic. */
  resources?: TopicResource[];
};

export type TopicProgress = {
  tier: number;
  xp: number;
  correctStreak: number;
  incorrectStreak: number;
  mastered: boolean;
  answeredIds: string[];
  /** Question IDs the learner answered incorrectly — shown again in Practice mode. */
  missedIds: string[];
  /** Unix ms timestamp of the last study session for this topic. */
  lastStudiedAt?: number;
  /** Unix ms timestamp when this topic is next due for review. */
  nextReviewAt?: number;
  /** How many spaced-repetition review cycles have been completed. */
  reviewCount?: number;
};

export type ModelSize = '1b' | '3b';

/** A learner's note on a specific question, kept for review later. */
export type QuestionNote = {
  id: string;
  questionId: string;
  topicId: string;
  subject: Subject;
  /** Snapshot of the question text at the time the note was written. */
  questionText: string;
  text: string;
  /** One-sentence Cornell-method summary, in the student's own words. */
  summary?: string;
  createdAt: number;
  updatedAt: number;
};

/** A "Teach It Back" entry — the learner's Feynman-technique explanation of a topic. */
export type TeachBackEntry = {
  topicId: string;
  subject: Subject;
  topicName: string;
  explanation: string;
  followUpPrompt: string;
  followUpResponse: string;
  updatedAt: number;
};

export type DreamGazeProgress = {
  /** IDs of checklist items the user has ticked off */
  checked: string[];
  /** Freeform personal notes */
  notes: string;
};

export type UserProfile = {
  age: number | null;
  voiceEnabled: boolean;
  modelSize: ModelSize;
  totalXp: number;
  badges: string[];
  topics: Record<string, TopicProgress>;
  notes: QuestionNote[];
  /** Teach It Back entries, keyed by topicId. A new submission overwrites the previous one for that topic. */
  teachBacks: Record<string, TeachBackEntry>;
  dreamGaze?: DreamGazeProgress;
};

export type AnswerEvent = 'correct-levelUp' | 'correct' | 'incorrect-levelDown' | 'incorrect';

export const MIN_TIER = 1;
export const MAX_TIER = 5;
