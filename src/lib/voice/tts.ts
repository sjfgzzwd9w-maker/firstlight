/** Thin wrapper around the Web Speech API's SpeechSynthesis for read-aloud text. */

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/**
 * Browsers default to their lowest-quality "compact" system voice when no
 * voice is explicitly picked. Prefer the higher-quality voices the OS/browser
 * actually ships (Chrome's "Google ..." voices, Edge's "... Online (Natural)"
 * voices, Safari/macOS "Enhanced"/"Premium" voices) before falling back.
 */
export function selectBestVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;

  const english = voices.filter((v) => v.lang.toLowerCase().startsWith('en'));
  const pool = english.length > 0 ? english : voices;

  const qualityKeywords = ['natural', 'premium', 'enhanced', 'google'];
  const highQuality = pool.find((v) =>
    qualityKeywords.some((kw) => v.name.toLowerCase().includes(kw)),
  );
  if (highQuality) return highQuality;

  const nonCompact = pool.find((v) => !v.name.toLowerCase().includes('compact'));
  return nonCompact ?? pool[0];
}

let cachedVoice: SpeechSynthesisVoice | null = null;

function ensureVoice(): void {
  if (cachedVoice) return;
  cachedVoice = selectBestVoice(window.speechSynthesis.getVoices());
}

if (isSpeechSupported()) {
  // Voice lists load asynchronously in most browsers — getVoices() can
  // return [] on the very first call, so re-pick once they're ready.
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = selectBestVoice(window.speechSynthesis.getVoices());
  };
}

export function speak(text: string, enabled: boolean): void {
  if (!enabled || !isSpeechSupported() || !text) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  ensureVoice();
  if (cachedVoice) utterance.voice = cachedVoice;
  utterance.rate = 0.95;
  utterance.pitch = 1.05;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
}
