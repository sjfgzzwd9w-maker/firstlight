import type { Question } from '../types';

type QuestionCardProps = {
  question: Question;
  selectedIndex: number | null;
  revealed: boolean;
  onSelect: (index: number) => void;
  /** When true, choices are rendered in a monospace code style (for Python code-flaw questions). */
  codeMode?: boolean;
};

/** Splits text on ``` fences and renders code sections in a monospace block. */
function QuestionPrompt({ text }: { text: string }) {
  const parts = text.split('```');
  if (parts.length === 1) {
    return <p className="text-base font-semibold text-deep-text whitespace-pre-wrap">{text}</p>;
  }

  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 === 0) {
          return part.trim() ? (
            <p key={i} className="text-base font-semibold text-deep-text whitespace-pre-wrap">
              {part.trim()}
            </p>
          ) : null;
        }
        const lines = part.split('\n');
        const code = /^[a-zA-Z0-9]*$/.test(lines[0].trim()) && lines.length > 1 ? lines.slice(1).join('\n') : part;
        return (
          <pre
            key={i}
            className="mt-3 overflow-x-auto rounded-xl border border-deep-700 bg-deep-900/80 p-3 text-left text-sm text-sage-300"
          >
            <code className="font-mono">{code.replace(/\n$/, '')}</code>
          </pre>
        );
      })}
    </>
  );
}

export default function QuestionCard({ question, selectedIndex, revealed, onSelect, codeMode }: QuestionCardProps) {
  return (
    /* Deep Work mode card — cool academic blue-slate per CogniSync Principle 4 */
    <div className="w-full max-w-lg rounded-2xl border border-deep-700 bg-deep-800 p-6 shadow-lg">
      <QuestionPrompt text={question.question} />
      <div className="mt-5 flex flex-col gap-2">
        {question.choices.map((choice, i) => {
          // Default: unselected in question phase
          let style = 'border-deep-700 bg-deep-900/60 text-deep-text hover:bg-deep-600/30 hover:border-deep-600';

          if (revealed) {
            if (i === question.answerIndex) {
              // Correct answer — comet teal (positive signal)
              style = 'border-comet-400 bg-comet-500/15 text-comet-300';
            } else if (i === selectedIndex) {
              // Wrong answer — Alert red (Focus/Precision mode — knowledge gap signal)
              style = 'border-alert-400 bg-alert-500/12 text-alert-300';
            } else {
              // Unchosen distractor — fade out
              style = 'border-deep-700/40 bg-deep-900/30 text-deep-text/40 opacity-50';
            }
          } else if (i === selectedIndex) {
            // Actively selected before check — sage green (Deep Work selection)
            style = 'border-sage-400 bg-sage-500/15 text-sage-300';
          }

          return (
            <button
              key={i}
              type="button"
              disabled={revealed}
              onClick={() => onSelect(i)}
              className={`rounded-xl border px-4 py-3 text-left text-sm transition-all duration-150 ${style}`}
            >
              {codeMode ? (
                <code className="font-mono text-sm whitespace-pre-wrap">{choice}</code>
              ) : (
                choice
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
