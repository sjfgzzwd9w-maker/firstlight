import { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import type { Question } from '../types';

type NoteEditorProps = {
  question: Question;
  /** Use the cyan "circuit" accent for the Robotics theme instead of the default comet teal. */
  circuit?: boolean;
};

/**
 * Pass `key={question.id}` from the parent so this component remounts (and resets
 * its local state) whenever the question changes.
 */
export default function NoteEditor({ question, circuit }: NoteEditorProps) {
  const { profile, saveQuestionNote, deleteNote } = useProfile();
  const existing = profile.notes.find((n) => n.questionId === question.id);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(existing?.text ?? '');
  const [saved, setSaved] = useState(false);

  const accent = circuit
    ? { text: 'text-circuit-300 hover:text-circuit-200', focus: 'focus:border-circuit-400', btn: 'bg-circuit-500 text-space-950 hover:bg-circuit-400' }
    : { text: 'text-comet-300 hover:text-comet-200', focus: 'focus:border-comet-400', btn: 'bg-comet-500 text-space-950 hover:bg-comet-400' };

  const handleSave = () => {
    saveQuestionNote(question, text);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleDelete = () => {
    if (existing) deleteNote(existing.id);
    setText('');
  };

  return (
    <div className="w-full max-w-lg">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wide ${accent.text}`}
      >
        {existing ? '📝 Note saved' : '📝 Add a note'}
        <span className="text-white/40">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="mt-2 rounded-xl border border-white/10 bg-white/5 p-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Jot down why this question was interesting or tricky…"
            rows={3}
            className={`w-full resize-none rounded-lg border border-white/10 bg-space-950/60 p-2 text-sm text-white placeholder:text-white/30 focus:outline-none ${accent.focus}`}
          />
          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSave}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${accent.btn}`}
              >
                {saved ? 'Saved!' : 'Save note'}
              </button>
              {existing && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded-full border border-white/10 px-4 py-1.5 text-xs text-white/60 hover:text-white"
                >
                  Delete
                </button>
              )}
            </div>
            <span className="text-[11px] text-white/30">Saved to My Notes</span>
          </div>
        </div>
      )}
    </div>
  );
}
