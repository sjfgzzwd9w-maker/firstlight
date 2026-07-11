import type { InitProgressReport } from '@mlc-ai/web-llm';
import type { AnswerEvent, ModelSize, Question } from '../../types';
import { chatJSON } from './client';

function ageLine(age: number | null): string {
  return age ? `The learner is ${age} years old — match your language to that age.` : '';
}

function assertNonEmptyString(value: unknown, field: string): asserts value is string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Invalid LLM response: "${field}" was not a non-empty string`);
  }
}

/**
 * The model is asked to reply with strict JSON, but small on-device models
 * sometimes return a malformed or incomplete shape. Validate before trusting
 * it — an unvalidated result could crash QuestionCard (bad answerIndex) or
 * silently show the learner a wrong "correct" answer.
 */
function assertValidGeneratedQuestion(result: {
  question: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
}): void {
  assertNonEmptyString(result.question, 'question');
  assertNonEmptyString(result.explanation, 'explanation');
  if (
    !Array.isArray(result.choices) ||
    result.choices.length !== 4 ||
    result.choices.some((c) => typeof c !== 'string' || c.trim().length === 0)
  ) {
    throw new Error('Invalid LLM response: "choices" must be an array of 4 non-empty strings');
  }
  if (!Number.isInteger(result.answerIndex) || result.answerIndex < 0 || result.answerIndex > 3) {
    throw new Error('Invalid LLM response: "answerIndex" must be an integer between 0 and 3');
  }
}

/** Generate a brand-new practice question for a topic/tier once the seed bank runs out. */
export async function generateQuestion(
  modelSize: ModelSize,
  params: { topicId: string; topicName: string; tier: number; age: number | null; subjectLabel: string },
  onProgress?: (report: InitProgressReport) => void,
): Promise<Question> {
  const system = `You are a friendly ${params.subjectLabel} tutor for kids and teens. ${ageLine(params.age)}
Create one multiple-choice practice question.
Respond ONLY with JSON in this exact shape:
{"question": string, "choices": [string, string, string, string], "answerIndex": 0-3, "explanation": string}
The explanation should be 1-2 short, encouraging sentences explaining how to solve it.`;

  const user = `Topic: ${params.topicName}. Difficulty tier: ${params.tier} of 5 (1 = basics, 5 = advanced). Write one new question appropriate for this tier.`;

  const result = await chatJSON<{
    question: string;
    choices: string[];
    answerIndex: number;
    explanation: string;
  }>(modelSize, system, user, onProgress);

  assertValidGeneratedQuestion(result);

  return {
    id: `generated-${params.topicId}-${Date.now()}`,
    topicId: params.topicId,
    tier: params.tier,
    question: result.question,
    choices: result.choices,
    answerIndex: result.answerIndex,
    explanation: result.explanation,
    generated: true,
  };
}

/** Re-explain why an answer was right/wrong, tailored to the learner's age. */
export async function explainMistake(
  modelSize: ModelSize,
  params: { question: Question; userChoice: string; age: number | null; subjectLabel: string },
  onProgress?: (report: InitProgressReport) => void,
): Promise<string> {
  const system = `You are a kind, patient ${params.subjectLabel} tutor. ${ageLine(params.age)}
Respond ONLY with JSON: {"explanation": string}.
Keep it to 1-3 short sentences, warm and encouraging, no jargon beyond the learner's level.`;

  const correctChoice = params.question.choices[params.question.answerIndex];
  const user = `Question: ${params.question.question}
The learner answered: "${params.userChoice}"
The correct answer is: "${correctChoice}"
Briefly explain why the correct answer is right and gently address the learner's mistake.`;

  const result = await chatJSON<{ explanation: string }>(modelSize, system, user, onProgress);
  assertNonEmptyString(result.explanation, 'explanation');
  return result.explanation;
}

/** Short mascot reaction line for an answer event. */
export async function mascotLine(
  modelSize: ModelSize,
  params: { event: AnswerEvent; age: number | null; topicName: string; subjectLabel: string },
  onProgress?: (report: InitProgressReport) => void,
): Promise<string> {
  const system = `You are "Cosmo", a cheerful space-alien mascot for a kids' ${params.subjectLabel} app. ${ageLine(params.age)}
Respond ONLY with JSON: {"line": string}.
The line must be ONE short, upbeat sentence (under 15 words), fitting the event described.`;

  const eventDescriptions: Record<AnswerEvent, string> = {
    'correct-levelUp': 'The learner just answered correctly twice in a row and is leveling up to a harder tier.',
    correct: 'The learner just answered correctly.',
    'incorrect-levelDown': 'The learner missed two in a row and is dropping to an easier tier to practice more.',
    incorrect: 'The learner just answered incorrectly and should try again.',
  };

  const user = `Topic: ${params.topicName}. Event: ${eventDescriptions[params.event]}`;

  const result = await chatJSON<{ line: string }>(modelSize, system, user, onProgress);
  assertNonEmptyString(result.line, 'line');
  return result.line;
}
