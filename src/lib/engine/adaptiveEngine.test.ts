import { describe, it, expect } from 'vitest';
import {
  createTopicProgress,
  recordAnswer,
  pickQuestion,
  placementTier,
  getQuestionById,
} from './adaptiveEngine';
import { MIN_TIER, MAX_TIER } from '../../types';

// ─── createTopicProgress ─────────────────────────────────────────────────────

describe('createTopicProgress', () => {
  it('defaults to MIN_TIER with zeroed counters', () => {
    const p = createTopicProgress();
    expect(p.tier).toBe(MIN_TIER);
    expect(p.xp).toBe(0);
    expect(p.correctStreak).toBe(0);
    expect(p.incorrectStreak).toBe(0);
    expect(p.mastered).toBe(false);
    expect(p.answeredIds).toEqual([]);
    expect(p.missedIds).toEqual([]);
  });

  it('respects an explicit starting tier', () => {
    const p = createTopicProgress(3);
    expect(p.tier).toBe(3);
  });
});

// ─── placementTier ───────────────────────────────────────────────────────────

describe('placementTier', () => {
  it('returns MIN_TIER for null age', () => {
    expect(placementTier(null)).toBe(MIN_TIER);
  });

  it('returns MIN_TIER for age < 11', () => {
    expect(placementTier(8)).toBe(MIN_TIER);
    expect(placementTier(10)).toBe(MIN_TIER);
  });

  it('returns tier 2 for age 11–13', () => {
    expect(placementTier(11)).toBe(2);
    expect(placementTier(13)).toBe(2);
  });

  it('returns tier 3 for age >= 14', () => {
    expect(placementTier(14)).toBe(3);
    expect(placementTier(18)).toBe(3);
  });

  it('never exceeds MAX_TIER', () => {
    expect(placementTier(99)).toBeLessThanOrEqual(MAX_TIER);
  });
});

// ─── recordAnswer — correct path ─────────────────────────────────────────────

describe('recordAnswer — correct answers', () => {
  it('adds XP equal to tier × 10 on a correct answer', () => {
    const p = createTopicProgress(2);
    const { progress } = recordAnswer(p, 'q1', true);
    expect(progress.xp).toBe(20);
  });

  it('increments correctStreak and resets incorrectStreak', () => {
    let p = createTopicProgress();
    p = recordAnswer(p, 'q1', true).progress;
    expect(p.correctStreak).toBe(1);
    expect(p.incorrectStreak).toBe(0);
  });

  it('emits "correct" event on first correct answer', () => {
    const p = createTopicProgress();
    const { event } = recordAnswer(p, 'q1', true);
    expect(event).toBe('correct');
  });

  it('advances tier and emits "correct-levelUp" after two correct in a row', () => {
    let p = createTopicProgress(1);
    p = recordAnswer(p, 'q1', true).progress;
    const { progress, event } = recordAnswer(p, 'q2', true);
    expect(event).toBe('correct-levelUp');
    expect(progress.tier).toBe(2);
    expect(progress.correctStreak).toBe(0);
  });

  it('marks mastered when already at MAX_TIER and levelling up', () => {
    let p = createTopicProgress(MAX_TIER);
    p = recordAnswer(p, 'q1', true).progress;
    const { progress, event } = recordAnswer(p, 'q2', true);
    expect(event).toBe('correct-levelUp');
    expect(progress.mastered).toBe(true);
    expect(progress.tier).toBe(MAX_TIER);
  });

  it('removes question from missedIds on correct answer', () => {
    let p = createTopicProgress();
    p = { ...p, missedIds: ['q1', 'q2'] };
    const { progress } = recordAnswer(p, 'q1', true);
    expect(progress.missedIds).not.toContain('q1');
    expect(progress.missedIds).toContain('q2');
  });

  it('appends questionId to answeredIds', () => {
    const p = createTopicProgress();
    const { progress } = recordAnswer(p, 'q1', true);
    expect(progress.answeredIds).toContain('q1');
  });
});

// ─── recordAnswer — incorrect path ───────────────────────────────────────────

describe('recordAnswer — incorrect answers', () => {
  it('emits "incorrect" on first wrong answer', () => {
    const p = createTopicProgress();
    const { event } = recordAnswer(p, 'q1', false);
    expect(event).toBe('incorrect');
  });

  it('increments incorrectStreak and resets correctStreak', () => {
    let p = createTopicProgress();
    p = recordAnswer(p, 'q1', true).progress; // correctStreak = 1
    const { progress } = recordAnswer(p, 'q2', false);
    expect(progress.incorrectStreak).toBe(1);
    expect(progress.correctStreak).toBe(0);
  });

  it('drops tier and emits "incorrect-levelDown" after two wrong in a row above MIN_TIER', () => {
    let p = createTopicProgress(3);
    p = recordAnswer(p, 'q1', false).progress;
    const { progress, event } = recordAnswer(p, 'q2', false);
    expect(event).toBe('incorrect-levelDown');
    expect(progress.tier).toBe(2);
    expect(progress.incorrectStreak).toBe(0);
  });

  it('does not drop below MIN_TIER on repeated wrong answers', () => {
    let p = createTopicProgress(MIN_TIER);
    p = recordAnswer(p, 'q1', false).progress;
    const { progress, event } = recordAnswer(p, 'q2', false);
    expect(event).toBe('incorrect');
    expect(progress.tier).toBe(MIN_TIER);
  });

  it('adds question to missedIds if not already present', () => {
    const p = createTopicProgress();
    const { progress } = recordAnswer(p, 'q1', false);
    expect(progress.missedIds).toContain('q1');
  });

  it('does not duplicate a question in missedIds', () => {
    let p = createTopicProgress();
    p = { ...p, missedIds: ['q1'] };
    const { progress } = recordAnswer(p, 'q1', false);
    expect(progress.missedIds.filter((id) => id === 'q1')).toHaveLength(1);
  });
});

// ─── pickQuestion ─────────────────────────────────────────────────────────────

describe('pickQuestion', () => {
  it('returns a question matching topicId and tier', () => {
    const q = pickQuestion('linear-equations', 1, []);
    expect(q).not.toBeNull();
    expect(q!.topicId).toBe('linear-equations');
    expect(q!.tier).toBe(1);
  });

  it('returns null when all questions have been answered', () => {
    // First collect all IDs for this topic/tier
    const seen: string[] = [];
    let q = pickQuestion('linear-equations', 1, seen);
    while (q !== null) {
      seen.push(q.id);
      q = pickQuestion('linear-equations', 1, seen);
    }
    expect(q).toBeNull();
  });

  it('returns null for a non-existent topic', () => {
    expect(pickQuestion('does-not-exist', 1, [])).toBeNull();
  });

  it('avoids excludeId when other candidates exist', () => {
    const first = pickQuestion('linear-equations', 1, []);
    expect(first).not.toBeNull();
    // Run many times to confirm excludeId is respected
    for (let i = 0; i < 20; i++) {
      const next = pickQuestion('linear-equations', 1, [], first!.id);
      if (next !== null) {
        expect(next.id).not.toBe(first!.id);
      }
    }
  });
});

// ─── getQuestionById ──────────────────────────────────────────────────────────

describe('getQuestionById', () => {
  it('returns the correct question for a known ID', () => {
    const q = getQuestionById('linear-equations-t1-q1');
    expect(q).not.toBeNull();
    expect(q!.id).toBe('linear-equations-t1-q1');
  });

  it('returns null for an unknown ID', () => {
    expect(getQuestionById('does-not-exist')).toBeNull();
  });
});
