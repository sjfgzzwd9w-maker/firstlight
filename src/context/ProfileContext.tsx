import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Question, Subject, TopicProgress, UserProfile } from '../types';
import {
  ensureTopicsInitialized,
  loadProfile,
  removeNote,
  removeTeachBack,
  saveNote,
  saveProfile,
  saveTeachBack,
  setAge,
} from '../lib/storage/progress';

type ProfileContextValue = {
  profile: UserProfile;
  setUserAge: (age: number) => void;
  updateAge: (age: number) => void;
  updateTopicProgress: (topicId: string, progress: TopicProgress) => void;
  setVoiceEnabled: (enabled: boolean) => void;
  setModelSize: (size: UserProfile['modelSize']) => void;
  saveQuestionNote: (question: Question, text: string, summary?: string) => void;
  deleteNote: (noteId: string) => void;
  clearMissedQuestion: (topicId: string, questionId: string) => void;
  saveTeachBack: (
    topicId: string,
    subject: Subject,
    topicName: string,
    explanation: string,
    followUpPrompt: string,
    followUpResponse: string,
  ) => void;
  deleteTeachBack: (topicId: string) => void;
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

  const saveQuestionNote = (question: Question, text: string, summary: string = '') => {
    setProfile((prev) => saveNote(prev, question, text, summary));
  };

  const deleteNote = (noteId: string) => {
    setProfile((prev) => removeNote(prev, noteId));
  };

  const saveTeachBackEntry = (
    topicId: string,
    subject: Subject,
    topicName: string,
    explanation: string,
    followUpPrompt: string,
    followUpResponse: string,
  ) => {
    setProfile((prev) =>
      saveTeachBack(prev, topicId, subject, topicName, explanation, followUpPrompt, followUpResponse),
    );
  };

  const deleteTeachBackEntry = (topicId: string) => {
    setProfile((prev) => removeTeachBack(prev, topicId));
  };

  const clearMissedQuestion = (topicId: string, questionId: string) => {
    setProfile((prev) => {
      const tp = prev.topics[topicId];
      if (!tp) return prev;
      return {
        ...prev,
        topics: {
          ...prev.topics,
          [topicId]: { ...tp, missedIds: (tp.missedIds ?? []).filter((id) => id !== questionId) },
        },
      };
    });
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
        clearMissedQuestion,
        saveTeachBack: saveTeachBackEntry,
        deleteTeachBack: deleteTeachBackEntry,
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
