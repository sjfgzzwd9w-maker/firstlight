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

export type Subject = 'math' | 'biology';

export type Topic = {
  id: string;
  name: string;
  description: string;
  subject: Subject;
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

export type UserProfile = {
  age: number | null;
  voiceEnabled: boolean;
  modelSize: ModelSize;
  totalXp: number;
  badges: string[];
  topics: Record<string, TopicProgress>;
};

export type AnswerEvent = 'correct-levelUp' | 'correct' | 'incorrect-levelDown' | 'incorrect';

export const MIN_TIER = 1;
export const MAX_TIER = 5;
