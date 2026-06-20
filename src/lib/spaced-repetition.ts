import type { TopicProgress } from '../types';

// Forgetting-curve intervals in days: review 1 day after first study,
// then 3, 7, 14, 30 days. After the last interval, repeat at 30 days.
const INTERVALS_DAYS = [1, 3, 7, 14, 30];

export function calcNextReviewAt(reviewCount: number): number {
  const days = INTERVALS_DAYS[Math.min(reviewCount, INTERVALS_DAYS.length - 1)];
  return Date.now() + days * 24 * 60 * 60 * 1000;
}

export function scheduleReview(progress: TopicProgress): TopicProgress {
  const reviewCount = (progress.reviewCount ?? 0) + 1;
  return {
    ...progress,
    lastStudiedAt: Date.now(),
    nextReviewAt: calcNextReviewAt(reviewCount),
    reviewCount,
  };
}

/** Returns true when the topic's review window has arrived. */
export function isDueForReview(progress: TopicProgress): boolean {
  if (!progress.nextReviewAt) return false;
  return Date.now() >= progress.nextReviewAt;
}

export function formatReviewIn(nextReviewAt: number): string {
  const ms = nextReviewAt - Date.now();
  if (ms <= 0) return 'Due now';
  const hours = Math.floor(ms / (1000 * 60 * 60));
  if (hours < 24) return hours <= 1 ? 'In ~1 hour' : `In ${hours} hours`;
  const days = Math.round(ms / (1000 * 60 * 60 * 24));
  return days === 1 ? 'Tomorrow' : `In ${days} days`;
}
