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
