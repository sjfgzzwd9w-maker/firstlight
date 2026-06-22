import type { Question } from '../types';

type QuestionCardProps = {
  question: Question;
  selectedIndex: number | null;
  revealed: boolean;
  onSelect: (index: number) => void;
  codeMode?: boolean;
  /** Topic context shown above the question — ties the question to real-world meaning. */
  topicContext?: { emoji: string; label: string };
};

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

export default function QuestionCard({ question, selectedIndex, revealed, onSelect, codeMode, topicContext }: QuestionCardProps) {
  return (
    <div className="w-full max-w-lg rounded-2xl border border-deep-700 bg-deep-800 shadow-lg overflow-hidden">
      {/* Topic context — ties the question to its real-world purpose */}
      {topicContext && (
        <div className="flex items-center gap-3 border-b border-deep-700 px-5 py-3" style={{ background: '#0e1820' }}>
          <span className="text-xl flex-shrink-0" aria-hidden>{topicContext.emoji}</span>
          <p className="text-sm font-medium leading-snug" style={{ color: '#7ea8c0' }}>{topicContext.label}</p>
        </div>
      )}

      <div className="p-6">
        <QuestionPrompt text={question.question} />

        <div className="mt-5 flex flex-col gap-2">
          {question.choices.map((choice, i) => {
            let style = 'border-deep-700 bg-deep-900/60 text-deep-text hover:bg-deep-600/30 hover:border-deep-600';

            if (revealed) {
              if (i === question.answerIndex) {
                style = 'border-comet-400 bg-comet-500/15 text-comet-300';
              } else if (i === selectedIndex) {
                style = 'border-alert-400 bg-alert-500/12 text-alert-300';
              } else {
                style = 'border-deep-700/40 bg-deep-900/30 text-deep-text/40 opacity-50';
              }
            } else if (i === selectedIndex) {
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
    </div>
  );
}
