import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Mascot from '../components/Mascot';
import QuestionCard from '../components/QuestionCard';
import { useProfile } from '../context/ProfileContext';
import { ALL_TOPICS, SUBJECT_LABELS } from '../lib/engine/topics';
import { getQuestionById } from '../lib/engine/adaptiveEngine';
import { getTopicContext } from '../lib/topic-contexts';
import { speak, stopSpeaking } from '../lib/voice/tts';
import type { Question } from '../types';

type PracticeItem = {
  question: Question;
  topicId: string;
  topicName: string;
  subjectLabel: string;
};

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export default function PracticeSession() {
  const navigate = useNavigate();
  const { profile, clearMissedQuestion } = useProfile();

  // Build the shuffled queue once at mount — snapshot of what was missed.
  const queue = useMemo<PracticeItem[]>(() => {
    const items: PracticeItem[] = [];
    for (const topic of ALL_TOPICS) {
      const tp = profile.topics[topic.id];
      if (!tp || !tp.missedIds?.length) continue;
      for (const id of tp.missedIds) {
        const question = getQuestionById(id);
        if (question) {
          items.push({
            question,
            topicId: topic.id,
            topicName: topic.name,
            subjectLabel: SUBJECT_LABELS[topic.subject],
          });
        }
      }
    }
    return shuffle(items);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally only once — we don't want the queue to shift mid-session

  const [index, setIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [phase, setPhase] = useState<'question' | 'feedback'>('question');
  const [clearedCount, setClearedCount] = useState(0);

  const current = queue[index] ?? null;
  const total = queue.length;
  const done = index >= total;

  const handleCheck = () => {
    if (selectedIndex === null || !current) return;
    const correct = selectedIndex === current.question.answerIndex;
    setPhase('feedback');
    if (correct) {
      clearMissedQuestion(current.topicId, current.question.id);
      setClearedCount((n) => n + 1);
    }
    speak(
      `${correct ? 'Correct! ' : 'Not quite. '}${current.question.explanation}`,
      profile.voiceEnabled,
    );
  };

  const handleNext = () => {
    stopSpeaking();
    setSelectedIndex(null);
    setPhase('question');
    setIndex((i) => i + 1);
  };

  const handleExit = () => {
    stopSpeaking();
    navigate('/profile');
  };

  // Empty state — nothing to practice.
  if (total === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-xl mx-auto text-center gap-6">
        <Mascot mood="excited" line="Your practice queue is empty — nothing to review!" />
        <p className="text-white/60 text-sm">
          Answer some questions in any subject and any you miss will appear here for review.
        </p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="rounded-full bg-nebula-500 px-8 py-3 font-semibold text-white hover:bg-nebula-400"
        >
          Go study →
        </button>
      </div>
    );
  }

  // All done state.
  if (done) {
    const stillMissed = total - clearedCount;
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-xl mx-auto text-center gap-6">
        <Mascot
          mood={clearedCount === total ? 'excited' : 'encouraging'}
          line={
            clearedCount === total
              ? 'Perfect round — you cleared every question!'
              : `Nice work! ${clearedCount} cleared, ${stillMissed} still need a bit more practice.`
          }
        />
        <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col gap-3">
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Cleared this round</span>
            <span className="font-bold text-comet-400">{clearedCount} / {total}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/10">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-nebula-500 to-comet-400 transition-all"
              style={{ width: `${Math.round((clearedCount / total) * 100)}%` }}
            />
          </div>
          {stillMissed > 0 && (
            <p className="text-xs text-white/40 text-center">
              {stillMissed} question{stillMissed > 1 ? 's' : ''} still in your practice queue.
            </p>
          )}
        </div>
        <div className="flex gap-3">
          {stillMissed > 0 && (
            <button
              type="button"
              onClick={() => navigate(0)} // reload the route to get a fresh queue
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Practice again
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="rounded-full bg-nebula-500 px-6 py-3 text-sm font-semibold text-white hover:bg-nebula-400"
          >
            Back to subjects
          </button>
        </div>
      </div>
    );
  }

  const isCorrect = phase === 'feedback' && selectedIndex === current.question.answerIndex;
  const isPython = current.question.topicId.startsWith('python') || current.question.topicId.startsWith('oop') || current.question.topicId.startsWith('modules');
  const topicContext = getTopicContext(current.topicId, current.topicName);

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-8 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="flex w-full items-center justify-between text-sm text-white/60">
        <button type="button" onClick={handleExit} className="hover:text-white">
          ← Exit
        </button>
        <span className="text-center">
          <span className="text-white font-medium">{current.topicName}</span>
          <span className="mx-1">·</span>
          <span>{index + 1} of {total}</span>
        </span>
        <span className="text-comet-400 font-medium">{clearedCount} cleared</span>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1.5 w-full rounded-full bg-white/10">
        <div
          className="h-1.5 rounded-full bg-gradient-to-r from-nebula-500 to-comet-400 transition-all"
          style={{ width: `${Math.round((index / total) * 100)}%` }}
        />
      </div>

      {/* Practice mode badge */}
      <div className="mt-4 rounded-full border border-star-400/30 bg-star-400/10 px-3 py-1 text-xs font-semibold text-star-400">
        🎯 Practice Mode — {current.subjectLabel}
      </div>

      <div className="mt-6 flex flex-1 flex-col items-center gap-6 w-full">
        <Mascot
          mood={phase === 'feedback' ? (isCorrect ? 'excited' : 'encouraging') : 'thinking'}
          line={
            phase === 'feedback'
              ? isCorrect
                ? 'Got it! This one is cleared from your practice queue.'
                : "Not quite — keep this one in mind for next time."
              : null
          }
        />

        <QuestionCard
          question={current.question}
          selectedIndex={selectedIndex}
          revealed={phase === 'feedback'}
          onSelect={(i) => phase === 'question' && setSelectedIndex(i)}
          codeMode={isPython}
          topicContext={topicContext}
        />

        {phase === 'feedback' && (
          <p className="max-w-lg text-center text-sm text-white/70">
            {current.question.explanation}
          </p>
        )}

        <div className="mt-2">
          {phase === 'question' && (
            <button
              type="button"
              disabled={selectedIndex === null}
              onClick={handleCheck}
              className="rounded-full bg-nebula-500 px-8 py-3 font-semibold text-white hover:bg-nebula-400 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Check answer
            </button>
          )}
          {phase === 'feedback' && (
            <button
              type="button"
              onClick={handleNext}
              className="rounded-full bg-nebula-500 px-8 py-3 font-semibold text-white hover:bg-nebula-400"
            >
              {index + 1 < total ? 'Next question →' : 'See results'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
