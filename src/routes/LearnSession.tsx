import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { InitProgressReport } from '@mlc-ai/web-llm';
import Mascot, { type MascotMood } from '../components/Mascot';
import QuestionCard from '../components/QuestionCard';
import LevelUpModal from '../components/LevelUpModal';
import NoteEditor from '../components/NoteEditor';
import TeachItBack from '../components/TeachItBack';
import { getTopicContext } from '../lib/topic-contexts';
import { useProfile } from '../context/ProfileContext';
import { useSession } from '../context/SessionContext';
import { ALL_TOPICS, SUBJECT_LABELS, SUBJECT_PATHS } from '../lib/engine/topics';
import { createTopicProgress, pickBestQuestion, placementTier, recordAnswer } from '../lib/engine/adaptiveEngine';
import { scheduleReview } from '../lib/spaced-repetition';
import { getReflectPrompt } from '../lib/reflect-prompts';
import type { Question } from '../types';
import { isWebGPUAvailable } from '../lib/webllm/client';
import { explainMistake, generateQuestion, mascotLine } from '../lib/webllm/prompts';
import { FALLBACK_EXPLANATION_HINT, randomFallbackLine } from '../lib/webllm/fallbacks';
import {
  MATH_TRIVIA, BIOLOGY_TRIVIA, CHEMISTRY_TRIVIA, PYTHON_TRIVIA, ROBOTICS_TRIVIA,
  SPACE_TRIVIA, PHYSICS_TRIVIA, HACKATHON_TRIVIA, randomTrivia,
} from '../lib/engine/trivia';
import { speak, stopSpeaking } from '../lib/voice/tts';

// CogniSync: fire Teach It Back every N correct answers in a session
const TEACHBACK_EVERY = 5;
// CogniSync: fire a Reflect prompt every N questions answered (mix methods)
const REFLECT_EVERY = 4;

type Phase = 'loading' | 'question' | 'feedback' | 'reflect' | 'teachback';
type LevelKind = 'levelUp' | 'levelDown' | 'mastered';

