# DreamGaze Checklist + Dead Field Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Tasks 1, 2, and 3 are fully independent — they touch different files and can be worked in any order.

**Goal:** Fix a real, visible bug (DreamGaze's checklist never saves — it doesn't even have checkboxes yet) and remove two genuinely dead fields from the profile data model (`badges`, `totalXp`) that are defined, initialized, but never read or written by anything.

**Architecture:** Task 1 adds checkbox UI to `DreamGaze.tsx`'s existing roadmap content and a notes textarea, persisted via a new `saveDreamGaze` storage function + context action, following the exact same pattern already used for `saveTeachBack`/`teachBacks` in this codebase. Tasks 2 and 3 delete unused fields from `types.ts` and their initializers from `defaultProfile()` in `src/lib/storage/progress.ts`.

**Tech Stack:** React, TypeScript, Vitest.

## Global Constraints

- Full context: `src/routes/DreamGaze.tsx` is currently 100% static content — no checkboxes exist yet, they must be added, not just "wired up."
- `UserProfile.dreamGaze?: DreamGazeProgress` (`{ checked: string[]; notes: string }`) already exists in `src/types.ts` and is currently unused — do not change its shape.
- Confirmed via grep before writing this plan: `profile.badges` and `awardBadgeIfNew` have no callers outside their own definitions in `src/lib/storage/progress.ts`. `profile.totalXp` (the field) has zero references anywhere. Both are safe to delete. (The separate `totalXp()` *function* in the same file, which `Profile.tsx` actually uses to compute XP from `profile.topics`, is NOT touched by Task 3 — different thing, same name-ish, do not confuse them.)
- `vitest` runs in a `node` environment (no `jsdom`), so `DreamGaze.tsx`'s new checkbox/textarea UI cannot be unit-tested — Task 1's automated test coverage is limited to the new pure storage function; the UI itself is verified manually in a browser.

---

### Task 1: DreamGaze checklist — add checkboxes, wire up persistence

**Files:**
- Modify: `src/types.ts` — no changes needed, `DreamGazeProgress`/`UserProfile.dreamGaze` already exist.
- Modify: `src/lib/storage/progress.ts` — add `saveDreamGazeProgress`.
- Test: `src/lib/storage/progress.test.ts` — add tests for `saveDreamGazeProgress`.
- Modify: `src/context/ProfileContext.tsx` — add `saveDreamGaze` action.
- Modify: `src/routes/DreamGaze.tsx` — add checkboxes to roadmap items + a notes textarea.

**Interfaces:**
- Consumes: `DreamGazeProgress` and `UserProfile` types from `src/types.ts` (unchanged).
- Produces: `saveDreamGazeProgress(profile: UserProfile, checked: string[], notes: string): UserProfile` (pure function in `progress.ts`); `saveDreamGaze(checked: string[], notes: string): void` (context action, available via `useProfile()`).

- [ ] **Step 1: Write the failing test for the storage function**

Add to `src/lib/storage/progress.test.ts` (append; the file already exists with a `makeProfile()` helper — reuse it):

```ts
import { saveDreamGazeProgress } from './progress';

describe('saveDreamGazeProgress', () => {
  it('stores checked items and notes on the profile', () => {
    const profile = saveDreamGazeProgress(makeProfile(), ['9th grade::Join 2-3 clubs'], 'Looking into robotics club');
    expect(profile.dreamGaze).toEqual({
      checked: ['9th grade::Join 2-3 clubs'],
      notes: 'Looking into robotics club',
    });
  });

  it('overwrites the previous checked list and notes on a later call', () => {
    let profile = saveDreamGazeProgress(makeProfile(), ['a'], 'first note');
    profile = saveDreamGazeProgress(profile, ['a', 'b'], 'updated note');
    expect(profile.dreamGaze).toEqual({ checked: ['a', 'b'], notes: 'updated note' });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/storage/progress.test.ts`
Expected: FAIL — `saveDreamGazeProgress is not a function` (not yet exported).

- [ ] **Step 3: Implement `saveDreamGazeProgress`**

Add to `src/lib/storage/progress.ts`, after `removeTeachBack` (the last function in the file):

```ts
export function saveDreamGazeProgress(
  profile: UserProfile,
  checked: string[],
  notes: string,
): UserProfile {
  return { ...profile, dreamGaze: { checked, notes } };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/lib/storage/progress.test.ts`
Expected: PASS (all tests in the file, including the 2 new ones).

- [ ] **Step 5: Wire the context action**

In `src/context/ProfileContext.tsx`:

