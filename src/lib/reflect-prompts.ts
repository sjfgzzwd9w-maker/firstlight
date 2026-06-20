import type { Subject } from '../types';

type ReflectPrompt = {
  prompt: string;
  placeholder: string;
  minWords: number;
};

/** Generic prompts that work for any topic — parameterized by topic name. */
function genericPrompts(topicName: string): ReflectPrompt[] {
  return [
    {
      prompt: `Explain "${topicName}" as if you're teaching it to a friend who has never heard of it.`,
      placeholder: 'Start simple. What is it? Why does it matter? Give an example…',
      minWords: 15,
    },
    {
      prompt: `Give a real-world example where knowing "${topicName}" would actually matter.`,
      placeholder: 'Think of a job, a problem, a news story, or an everyday situation…',
      minWords: 10,
    },
    {
      prompt: `What is the most important idea inside "${topicName}", and why does it stick out to you?`,
      placeholder: 'Pick one concept and go deep. Don\'t list everything — explain one thing well…',
      minWords: 15,
    },
    {
      prompt: `Connect "${topicName}" to something you already knew before today.`,
      placeholder: 'What does this remind you of? How is it similar or different?',
      minWords: 10,
    },
  ];
}

const SUBJECT_EXTRA: Record<Subject, ReflectPrompt[]> = {
  math: [
    {
      prompt: 'Describe a step-by-step process you just learned. Walk through it out loud as if solving it on a whiteboard.',
      placeholder: 'Step 1: First I… Step 2: Then I… because…',
      minWords: 20,
    },
  ],
  biology: [
    {
      prompt: 'How does what you just studied connect to something inside your own body or a living thing you\'ve seen?',
      placeholder: 'Think of a cell, an organ, an animal, a plant…',
      minWords: 10,
    },
  ],
  chemistry: [
    {
      prompt: 'Describe what is physically happening at the atomic or molecular level in the concept you just studied.',
      placeholder: 'Picture the atoms. What are they doing?',
      minWords: 15,
    },
  ],
  python: [
    {
      prompt: 'Write or describe a tiny program (even in plain English) that uses what you just learned.',
      placeholder: 'Something like: "A program that asks the user… then uses a loop to…"',
      minWords: 10,
    },
  ],
  robotics: [
    {
      prompt: 'Describe how a robot you\'ve seen or imagined uses the concept you just studied.',
      placeholder: 'What sensor, motor, or logic would apply here?',
      minWords: 10,
    },
  ],
  space: [
    {
      prompt: 'If you were explaining this to an astronaut preparing for a mission, what would you tell them?',
      placeholder: 'What do they need to know and why does it matter out there?',
      minWords: 15,
    },
  ],
  physics: [
    {
      prompt: 'Draw or describe a free-body diagram or scenario that shows the physics concept you just studied.',
      placeholder: 'Describe the forces, motion, or energy involved in a real situation…',
      minWords: 15,
    },
  ],
  hackathon: [
    {
      prompt: 'If you had to start a hackathon project using what you just learned — right now, with a 2-person team — what would you build?',
      placeholder: 'Keep it small and specific. What problem, who it\'s for, one core feature…',
      minWords: 15,
    },
  ],
};

/** Pick a reflection prompt for the current topic. Cycles through prompts as questionCount grows. */
export function getReflectPrompt(
  topicName: string,
  subject: Subject,
  questionCount: number,
): ReflectPrompt {
  const extra = SUBJECT_EXTRA[subject] ?? [];
  const all = [...genericPrompts(topicName), ...extra];
  return all[questionCount % all.length];
}
