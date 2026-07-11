# CogniSync persistence fixes — design

Date: 2026-07-11
Status: Approved

## Problem

`docs/AUDIT.md` identified that several of Stardance's "CogniSync" learning
techniques are wired into the UI but silently do nothing:

- **Teach It Back** (Feynman technique): captures the student's explanation
  and a follow-up answer in local component state, then discards both when
  the modal closes.
- **Cornell note summary field**: the "Summary — one sentence in your own
  words" input in `NoteEditor` has no `value`/`onChange` binding; anything
  typed there vanishes.
- **Notes page subject coverage**: `Notes.tsx`'s `SUBJECT_ORDER` only lists
  4 of the app's 8 real subjects (math, biology, python, robotics), so notes
  for chemistry/space/physics/hackathon never render, and the empty state is
  wrong when only those subjects have notes.

The goal of this change is to make these techniques actually function, so
studying on Stardance matches the learning-science principles it claims to
implement (active recall via self-testing already works; spaced repetition
is already correctly surfaced on the Profile page; the adaptive tier engine
already implements desirable difficulty — none of those need changes).

Explicitly out of scope: `PomodoroGateway`'s missing skip/dismiss control.
It already works as designed (forces a break after sustained active study);
the lack of an override is an accessibility gap tracked separately in
`docs/AUDIT.md`, not a broken technique.

## Data model (`src/types.ts`)

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

- `UserProfile.teachBacks: Record<string, TeachBackEntry>`, keyed by
  `topicId` — mirrors the existing `topics: Record<string, TopicProgress>`
  pattern. Keying by topic makes "a new submission overwrites the previous
  one for that topic" (the approved behavior) a direct object write, no
  search-and-replace.
- `QuestionNote` gains `summary?: string`.

## Storage layer (`src/lib/storage/progress.ts`)

- `defaultProfile()` gains `teachBacks: {}`. Old saved profiles get this for
  free via the existing `{...defaultProfile(), ...parsed}` merge in
  `loadProfile` — the same mechanism that already backfills `notes: []`
  today, so no separate migration function is needed.
- `saveNote(profile, question, text, summary)` — signature extended to
  accept and persist `summary` alongside `text`. Save/no-op rules stay the
  same as today (driven by whether `text` is non-empty); `summary` is stored
  whenever provided, including empty string.
- `saveTeachBack(profile, topicId, subject, topicName, explanation,
  followUpPrompt, followUpResponse)` — upserts
  `profile.teachBacks[topicId]`.
- `removeTeachBack(profile, topicId)` — deletes the entry.

## Context (`src/context/ProfileContext.tsx`)

- `saveQuestionNote(question, text, summary)` — updated signature, forwards
  to `saveNote`.
- `saveTeachBack(topicId, subject, topicName, explanation, followUpPrompt,
  followUpResponse)` — new context action.
- `deleteTeachBack(topicId)` — new context action.

## Components

**`TeachItBack.tsx`**
- Gains `topicId: string` and `subject: Subject` props (the caller,
  `LearnSession.tsx`, already has both via `topic.id`/`topic.subject`).
- On the final "Done — back to studying →" click (end of the follow-up
  phase), calls `saveTeachBack(...)` via `useProfile()` before calling
  `onDone()`. This is the only save point — submitting the first-phase
  explanation just transitions to the follow-up phase, it doesn't save yet,
  so a single write captures explanation + follow-up together.
- Clicking "Skip" on the first phase still calls `onDone()` directly with no
  save, unchanged from today.

**`NoteEditor.tsx`**
- New `summary` state, seeded from `existing?.summary ?? ''`.
- The summary `<input>` gets `value={summary}` / `onChange`.
- `handleSave` calls `saveQuestionNote(question, text, summary)`.
- `handleDelete` resets both `text` and `summary` to `''`.
- `handlePrint`'s generated template fills the "Summary" content div with
  the current `summary` value instead of leaving it blank.

**`Notes.tsx`**
- `SUBJECT_ORDER` becomes `Object.keys(SUBJECT_LABELS) as Subject[]` instead
  of a hand-maintained 4-item array, so it can't silently drop subjects
  again as new ones are added.
- Each note card renders `note.summary` (when present) under the note text,
  labeled distinctly from the main notes (e.g. "In your words: …").
- New "Explain It Back" subsection per subject, rendered below the
  per-question notes for that subject: for each topic in that subject with a
  `TeachBackEntry`, show topic name, explanation, the follow-up prompt and
  response, last-updated date, and a delete button wired to
  `deleteTeachBack`.
- `hasAnyNotes` (empty-state gate) becomes
  `profile.notes.length > 0 || Object.keys(profile.teachBacks).length > 0`.

## Testing

- Unit tests in `src/lib/storage/progress.test.ts` (new file) for:
  `saveNote` persisting `summary`, `saveTeachBack` creating and then
  overwriting an entry for the same `topicId`, `removeTeachBack`.
- No new component/UI tests: `vite.config.ts` runs vitest in a `node`
  environment (no `jsdom`), so React-component tests aren't practical
  without a separate config change, which is out of scope here (tracked as
  a pre-existing gap in `docs/AUDIT.md`). Verification for the UI pieces is
  manual: run the dev server, complete a Teach It Back flow and a note with
  a summary, and confirm both appear correctly on `/notes` across subjects
  including one of the previously-hidden four (e.g. chemistry).