Change the import (currently):
```ts
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
to:
```ts
import {
  ensureTopicsInitialized,
  loadProfile,
  removeNote,
  removeTeachBack,
  saveDreamGazeProgress,
  saveNote,
  saveProfile,
  saveTeachBack,
  setAge,
} from '../lib/storage/progress';
```

Add `saveDreamGaze: (checked: string[], notes: string) => void;` to the `ProfileContextValue` type, right after `deleteTeachBack: (topicId: string) => void;`.

Add the action function after `deleteTeachBackEntry`:
```ts
  const saveDreamGazeEntry = (checked: string[], notes: string) => {
    setProfile((prev) => saveDreamGazeProgress(prev, checked, notes));
  };
```

Add `saveDreamGaze: saveDreamGazeEntry,` to the `<ProfileContext.Provider value={{ ... }}>` object, after `deleteTeachBack: deleteTeachBackEntry,`.

- [ ] **Step 6: Run the compiler**

Run: `npx tsc -b`
Expected: exits with no output (success).

- [ ] **Step 7: Add checkboxes and a notes textarea to `DreamGaze.tsx`**

Change the imports at the top of `src/routes/DreamGaze.tsx` (currently just `import Mascot from '../components/Mascot';`) to:
```tsx
import { useState } from 'react';
import Mascot from '../components/Mascot';
import { useProfile } from '../context/ProfileContext';
```

Change the component signature and add state (currently `export default function DreamGaze() {` followed directly by the `return`):
```tsx
export default function DreamGaze() {
  const { profile, saveDreamGaze } = useProfile();
  const checked = profile.dreamGaze?.checked ?? [];
  const [notes, setNotes] = useState(profile.dreamGaze?.notes ?? '');

  const toggleItem = (itemId: string) => {
    const next = checked.includes(itemId)
      ? checked.filter((id) => id !== itemId)
      : [...checked, itemId];
    saveDreamGaze(next, notes);
  };

  const handleNotesBlur = () => {
    saveDreamGaze(checked, notes);
  };

```
(keep the existing `return (` and everything inside it, only the block above is new, inserted before the `return`).

Inside the roadmap render, change the items `<ul>` (currently):
```tsx
                <ul className="mt-2 flex flex-col gap-1.5 text-sm text-white/70">
                  {stage.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span aria-hidden="true">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
```
to:
```tsx
                <ul className="mt-2 flex flex-col gap-2 text-sm text-white/70">
                  {stage.items.map((item) => {
                    const itemId = `${stage.grade}::${item}`;
                    const isChecked = checked.includes(itemId);
                    return (
                      <li key={item} className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleItem(itemId)}
                          aria-label={item}
                          className="mt-1 h-4 w-4 shrink-0 accent-star-400"
                        />
                        <span className={isChecked ? 'text-white/40 line-through' : ''}>{item}</span>
                      </li>
                    );
                  })}
                </ul>
```

Add a notes section right before the final "Remember: extracurriculars..." `<div>` at the bottom of the JSX (currently the last element before the closing `</div>` of the component):
```tsx
      <div className="mt-10 w-full max-w-xl text-left">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white/50">Your notes</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={handleNotesBlur}
          placeholder="Ideas, plans, things to look into..."
          rows={4}
          className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-star-400"
        />
      </div>

```

- [ ] **Step 8: Run the compiler and full test suite**

Run: `npx tsc -b`
Expected: exits with no output (success).

Run: `npm run test`
Expected: PASS (all suites, including the 2 new `saveDreamGazeProgress` tests).

- [ ] **Step 9: Manually verify in the browser**

Run: `npm run dev`. Go to `/dream-gaze`. Check a couple of roadmap boxes, type something in the notes box, click away. Reload the page. Expected: the checked boxes and notes text are still there.

- [ ] **Step 10: Commit**

```bash
git add src/types.ts src/lib/storage/progress.ts src/lib/storage/progress.test.ts src/context/ProfileContext.tsx src/routes/DreamGaze.tsx
git commit -m "Add working checklist and notes to Dream Gaze

DreamGaze previously had no checkboxes at all despite
DreamGazeProgress already existing in the data model — the roadmap
was purely static text. Roadmap items are now checkable and a notes
field is added, both persisted via a new saveDreamGaze action,
following the same pattern as the existing saveTeachBack."
```

---

### Task 2: Remove dead `badges` field and `awardBadgeIfNew`

**Files:**
- Modify: `src/types.ts:81-92` (`UserProfile`)
- Modify: `src/lib/storage/progress.ts` (`defaultProfile`, `awardBadgeIfNew`)

**Interfaces:**
- Consumes: nothing new.
- Produces: nothing new — this is a pure deletion. Confirmed via `grep -rn "\.badges\b" src` and `grep -rn "awardBadgeIfNew" src` before this plan was written: both have zero references outside `progress.ts`'s own (now-deleted) definitions.

- [ ] **Step 1: Remove `badges` from `UserProfile`**

In `src/types.ts`, remove the `badges: string[];` line from the `UserProfile` type (currently between `totalXp: number;` and `topics: Record<string, TopicProgress>;`).

- [ ] **Step 2: Remove `badges: []` from `defaultProfile()`**

In `src/lib/storage/progress.ts`, remove the `badges: [],` line from `defaultProfile()`.

- [ ] **Step 3: Delete `awardBadgeIfNew`**

In `src/lib/storage/progress.ts`, delete the entire function:
```ts
export function awardBadgeIfNew(profile: UserProfile, badge: string): UserProfile {
  if (profile.badges.includes(badge)) return profile;
  return { ...profile, badges: [...profile.badges, badge] };
}
```

- [ ] **Step 4: Run the compiler and full test suite**

Run: `npx tsc -b`
Expected: exits with no output (success). If this fails with a reference to `badges` somewhere unexpected, STOP — that means the earlier grep missed a caller; do not delete further, report what was found instead.

Run: `npm run test`
Expected: PASS (all suites).

- [ ] **Step 5: Commit**

```bash
git add src/types.ts src/lib/storage/progress.ts
git commit -m "Remove dead badges field and awardBadgeIfNew

Neither had any callers — Profile.tsx computes badges locally from
topic progress instead of reading profile.badges. Confirmed via grep
before removal that nothing else referenced either."
```

---

### Task 3: Remove dead `totalXp` field

**Files:**
- Modify: `src/types.ts:81-92` (`UserProfile`)
- Modify: `src/lib/storage/progress.ts` (`defaultProfile`)

**Interfaces:**
- Consumes: nothing new.
- Produces: nothing new — pure deletion. Confirmed via `grep -rn "\.totalXp\b" src` before this plan was written: zero references to the *field* anywhere (the separate `totalXp()` *function* in the same file, used by `src/routes/Profile.tsx`, is a different thing and is NOT touched by this task).

- [ ] **Step 1: Remove `totalXp` from `UserProfile`**

In `src/types.ts`, remove the `totalXp: number;` line from the `UserProfile` type (currently the line right after `modelSize: ModelSize;`).

- [ ] **Step 2: Remove `totalXp: 0` from `defaultProfile()`**

In `src/lib/storage/progress.ts`, remove the `totalXp: 0,` line from `defaultProfile()`. Do NOT touch the separate `export function totalXp(profile: UserProfile): number { ... }` function later in the same file — that one is real and used by `src/routes/Profile.tsx`.

- [ ] **Step 3: Run the compiler and full test suite**

Run: `npx tsc -b`
Expected: exits with no output (success). If this fails with a reference to `totalXp` as a *property access* (e.g. `profile.totalXp`) somewhere, STOP and report it rather than deleting further — that would mean the earlier grep missed a caller. A failure referencing the `totalXp(...)` *function* being undefined would mean the wrong thing was deleted — also stop and report.

Run: `npm run test`
Expected: PASS (all suites).

- [ ] **Step 4: Commit**

```bash
git add src/types.ts src/lib/storage/progress.ts
git commit -m "Remove dead totalXp field from UserProfile

Always initialized to 0 and never updated by anything — Profile.tsx
computes XP via the separate totalXp() function instead, which reads
profile.topics directly and is unaffected by this change."
```

---

## Self-Review Notes

- **Spec coverage:** Task 1 covers the DreamGaze checklist/notes persistence bug. Tasks 2 and 3 cover the two dead-field removals. All three were confirmed independent (different files, no shared state) before writing.
- **Type consistency:** `saveDreamGazeProgress`'s signature (`profile, checked: string[], notes: string`) matches exactly between its definition (Task 1 Step 3), the context wrapper (Step 5), and the component call sites (Step 7) — `saveDreamGaze(next, notes)` and `saveDreamGaze(checked, notes)` both pass a `string[]` then a `string`, matching the function signature in that order.
- **Order-independence confirmed:** Tasks 2 and 3 both touch `src/types.ts`'s `UserProfile` type and `src/lib/storage/progress.ts`'s `defaultProfile()`, but remove different, non-adjacent lines — they can run in either order or via separate subagents without conflicting, though if run as literal concurrent git operations rather than sequential subagent turns, whichever commits second should rebase/reapply cleanly since the two diffs don't overlap.
