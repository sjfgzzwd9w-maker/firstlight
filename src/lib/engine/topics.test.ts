import { describe, it, expect } from 'vitest';
import {
  ALL_TOPICS,
  MATH_TOPICS_ALL,
  BIOLOGY_TOPICS,
  BIOLOGY_TOPICS_PART2,
  CHEMISTRY_TOPICS_ALL,
  PYTHON_TOPICS_ALL,
  ROBOTICS_TOPICS_ALL,
  SPACE_TOPICS_ALL,
  PHYSICS_TOPICS_ALL,
  HACKATHON_TOPICS_ALL,
  SUBJECT_LABELS,
  SUBJECT_PATHS,
} from './topics';
import type { Subject } from '../../types';

const SUBJECTS: Subject[] = ['math', 'biology', 'python', 'robotics', 'chemistry', 'space', 'physics', 'hackathon'];

describe('ALL_TOPICS', () => {
  it('contains topics from every subject', () => {
    for (const subject of SUBJECTS) {
      const found = ALL_TOPICS.filter((t) => t.subject === subject);
      expect(found.length, `no topics for subject "${subject}"`).toBeGreaterThan(0);
    }
  });

  it('all topic IDs are unique', () => {
    const ids = ALL_TOPICS.map((t) => t.id);
    const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(duplicates, `duplicate topic IDs: ${duplicates.join(', ')}`).toHaveLength(0);
  });

  it('every topic has non-empty id, name, description, and subject', () => {
    for (const t of ALL_TOPICS) {
      expect(t.id.length, `${t.id} — id non-empty`).toBeGreaterThan(0);
      expect(t.name.length, `${t.id} — name non-empty`).toBeGreaterThan(0);
      expect(t.description.length, `${t.id} — description non-empty`).toBeGreaterThan(0);
      expect(SUBJECTS).toContain(t.subject);
    }
  });

  it('resource URLs are valid HTTP/HTTPS strings when present', () => {
    for (const t of ALL_TOPICS) {
      for (const r of t.resources ?? []) {
        expect(r.label.length, `${t.id} resource label non-empty`).toBeGreaterThan(0);
        expect(r.url, `${t.id} resource URL`).toMatch(/^https?:\/\//);
      }
    }
  });
});

describe('subject topic lists', () => {
  it('MATH_TOPICS_ALL subjects are all "math"', () => {
    expect(MATH_TOPICS_ALL.every((t) => t.subject === 'math')).toBe(true);
  });

  it('BIOLOGY_TOPICS + BIOLOGY_TOPICS_PART2 subjects are all "biology"', () => {
    const all = [...BIOLOGY_TOPICS, ...BIOLOGY_TOPICS_PART2];
    expect(all.every((t) => t.subject === 'biology')).toBe(true);
  });

  it('CHEMISTRY_TOPICS_ALL subjects are all "chemistry"', () => {
    expect(CHEMISTRY_TOPICS_ALL.every((t) => t.subject === 'chemistry')).toBe(true);
  });

  it('PYTHON_TOPICS_ALL subjects are all "python"', () => {
    expect(PYTHON_TOPICS_ALL.every((t) => t.subject === 'python')).toBe(true);
  });

  it('ROBOTICS_TOPICS_ALL subjects are all "robotics"', () => {
    expect(ROBOTICS_TOPICS_ALL.every((t) => t.subject === 'robotics')).toBe(true);
  });

  it('SPACE_TOPICS_ALL subjects are all "space"', () => {
    expect(SPACE_TOPICS_ALL.every((t) => t.subject === 'space')).toBe(true);
  });

  it('PHYSICS_TOPICS_ALL subjects are all "physics"', () => {
    expect(PHYSICS_TOPICS_ALL.every((t) => t.subject === 'physics')).toBe(true);
  });

  it('HACKATHON_TOPICS_ALL subjects are all "hackathon"', () => {
    expect(HACKATHON_TOPICS_ALL.every((t) => t.subject === 'hackathon')).toBe(true);
  });
});

describe('SUBJECT_LABELS', () => {
  it('has an entry for every subject', () => {
    for (const subject of SUBJECTS) {
      expect(SUBJECT_LABELS[subject], `missing label for ${subject}`).toBeTruthy();
    }
  });
});

describe('SUBJECT_PATHS', () => {
  it('has a path for every subject', () => {
    for (const subject of SUBJECTS) {
      expect(SUBJECT_PATHS[subject], `missing path for ${subject}`).toBeTruthy();
      expect(SUBJECT_PATHS[subject]).toMatch(/^\//);
    }
  });
});
