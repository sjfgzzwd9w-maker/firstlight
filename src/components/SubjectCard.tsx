type SubjectCardProps = {
  emoji: string;
  title: string;
  description: string;
  comingSoon?: boolean;
  onClick?: () => void;
};

export default function SubjectCard({ emoji, title, description, comingSoon, onClick }: SubjectCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={comingSoon}
      className={`relative flex flex-col items-start gap-2 rounded-2xl border p-5 text-left transition-all ${
        comingSoon
          ? 'border-white/5 bg-white/[0.03] opacity-60 cursor-not-allowed'
          : 'border-nebula-500/40 bg-white/5 hover:bg-white/10 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(170,59,255,0.35)]'
      }`}
    >
      {comingSoon && (
        <span className="absolute top-3 right-3 rounded-full bg-white/10 px-2 py-0.5 text-xs text-comet-400">
          Coming soon
        </span>
      )}
      <span className="text-4xl">{emoji}</span>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm text-white/60">{description}</p>
    </button>
  );
}
