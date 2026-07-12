# WebLLM Engine Disposal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix a memory leak where switching the WebLLM model size (1B ↔ 3B) never disposes the previously loaded model, by calling its `.unload()` method before creating the new one.

**Architecture:** `src/lib/webllm/client.ts`'s `getEngine()` caches a single in-flight/loaded `MLCEngine` in module-level state. On a model-size switch, it will now await and unload the previous engine (tolerating unload failure) before creating the replacement. No other files change.

**Tech Stack:** TypeScript, Vitest, `@mlc-ai/web-llm`.

## Global Constraints

- Full design context lives in `docs/superpowers/specs/2026-07-12-webllm-engine-disposal-design.md` — read it if anything below is ambiguous.
- Do not change any behavior of `client.ts` other than engine disposal on a model-size switch (timeouts, `chatJSON`, `isWebGPUAvailable` are out of scope).
- The existing same-`modelSize` fast path (return the cached promise unchanged) must still work exactly as before.

---

### Task 1: Dispose the previous WebLLM engine on a model-size switch

**Files:**
- Modify: `src/lib/webllm/client.ts:18-28` (`getEngine`)
- Test: Create `src/lib/webllm/client.test.ts`

**Interfaces:**
- Consumes: `MLCEngine` type and `CreateMLCEngine` function from `@mlc-ai/web-llm` (already imported in `client.ts`); `ModelSize` type from `../../types` (already imported).
- Produces: `getEngine(modelSize: ModelSize, onProgress?: (report: InitProgressReport) => void): Promise<MLCEngine>` — same public signature as today, no callers elsewhere in the codebase need to change.

The full current contents of `src/lib/webllm/client.ts` for reference:

```ts
import { CreateMLCEngine, type InitProgressReport, type MLCEngine } from '@mlc-ai/web-llm';
import type { ModelSize } from '../../types';

const MODEL_IDS: Record<ModelSize, string> = {
  '1b': 'Llama-3.2-1B-Instruct-q4f16_1-MLC',
  '3b': 'Llama-3.2-3B-Instruct-q4f16_1-MLC',
};

let enginePromise: Promise<MLCEngine> | null = null;
let loadedModel: ModelSize | null = null;

/** WebGPU is required to run a model in-browser. */
export function isWebGPUAvailable(): boolean {
  return typeof navigator !== 'undefined' && 'gpu' in navigator;
}

/** Lazily create (or reuse) the in-browser LLM engine for the given model size. */
export function getEngine(
  modelSize: ModelSize,
  onProgress?: (report: InitProgressReport) => void,
): Promise<MLCEngine> {
  if (enginePromise && loadedModel === modelSize) return enginePromise;
  loadedModel = modelSize;
  enginePromise = CreateMLCEngine(MODEL_IDS[modelSize], {
    initProgressCallback: onProgress,
  });
  return enginePromise;
}

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      },
    );
  });
}

const MODEL_LOAD_TIMEOUT_MS = 45_000;
const COMPLETION_TIMEOUT_MS = 20_000;

/** Send a system+user prompt and parse the model's JSON-mode reply as T. */
export async function chatJSON<T>(
  modelSize: ModelSize,
  systemPrompt: string,
  userPrompt: string,
  onProgress?: (report: InitProgressReport) => void,
): Promise<T> {
  const engine = await withTimeout(
    getEngine(modelSize, onProgress),
    MODEL_LOAD_TIMEOUT_MS,
    'Model load timed out',
  );
  const reply = await withTimeout(
    engine.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
    }),
    COMPLETION_TIMEOUT_MS,
    'Model response timed out',
  );
  const content = reply.choices[0]?.message?.content ?? '{}';
  return JSON.parse(content) as T;
}
```

`node_modules/@mlc-ai/web-llm/lib/engine.d.ts:65` confirms `MLCEngine` has `unload(): Promise<void>`. Nothing in this repo currently calls it.

A note on testing module-level state: `enginePromise`/`loadedModel` are private variables inside `client.ts` with no reset hook. Vitest's module registry must be reset between test cases (`vi.resetModules()`) and both `@mlc-ai/web-llm` and `./client` must be re-imported *dynamically inside each test* (not statically at the top of the file) so the test observes the same fresh mock instance that the freshly-reloaded `client.ts` module will itself resolve via `import`. Importing `CreateMLCEngine` statically at the top of the test file would go stale after `vi.resetModules()` and silently test the wrong mock instance — do not do that.

Also call `vi.clearAllMocks()` alongside `vi.resetModules()` in `beforeEach`: `resetModules()` resets `client.ts`'s module state but does *not* clear the mocked `CreateMLCEngine`'s call-count history, so without `clearAllMocks()` a later test's call count silently includes earlier tests' calls (verified by hand — omitting this causes the second test to see 3 calls instead of 2).

- [ ] **Step 1: Write the failing test**

Create `src/lib/webllm/client.test.ts`:

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { MLCEngine } from '@mlc-ai/web-llm';

vi.mock('@mlc-ai/web-llm', () => ({
  CreateMLCEngine: vi.fn(),
}));

