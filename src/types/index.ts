export type BrainwaveState = 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma';

export interface BrainwaveConfig {
  state: BrainwaveState;
  name: string;
  frequencyRange: [number, number];
  description: string;
  color: string;
}

export type FrequencyPreset = 
  | '417' 
  | '432' 
  | '528' 
  | '639' 
  | '741' 
  | '852' 
  | 'schumann';

export interface FrequencyConfig {
  id: FrequencyPreset;
  frequency: number;
  name: string;
  description: string;
  color: string;
}

export type HarmonicMode = 'fibonacci' | 'golden' | '369' | 'none';

export interface HarmonicConfig {
  mode: HarmonicMode;
  name: string;
  description: string;
  multiplier: number | number[];
}

export type AmbientSound = 'rain' | 'wind' | 'space' | 'ocean' | 'forest' | 'none';

export interface SessionConfig {
  id?: string;
  name: string;
  duration: number;
  baseFrequency: number;
  brainwaveState: BrainwaveState;
  harmonicMode: HarmonicMode;
  binauralEnabled: boolean;
  binauralOffset: number;
  ambientSound: AmbientSound;
  layers: FrequencyLayer[];
  evolutionSpeed: number;
  loopEnabled: boolean;
  adaptiveMode: boolean;
}

export interface FrequencyLayer {
  id: string;
  frequency: number;
  volume: number;
  enabled: boolean;
  waveform: OscillatorType;
}

export interface BinauralConfig {
  enabled: boolean;
  leftFrequency: number;
  rightFrequency: number;
  beatFrequency: number;
}

export interface AdaptivePhase {
  id: number;
  name: string;
  duration: number;
  baseFrequency: number;
  harmonicMode: HarmonicMode;
  binauralOffset: number;
  description: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
  subscription_status: 'free' | 'premium';
  subscription_expires?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  defaultDuration: number;
  defaultBrainwaveState: BrainwaveState;
  defaultAmbientSound: AmbientSound;
  visualizationEnabled: boolean;
  hapticFeedback: boolean;
}

export interface SavedSession {
  id: string;
  user_id: string;
  name: string;
  config: SessionConfig;
  created_at: string;
  updated_at: string;
}

export interface SessionAnalytics {
  id?: string;
  user_id: string;
  session_id?: string;
  brainwave_state: BrainwaveState;
  duration: number;
  completed: boolean;
  created_at: string;
}

export interface VoiceAnalysisResult {
  dominantFrequency: number;
  harmonics: number[];
  confidence: number;
  recommendedSession: Partial<SessionConfig>;
}

export type VisualizationType = 'sine' | 'harmonic' | 'spiral' | 'sacred' | 'particles';

export interface VisualizationConfig {
  type: VisualizationType;
  colorScheme: string[];
  speed: number;
  complexity: number;
}

export type SubscriptionTier = 'free' | 'premium';

export interface SubscriptionConfig {
  tier: SubscriptionTier;
  price: number;
  currency: string;
  features: string[];
  limitations: string[];
}
