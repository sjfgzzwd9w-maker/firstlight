import { describe, expect, it, vi } from 'vitest';
import { generateQuestion, explainMistake, mascotLine } from './prompts';
import * as client from './client';
import type { Question } from '../../types';

const baseParams = { topicId: 'linear-equations', topicName: 'Linear Equations', tier: 1, age: 14, subjectLabel: 'Algebra' };

const question: Question = {
  id: 'q1',
  topicId: 'linear-equations',
  tier: 1,
  question: 'Solve for x: 2x = 4',
  choices: ['1', '2', '3', '4'],
  answerIndex: 1,
  explanation: 'Divide both sides by 2.',
};

describe('generateQuestion', () => {
  it('returns a Question when the model responds with a valid shape', async () => {
    vi.spyOn(client, 'chatJSON').mockResolvedValue({
      question: 'What is 2+2?',
      choices: ['3', '4', '5', '6'],
      answerIndex: 1,
      explanation: 'Basic addition.',
    });
    const result = await generateQuestion('1b', baseParams);
    expect(result.question).toBe('What is 2+2?');
    expect(result.answerIndex).toBe(1);
    expect(result.generated).toBe(true);
  });

  it('rejects a response with the wrong number of choices', async () => {
    vi.spyOn(client, 'chatJSON').mockResolvedValue({
      question: 'What is 2+2?',
      choices: ['3', '4', '5'],
      answerIndex: 1,
      explanation: 'Basic addition.',
    });
    await expect(generateQuestion('1b', baseParams)).rejects.toThrow(/choices/);
  });

  it('rejects a response with an out-of-range answerIndex', async () => {
    vi.spyOn(client, 'chatJSON').mockResolvedValue({
      question: 'What is 2+2?',
      choices: ['3', '4', '5', '6'],
      answerIndex: 7,
      explanation: 'Basic addition.',
    });
    await expect(generateQuestion('1b', baseParams)).rejects.toThrow(/answerIndex/);
  });

  it('rejects a response with an empty question string', async () => {
    vi.spyOn(client, 'chatJSON').mockResolvedValue({
      question: '   ',
      choices: ['3', '4', '5', '6'],
      answerIndex: 1,
      explanation: 'Basic addition.',
    });
    await expect(generateQuestion('1b', baseParams)).rejects.toThrow(/question/);
  });

  it('rejects a response with a non-string choice', async () => {
    vi.spyOn(client, 'chatJSON').mockResolvedValue({
      question: 'What is 2+2?',
      // @ts-expect-error intentionally malformed for the test
      choices: ['3', 4, '5', '6'],
      answerIndex: 1,
      explanation: 'Basic addition.',
    });
    await expect(generateQuestion('1b', baseParams)).rejects.toThrow(/choices/);
  });
});

describe('explainMistake', () => {
  it('returns the explanation when valid', async () => {
    vi.spyOn(client, 'chatJSON').mockResolvedValue({ explanation: 'Here is why.' });
    const result = await explainMistake('1b', { question, userChoice: '1', age: 14, subjectLabel: 'Algebra' });
    expect(result).toBe('Here is why.');
  });

  it('rejects an empty explanation', async () => {
    vi.spyOn(client, 'chatJSON').mockResolvedValue({ explanation: '' });
    await expect(
      explainMistake('1b', { question, userChoice: '1', age: 14, subjectLabel: 'Algebra' }),
    ).rejects.toThrow(/explanation/);
  });
});

describe('mascotLine', () => {
  it('returns the line when valid', async () => {
    vi.spyOn(client, 'chatJSON').mockResolvedValue({ line: 'Nice work!' });
    const result = await mascotLine('1b', { event: 'correct', age: 14, topicName: 'Linear Equations', subjectLabel: 'Algebra' });
    expect(result).toBe('Nice work!');
  });

  it('rejects a non-string line', async () => {
    // @ts-expect-error intentionally malformed for the test
    vi.spyOn(client, 'chatJSON').mockResolvedValue({ line: null });
    await expect(
      mascotLine('1b', { event: 'correct', age: 14, topicName: 'Linear Equations', subjectLabel: 'Algebra' }),
    ).rejects.toThrow(/line/);
  });
});
