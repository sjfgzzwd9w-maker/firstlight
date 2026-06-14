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

export type Subject = 'math' | 'biology' | 'python' | 'robotics' | 'chemistry' | 'space';

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
  createdAt: number;
  updatedAt: number;
};

export type UserProfile = {
  age: number | null;
  voiceEnabled: boolean;
  modelSize: ModelSize;
  totalXp: number;
  badges: string[];
  topics: Record<string, TopicProgress>;
  notes: QuestionNote[];
};

export type AnswerEvent = 'correct-levelUp' | 'correct' | 'incorrect-levelDown' | 'incorrect';

export const MIN_TIER = 1;
export const MAX_TIER = 5;