export default function LearnSession() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { profile, updateTopicProgress, setVoiceEnabled } = useProfile();
  const { tickActivity } = useSession();

  const topicId = params.get('topic') ?? ALL_TOPICS[0].id;
  const topic = ALL_TOPICS.find((t) => t.id === topicId) ?? ALL_TOPICS[0];
  const subjectLabel = SUBJECT_LABELS[topic.subject];
  const mapPath = SUBJECT_PATHS[topic.subject];

  const topicTrivia =
    topic.subject === 'biology'    ? BIOLOGY_TRIVIA
    : topic.subject === 'chemistry' ? CHEMISTRY_TRIVIA
    : topic.subject === 'python'    ? PYTHON_TRIVIA
    : topic.subject === 'robotics'  ? ROBOTICS_TRIVIA
    : topic.subject === 'space'     ? SPACE_TRIVIA
    : topic.subject === 'physics'   ? PHYSICS_TRIVIA
    : topic.subject === 'hackathon' ? HACKATHON_TRIVIA
    : MATH_TRIVIA;

  const isRobotics = topic.subject === 'robotics';
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

  // CogniSync counters
  const [sessionCorrect, setSessionCorrect] = useState(0);   // correct answers this session
  const [questionsAnswered, setQuestionsAnswered] = useState(0); // total answered this session
  const [showTeachBack, setShowTeachBack] = useState(false);
  const [reflectPromptIdx, setReflectPromptIdx] = useState(0);
  const questionStartRef = useRef<number>(Date.now()); // for tickActivity

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
    questionStartRef.current = Date.now();

    const current = profile.topics[topicId] ?? createTopicProgress(placementTier(profile.age));

    const seed = pickBestQuestion(topicId, current.tier, current.answeredIds);
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

    const recycled = pickBestQuestion(topicId, current.tier, [], question?.id);
    if (!recycled) {
      // No questions exist for this topic at any tier — go back to module map
      navigate(mapPath);
      return;
    }
    setQuestion(recycled);
    setPhase('question');
  }, [topicId, profile.topics, profile.age, profile.modelSize, webGPU, topic.name, subjectLabel, question]);

  useEffect(() => {
    loadQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId]);

  // Rotate trivia while loading
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

    // CogniSync: tick active time for Pomodoro
    tickActivity(Date.now() - questionStartRef.current);

    const correct = selectedIndex === question.answerIndex;
    const result = recordAnswer(progress, question.id, correct);

    // CogniSync: spaced repetition — update review schedule after a correct answer
    const updatedProgress = correct
      ? scheduleReview(result.progress)
      : result.progress;

    updateTopicProgress(topicId, updatedProgress);

    const newCorrect = correct ? sessionCorrect + 1 : sessionCorrect;
    const newAnswered = questionsAnswered + 1;
    setSessionCorrect(newCorrect);
    setQuestionsAnswered(newAnswered);

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

    // CogniSync: trigger Teach It Back after every TEACHBACK_EVERY correct answers
    if (correct && newCorrect % TEACHBACK_EVERY === 0) {
      setShowTeachBack(true);
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

    // CogniSync: Mix Methods — fire reflect prompt every REFLECT_EVERY questions
    if (questionsAnswered > 0 && questionsAnswered % REFLECT_EVERY === 0 && !showTeachBack) {
      setReflectPromptIdx((i) => i + 1);
      setPhase('reflect');
      return;
    }

    loadQuestion();
  };

  const handleTeachBackDone = () => {
    setShowTeachBack(false);
    // After Teach It Back, check if we also need a reflect before next question
    loadQuestion();
  };

  // Stop speech on unmount
  useEffect(() => stopSpeaking, []);

  const reflectPrompt = getReflectPrompt(topic.name, topic.subject, reflectPromptIdx);
  const wasCorrect = selectedIndex !== null && question !== null && selectedIndex === question.answerIndex;
  const topicContext = getTopicContext(topicId, topic.name);

  return (
    <div className={`flex-1 flex flex-col items-center px-6 py-8 max-w-2xl mx-auto w-full ${isRobotics ? 'bg-robotics' : ''}`}>
      {showTeachBack && (
        <TeachItBack
          topicId={topic.id}
          subject={topic.subject}
          topicName={topic.name}
          onDone={handleTeachBackDone}
        />
      )}

      {/* Persistent header */}
      <div className="flex w-full items-center justify-between text-sm text-deep-text/60">
        <button
          type="button"
          onClick={() => { stopSpeaking(); navigate(mapPath); }}
          className="hover:text-deep-text"
        >
          ← Exit
        </button>
        <span className={isRobotics ? 'glow-circuit text-circuit-300' : 'text-deep-text/50'}>
          {topic.name} · Tier {progress.tier}/5
        </span>
        <button
          type="button"
          onClick={() => { if (profile.voiceEnabled) stopSpeaking(); setVoiceEnabled(!profile.voiceEnabled); }}
          aria-label="Toggle voice"
          className="hover:text-deep-text"
        >
          {profile.voiceEnabled ? '🔊' : '🔇'}
        </button>
      </div>

      {/* ── REFLECT PHASE ── */}
      {phase === 'reflect' && (
        <ReflectPhase
          prompt={reflectPrompt.prompt}
          placeholder={reflectPrompt.placeholder}
          minWords={reflectPrompt.minWords}
          onDone={loadQuestion}
        />
      )}

      {/* ── LOADING / QUESTION / FEEDBACK PHASES ── */}
      {(phase === 'loading' || phase === 'question' || phase === 'feedback') && (
        <div className="mt-8 flex flex-1 flex-col items-center gap-6 w-full">
          <Mascot mood={mascotMood} line={phase === 'feedback' ? mascotMsg : null} />

          {phase === 'loading' && (
            <div className="flex flex-col items-center gap-4">
              <p className="text-deep-text/50 text-sm animate-pulse">{loadStatus ?? 'Loading question…'}</p>
              {trivia && (
                <div className="max-w-md rounded-2xl border border-deep-700 bg-deep-800/80 px-5 py-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wide text-sage-400">Did you know?</p>
                  <p className="mt-2 text-sm text-deep-text/80">{trivia}</p>
                </div>
              )}
              {canSkip && (
                <button
                  type="button"
                  onClick={() => skipRef.current?.()}
                  className="text-xs text-sage-400 underline hover:text-sage-300"
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
              codeMode={topic.subject === 'python'}
              topicContext={topicContext}
            />
          )}

          {question && phase === 'feedback' && !question.generated && (
            <NoteEditor key={question.id} question={question} circuit={isRobotics} />
          )}

          {phase === 'feedback' && (
            <p className={`max-w-lg text-center text-sm ${wasCorrect ? 'text-comet-300' : 'text-alert-300'}`}>
              {explanation}
            </p>
          )}

          {phase === 'question' && sessionCorrect > 0 && sessionCorrect % TEACHBACK_EVERY !== 0 && (
            <p className="text-xs text-deep-text/25">
              {TEACHBACK_EVERY - (sessionCorrect % TEACHBACK_EVERY)} more correct → Teach It Back checkpoint
            </p>
          )}

          <div className="mt-2">
            {phase === 'question' && (
              <button
                type="button"
                disabled={selectedIndex === null}
                onClick={handleCheck}
                className="rounded-full bg-sage-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-sage-400 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Check answer
              </button>
            )}
            {phase === 'feedback' && !levelKind && (
              <button
                type="button"
                onClick={handleContinue}
                className="rounded-full bg-sage-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-sage-400"
              >
                Next question →
              </button>
            )}
          </div>
        </div>
      )}

      {levelKind && (
        <LevelUpModal kind={levelKind} topicName={topic.name} tier={levelTier} onContinue={handleContinue} />
      )}
    </div>
  );
}

// ── CogniSync Reflect Phase (Mix Methods) ────────────────────────────────────

function ReflectPhase({
  prompt,
  placeholder,
  minWords,
  onDone,
}: {
  prompt: string;
  placeholder: string;
  minWords: number;
  onDone: () => void;
}) {
  const [text, setText] = useState('');
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const canSubmit = wordCount >= minWords;

  return (
    <div className="mt-8 flex flex-1 flex-col items-center gap-6 w-full max-w-lg">
      {/* Deep Work mode — analytical reflection stays in cool academic palette */}
      <div className="w-full rounded-3xl border border-deep-700 bg-deep-800 p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-sage-400 mb-1">
          CogniSync · Mix Methods · Reflect
        </p>
        <h2 className="text-base font-bold text-deep-text mb-3">{prompt}</h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          rows={5}
          autoFocus
          className="w-full resize-none rounded-xl border border-deep-700 bg-deep-900/80 p-3 text-sm text-deep-text placeholder:text-deep-text/30 focus:outline-none focus:border-sage-400"
        />
        <div className="mt-2 flex items-center justify-between">
          <span className={`text-xs ${canSubmit ? 'text-sage-400' : 'text-deep-text/30'}`}>
            {wordCount} / {minWords} words minimum
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onDone}
        disabled={!canSubmit}
        className="rounded-full bg-sage-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-sage-400 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continue →
      </button>
      <p className="text-xs text-deep-text/30 text-center">
        Reflection helps your brain build connections. No wrong answers — just think out loud.
      </p>
    </div>
  );
}
