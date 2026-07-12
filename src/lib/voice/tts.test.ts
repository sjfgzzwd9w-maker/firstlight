import { describe, expect, it } from 'vitest';
import { selectBestVoice } from './tts';

function voice(name: string, lang: string): SpeechSynthesisVoice {
  return { name, lang, default: false, localService: true, voiceURI: name } as SpeechSynthesisVoice;
}

describe('selectBestVoice', () => {
  it('returns null when there are no voices', () => {
    expect(selectBestVoice([])).toBeNull();
  });

  it('prefers a "Natural" voice (Edge Online voices) over a compact one', () => {
    const voices = [voice('Microsoft David Desktop', 'en-US'), voice('Microsoft Jenny Online (Natural)', 'en-US')];
    expect(selectBestVoice(voices)?.name).toBe('Microsoft Jenny Online (Natural)');
  });

  it('prefers a Google voice over the default compact voice', () => {
    const voices = [voice('English (America)', 'en-US'), voice('Google US English', 'en-US')];
    expect(selectBestVoice(voices)?.name).toBe('Google US English');
  });

  it('avoids a "Compact" voice when a non-compact alternative exists', () => {
    const voices = [voice('Samantha (Compact)', 'en-US'), voice('Samantha', 'en-US')];
    expect(selectBestVoice(voices)?.name).toBe('Samantha');
  });

  it('prefers English voices over other languages', () => {
    const voices = [voice('Amelie', 'fr-FR'), voice('Samantha', 'en-US')];
    expect(selectBestVoice(voices)?.name).toBe('Samantha');
  });

  it('falls back to the first voice when no English voice is available', () => {
    const voices = [voice('Amelie', 'fr-FR'), voice('Yuna', 'ko-KR')];
    expect(selectBestVoice(voices)?.name).toBe('Amelie');
  });

  it('falls back to the first available voice when nothing else distinguishes them', () => {
    const voices = [voice('Alex', 'en-US'), voice('Fred', 'en-US')];
    expect(selectBestVoice(voices)?.name).toBe('Alex');
  });
});