function makeMockEngine(unload: () => Promise<void> = vi.fn().mockResolvedValue(undefined)) {
  return { unload } as unknown as MLCEngine;
}

describe('getEngine', () => {
  beforeEach(() => {
    vi.resetModules();
    // resetModules() gives ./client a fresh module (clean enginePromise/
    // loadedModel state) but does NOT clear the mocked CreateMLCEngine's
    // call history — without this, call counts leak across tests.
    vi.clearAllMocks();
  });

  it('returns the same cached promise when the same modelSize is requested twice', async () => {
    const { CreateMLCEngine } = await import('@mlc-ai/web-llm');
    vi.mocked(CreateMLCEngine).mockResolvedValue(makeMockEngine());
    const { getEngine } = await import('./client');

    const first = getEngine('1b');
    const second = getEngine('1b');
    await first;

    expect(first).toBe(second);
    expect(CreateMLCEngine).toHaveBeenCalledTimes(1);
  });

  it('unloads the previous engine before resolving a new one for a different modelSize', async () => {
    const { CreateMLCEngine } = await import('@mlc-ai/web-llm');
    const unload1b = vi.fn().mockResolvedValue(undefined);
    vi.mocked(CreateMLCEngine)
      .mockResolvedValueOnce(makeMockEngine(unload1b))
      .mockResolvedValueOnce(makeMockEngine());
    const { getEngine } = await import('./client');

    await getEngine('1b');
    await getEngine('3b');

    expect(unload1b).toHaveBeenCalledTimes(1);
    expect(CreateMLCEngine).toHaveBeenCalledTimes(2);
  });

  it('still resolves the new engine even if the previous engine fails to unload', async () => {
    const { CreateMLCEngine } = await import('@mlc-ai/web-llm');
    const failingUnload = vi.fn().mockRejectedValue(new Error('unload failed'));
    const newEngine = makeMockEngine();
    vi.mocked(CreateMLCEngine)
      .mockResolvedValueOnce(makeMockEngine(failingUnload))
      .mockResolvedValueOnce(newEngine);
    const { getEngine } = await import('./client');

    await getEngine('1b');
    const result = await getEngine('3b');

    expect(failingUnload).toHaveBeenCalledTimes(1);
    expect(result).toBe(newEngine);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/webllm/client.test.ts`
Expected: FAIL on the second and third tests — `unload1b`/`failingUnload` were never called, because `getEngine` doesn't unload anything yet. (The first test should already pass, since the same-`modelSize` fast path is unaffected by this change — that's expected and fine.)

- [ ] **Step 3: Implement the fix**

Replace `getEngine` in `src/lib/webllm/client.ts` (currently lines 18-28):

```ts
/** Lazily create (or reuse) the in-browser LLM engine for the given model size. */
export function getEngine(
  modelSize: ModelSize,
  onProgress?: (report: InitProgressReport) => void,
): Promise<MLCEngine> {
  if (enginePromise && loadedModel === modelSize) return enginePromise;

  const previousEnginePromise = enginePromise;
  loadedModel = modelSize;
  enginePromise = (async () => {
    if (previousEnginePromise) {
      try {
        const previousEngine = await previousEnginePromise;
        await previousEngine.unload();
      } catch (err) {
        console.warn('Failed to unload previous WebLLM engine', err);
      }
    }
    return CreateMLCEngine(MODEL_IDS[modelSize], {
      initProgressCallback: onProgress,
    });
  })();
  return enginePromise;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/lib/webllm/client.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Run the full test suite and type-check to confirm nothing else broke**

Run: `npm run test`
Expected: PASS (all suites, including the 3 new ones).

Run: `npx tsc -b`
Expected: exits with no output (success).

- [ ] **Step 6: Commit**

```bash
git add src/lib/webllm/client.ts src/lib/webllm/client.test.ts
git commit -m "Dispose the previous WebLLM engine when switching model size

getEngine() replaced enginePromise on a model-size switch without
ever calling the previous engine's unload(), leaking its GPU/WASM
memory for the rest of the browser session. Now awaits and unloads
the previous engine first (tolerating unload failure) before
creating the new one."
```

---

## Self-Review Notes

- **Spec coverage:** the spec's three requirements — capture and await the previous engine, call `.unload()`, tolerate unload failure without blocking the new engine — are all covered by Task 1's implementation and its three respective tests. The unchanged same-`modelSize` fast path is covered by the first test.
- **Type consistency:** `getEngine`'s signature (`modelSize: ModelSize`, `onProgress?: (report: InitProgressReport) => void`, returns `Promise<MLCEngine>`) is unchanged from the current code and matches every existing call site (`chatJSON` in this same file; `LearnSession.tsx` calls `generateQuestion`/`explainMistake`/`mascotLine` in `prompts.ts`, which call `chatJSON`, not `getEngine` directly — no call site needs updating).
- **Single task, by design:** this is one atomic unit of work (one file's behavior change, one new test file) with no independent sub-parts to split across multiple tasks, per the scope agreed for this plan.
