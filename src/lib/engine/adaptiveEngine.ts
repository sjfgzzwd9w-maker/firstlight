import type { AnswerEvent, Question, TopicProgress } from '../../types';
import { MAX_TIER, MIN_TIER } from '../../types';
import mathQuestionBank from './questionBank.algebra2.json';
import biologyQuestionBank from './questionBank.biology.json';

const BANK = [...(mathQuestionBank as Question[]), ...(biologyQuestionBank as Question[])];

export function createTopicProgress(startTier = MIN_TIER): TopicProgress {
  return {
    tier: startTier,
    xp: 0,
    correctStreak: 0,
    incorrectStreak: 0,
    mastered: false,
    answeredIds: [],
  };
}

/**
 * Pick the next unanswered question for a topic/tier from the seed bank.
 * If `excludeId` is given and other candidates exist, avoid repeating that
 * question (used when recycling so "skip waiting" doesn't show the same one).
 */
export function pickQuestion(
  topicId: string,
  tier: number,
  answeredIds: string[],
  excludeId?: string,
): Question | null {
  let candidates = BANK.filter(
    (q) => q.topicId === topicId && q.tier === tier && !answeredIds.includes(q.id),
  );
  if (excludeId && candidates.length > 1) {
    candidates = candidates.filter((q) => q.id !== excludeId);
  }
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

/** Suggest a placement tier based on age: younger learners start a bit lower. */
export function placementTier(age: number | null): number {
  if (age === null) return MIN_TIER;
  if (age < 11) return MIN_TIER;
  if (age < 14) return Math.min(2, MAX_TIER);
  return Math.min(3, MAX_TIER);
}

const XP_PER_CORRECT = 10;

/**
 * Apply an answer to a topic's progress. Two correct answers in a row advance
 * the tier (capping at MAX_TIER and marking the topic mastered); two incorrect
 * answers in a row drop the tier (floor at MIN_TIER) so a refresher question
 * is served next.
 */
export function recordAnswer(
  progress: TopicProgress,
  questionId: string,
  correct: boolean,
): { progress: TopicProgress; event: AnswerEvent } {
  const next: TopicProgress = {
    ...progress,
    answeredIds: [...progress.answeredIds, questionId],
  };

  if (correct) {
    next.xp = progress.xp + XP_PER_CORRECT * progress.tier;
    next.correctStreak = progress.correctStreak + 1;
    next.incorrectStreak = 0;

    if (next.correctStreak >= 2) {
      next.correctStreak = 0;
      if (progress.tier >= MAX_TIER) {
        next.mastered = true;
        return { progress: next, event: 'correct-levelUp' };
      }
      next.tier = progress.tier + 1;
      return { progress: next, event: 'correct-levelUp' };
    }
    return { progress: next, event: 'correct' };
  }

  next.incorrectStreak = progress.incorrectStreak + 1;
  next.correctStreak = 0;

  if (next.incorrectStreak >= 2 && progress.tier > MIN_TIER) {
    next.incorrectStreak = 0;
    next.tier = progress.tier - 1;
    return { progress: next, event: 'incorrect-levelDown' };
  }
  return { progress: next, event: 'incorrect' };
}
