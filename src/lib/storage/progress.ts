import type { Question, QuestionNote, UserProfile } from '../../types';
import { ALL_TOPICS } from '../engine/topics';

const STORAGE_KEY = 'stardance:profile:v1';

function defaultProfile(): UserProfile {
  return {
    age: null,
    voiceEnabled: true,
    modelSize: '1b',
    totalXp: 0,
    badges: [],
    topics: {},
    notes: [],
    teachBacks: {},
  };
}

export function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProfile();
    const parsed = JSON.parse(raw) as UserProfile;
    return { ...defaultProfile(), ...parsed };
  } catch {
    return defaultProfile();
  }
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

/** Ensure every topic has a progress entry and all fields are present (handles old saved data). */
export function ensureTopicsInitialized(profile: UserProfile): UserProfile {
  // Only backfill missedIds on topics the user has already touched.
  // Do NOT pre-create entries for untouched topics — that would make every
  // topic appear started (Tier 3 / 0 XP) and bypass the SkillPath lock system.
  const topics = { ...profile.topics };
  let changed = false;
  for (const id of Object.keys(topics)) {
    if (!topics[id].missedIds) {
      topics[id] = { ...topics[id], missedIds: [] };
      changed = true;
    }
  }
  return changed ? { ...profile, topics } : profile;
}

export function setAge(profile: UserProfile, age: number): UserProfile {
  const updated: UserProfile = { ...profile, age, topics: {} };
  return ensureTopicsInitialized(updated);
}

export function totalXp(profile: UserProfile): number {
  return Object.values(profile.topics).reduce((sum, t) => sum + t.xp, 0);
}

export function awardBadgeIfNew(profile: UserProfile, badge: string): UserProfile {
  if (profile.badges.includes(badge)) return profile;
  return { ...profile, badges: [...profile.badges, badge] };
}

/**
 * Add a new note for a question, or update the existing note for that
 * question if one is already saved.
 */
export function saveNote(
  profile: UserProfile,
  question: Question,
  text: string,
  summary: string = '',
): UserProfile {
  const trimmed = text.trim();
  const now = Date.now();
  const existing = profile.notes.find((n) => n.questionId === question.id);

  if (existing) {
    if (!trimmed) return removeNote(profile, existing.id);
    const notes = profile.notes.map((n) =>
      n.id === existing.id ? { ...n, text: trimmed, summary, updatedAt: now } : n,
    );
    return { ...profile, notes };
  }

  if (!trimmed) return profile;

  const topic = ALL_TOPICS.find((t) => t.id === question.topicId);
  const note: QuestionNote = {
    id: `note-${question.id}-${now}`,
    questionId: question.id,
    topicId: question.topicId,
    subject: topic?.subject ?? 'math',
    questionText: question.question,
    text: trimmed,
    summary,
    createdAt: now,
    updatedAt: now,
  };
  return { ...profile, notes: [...profile.notes, note] };
}

export function removeNote(profile: UserProfile, noteId: string): UserProfile {
  return { ...profile, notes: profile.notes.filter((n) => n.id !== noteId) };
}

export function noteForQuestion(profile: UserProfile, questionId: string): QuestionNote | undefined {
  return profile.notes.find((n) => n.questionId === questionId);
}
