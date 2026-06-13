import type { AnswerEvent } from '../../types';

/** Canned mascot lines used when WebGPU/WebLLM is unavailable. */
export const FALLBACK_MASCOT_LINES: Record<AnswerEvent, string[]> = {
  'correct-levelUp': [
    "Awesome! You're ready for something a bit harder!",
    "Level up! Great thinking.",
  ],
  correct: ['Nice work!', "That's right!", 'You got it!'],
  'incorrect-levelDown': [
    "No worries — let's practice this a little more.",
    "Almost there! Let's try an easier one first.",
  ],
  incorrect: ['Not quite — give it another shot!', 'Close! Try again.'],
};

export function randomFallbackLine(event: AnswerEvent): string {
  const lines = FALLBACK_MASCOT_LINES[event];
  return lines[Math.floor(Math.random() * lines.length)];
}

/** Canned explanation suffix used when the LLM can't tailor an explanation. */
export const FALLBACK_EXPLANATION_HINT =
  'Take another look at each step above — you can do this!';
