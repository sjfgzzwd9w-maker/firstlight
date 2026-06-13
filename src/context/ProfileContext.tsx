import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Question, TopicProgress, UserProfile } from '../types';
import {
  ensureTopicsInitialized,
  loadProfile,
  removeNote,
  saveNote,
  saveProfile,
  setAge,
} from '../lib/storage/progress';

type ProfileContextValue = {
  profile: UserProfile;
  setUserAge: (age: number) => void;
  updateAge: (age: number) => void;
  updateTopicProgress: (topicId: string, progress: TopicProgress) => void;
  setVoiceEnabled: (enabled: boolean) => void;
  setModelSize: (size: UserProfile['modelSize']) => void;
  saveQuestionNote: (question: Question, text: string) => void;
  deleteNote: (noteId: string) => void;
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

  const saveQuestionNote = (question: Question, text: string) => {
    setProfile((prev) => saveNote(prev, question, text));
  };

  const deleteNote = (noteId: string) => {
    setProfile((prev) => removeNote(prev, noteId));
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setUserAge,
        updateAge,
        updateTopicProgress,
        setVoiceEnabled,
        setModelSize,
        saveQuestionNote,
        deleteNote,
      }}
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
