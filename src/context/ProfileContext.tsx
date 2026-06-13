import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { TopicProgress, UserProfile } from '../types';
import { ensureTopicsInitialized, loadProfile, saveProfile, setAge } from '../lib/storage/progress';

type ProfileContextValue = {
  profile: UserProfile;
  setUserAge: (age: number) => void;
  updateAge: (age: number) => void;
  updateTopicProgress: (topicId: string, progress: TopicProgress) => void;
  setVoiceEnabled: (enabled: boolean) => void;
  setModelSize: (size: UserProfile['modelSize']) => void;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(() =>
    ensureTopicsInitialized(loadProfile()),
  );

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  const setUserAge = (age: number) => {
    setProfile((prev) => setAge(prev, age));
  };

  /** Update age without resetting existing topic progress (used by Settings). */
  const updateAge = (age: number) => {
    setProfile((prev) => ({ ...prev, age }));
  };

  const updateTopicProgress = (topicId: string, progress: TopicProgress) => {
    setProfile((prev) => ({
      ...prev,
      topics: { ...prev.topics, [topicId]: progress },
    }));
  };

  const setVoiceEnabled = (enabled: boolean) => {
    setProfile((prev) => ({ ...prev, voiceEnabled: enabled }));
  };

  const setModelSize = (size: UserProfile['modelSize']) => {
    setProfile((prev) => ({ ...prev, modelSize: size }));
  };

  return (
    <ProfileContext.Provider
      value={{ profile, setUserAge, updateAge, updateTopicProgress, setVoiceEnabled, setModelSize }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within a ProfileProvider');
  return ctx;
}
