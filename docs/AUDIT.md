# Stardance Learn — Flaw Audit (2026-07-11)

Full-codebase audit performed to find flaws standing between Stardance and the
goal of being a project any student can pick up, use, and learn from. Covers
core engine/state logic, all 20 question banks (1,345 questions), UI/UX and
accessibility across every route and component, and the WebLLM/test/tooling
setup.

Content quality turned out to be excellent — the question banks are
structurally clean and factually accurate. The issues are almost entirely in
the app layer: several "core" features quietly do nothing, progression gating
doesn't gate, and accessibility is largely unaddressed.

## P0 — Broken features (student-facing, undermines the "learn" promise)

1. **"Teach It Back" discards everything the student writes.**
   `src/components/TeachItBack.tsx` keeps the explanation in local state only;
   `onDone` takes no args and nothing is ever saved. The app's core
   active-recall mechanic is decorative.

2. **Note-taking silently drops the summary field.**
   `src/components/NoteEditor.tsx:151` — the Cornell-notes "Summary" `<input>`
   has no `value`/`onChange` binding at all. Typed text vanishes on save.

3. **Skill-path unlocking is fake for every subject's Part 2/Unit 2.**
   `src/components/SkillPath.tsx:12` treats `index === 0` as always-unlocked,
   but every module map renders a *separate* `<SkillPath>` per part, so the
   first topic of Part 2 (e.g. Piecewise Functions, History of the Atom) is
   clickable from a brand-new profile — the progression gate doesn't gate.

4. **Notes page silently hides 4 of 8 subjects.**
   `src/routes/Notes.tsx:7` — `SUBJECT_ORDER` omits chemistry, space, physics,
   hackathon. Notes for those subjects exist in storage but never render, and
   the "no notes yet" empty state doesn't show either — they just disappear
   with no explanation.

5. **Biology Part 2 progress is invisible on the Profile page.**
   `src/routes/Profile.tsx:34,164` only reads `BIOLOGY_TOPICS`, never
   `BIOLOGY_TOPICS_PART2` — mastering Genetics/Evolution/Ecology earns no
   badge and shows no progress bar.

6. **Practice-mode code formatting breaks for most Python topics.**
   `src/routes/PracticeSession.tsx:161` — the `isPython` prefix check misses
   9 of 12 Python topic IDs.

7. **Hackathon subject can never reach its advertised difficulty.**
   All 6 hackathon topics have zero tier-4/5 questions
   (`src/lib/engine/questionBank.hackathon.json`) — the adaptive-difficulty
   promise silently caps at tier 3 for that whole subject.

8. **AI-generated questions aren't validated before being shown.**
   `src/lib/webllm/prompts.ts:23-39` casts the model's JSON straight into a
   `Question` — no check that `choices.length`, `answerIndex` range, or text
   are sane. A malformed response from the on-device 1B/3B model can crash
   `QuestionCard` or show a student a wrong "correct" answer with total
   confidence.

9. **Lint is currently giving zero signal.**
   A leftover git worktree
   (`.claude/worktrees/agent-ab026375548fdd519/tsconfig.json`) confuses
   ESLint's tsconfig detection — `npm run lint` fails on all 96 files with a
   parsing error, not real lint errors. Should be removed/gitignored.

10. **README is materially wrong.**
    It claims "Space and Coding modules are planned but not yet available" —
    both are fully built, along with Chemistry, Robotics, Physics, and
    Hackathon, none of which are mentioned at all. Misleading for any student
    or teacher sizing up the project.

## P1 — Accessibility (blocks real students: colorblind, keyboard-only, screen-reader users)

- **Color-only correct/incorrect feedback** in `src/components/QuestionCard.tsx`
  — no icon/text backup, no radiogroup semantics.
- **`PomodoroGateway` traps the entire app for 5 minutes with no skip/dismiss
  control** — no escape hatch even to check Settings or Profile.
- **No modal semantics anywhere**: `AgeGate`, `LevelUpModal`, `TeachItBack`
  lack `role="dialog"`, `aria-modal`, and focus trapping/Escape-to-close.
- **Mascot's speech bubble has no `aria-live`**, so screen-reader users miss
  Cosmo's feedback entirely.

## P2 — Cleanup / dead code / risk

- `profile.badges`, `profile.totalXp`, `awardBadgeIfNew`, and
  `DreamGazeProgress`/`dreamGaze` are all defined in the data model but never
  actually read/written (Profile.tsx recomputes badges/XP locally; DreamGaze
  route is static content).
- `Subject` type includes `'music'` with zero content or routes anywhere.
- Switching model size in Settings doesn't dispose the previously-loaded
  WebLLM engine — likely leaks GPU/WASM memory.
- Clicking "Skip waiting" doesn't cancel the in-flight LLM generation call —
  it keeps running and could interfere with the next question's generation.
- No tests at all for `webllm/*`, `tts.ts`, `PomodoroGateway`,
  `ProfileContext` persistence, `NoteEditor`, or spaced-repetition math — and
  `vitest` runs in `node` environment, not `jsdom`, so no browser-API test
  could even be written today without a config change.
- No CI config in the repo at all.
- `tsconfig.app.json` doesn't enable `strict`/`strictNullChecks`, so
  `age: number | null`-style fields throughout the codebase aren't
  null-checked by the compiler.

## Content quality (the pleasant surprise)

1,345 questions, structurally perfect (no duplicate IDs, no out-of-range
answers, no orphaned topics), and a 288-question factual spot-check across
all subjects found **zero wrong answers**. Only nits: one physics question
(`forces-equilibrium-t5-q2`) is technically imprecise (µ=tanθ only holds at
the verge of slipping), and two exact duplicate questions appear across
subject files (`chem-metric-measurement-t2-q1` / `physics-measurement-t2-q3`;
`kinematics-1d-t1-q3` / `kinematics-2d-t1-q3`).

## Suggested fix order

1. Dead pedagogical features: Teach It Back save, NoteEditor summary field,
   SkillPath gating (#1–3).
2. Visibility/data bugs: Notes subjects, Biology Part 2 on Profile, Practice
   codeMode detection, hackathon tier gap (#4–7).
3. LLM output validation and the stray-worktree lint fix (#8–9).
4. Accessibility pass (P1).
5. Cleanup and test-coverage gaps (P2).
