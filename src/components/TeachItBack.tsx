import { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import type { Subject } from '../types';

type TeachItBackProps = {
  topicId: string;
  subject: Subject;
  topicName: string;
  onDone: () => void;
};

const FOLLOW_UPS = [
  'Great start! Can you give me one concrete example to make it more real?',
  'Interesting! What would happen if you got that concept wrong in a real situation — what would break?',
  'Nice explanation! What was the hardest part to understand, and why?',
  'Good summary! If you had to turn this into one quiz question, what would it be?',
  'Thanks! How does this connect to something you already knew before today?',
  'I think I get it. One more thing — why does it matter? Who would need to know this?',
];

export default function TeachItBack({ topicId, subject, topicName, onDone }: TeachItBackProps) {
  const { saveTeachBack } = useProfile();
  const [phase, setPhase] = useState<'prompt' | 'followup'>('prompt');
  const [text, setText] = useState('');
  const [followUp] = useState(() => FOLLOW_UPS[Math.floor(Math.random() * FOLLOW_UPS.length)]);
  const [response, setResponse] = useState('');

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const canSubmit = wordCount >= 10;

  return (
    /* Action mode — warm amber signals cognitive "wake-up" from input → output */
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-action backdrop-blur-sm px-6">
      <div className="max-w-lg w-full rounded-3xl border border-action-400/30 bg-action-surface p-8 shadow-2xl">
        {phase === 'prompt' ? (
          <>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl">🦆</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-action-300">
                  CogniSync · Teach It Back
                </p>
                <h2 className="text-lg font-bold text-action-200">Explain it to Cosmo</h2>
              </div>
            </div>
            <p className="text-action-200/70 text-sm leading-relaxed">
              You've answered <strong className="text-action-200">5 questions</strong> on{' '}
              <strong className="text-action-200">{topicName}</strong>. Now explain what you learned
              as if Cosmo is a student who has never heard of it. Teaching is the fastest way to
              find gaps in your own understanding.
            </p>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`Explain "${topicName}" in your own words…`}
              rows={5}
              className="mt-4 w-full resize-none rounded-xl border border-action-500/40 bg-action-bg/60 p-3 text-sm text-action-200 placeholder:text-action-200/30 focus:outline-none focus:border-action-400"
              autoFocus
            />

            <div className="mt-2">
              <span className={`text-xs ${canSubmit ? 'text-action-300' : 'text-action-200/30'}`}>
                {wordCount} / 10 words minimum
              </span>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setPhase('followup')}
                disabled={!canSubmit}
                className="flex-1 rounded-full bg-action-400 px-5 py-2.5 text-sm font-semibold text-action-bg transition-colors hover:bg-action-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Submit explanation →
              </button>
              <button
                type="button"
                onClick={onDone}
                className="rounded-full border border-action-500/40 px-5 py-2.5 text-sm text-action-200/50 hover:text-action-200"
              >
                Skip
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl">🦆</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-action-300">
                  Cosmo is asking…
                </p>
                <h2 className="text-lg font-bold text-action-200">One follow-up question</h2>
              </div>
            </div>

            <div className="rounded-2xl border border-action-400/40 bg-action-400/10 p-4 mb-4">
              <p className="text-sm text-action-200/80 italic">"{followUp}"</p>
            </div>

            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Your answer…"
              rows={4}
              className="w-full resize-none rounded-xl border border-action-500/40 bg-action-bg/60 p-3 text-sm text-action-200 placeholder:text-action-200/30 focus:outline-none focus:border-action-400"
              autoFocus
            />

            <div className="mt-4">
              <button
                type="button"
                onClick={() => {
                  saveTeachBack(topicId, subject, topicName, text, followUp, response);
                  onDone();
                }}
                className="w-full rounded-full bg-action-400 px-5 py-2.5 text-sm font-semibold text-action-bg transition-colors hover:bg-action-300"
              >
                Done — back to studying →
              </button>
            </div>
            <p className="mt-3 text-xs text-action-200/30 text-center">
              There's no wrong answer here — the goal is active recall.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
