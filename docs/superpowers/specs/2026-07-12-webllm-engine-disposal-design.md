# WebLLM engine disposal on model-size switch — design

Date: 2026-07-12
Status: Approved (prep for live demo)

## Problem

`src/lib/webllm/client.ts`'s `getEngine(modelSize, onProgress)` caches a WebLLM
`MLCEngine` in a module-level `enginePromise`, keyed by `loadedModel`. When a
caller requests a different `modelSize` than what's cached (e.g. a student
switches from the 1B to the 3B model in Settings), the function overwrites
`enginePromise` with a new `CreateMLCEngine(...)` call — it never disposes the
previous engine first.

`node_modules/@mlc-ai/web-llm/lib/engine.d.ts:65` confirms `MLCEngine` exposes
`unload(): Promise<void>`, documented as explicitly unloading the currently
loaded model(s) and releasing related resources. Nothing in the codebase
calls it. Net effect: switching model size leaks the previous model's
GPU/WASM memory for the rest of the browser session.

## Fix

In `getEngine()`, when a switch to a different `modelSize` is requested:
1. Capture the previous `enginePromise` before overwriting it.
2. Await the previous promise (it may still be mid-load) and call `.unload()`
   on the resolved engine.
3. If `.unload()` (or awaiting the previous promise) throws, log a warning
   and proceed anyway — a failed cleanup must not block the student from
   getting their new model.
4. Only after that, create the new engine via `CreateMLCEngine(...)`.

The existing same-size fast path (`if (enginePromise && loadedModel ===
modelSize) return enginePromise;`) is unchanged.

## Testing

`CreateMLCEngine` and `.unload()` can't run in a real browser during tests
(no WebGPU in the test environment), so `@mlc-ai/web-llm`'s `CreateMLCEngine`
is mocked in a unit test. Cases:
- Requesting the same `modelSize` twice returns the cached promise without
  creating a second engine (`CreateMLCEngine` called once).
- Requesting a different `modelSize` calls `.unload()` on the previous
  engine before the new one resolves.
- A rejected `.unload()` does not prevent the new engine from being
  returned (the promise still resolves to the new engine).

## Out of scope

No other behavior of `client.ts` (timeouts, `chatJSON`, WebGPU detection)
changes.
