import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { InitProgressReport } from '@mlc-ai/web-llm';
import Mascot, { type MascotMood } from '../components/Mascot';
import QuestionCard from '../components/QuestionCard';
import LevelUpModal from '../components/LevelUpModal';
import { useProfile } from '../context/ProfileContext';
import { ALL_TOPICS, SUBJECT_LABELS, SUBJECT_PATHS } from '../lib/engine/topics';
import { createTopicProgress, pickQuestion, placementTier, recordAnswer } from '../lib/engine/adaptiveEngine';
import type { Question } from '../types';
import { isWebGPUAvailable } from '../lib/webllm/client';
import { explainMistake, generateQuestion, mascotLine } from '../lib/webllm/prompts';
import { FALLBACK_EXPLANATION_HINT, randomFallbackLine } from '../lib/webllm/fallbacks';
import { MATH_TRIVIA, BIOLOGY_TRIVIA, randomTrivia } from '../lib/engine/trivia';
import { speak, stopSpeaking } from '../lib/voice/tts';

type Phase = 'loading' | 'question' | 'feedback';
type LevelKind = 'levelUp' | 'levelDown' | 'mastered';

export default function LearnSession() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { profile, updateTopicProgress, setVoiceEnabled } = useProfile();

  const topicId = params.get('topic') ?? ALL_TOPICS[0].id;
  const topic = ALL_TOPICS.find((t) => t.id === topicId) ?? ALL_TOPICS[0];
  const subjectLabel = SUBJECT_LABELS[topic.subject];
  const mapPath = SUBJECT_PATHS[topic.subject];
  const topicTrivia = topic.subject === 'biology' ? BIOLOGY_TRIVIA : MATH_TRIVIA;
  const progress = profile.topics[topicId] ?? createTopicProgress(placementTier(profile.age));
  const webGPU = isWebGPUAvailable();

  const [phase, setPhase] = useState<Phase>('loading');
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [explanation, setExplanation] = useState('');
  const [mascotMsg, setMascotMsg] = useState('');
  const [mascotMood, setMascotMood] = useState<MascotMood>('thinking');
  const [loadStatus, setLoadStatus] = useState<string | null>(null);
  const [canSkip, setCanSkip] = useState(false);
  const [trivia, setTrivia] = useState<string | null>(null);
  const [levelKind, setLevelKind] = useState<LevelKind | null>(null);
  const [levelTier, setLevelTier] = useState(progress.tier);

  const skipRef = useRef<(() => void) | null>(null);

  const loadQuestion = useCallback(async () => {
    stopSpeaking();
    setPhase('loading');
    setSelectedIndex(null);
    setExplanation('');
    setMascotMsg('');
    setMascotMood('thinking');
    setLevelKind(null);
    setCanSkip(false);

    const current = profile.topics[topicId] ?? createTopicProgress(placementTier(profile.age));

    const seed = pickQuestion(topicId, current.tier, current.answeredIds);
    if (seed) {
      setQuestion(seed);
      setPhase('question');
      return;
    }

    if (webGPU) {
      setLoadStatus("Waking up Cosmo's brain…");
      const skipTimer = setTimeout(() => setCanSkip(true), 4000);
      const skipped = new Promise<'skipped'>((resolve) => {
        skipRef.current = () => resolve('skipped');
      });

      try {
        const outcome = await Promise.race([
          generateQuestion(
            profile.modelSize,
            { topicId, topicName: topic.name, tier: current.tier, age: profile.age, subjectLabel },
            (report: InitProgressReport) => setLoadStatus(report.text),
          ),
          skipped,
        ]);
        if (outcome !== 'skipped') {
          clearTimeout(skipTimer);
          skipRef.current = null;
          setLoadStatus(null);
          setQuestion(outcome);
          setPhase('question');
          return;
        }
      } catch (err) {
        console.warn('LLM question generation failed, recycling seed bank', err);
      }
      clearTimeout(skipTimer);
      skipRef.current = null;
      setLoadStatus(null);
    }

    const recycled = pickQuestion(topicId, current.tier, [], question?.id);
    setQuestion(recycled);
    setPhase('question');
  }, [topicId, profile.topics, profile.age, profile.modelSize, webGPU, topic.name, subjectLabel, question]);

  useEffect(() => {
    loadQuestion();
    // Only reload when the chosen topic changes; loadQuestion reads fresh profile state itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId]);

  // Rotate a fun fact every few seconds while Cosmo is thinking up a question.
  useEffect(() => {
    if (phase !== 'loading') return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTrivia((current) => current ?? randomTrivia(topicTrivia));
    const interval = setInterval(() => {
      setTrivia((current) => randomTrivia(topicTrivia, current ?? undefined));
    }, 12000);
    return () => clearInterval(interval);
  }, [phase, topicTrivia]);

  const handleCheck = () => {
    if (selectedIndex === null || !question) return;
    const correct = selectedIndex === question.answerIndex;
    const result = recordAnswer(progress, question.id, correct);
    updateTopicProgress(topicId, result.progress);

    // Show feedback immediately using the seed explanation + a canned mascot
    // line, so the UI never blocks on the (slow, first-load) LLM call.
    const fallbackExplanation = correct
      ? question.explanation
      : `${question.explanation} ${FALLBACK_EXPLANATION_HINT}`;
    const fallbackMascot = randomFallbackLine(result.event);
    const mood: MascotMood =
      result.event === 'correct-levelUp' ? 'excited' : correct ? 'happy' : 'encouraging';

    setExplanation(fallbackExplanation);
    setMascotMsg(fallbackMascot);
    setMascotMood(mood);
    setPhase('feedback');
    speak(`${correct ? 'Correct! ' : 'Not quite. '} ${fallbackExplanation} ${fallbackMascot}`, profile.voiceEnabled);

    if (result.event === 'correct-levelUp') {
      setLevelKind(result.progress.mastered ? 'mastered' : 'levelUp');
      setLevelTier(result.progress.tier);
    } else if (result.event === 'incorrect-levelDown') {
      setLevelKind('levelDown');
      setLevelTier(result.progress.tier);
    }

    // Progressively enhance with a personalized LLM explanation/mascot line, if available.
    if (webGPU) {
      Promise.all([
        mascotLine(profile.modelSize, { event: result.event, age: profile.age, topicName: topic.name, subjectLabel }),
        correct
          ? Promise.resolve<string | null>(null)
          : explainMistake(profile.modelSize, {
              question,
              userChoice: question.choices[selectedIndex],
              age: profile.age,
              subjectLabel,
            }),
      ])
        .then(([line, extra]) => {
          setMascotMsg(line);
          if (extra) setExplanation(extra);
        })
        .catch((err) => {
          console.warn('LLM feedback generation failed, keeping fallback text', err);
        });
    }
  };

  const handleContinue = () => {
    const wasMastered = levelKind === 'mastered';
    setLevelKind(null);
    if (wasMastered) {
      stopSpeaking();
      navigate(mapPath);
      return;
    }
    loadQuestion();
  };

  // Stop any in-progress speech if the learner leaves the session entirely.
  useEffect(() => stopSpeaking, []);

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-8 max-w-2xl mx-auto w-full">
      <div className="flex w-full items-center justify-between text-sm text-white/60">
        <button
          type="button"
          onClick={() => {
            stopSpeaking();
            navigate(mapPath);
          }}
          className="hover:text-white"
        >
          ← Exit
        </button>
        <span>
          {topic.name} · Tier {progress.tier}/5
        </span>
        <button
          type="button"
          onClick={() => {
            if (profile.voiceEnabled) stopSpeaking();
            setVoiceEnabled(!profile.voiceEnabled);
          }}
          aria-label="Toggle voice"
          className="hover:text-white"
        >
          {profile.voiceEnabled ? '🔊' : '🔇'}
        </button>
      </div>

      <div className="mt-8 flex flex-1 flex-col items-center gap-6 w-full">
        <Mascot mood={mascotMood} line={phase === 'feedback' ? mascotMsg : null} />

        {phase === 'loading' && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-white/60 text-sm animate-pulse">{loadStatus ?? 'Loading question…'}</p>
            {trivia && (
              <div className="max-w-md rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-star-400">Did you know?</p>
                <p className="mt-2 text-sm text-white/80">{trivia}</p>
              </div>
            )}
            {canSkip && (
              <button
                type="button"
                onClick={() => skipRef.current?.()}
                className="text-xs text-comet-400 underline hover:text-comet-300"
              >
                Skip waiting — use a practice question instead
              </button>
            )}
          </div>
        )}

        {question && phase !== 'loading' && (
          <QuestionCard
            question={question}
            selectedIndex={selectedIndex}
            revealed={phase === 'feedback'}
            onSelect={(i) => phase === 'question' && setSelectedIndex(i)}
          />
        )}

        {phase === 'feedback' && (
          <p className="max-w-lg text-center text-sm text-white/70">{explanation}</p>
        )}

        <div className="mt-2">
          {phase === 'question' && (
            <button
              type="button"
              disabled={selectedIndex === null}
              onClick={handleCheck}
              className="rounded-full bg-nebula-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-nebula-400 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Check answer
            </button>
          )}
          {phase === 'feedback' && !levelKind && (
            <button
              type="button"
              onClick={loadQuestion}
              className="rounded-full bg-nebula-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-nebula-400"
            >
              Next question →
            </button>
          )}
        </div>
      </div>

      {levelKind && (
        <LevelUpModal kind={levelKind} topicName={topic.name} tier={levelTier} onContinue={handleContinue} />
      )}
    </div>
  );
}
