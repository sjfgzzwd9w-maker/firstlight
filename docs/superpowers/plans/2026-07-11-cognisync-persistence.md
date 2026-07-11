# CogniSync Persistence Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make three broken CogniSync learning-technique features in Stardance Learn actually persist data: Teach It Back (Feynman technique) saves the student's explanation and follow-up answer, the Cornell note "Summary" field saves what's typed into it, and the Notes page shows all 8 subjects (currently only 4) plus the new Teach It Back entries.

**Architecture:** Add a `teachBacks: Record<string, TeachBackEntry>` map (keyed by `topicId`, overwrite-latest) and a `summary` field on `QuestionNote` to the existing `UserProfile` model. Extend the pure storage functions in `src/lib/storage/progress.ts`, thread new actions through `ProfileContext`, then wire the three consuming components (`TeachItBack`, `NoteEditor`, `Notes`) to actually call them.

**Tech Stack:** React 19, TypeScript, Vite, Vitest (runs in `node` test environment — no `jsdom`/`localStorage`, so only pure functions that take a `UserProfile` as a plain argument are unit-testable; anything touching `localStorage` directly (`loadProfile`/`saveProfile`) is verified via `tsc` type-checking and manual browser testing instead).

## Global Constraints

- Full design context lives in `docs/superpowers/specs/2026-07-11-cognisync-persistence-design.md` — read it if anything below is ambiguous.
- Teach It Back overwrites the previous entry for a topic; it does not keep history (per approved design decision).
- `PomodoroGateway`'s missing skip control is explicitly out of scope for this plan.
- Do not touch `vite.config.ts`'s test environment or attempt to add component/DOM tests — that's a separate, larger change tracked in `docs/AUDIT.md`, not part of this plan.
- Run `npx tsc -b` (not `npm run lint`) to verify type correctness after each task — `npm run lint` is currently broken repo-wide by an unrelated stray git worktree (`docs/AUDIT.md` item #9) and gives no signal either way.

---

### Task 1: Extend the data model

**Files:**
- Modify: `src/types.ts`
- Modify: `src/lib/storage/progress.ts:6-16` (`defaultProfile`)

**Interfaces:**
- Produces: `TeachBackEntry` type (`{ topicId: string; subject: Subject; topicName: string; explanation: string; followUpPrompt: string; followUpResponse: string; updatedAt: number }`); `QuestionNote.summary?: string`; `UserProfile.teachBacks: Record<string, TeachBackEntry>`.

This is a pure type/model change with no new runtime logic, so instead of a unit test we verify it with the TypeScript compiler: adding a required `teachBacks` field to `UserProfile` will make `defaultProfile()` fail to type-check until it's updated, which is our "red/green" signal.

- [ ] **Step 1: Confirm the compiler is currently clean**

Run: `npx tsc -b`
Expected: exits with no output (success).

- [ ] **Step 2: Edit `src/types.ts` — add `TeachBackEntry` and extend `QuestionNote`/`UserProfile`**

Add the new type directly after the existing `QuestionNote` type (after line 59, before `DreamGazeProgress`):

```ts
export type TeachBackEntry = {
  topicId: string;
  subject: Subject;
  topicName: string;
  explanation: string;
  followUpPrompt: string;
  followUpResponse: string;
  updatedAt: number;
};
```

Update `QuestionNote` (currently lines 49-59) to add `summary`:

```ts
export type QuestionNote = {
  id: string;
  questionId: string;
  topicId: string;
  subject: Subject;
  /** Snapshot of the question text at the time the note was written. */
  questionText: string;
  text: string;
  /** One-sentence Cornell-method summary, in the student's own words. */
  summary?: string;
  createdAt: number;
  updatedAt: number;
};
```

Update `UserProfile` (currently lines 68-77) to add `teachBacks`:

```ts
export type UserProfile = {
  age: number | null;
  voiceEnabled: boolean;
  modelSize: ModelSize;
  totalXp: number;
  badges: string[];
  topics: Record<string, TopicProgress>;
  notes: QuestionNote[];
  /** Teach It Back entries, keyed by topicId. A new submission overwrites the previous one for that topic. */
  teachBacks: Record<string, TeachBackEntry>;
  dreamGaze?: DreamGazeProgress;
};
```

- [ ] **Step 3: Run the compiler to confirm it now fails**

Run: `npx tsc -b`
Expected: FAIL — error in `src/lib/storage/progress.ts` similar to `Property 'teachBacks' is missing in type '{ age: null; ... }' but required in type 'UserProfile'.`

- [ ] **Step 4: Edit `src/lib/storage/progress.ts` — add `teachBacks: {}` to `defaultProfile`**

Replace the `defaultProfile` function (lines 6-16):

```ts
function defaultProfile(): UserProfile {
  return {
    age: null,
    voiceEnabled: true,
    modelSize: '1b',
    totalXp: 0,
    badges: [],
    topics: {},
    notes: [],
    teachBacks: {},
  };
}
```

- [ ] **Step 5: Run the compiler to confirm it passes again**

Run: `npx tsc -b`
Expected: exits with no output (success).

- [ ] **Step 6: Commit**

```bash
git add src/types.ts src/lib/storage/progress.ts
git commit -m "Add TeachBackEntry type and note summary field to profile model"
```

---

### Task 2: `saveNote` persists a summary

**Files:**
- Modify: `src/lib/storage/progress.ts:67-94` (`saveNote`)
- Test: Create `src/lib/storage/progress.test.ts`

**Interfaces:**
- Consumes: `UserProfile`, `Question`, `QuestionNote`, `TeachBackEntry` types from Task 1.
- Produces: `saveNote(profile: UserProfile, question: Question, text: string, summary?: string): UserProfile` — the `summary` param defaults to `''` so existing 3-arg call sites (in `ProfileContext`, updated in Task 4) keep compiling until they're updated.

- [ ] **Step 1: Write the failing test**

Create `src/lib/storage/progress.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { saveNote, removeNote, saveTeachBack, removeTeachBack } from './progress';
import type { Question, UserProfile } from '../../types';

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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/storage/progress.test.ts`
Expected: FAIL — `expect(profile.notes[0].summary).toBe('x equals 2')` receives `undefined` (the fourth argument is silently ignored by the current `saveNote`).

- [ ] **Step 3: Update `saveNote` to accept and persist `summary`**

Replace `saveNote` (currently lines 67-94):

```ts
export function saveNote(
  profile: UserProfile,
  question: Question,
  text: string,
  summary: string = '',
): UserProfile {
  const trimmed = text.trim();
  const now = Date.now();
  const existing = profile.notes.find((n) => n.questionId === question.id);

  if (existing) {
    if (!trimmed) return removeNote(profile, existing.id);
    const notes = profile.notes.map((n) =>
      n.id === existing.id ? { ...n, text: trimmed, summary, updatedAt: now } : n,
    );
    return { ...profile, notes };
  }

  if (!trimmed) return profile;

  const topic = ALL_TOPICS.find((t) => t.id === question.topicId);
  const note: QuestionNote = {
    id: `note-${question.id}-${now}`,
    questionId: question.id,
    topicId: question.topicId,
    subject: topic?.subject ?? 'math',
    questionText: question.question,
    text: trimmed,
    summary,
    createdAt: now,
    updatedAt: now,
  };
  return { ...profile, notes: [...profile.notes, note] };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/lib/storage/progress.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/storage/progress.ts src/lib/storage/progress.test.ts
git commit -m "Persist Cornell note summary in saveNote"
```

---

### Task 3: `saveTeachBack` and `removeTeachBack`

**Files:**
- Modify: `src/lib/storage/progress.ts` (add new functions after `noteForQuestion`, currently ending at line 102)
- Modify: `src/lib/storage/progress.test.ts`

**Interfaces:**
- Consumes: `TeachBackEntry` type from Task 1.
- Produces: `saveTeachBack(profile: UserProfile, topicId: string, subject: Subject, topicName: string, explanation: string, followUpPrompt: string, followUpResponse: string): UserProfile`; `removeTeachBack(profile: UserProfile, topicId: string): UserProfile`.

- [ ] **Step 1: Write the failing tests**

Append to `src/lib/storage/progress.test.ts` (add `Subject` to the existing type-only import from `'../../types'`, changing it to `import type { Question, Subject, UserProfile } from '../../types';`):

```ts
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
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/lib/storage/progress.test.ts`
Expected: FAIL with `saveTeachBack is not a function` / `removeTeachBack is not a function` (not yet exported).

- [ ] **Step 3: Implement `saveTeachBack` and `removeTeachBack`**

Add after `noteForQuestion` (currently the last function in the file, ending at line 102), and add `TeachBackEntry`/`Subject` to the existing type import at the top of `progress.ts` (currently `import type { Question, QuestionNote, UserProfile } from '../../types';` → change to `import type { Question, QuestionNote, Subject, TeachBackEntry, UserProfile } from '../../types';`):

```ts
export function saveTeachBack(
  profile: UserProfile,
  topicId: string,
  subject: Subject,
  topicName: string,
  explanation: string,
  followUpPrompt: string,
  followUpResponse: string,
): UserProfile {
  const entry: TeachBackEntry = {
    topicId,
    subject,
    topicName,
    explanation,
    followUpPrompt,
    followUpResponse,
    updatedAt: Date.now(),
  };
  return { ...profile, teachBacks: { ...profile.teachBacks, [topicId]: entry } };
}

export function removeTeachBack(profile: UserProfile, topicId: string): UserProfile {
  const teachBacks = { ...profile.teachBacks };
  delete teachBacks[topicId];
  return { ...profile, teachBacks };
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/lib/storage/progress.test.ts`
Expected: PASS (5 tests total).

- [ ] **Step 5: Run the full test suite to confirm nothing else broke**

Run: `npm run test`
Expected: PASS (all existing suites plus the new one).

- [ ] **Step 6: Commit**

```bash
git add src/lib/storage/progress.ts src/lib/storage/progress.test.ts
git commit -m "Add saveTeachBack/removeTeachBack to profile storage"
```

---

### Task 4: Wire new actions into `ProfileContext`

**Files:**
- Modify: `src/context/ProfileContext.tsx`

**Interfaces:**
- Consumes: `saveNote`, `saveTeachBack`, `removeTeachBack` from `src/lib/storage/progress.ts` (Tasks 2-3).
- Produces: `ProfileContextValue.saveQuestionNote(question: Question, text: string, summary?: string): void`; `ProfileContextValue.saveTeachBack(topicId: string, subject: Subject, topicName: string, explanation: string, followUpPrompt: string, followUpResponse: string): void`; `ProfileContextValue.deleteTeachBack(topicId: string): void`.

No new unit tests here — `ProfileContext` is a thin React context wrapper with no logic of its own beyond calling the already-tested storage functions; it's verified via `tsc` and the manual browser walkthrough in Task 7.

- [ ] **Step 1: Update imports**

Change line 2-10 of `src/context/ProfileContext.tsx` from:

```tsx
import type { Question, TopicProgress, UserProfile } from '../types';
import {
  ensureTopicsInitialized,
  loadProfile,
  removeNote,
  saveNote,
  saveProfile,
  setAge,
} from '../lib/storage/progress';
```

to:

```tsx
import type { Question, Subject, TopicProgress, UserProfile } from '../types';
import {
  ensureTopicsInitialized,
  loadProfile,
  removeNote,
  removeTeachBack,
  saveNote,
  saveProfile,
  saveTeachBack,
  setAge,
} from '../lib/storage/progress';
```

- [ ] **Step 2: Extend `ProfileContextValue`**

Change the type (currently lines 12-22) from:

```tsx
type ProfileContextValue = {
  profile: UserProfile;
  setUserAge: (age: number) => void;
  updateAge: (age: number) => void;
  updateTopicProgress: (topicId: string, progress: TopicProgress) => void;
  setVoiceEnabled: (enabled: boolean) => void;
  setModelSize: (size: UserProfile['modelSize']) => void;
  saveQuestionNote: (question: Question, text: string) => void;
  deleteNote: (noteId: string) => void;
  clearMissedQuestion: (topicId: string, questionId: string) => void;
};
```

to:

```tsx
type ProfileContextValue = {
  profile: UserProfile;
  setUserAge: (age: number) => void;
  updateAge: (age: number) => void;
  updateTopicProgress: (topicId: string, progress: TopicProgress) => void;
  setVoiceEnabled: (enabled: boolean) => void;
  setModelSize: (size: UserProfile['modelSize']) => void;
  saveQuestionNote: (question: Question, text: string, summary?: string) => void;
  deleteNote: (noteId: string) => void;
  clearMissedQuestion: (topicId: string, questionId: string) => void;
  saveTeachBack: (
    topicId: string,
    subject: Subject,
    topicName: string,
    explanation: string,
    followUpPrompt: string,
    followUpResponse: string,
  ) => void;
  deleteTeachBack: (topicId: string) => void;
};
```

- [ ] **Step 3: Update `saveQuestionNote` and add the two new action functions**

Replace the existing `saveQuestionNote` (currently lines 59-61):

```tsx
  const saveQuestionNote = (question: Question, text: string, summary: string = '') => {
    setProfile((prev) => saveNote(prev, question, text, summary));
  };
```

Add after `deleteNote` (currently lines 63-65):

```tsx
  const saveTeachBackEntry = (
    topicId: string,
    subject: Subject,
    topicName: string,
    explanation: string,
    followUpPrompt: string,
    followUpResponse: string,
  ) => {
    setProfile((prev) =>
      saveTeachBack(prev, topicId, subject, topicName, explanation, followUpPrompt, followUpResponse),
    );
  };

  const deleteTeachBackEntry = (topicId: string) => {
    setProfile((prev) => removeTeachBack(prev, topicId));
  };
```

(Named `saveTeachBackEntry`/`deleteTeachBackEntry` locally to avoid shadowing the imported `saveTeachBack`/`removeTeachBack` storage functions — the same pattern the file already uses for `setUserAge` wrapping the imported `setAge`.)

- [ ] **Step 4: Expose the new actions from the provider value**

In the `<ProfileContext.Provider value={{ ... }}>` block (currently lines 82-93), add the two new entries:

```tsx
  return (
    <ProfileContext.Provider
      value={{
        profile,
        setUserAge,
        updateAge,
        updateTopicProgress,
        setVoiceEnabled,
        setModelSize,
        saveQuestionNote,
        deleteNote,
        clearMissedQuestion,
        saveTeachBack: saveTeachBackEntry,
        deleteTeachBack: deleteTeachBackEntry,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
```

- [ ] **Step 5: Run the compiler**

Run: `npx tsc -b`
Expected: exits with no output (success) — `NoteEditor.tsx`'s existing 2-arg `saveQuestionNote(question, text)` call still compiles because `summary` has a default value.

- [ ] **Step 6: Commit**

```bash
git add src/context/ProfileContext.tsx
git commit -m "Expose saveTeachBack/deleteTeachBack and note summaries via ProfileContext"
```

---

### Task 5: `NoteEditor` — wire up the summary field

**Files:**
- Modify: `src/components/NoteEditor.tsx`

**Interfaces:**
- Consumes: `saveQuestionNote(question, text, summary?)` from `ProfileContext` (Task 4).

- [ ] **Step 1: Add `summary` state, seeded from the existing note**

Change line 20 from:

```tsx
  const [text, setText] = useState(existing?.text ?? '');
```

to:

```tsx
  const [text, setText] = useState(existing?.text ?? '');
  const [summary, setSummary] = useState(existing?.summary ?? '');
```

- [ ] **Step 2: Save and clear the summary alongside the note text**

Change `handleSave`/`handleDelete` (currently lines 59-68) from:

```tsx
  const handleSave = () => {
    saveQuestionNote(question, text);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleDelete = () => {
    if (existing) deleteNote(existing.id);
    setText('');
  };
```

to:

```tsx
  const handleSave = () => {
    saveQuestionNote(question, text, summary);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleDelete = () => {
    if (existing) deleteNote(existing.id);
    setText('');
    setSummary('');
  };
```

- [ ] **Step 3: Bind the summary `<input>`**

Change the summary input (currently lines 151-155) from:

```tsx
            <input
              type="text"
              placeholder="In my own words, this means…"
              className={`w-full rounded-lg border ${a.inputBorder} ${a.inputBg} px-2 py-1.5 text-xs ${a.inputText} placeholder:opacity-30 focus:outline-none ${a.inputFocus}`}
            />
```

to:

```tsx
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="In my own words, this means…"
              className={`w-full rounded-lg border ${a.inputBorder} ${a.inputBg} px-2 py-1.5 text-xs ${a.inputText} placeholder:opacity-30 focus:outline-none ${a.inputFocus}`}
            />
```

- [ ] **Step 4: Include the summary in the printed Cornell template**

Change the summary row of the `handlePrint` template string (currently line 94) from:

```tsx
      <div class="summary"><div class="col-label">Summary — explain it in your own words</div><div class="content"> </div></div>
```

to:

```tsx
      <div class="summary"><div class="col-label">Summary — explain it in your own words</div><div class="content">${summary || ' '}</div></div>
```

- [ ] **Step 5: Run the compiler**

Run: `npx tsc -b`
Expected: exits with no output (success).

- [ ] **Step 6: Commit**

```bash
git add src/components/NoteEditor.tsx
git commit -m "Bind Cornell note summary field to state and persist it"
```

---

### Task 6: `TeachItBack` persists the Feynman explanation, wired from `LearnSession`

**Files:**
- Modify: `src/components/TeachItBack.tsx`
- Modify: `src/routes/LearnSession.tsx:261-263`

**Interfaces:**
- Consumes: `saveTeachBack(topicId, subject, topicName, explanation, followUpPrompt, followUpResponse)` from `ProfileContext` (Task 4); `topic.id: string` and `topic.subject: Subject` already available in `LearnSession`.
- Produces: `TeachItBack` now requires `topicId: string` and `subject: Subject` props in addition to the existing `topicName`/`onDone`.

- [ ] **Step 1: Add the new props and imports to `TeachItBack.tsx`**

Change the top of the file (currently lines 1-6) from:

```tsx
import { useState } from 'react';

type TeachItBackProps = {
  topicName: string;
  onDone: () => void;
};
```

to:

```tsx
import { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import type { Subject } from '../types';

type TeachItBackProps = {
  topicId: string;
  subject: Subject;
  topicName: string;
  onDone: () => void;
};
```

- [ ] **Step 2: Destructure the new props and pull in `saveTeachBack`**

Change the component signature (currently line 17) from:

```tsx
export default function TeachItBack({ topicName, onDone }: TeachItBackProps) {
```

to:

```tsx
export default function TeachItBack({ topicId, subject, topicName, onDone }: TeachItBackProps) {
  const { saveTeachBack } = useProfile();
```

- [ ] **Step 3: Save the explanation and follow-up when the student finishes**

Change the final "Done" button (currently lines 106-113) from:

```tsx
            <div className="mt-4">
              <button
                type="button"
                onClick={onDone}
                className="w-full rounded-full bg-action-400 px-5 py-2.5 text-sm font-semibold text-action-bg transition-colors hover:bg-action-300"
              >
                Done — back to studying →
              </button>
            </div>
```

to:

```tsx
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
```

- [ ] **Step 4: Pass the new props from `LearnSession.tsx`**

Change (currently lines 261-263):

```tsx
      {showTeachBack && (
        <TeachItBack topicName={topic.name} onDone={handleTeachBackDone} />
      )}
```

to:

```tsx
      {showTeachBack && (
        <TeachItBack
          topicId={topic.id}
          subject={topic.subject}
          topicName={topic.name}
          onDone={handleTeachBackDone}
        />
      )}
```

- [ ] **Step 5: Run the compiler**

Run: `npx tsc -b`
Expected: exits with no output (success).

- [ ] **Step 6: Manually verify in the browser**

Run: `npm run dev`, open the app, start a Math session, answer 5 questions correctly in a row to trigger Teach It Back, type an explanation (≥10 words), submit, answer the follow-up, click "Done — back to studying →".
Expected: no console errors; the modal closes and the question flow continues.

- [ ] **Step 7: Commit**

```bash
git add src/components/TeachItBack.tsx src/routes/LearnSession.tsx
git commit -m "Persist Teach It Back explanations instead of discarding them"
```

---

### Task 7: `Notes` page — all 8 subjects, note summaries, Teach It Back section

**Files:**
- Modify: `src/routes/Notes.tsx`

**Interfaces:**
- Consumes: `profile.teachBacks: Record<string, TeachBackEntry>` (Task 1), `profile.notes[].summary?: string` (Task 1/2), `deleteTeachBack(topicId)` from `ProfileContext` (Task 4).

- [ ] **Step 1: Replace the whole file**

Replace the full contents of `src/routes/Notes.tsx`:

```tsx
import { useNavigate } from 'react-router-dom';
import Mascot from '../components/Mascot';
import { useProfile } from '../context/ProfileContext';
import { ALL_TOPICS, SUBJECT_LABELS, SUBJECT_PATHS } from '../lib/engine/topics';
import type { Subject, QuestionNote } from '../types';

const SUBJECT_ORDER = Object.keys(SUBJECT_LABELS) as Subject[];

export default function Notes() {
  const { profile, deleteNote, deleteTeachBack } = useProfile();
  const navigate = useNavigate();

  const notesBySubject = new Map<Subject, QuestionNote[]>();
  for (const note of profile.notes) {
    const list = notesBySubject.get(note.subject) ?? [];
    list.push(note);
    notesBySubject.set(note.subject, list);
  }

  const hasAnyNotes = profile.notes.length > 0 || Object.keys(profile.teachBacks).length > 0;

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-10 max-w-3xl mx-auto w-full text-center">
      <Mascot mood="happy" line="Here's everything you flagged for a second look." />
      <h1 className="mt-6 text-2xl font-extrabold text-white">My Notes</h1>
      <p className="mt-2 text-white/60">
        Questions you marked as interesting or tricky, and topics you've explained back to Cosmo — grouped by subject.
      </p>

      {!hasAnyNotes && (
        <p className="mt-10 text-sm text-white/50">
          No notes yet. While answering a question, tap "📝 Add a note" to save it here, or complete a Teach It Back
          checkpoint.
        </p>
      )}

      {SUBJECT_ORDER.map((subject) => {
        const notes = notesBySubject.get(subject) ?? [];
        const teachBackTopics = ALL_TOPICS.filter(
          (t) => t.subject === subject && profile.teachBacks[t.id],
        );
        if (notes.length === 0 && teachBackTopics.length === 0) return null;

        const notesByTopic = new Map<string, QuestionNote[]>();
        for (const note of notes) {
          const list = notesByTopic.get(note.topicId) ?? [];
          list.push(note);
          notesByTopic.set(note.topicId, list);
        }

        return (
          <section key={subject} className="mt-10 w-full text-left">
            <h2 className="text-lg font-semibold text-white">{SUBJECT_LABELS[subject]}</h2>

            {notesByTopic.size > 0 && (
              <div className="mt-3 flex flex-col gap-6">
                {[...notesByTopic.entries()].map(([topicId, topicNotes]) => {
                  const topic = ALL_TOPICS.find((t) => t.id === topicId);
                  return (
                    <div key={topicId}>
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-white/50">
                        {topic?.name ?? topicId}
                      </h3>
                      <div className="mt-2 flex flex-col gap-3">
                        {topicNotes
                          .sort((a, b) => b.updatedAt - a.updatedAt)
                          .map((note) => (
                            <div key={note.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                              <p className="text-sm text-white/50 italic">"{note.questionText}"</p>
                              <p className="mt-2 whitespace-pre-wrap text-white">{note.text}</p>
                              {note.summary && (
                                <p className="mt-2 text-sm text-comet-300">
                                  <span className="text-white/40">In your words: </span>
                                  {note.summary}
                                </p>
                              )}
                              <div className="mt-3 flex items-center justify-between gap-2 text-xs text-white/40">
                                <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                                <div className="flex gap-3">
                                  {topic && (
                                    <button
                                      type="button"
                                      onClick={() => navigate(`${SUBJECT_PATHS[subject]}/session?topic=${topic.id}`)}
                                      className="text-comet-400 hover:text-comet-300"
                                    >
                                      Practice this topic →
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => deleteNote(note.id)}
                                    className="hover:text-white"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {teachBackTopics.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-white/50">
                  🦆 Explain It Back
                </h3>
                <div className="mt-2 flex flex-col gap-3">
                  {teachBackTopics.map((topic) => {
                    const entry = profile.teachBacks[topic.id];
                    return (
                      <div key={topic.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-sm text-white/50 italic">{topic.name}</p>
                        <p className="mt-2 whitespace-pre-wrap text-white">{entry.explanation}</p>
                        {entry.followUpResponse && (
                          <div className="mt-2 border-t border-white/10 pt-2">
                            <p className="text-xs text-white/40 italic">"{entry.followUpPrompt}"</p>
                            <p className="mt-1 whitespace-pre-wrap text-white">{entry.followUpResponse}</p>
                          </div>
                        )}
                        <div className="mt-3 flex items-center justify-between gap-2 text-xs text-white/40">
                          <span>{new Date(entry.updatedAt).toLocaleDateString()}</span>
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => navigate(`${SUBJECT_PATHS[subject]}/session?topic=${topic.id}`)}
                              className="text-comet-400 hover:text-comet-300"
                            >
                              Practice this topic →
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteTeachBack(topic.id)}
                              className="hover:text-white"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Run the compiler**

Run: `npx tsc -b`
Expected: exits with no output (success).

- [ ] **Step 3: Manually verify in the browser**

Run: `npm run dev` (if not already running from Task 6).
1. Go to `/notes` with a fresh profile → confirm the empty state shows.
2. Answer a Chemistry question, add a note with both a "Notes" and a "Summary" value, save it.
3. Go to `/notes` → confirm a "Chemistry" section now appears (previously impossible — Chemistry was excluded from `SUBJECT_ORDER`) showing both the note text and the "In your words: …" summary line.
4. Complete a Teach It Back checkpoint (from Task 6's verification, or trigger a new one) → go to `/notes` → confirm an "🦆 Explain It Back" entry appears under the correct subject with the explanation and follow-up Q&A, and that "Delete" removes it.

Expected: all four checks pass, no console errors.

- [ ] **Step 4: Run the full test suite one more time**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/routes/Notes.tsx
git commit -m "Show all subjects and Teach It Back entries on the Notes page"
```

---

## Self-Review Notes

- **Spec coverage:** Task 1 covers the data-model section of the spec; Tasks 2-3 cover the storage-layer section; Task 4 covers the context section; Tasks 5-7 cover the three component sections (`NoteEditor`, `TeachItBack`+`LearnSession`, `Notes`) in the order the spec lists them. The spec's testing section (unit tests on storage, manual verification for UI) is covered by Tasks 2-3's automated tests and Tasks 6-7's manual browser steps.
- **Type consistency:** `saveTeachBack`'s parameter order (`topicId, subject, topicName, explanation, followUpPrompt, followUpResponse`) is identical across its definition (Task 3), the `ProfileContextValue` type and wrapper (Task 4), and both call sites (Task 6, Task 7's read side via `profile.teachBacks`). `TeachBackEntry` field names (`explanation`, `followUpPrompt`, `followUpResponse`, `updatedAt`) match between Task 1's type, Task 3's constructor, and Task 7's render code.
- **Out-of-scope items confirmed not touched:** `PomodoroGateway`, spaced repetition, the adaptive tier engine, and `vite.config.ts`'s test environment are not modified by any task above.
