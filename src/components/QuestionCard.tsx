import type { Question } from '../types';

type QuestionCardProps = {
  question: Question;
  selectedIndex: number | null;
  revealed: boolean;
  onSelect: (index: number) => void;
};

export default function QuestionCard({ question, selectedIndex, revealed, onSelect }: QuestionCardProps) {
  return (
    <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 p-6">
      <p className="text-lg font-semibold text-white">{question.question}</p>
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
              {choice}
            </button>
          );
        })}
      </div>
    </div>
  );
}
