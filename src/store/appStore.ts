import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  BrainwaveState, 
  SessionConfig, 
  User, 
  UserPreferences,
  SavedSession,
  SubscriptionTier,
  VisualizationType 
} from '@types';
import { 
  DEFAULT_SESSION_DURATION, 
  SUBSCRIPTION_TIERS 
} from '@constants';

interface AppState {
  // User & Auth
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Subscription
  subscriptionTier: SubscriptionTier;
  subscriptionExpires?: string;
  
  // Session State
  currentSession: SessionConfig | null;
  isPlaying: boolean;
  sessionTimeRemaining: number;
  sessionProgress: number;
  
  // Audio Settings
  masterVolume: number;
  currentFrequency: number;
  currentBrainwaveState: BrainwaveState;
  
  // Visual Settings
  visualizationEnabled: boolean;
  visualizationType: VisualizationType;
  
  // User Preferences
  preferences: UserPreferences;
  
  // Saved Sessions
  savedSessions: SavedSession[];
  
  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  
  setSubscriptionTier: (tier: SubscriptionTier) => void;
  
  setCurrentSession: (session: SessionConfig | null) => void;
  setIsPlaying: (value: boolean) => void;
  setSessionTimeRemaining: (time: number) => void;
  setSessionProgress: (progress: number) => void;
  
  setMasterVolume: (volume: number) => void;
  setCurrentFrequency: (freq: number) => void;
  setCurrentBrainwaveState: (state: BrainwaveState) => void;
  
  setVisualizationEnabled: (enabled: boolean) => void;
  setVisualizationType: (type: VisualizationType) => void;
  
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  
  setSavedSessions: (sessions: SavedSession[]) => void;
  addSavedSession: (session: SavedSession) => void;
  removeSavedSession: (sessionId: string) => void;
  
  resetSession: () => void;
  canUsePremiumFeature: () => boolean;
}

const defaultPreferences: UserPreferences = {
  defaultDuration: DEFAULT_SESSION_DURATION,
  defaultBrainwaveState: 'alpha',
  defaultAmbientSound: 'none',
  visualizationEnabled: true,
  hapticFeedback: true
};

const defaultSession: SessionConfig = {
  name: 'New Session',
  duration: DEFAULT_SESSION_DURATION,
  baseFrequency: 528,
  brainwaveState: 'alpha',
  harmonicMode: 'none',
  binauralEnabled: true,
  binauralOffset: 10,
  ambientSound: 'none',
  layers: [],
  evolutionSpeed: 1,
  loopEnabled: false,
  adaptiveMode: false
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      isAuthenticated: false,
      isLoading: true,
      
      subscriptionTier: 'free',
      subscriptionExpires: undefined,
      
      currentSession: defaultSession,
      isPlaying: false,
      sessionTimeRemaining: DEFAULT_SESSION_DURATION,
      sessionProgress: 0,
      
      masterVolume: 0.5,
      currentFrequency: 528,
      currentBrainwaveState: 'alpha',
      
      visualizationEnabled: true,
      visualizationType: 'sine',
      
      preferences: defaultPreferences,
      
      savedSessions: [],
      
      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      setLoading: (value) => set({ isLoading: value }),
      
      setSubscriptionTier: (tier) => set({ subscriptionTier: tier }),
      
      setCurrentSession: (session) => set({ 
        currentSession: session,
        sessionTimeRemaining: session?.duration || DEFAULT_SESSION_DURATION,
        sessionProgress: 0
      }),
      setIsPlaying: (value) => set({ isPlaying: value }),
      setSessionTimeRemaining: (time) => set({ sessionTimeRemaining: time }),
      setSessionProgress: (progress) => set({ sessionProgress: progress }),
      
      setMasterVolume: (volume) => set({ masterVolume: Math.max(0, Math.min(1, volume)) }),
      setCurrentFrequency: (freq) => set({ currentFrequency: freq }),
      setCurrentBrainwaveState: (state) => set({ currentBrainwaveState: state }),
      
      setVisualizationEnabled: (enabled) => set({ visualizationEnabled: enabled }),
      setVisualizationType: (type) => set({ visualizationType: type }),
      
      updatePreferences: (prefs) => set((state) => ({
        preferences: { ...state.preferences, ...prefs }
      })),
      
      setSavedSessions: (sessions) => set({ savedSessions: sessions }),
      addSavedSession: (session) => set((state) => ({
        savedSessions: [session, ...state.savedSessions]
      })),
      removeSavedSession: (sessionId) => set((state) => ({
        savedSessions: state.savedSessions.filter(s => s.id !== sessionId)
      })),
      
      resetSession: () => set({
        currentSession: defaultSession,
        isPlaying: false,
        sessionTimeRemaining: DEFAULT_SESSION_DURATION,
        sessionProgress: 0
      }),
      
      canUsePremiumFeature: () => {
        const { subscriptionTier, subscriptionExpires } = get();
        if (subscriptionTier === 'premium' && subscriptionExpires) {
          return new Date(subscriptionExpires) > new Date();
        }
        return subscriptionTier === 'premium';
      }
    }),
    {
      name: 'pulse369-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        preferences: state.preferences,
        subscriptionTier: state.subscriptionTier,
        subscriptionExpires: state.subscriptionExpires,
        savedSessions: state.savedSessions,
        masterVolume: state.masterVolume,
        visualizationEnabled: state.visualizationEnabled,
        visualizationType: state.visualizationType
      })
    }
  )
);

export default useAppStore;
