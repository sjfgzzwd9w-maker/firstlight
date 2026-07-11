import { describe, expect, it } from 'vitest';
import { saveNote, removeNote, saveTeachBack, removeTeachBack } from './progress';
import type { Question, Subject, UserProfile } from '../../types';

function makeProfile(): UserProfile {
  return {
    age: 14,
    voiceEnabled: true,
    modelSize: '1b',
    totalXp: 0,
    badges: [],
    topics: {},
    notes: [],
    teachBacks: {},
  };
}

const question: Question = {
  id: 'algebra2-linear-t1-q1',
  topicId: 'linear-equations',
  tier: 1,
  question: 'Solve for x: 2x = 4',
  choices: ['1', '2', '3', '4'],
  answerIndex: 1,
  explanation: 'Divide both sides by 2.',
};

describe('saveNote', () => {
  it('stores the summary alongside the note text', () => {
    const profile = saveNote(makeProfile(), question, 'Remember to divide.', 'x equals 2');
    expect(profile.notes).toHaveLength(1);
    expect(profile.notes[0].text).toBe('Remember to divide.');
    expect(profile.notes[0].summary).toBe('x equals 2');
  });

  it('updates the summary on an existing note for the same question', () => {
    let profile = saveNote(makeProfile(), question, 'First note.', 'First summary.');
    profile = saveNote(profile, question, 'First note.', 'Updated summary.');
    expect(profile.notes).toHaveLength(1);
    expect(profile.notes[0].summary).toBe('Updated summary.');
  });
});

describe('saveTeachBack', () => {
  it('creates a new entry for a topic', () => {
    const profile = saveTeachBack(
      makeProfile(),
      'linear-equations',
      'math' as Subject,
      'Linear Equations',
      'A linear equation is a straight-line relationship between x and y.',
      'Can you give an example?',
      'y = 2x + 1',
    );
    expect(profile.teachBacks['linear-equations']).toMatchObject({
      topicId: 'linear-equations',
      subject: 'math',
      topicName: 'Linear Equations',
      explanation: 'A linear equation is a straight-line relationship between x and y.',
      followUpPrompt: 'Can you give an example?',
      followUpResponse: 'y = 2x + 1',
    });
  });

  it('overwrites the previous entry for the same topic instead of keeping history', () => {
    let profile = saveTeachBack(
      makeProfile(), 'linear-equations', 'math' as Subject, 'Linear Equations',
      'First attempt.', 'Follow up?', 'First answer.',
    );
    profile = saveTeachBack(
      profile, 'linear-equations', 'math' as Subject, 'Linear Equations',
      'Better attempt.', 'Follow up?', 'Better answer.',
    );
    expect(Object.keys(profile.teachBacks)).toHaveLength(1);
    expect(profile.teachBacks['linear-equations'].explanation).toBe('Better attempt.');
  });
});

describe('removeTeachBack', () => {
  it('deletes the entry for a topic', () => {
    let profile = saveTeachBack(
      makeProfile(), 'linear-equations', 'math' as Subject, 'Linear Equations',
      'Explanation.', 'Follow up?', 'Answer.',
    );
    profile = removeTeachBack(profile, 'linear-equations');
    expect(profile.teachBacks['linear-equations']).toBeUndefined();
  });
});

describe('removeNote', () => {
  it('removes a note by id', () => {
    let profile = saveNote(makeProfile(), question, 'Note text.', 'Summary.');
    const noteId = profile.notes[0].id;
    profile = removeNote(profile, noteId);
    expect(profile.notes).toHaveLength(0);
  });
});
