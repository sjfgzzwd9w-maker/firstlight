import type { UserProfile } from '../../types';
import { ALL_TOPICS } from '../engine/topics';
import { createTopicProgress, placementTier } from '../engine/adaptiveEngine';

const STORAGE_KEY = 'stardance:profile:v1';

function defaultProfile(): UserProfile {
  return {
    age: null,
    voiceEnabled: true,
    modelSize: '1b',
    totalXp: 0,
    badges: [],
    topics: {},
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

/** Ensure every topic has a progress entry, seeded by the user's age-based placement. */
export function ensureTopicsInitialized(profile: UserProfile): UserProfile {
  const topics = { ...profile.topics };
  let changed = false;
  for (const topic of ALL_TOPICS) {
    if (!topics[topic.id]) {
      topics[topic.id] = createTopicProgress(placementTier(profile.age));
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
