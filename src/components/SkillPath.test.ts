import { describe, expect, it } from 'vitest';
import { isUnlocked } from './SkillPath';
import type { Topic, TopicProgress } from '../types';

const topics: Topic[] = [
  { id: 'a', name: 'A', description: '', subject: 'math' },
  { id: 'b', name: 'B', description: '', subject: 'math' },
];

function progressAt(tier: number, mastered = false): TopicProgress {
  return { tier, xp: 0, correctStreak: 0, incorrectStreak: 0, mastered, answeredIds: [], missedIds: [] };
}

describe('isUnlocked', () => {
  it('unlocks the first topic of a section when there is no previousTopicId', () => {
    expect(isUnlocked(topics, {}, 0)).toBe(true);
  });

  it('locks the first topic of a later section until the previous section is progressed', () => {
    expect(isUnlocked(topics, {}, 0, 'part1-last-topic')).toBe(false);
  });

  it('unlocks the first topic of a later section once the previous section topic reaches the unlock tier', () => {
    const progress = { 'part1-last-topic': progressAt(3) };
    expect(isUnlocked(topics, progress, 0, 'part1-last-topic')).toBe(true);
  });

  it('unlocks the first topic of a later section once the previous section topic is mastered', () => {
    const progress = { 'part1-last-topic': progressAt(1, true) };
    expect(isUnlocked(topics, progress, 0, 'part1-last-topic')).toBe(true);
  });

  it('locks a mid-list topic until the immediately preceding topic in the same list is progressed', () => {
    expect(isUnlocked(topics, {}, 1)).toBe(false);
    const progress = { a: progressAt(3) };
    expect(isUnlocked(topics, progress, 1)).toBe(true);
  });
});
