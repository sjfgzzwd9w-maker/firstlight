import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import type { Question } from '../../types';
import { MIN_TIER, MAX_TIER } from '../../types';

const BANK_DIR = join(import.meta.dirname, '.');

function loadAllBanks(): { file: string; questions: Question[] }[] {
  return readdirSync(BANK_DIR)
    .filter((f) => f.startsWith('questionBank.') && f.endsWith('.json'))
    .map((file) => ({
      file,
      questions: JSON.parse(readFileSync(join(BANK_DIR, file), 'utf-8')) as Question[],
    }));
}

const banks = loadAllBanks();
const allQuestions = banks.flatMap((b) => b.questions);

describe('question bank schema', () => {
  it('loads at least one bank file', () => {
    expect(banks.length).toBeGreaterThan(0);
  });

  it('every question has required string fields', () => {
    for (const q of allQuestions) {
      expect(typeof q.id, `${q.id} — id`).toBe('string');
      expect(q.id.length, `${q.id} — id non-empty`).toBeGreaterThan(0);
      expect(typeof q.topicId, `${q.id} — topicId`).toBe('string');
      expect(q.topicId.length, `${q.id} — topicId non-empty`).toBeGreaterThan(0);
      expect(typeof q.question, `${q.id} — question`).toBe('string');
      expect(q.question.length, `${q.id} — question non-empty`).toBeGreaterThan(0);
      expect(typeof q.explanation, `${q.id} — explanation`).toBe('string');
      expect(q.explanation.length, `${q.id} — explanation non-empty`).toBeGreaterThan(0);
    }
  });

  it('every question has exactly 4 choices', () => {
    for (const q of allQuestions) {
      expect(q.choices, `${q.id}`).toHaveLength(4);
      for (const c of q.choices) {
        expect(typeof c, `${q.id} choice`).toBe('string');
        expect(c.length, `${q.id} choice non-empty`).toBeGreaterThan(0);
      }
    }
  });

  it('answerIndex is a valid index into choices', () => {
    for (const q of allQuestions) {
      expect(q.answerIndex, `${q.id}`).toBeGreaterThanOrEqual(0);
      expect(q.answerIndex, `${q.id}`).toBeLessThan(q.choices.length);
    }
  });

  it('tier is within MIN_TIER..MAX_TIER', () => {
    for (const q of allQuestions) {
      expect(q.tier, `${q.id}`).toBeGreaterThanOrEqual(MIN_TIER);
      expect(q.tier, `${q.id}`).toBeLessThanOrEqual(MAX_TIER);
    }
  });

  it('all IDs are unique across the entire bank', () => {
    const ids = allQuestions.map((q) => q.id);
    const unique = new Set(ids);
    const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(duplicates, `duplicate IDs: ${duplicates.join(', ')}`).toHaveLength(0);
    expect(unique.size).toBe(ids.length);
  });

  it('choices within a question are all distinct', () => {
    for (const q of allQuestions) {
      const unique = new Set(q.choices);
      expect(unique.size, `${q.id} has duplicate choices`).toBe(q.choices.length);
    }
  });

  it('each bank file is a non-empty array', () => {
    for (const { file, questions } of banks) {
      expect(Array.isArray(questions), `${file} should be an array`).toBe(true);
      expect(questions.length, `${file} should not be empty`).toBeGreaterThan(0);
    }
  });
});
