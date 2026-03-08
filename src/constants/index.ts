import { 
  BrainwaveConfig, 
  FrequencyConfig, 
  HarmonicConfig, 
  AdaptivePhase,
  SubscriptionConfig 
} from '@types';

export const BRAINWAVE_STATES: Record<string, BrainwaveConfig> = {
  delta: {
    state: 'delta',
    name: 'Delta',
    frequencyRange: [0.5, 4],
    description: 'Deep sleep, healing, regeneration',
    color: '#4A90D9'
  },
  theta: {
    state: 'theta',
    name: 'Theta',
    frequencyRange: [4, 8],
    description: 'Meditation, creativity, intuition',
    color: '#9B59B6'
  },
  alpha: {
    state: 'alpha',
    name: 'Alpha',
    frequencyRange: [8, 12],
    description: 'Relaxation, calm awareness',
    color: '#2ECC71'
  },
  beta: {
    state: 'beta',
    name: 'Beta',
    frequencyRange: [12, 30],
    description: 'Focus, alertness, concentration',
    color: '#F39C12'
  },
  gamma: {
    state: 'gamma',
    name: 'Gamma',
    frequencyRange: [30, 80],
    description: 'Peak cognition, insight, bliss',
    color: '#E74C3C'
  }
};

export const FREQUENCY_PRESETS: Record<string, FrequencyConfig> = {
  '417': {
    id: '417',
    frequency: 417,
    name: '417 Hz',
    description: 'Facilitates change, clears negativity',
    color: '#FF6B6B'
  },
  '432': {
    id: '432',
    frequency: 432,
    name: '432 Hz',
    description: 'Natural tuning, harmonic balance',
    color: '#4ECDC4'
  },
  '528': {
    id: '528',
    frequency: 528,
    name: '528 Hz',
    description: 'Love frequency, DNA repair',
    color: '#FFE66D'
  },
  '639': {
    id: '639',
    frequency: 639,
    name: '639 Hz',
    description: 'Connection, relationships',
    color: '#95E1D3'
  },
  '741': {
    id: '741',
    frequency: 741,
    name: '741 Hz',
    description: 'Awakening, intuition',
    color: '#F38181'
  },
  '852': {
    id: '852',
    frequency: 852,
    name: '852 Hz',
    description: 'Spiritual order, inner strength',
    color: '#AA96DA'
  },
  'schumann': {
    id: 'schumann',
    frequency: 7.83,
    name: '7.83 Hz',
    description: 'Earth resonance, Schumann frequency',
    color: '#FCBAD3'
  }
};

export const HARMONIC_MODES: Record<string, HarmonicConfig> = {
  none: {
    mode: 'none',
    name: 'Pure Tone',
    description: 'Single frequency without harmonics',
    multiplier: 1
  },
  fibonacci: {
    mode: 'fibonacci',
    name: 'Fibonacci',
    description: 'Natural growth pattern harmonics',
    multiplier: [1, 1, 2, 3, 5, 8, 13, 21]
  },
  golden: {
    mode: 'golden',
    name: 'Golden Ratio',
    description: 'Phi-based harmonic expansion (1.618)',
    multiplier: 1.618033988749895
  },
  '369': {
    mode: '369',
    name: '3-6-9',
    description: 'Tesla harmonic multiples',
    multiplier: [3, 6, 9, 12, 15, 18]
  }
};

export const AMBIENT_SOUNDS = [
  { id: 'none', name: 'Silence', icon: 'volume-mute' },
  { id: 'rain', name: 'Rain', icon: 'cloud-rain' },
  { id: 'wind', name: 'Wind', icon: 'wind' },
  { id: 'ocean', name: 'Ocean', icon: 'waves' },
  { id: 'forest', name: 'Forest', icon: 'tree' },
  { id: 'space', name: 'Space Drone', icon: 'star' }
];

export const ADAPTIVE_PHASES: AdaptivePhase[] = [
  {
    id: 1,
    name: 'Grounding',
    duration: 300,
    baseFrequency: 417,
    harmonicMode: 'none',
    binauralOffset: 0,
    description: 'Establishing baseline resonance'
  },
  {
    id: 2,
    name: 'Expansion',
    duration: 600,
    baseFrequency: 417,
    harmonicMode: 'fibonacci',
    binauralOffset: 4,
    description: 'Fibonacci harmonic layering'
  },
  {
    id: 3,
    name: 'Transition',
    duration: 300,
    baseFrequency: 528,
    harmonicMode: 'golden',
    binauralOffset: 6,
    description: 'Frequency shift with golden ratio'
  },
  {
    id: 4,
    name: 'Deep State',
    duration: 600,
    baseFrequency: 528,
    harmonicMode: '369',
    binauralOffset: 7.83,
    description: '3-6-9 harmonics with theta entrainment'
  },
  {
    id: 5,
    name: 'Integration',
    duration: 300,
    baseFrequency: 7.83,
    harmonicMode: 'none',
    binauralOffset: 0,
    description: 'Earth resonance grounding'
  }
];

export const SUBSCRIPTION_TIERS: Record<string, SubscriptionConfig> = {
  free: {
    tier: 'free',
    price: 0,
    currency: 'USD',
    features: [
      'Basic frequency generator',
      '3 brainwave presets',
      '15-minute session limit',
      'Basic sine wave visualization'
    ],
    limitations: [
      'No adaptive resonance',
      'No voice frequency scan',
      'No session saving',
      'Limited ambient sounds'
    ]
  },
  premium: {
    tier: 'premium',
    price: 9.99,
    currency: 'USD',
    features: [
      'Unlimited session duration',
      'All brainwave states',
      'Adaptive resonance engine',
      'Voice frequency scan',
      'Advanced visualizations',
      'Session saving & sharing',
      'All ambient sounds',
      'Extended meditation journeys',
      'Harmonic expansion engine'
    ],
    limitations: []
  }
};

export const FIBONACCI_SEQUENCE = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
export const GOLDEN_RATIO = 1.618033988749895;
export const TESLA_SEQUENCE = [3, 6, 9, 12, 15, 18, 21, 24, 27];
export const SCHUMANN_FREQUENCY = 7.83;

export const DEFAULT_SESSION_DURATION = 900;
export const MIN_SESSION_DURATION = 60;
export const MAX_SESSION_DURATION_FREE = 900;
export const MAX_SESSION_DURATION_PREMIUM = 7200;

export const VISUALIZATION_COLORS = {
  delta: ['#1a237e', '#3949ab', '#5c6bc0'],
  theta: ['#4a148c', '#7b1fa2', '#9c27b0'],
  alpha: ['#1b5e20', '#388e3c', '#4caf50'],
  beta: ['#e65100', '#f57c00', '#ff9800'],
  gamma: ['#b71c1c', '#d32f2f', '#f44336']
};

export const AUDIO_DEFAULTS = {
  sampleRate: 44100,
  bufferSize: 4096,
  defaultVolume: 0.5,
  fadeInDuration: 2,
  fadeOutDuration: 2
};
