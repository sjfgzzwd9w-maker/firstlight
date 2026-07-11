import { useNavigate } from 'react-router-dom';
import Mascot from '../components/Mascot';
import { useProfile } from '../context/ProfileContext';
import { ALL_TOPICS, SUBJECT_LABELS, SUBJECT_PATHS } from '../lib/engine/topics';
import type { Subject, QuestionNote } from '../types';

const SUBJECT_ORDER = Object.keys(SUBJECT_LABELS) as Subject[];

export default function Notes() {
  const { profile, deleteNote, deleteTeachBack } = useProfile();
  const navigate = useNavigate();

  const notesBySubject = new Map<Subject, QuestionNote[]>();
  for (const note of profile.notes) {
    const list = notesBySubject.get(note.subject) ?? [];
    list.push(note);
    notesBySubject.set(note.subject, list);
  }

  const hasAnyNotes = profile.notes.length > 0 || Object.keys(profile.teachBacks).length > 0;

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-10 max-w-3xl mx-auto w-full text-center">
      <Mascot mood="happy" line="Here's everything you flagged for a second look." />
      <h1 className="mt-6 text-2xl font-extrabold text-white">My Notes</h1>
      <p className="mt-2 text-white/60">
        Questions you marked as interesting or tricky, and topics you've explained back to Cosmo — grouped by subject.
      </p>

      {!hasAnyNotes && (
        <p className="mt-10 text-sm text-white/50">
          No notes yet. While answering a question, tap "📝 Add a note" to save it here, or complete a Teach It Back
          checkpoint.
        </p>
      )}

      {SUBJECT_ORDER.map((subject) => {
        const notes = notesBySubject.get(subject) ?? [];
        const teachBackTopics = ALL_TOPICS.filter(
          (t) => t.subject === subject && profile.teachBacks[t.id],
        );
        if (notes.length === 0 && teachBackTopics.length === 0) return null;

        const notesByTopic = new Map<string, QuestionNote[]>();
        for (const note of notes) {
          const list = notesByTopic.get(note.topicId) ?? [];
          list.push(note);
          notesByTopic.set(note.topicId, list);
        }

        return (
          <section key={subject} className="mt-10 w-full text-left">
            <h2 className="text-lg font-semibold text-white">{SUBJECT_LABELS[subject]}</h2>

            {notesByTopic.size > 0 && (
              <div className="mt-3 flex flex-col gap-6">
                {[...notesByTopic.entries()].map(([topicId, topicNotes]) => {
                  const topic = ALL_TOPICS.find((t) => t.id === topicId);
                  return (
                    <div key={topicId}>
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-white/50">
                        {topic?.name ?? topicId}
                      </h3>
                      <div className="mt-2 flex flex-col gap-3">
                        {topicNotes
                          .sort((a, b) => b.updatedAt - a.updatedAt)
                          .map((note) => (
                            <div key={note.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                              <p className="text-sm text-white/50 italic">"{note.questionText}"</p>
                              <p className="mt-2 whitespace-pre-wrap text-white">{note.text}</p>
                              {note.summary && (
                                <p className="mt-2 text-sm text-comet-300">
                                  <span className="text-white/40">In your words: </span>
                                  {note.summary}
                                </p>
                              )}
                              <div className="mt-3 flex items-center justify-between gap-2 text-xs text-white/40">
                                <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                                <div className="flex gap-3">
                                  {topic && (
                                    <button
                                      type="button"
                                      onClick={() => navigate(`${SUBJECT_PATHS[subject]}/session?topic=${topic.id}`)}
                                      className="text-comet-400 hover:text-comet-300"
                                    >
                                      Practice this topic →
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => deleteNote(note.id)}
                                    className="hover:text-white"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {teachBackTopics.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-white/50">
                  🦆 Explain It Back
                </h3>
                <div className="mt-2 flex flex-col gap-3">
                  {teachBackTopics.map((topic) => {
                    const entry = profile.teachBacks[topic.id];
                    return (
                      <div key={topic.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-sm text-white/50 italic">{topic.name}</p>
                        <p className="mt-2 whitespace-pre-wrap text-white">{entry.explanation}</p>
                        {entry.followUpResponse && (
                          <div className="mt-2 border-t border-white/10 pt-2">
                            <p className="text-xs text-white/40 italic">"{entry.followUpPrompt}"</p>
                            <p className="mt-1 whitespace-pre-wrap text-white">{entry.followUpResponse}</p>
                          </div>
                        )}
                        <div className="mt-3 flex items-center justify-between gap-2 text-xs text-white/40">
                          <span>{new Date(entry.updatedAt).toLocaleDateString()}</span>
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => navigate(`${SUBJECT_PATHS[subject]}/session?topic=${topic.id}`)}
                              className="text-comet-400 hover:text-comet-300"
                            >
                              Practice this topic →
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteTeachBack(topic.id)}
                              className="hover:text-white"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
