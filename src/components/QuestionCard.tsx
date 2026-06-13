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
    return <p className="text-lg font-semibold text-white whitespace-pre-wrap">{text}</p>;
  }

  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 === 0) {
          return part.trim() ? (
            <p key={i} className="text-lg font-semibold text-white whitespace-pre-wrap">
              {part.trim()}
            </p>
          ) : null;
        }
        // Drop an optional leading language tag (e.g. "python\n...") on its own first line.
        const lines = part.split('\n');
        const code = /^[a-zA-Z0-9]*$/.test(lines[0].trim()) && lines.length > 1 ? lines.slice(1).join('\n') : part;
        return (
          <pre
            key={i}
            className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-space-950/80 p-3 text-left text-sm text-comet-200"
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
    <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 p-6">
      <QuestionPrompt text={question.question} />
      <div className="mt-4 flex flex-col gap-2">
        {question.choices.map((choice, i) => {
          let style = 'border-white/10 bg-white/5 hover:bg-white/10';
          if (revealed) {
            if (i === question.answerIndex) {
              style = 'border-comet-400 bg-comet-500/20 text-comet-300';
            } else if (i === selectedIndex) {
              style = 'border-red-400 bg-red-500/10 text-red-300';
            } else {
              style = 'border-white/5 bg-white/[0.02] opacity-60';
            }
          } else if (i === selectedIndex) {
            style = 'border-nebula-400 bg-nebula-500/20';
          }

          return (
            <button
              key={i}
              type="button"
              disabled={revealed}
              onClick={() => onSelect(i)}
              className={`rounded-xl border px-4 py-3 text-left text-white transition-colors ${style}`}
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
