import { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import type { Question } from '../types';

type NoteEditorProps = {
  question: Question;
  /** Use the cyan "circuit" accent for the Robotics theme. */
  circuit?: boolean;
};

/**
 * Cornell-Method note editor.
 * Pass `key={question.id}` from the parent so this remounts when the question changes.
 * Uses Deep Work palette (cool academic blue-slate) per CogniSync Principle 3.
 */
export default function NoteEditor({ question, circuit }: NoteEditorProps) {
  const { profile, saveQuestionNote, deleteNote } = useProfile();
  const existing = profile.notes.find((n) => n.questionId === question.id);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(existing?.text ?? '');
  const [summary, setSummary] = useState(existing?.summary ?? '');
  const [saved, setSaved] = useState(false);

  // Deep Work palette — analytical note-taking stays in cool academic tones.
  // Robotics keeps its circuit-cyan identity; all other subjects use sage.
  const a = circuit
    ? {
        toggle: 'text-circuit-300 hover:text-circuit-200',
        border: 'border-circuit-500/30',
        card: 'bg-deep-900',
        divider: 'border-circuit-500/20',
        label: 'text-circuit-300/50',
        cueText: 'text-circuit-300/60',
        inputBorder: 'border-circuit-500/30',
        inputBg: 'bg-deep-800/80',
        inputText: 'text-deep-text',
        inputFocus: 'focus:border-circuit-400',
        btn: 'bg-circuit-500 text-space-950 hover:bg-circuit-400',
        delBtn: 'border-circuit-500/20 text-circuit-300/50 hover:text-circuit-300',
        printLink: 'text-circuit-300/40 hover:text-circuit-300/70',
        badge: 'text-circuit-300/30',
      }
    : {
        toggle: 'text-sage-400 hover:text-sage-300',
        border: 'border-deep-700',
        card: 'bg-deep-800',
        divider: 'border-deep-700',
        label: 'text-deep-text/40',
        cueText: 'text-deep-text/50',
        inputBorder: 'border-deep-700',
        inputBg: 'bg-deep-900/80',
        inputText: 'text-deep-text',
        inputFocus: 'focus:border-sage-400',
        btn: 'bg-sage-500 text-white hover:bg-sage-400',
        delBtn: 'border-deep-700 text-deep-text/50 hover:text-deep-text',
        printLink: 'text-deep-text/30 hover:text-deep-text/60',
        badge: 'text-deep-text/25',
      };

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

  const handlePrint = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head>
      <title>Cornell Notes — ${question.question}</title>
      <style>
        body{font-family:Georgia,serif;max-width:720px;margin:40px auto;color:#1e2b3a}
        .meta{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#6aaa99;margin-bottom:4px}
        .q{font-size:16px;font-weight:bold;margin-bottom:20px;color:#131d2b}
        table{width:100%;border-collapse:collapse}
        td{vertical-align:top;padding:12px;border:1px solid #c6d4e3}
        .cue{width:30%;background:#e8f0f7}
        .notes{width:70%;min-height:200px}
        .col-label{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#6aaa99;margin-bottom:6px}
        .content{min-height:160px;white-space:pre-wrap;font-size:14px;color:#1a2b3e}
        .summary{border:1px solid #c6d4e3;padding:12px;margin-top:0;min-height:80px}
      </style>
    </head><body>
      <div class="meta">CogniSync Smart Template · Cornell Method · Principle 3: Hand Notes</div>
      <div class="q">${question.question}</div>
      <table><tr>
        <td class="cue"><div class="col-label">Cues / Keywords</div><div class="content"> </div></td>
        <td class="notes"><div class="col-label">Notes</div><div class="content">${text || ' '}</div></td>
      </tr></table>
      <div class="summary"><div class="col-label">Summary — explain it in your own words</div><div class="content">${summary || ' '}</div></div>
    </body></html>`);
    win.document.close();
    win.focus();
    win.print();
  };

  return (
    <div className="w-full max-w-lg">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wide ${a.toggle}`}
      >
        {existing ? '📝 Note saved' : '📝 Add a note'}
        <span className={a.label}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className={`mt-2 rounded-xl border ${a.border} ${a.card}`}>
          {/* Cornell header */}
          <div className={`px-3 pt-3 pb-1 flex items-center justify-between border-b ${a.divider}`}>
            <span className={`text-[10px] font-semibold uppercase tracking-widest ${a.label}`}>
              Cornell Method
            </span>
            <button type="button" onClick={handlePrint} className={`text-[10px] underline ${a.printLink}`}>
              Print template ↗
            </button>
          </div>

          {/* Cornell layout: cue column | notes column */}
          <div className="flex">
            <div className={`w-28 shrink-0 border-r ${a.divider} p-2`}>
              <p className={`text-[10px] font-semibold uppercase tracking-wide mb-1 ${a.label}`}>Cues</p>
              <p className={`text-[11px] leading-relaxed ${a.cueText}`}>
                {question.question.length > 60
                  ? question.question.slice(0, 60) + '…'
                  : question.question}
              </p>
            </div>
            <div className="flex-1 p-2">
              <p className={`text-[10px] font-semibold uppercase tracking-wide mb-1 ${a.label}`}>Notes</p>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Key ideas, connections, things to remember…"
                rows={4}
                className={`w-full resize-none rounded-lg border ${a.inputBorder} ${a.inputBg} p-2 text-xs ${a.inputText} placeholder:opacity-30 focus:outline-none ${a.inputFocus}`}
              />
            </div>
          </div>

          {/* Summary row */}
          <div className={`border-t ${a.divider} p-2`}>
            <p className={`text-[10px] font-semibold uppercase tracking-wide mb-1 ${a.label}`}>
              Summary — one sentence in your own words
            </p>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="In my own words, this means…"
              className={`w-full rounded-lg border ${a.inputBorder} ${a.inputBg} px-2 py-1.5 text-xs ${a.inputText} placeholder:opacity-30 focus:outline-none ${a.inputFocus}`}
            />
          </div>

          {/* Actions */}
          <div className={`p-2 pt-1 flex items-center justify-between gap-2 border-t ${a.divider}`}>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSave}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${a.btn}`}
              >
                {saved ? 'Saved!' : 'Save note'}
              </button>
              {existing && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className={`rounded-full border px-4 py-1.5 text-xs transition-colors ${a.delBtn}`}
                >
                  Delete
                </button>
              )}
            </div>
            <span className={`text-[11px] ${a.badge}`}>CogniSync · Principle 3</span>
          </div>
        </div>
      )}
    </div>
  );
}
