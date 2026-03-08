# Pulse 369 Inner Wave

A cross-platform meditation and focus app that generates adaptive sound environments using harmonic mathematics, binaural beats, Solfeggio tones, and Earth resonance frequencies.

## Features

### Core Audio Engine
- **Brainwave State Selector**: Delta, Theta, Alpha, Beta, Gamma frequencies
- **Frequency Presets**: 417Hz, 432Hz, 528Hz, 639Hz, 741Hz, 852Hz, 7.83Hz (Schumann)
- **Harmonic Expansion**: Fibonacci sequence, Golden Ratio (1.618), 3-6-9 Tesla harmonics
- **Binaural Beats**: Left/right ear frequency differentiation
- **Adaptive Resonance**: Dynamic frequency evolution during sessions
- **Voice Frequency Scan**: Personalized sessions based on vocal analysis

### Visualizations
- Sine wave animations
- Harmonic interference patterns
- Fibonacci spirals
- Sacred geometry patterns
- Particle systems

### Session Management
- Custom session builder with duration, layers, ambient sounds
- Save and load sessions (Premium)
- Loop playback with timer
- Session analytics tracking

### Subscription Tiers

**Free Tier:**
- Basic frequency generator
- 3 brainwave presets (Delta, Theta, Alpha)
- 15-minute session limit
- Basic sine wave visualization

**Premium Tier ($9.99/month):**
- Unlimited session duration
- All brainwave states
- Adaptive resonance engine
- Voice frequency scan
- Advanced visualizations
- Session saving & sharing
- All ambient sounds
- Extended meditation journeys

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Zustand
- **Backend**: Supabase
- **Audio**: Web Audio API / Expo AV
- **UI**: React Native + Expo Linear Gradient
- **Navigation**: React Navigation

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Configuration

### Supabase Setup

1. Create a Supabase project at https://supabase.com
2. Add your credentials to `app.json`:

```json
{
  "extra": {
    "supabaseUrl": "YOUR_SUPABASE_URL",
    "supabaseAnonKey": "YOUR_SUPABASE_ANON_KEY"
  }
}
```

### Database Schema

```sql
-- Users table (extends auth.users)
create table users (
  id uuid references auth.users primary key,
  email text not null,
  subscription_status text default 'free',
  subscription_expires timestamp,
  preferences jsonb default '{}',
  created_at timestamp default now()
);

-- Saved sessions table
create table saved_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id),
  name text not null,
  config jsonb not null,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Session analytics table
create table session_analytics (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id),
  session_id uuid references saved_sessions(id),
  brainwave_state text not null,
  duration integer not null,
  completed boolean default false,
  created_at timestamp default now()
);
```

### In-App Purchases Setup

1. Configure products in App Store Connect (iOS) and Google Play Console (Android)
2. Product ID: `pulse369_premium_monthly`
3. Update the product ID in `src/hooks/useSubscription.ts`

## Project Structure

```
pulse-369-app/
├── App.tsx                 # Main app component with navigation
├── index.js                # Entry point
├── app.json                # Expo configuration
├── package.json            # Dependencies
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── BrainwaveSelector.tsx
│   │   ├── FrequencyPresets.tsx
│   │   ├── HarmonicEngine.tsx
│   │   ├── BinauralBeats.tsx
│   │   ├── VoiceScanner.tsx
│   │   ├── Visualization.tsx
│   │   ├── SessionBuilder.tsx
│   │   └── PlayControls.tsx
│   ├── screens/            # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── SessionsScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── AuthScreen.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useAudio.ts
│   │   ├── useVoiceAnalysis.ts
│   │   └── useSubscription.ts
│   ├── services/           # API services
│   │   ├── supabase.ts
│   │   └── audioEngine.ts
│   ├── store/              # State management
│   │   └── appStore.ts
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   ├── constants/          # App constants
│   │   └── index.ts
│   └── utils/              # Utility functions
├── assets/                 # Static assets
│   ├── images/
│   └── sounds/
```

## Audio Engine Architecture

The audio engine uses the Web Audio API to generate real-time oscillators:

1. **Master Gain Node**: Controls overall volume
2. **Oscillator Nodes**: Generate base frequencies and harmonics
3. **Binaural Processing**: Separate left/right channels
4. **Analyser Node**: Provides visualization data
5. **Adaptive Engine**: Dynamically changes frequencies over time

## Harmonic Mathematics

### Fibonacci Sequence
```
F(n) = F(n-1) + F(n-2)
Harmonics: base × [1, 1, 2, 3, 5, 8, 13, 21]
```

### Golden Ratio
```
φ = 1.618033988749895
Harmonics: base × [1, φ, φ²]
```

### 3-6-9 Sequence (Tesla)
```
Harmonics: base × [3, 6, 9, 12, 15, 18] / 3
```

## Brainwave Frequencies

| State  | Range (Hz) | Description                    |
|--------|------------|--------------------------------|
| Delta  | 0.5–4      | Deep sleep, healing            |
| Theta  | 4–8        | Meditation, creativity         |
| Alpha  | 8–12       | Relaxation, calm awareness     |
| Beta   | 12–30      | Focus, alertness               |
| Gamma  | 30–80      | Peak cognition, insight        |

## Solfeggio Frequencies

| Frequency | Properties                      |
|-----------|---------------------------------|
| 417 Hz    | Facilitates change              |
| 432 Hz    | Natural tuning, balance         |
| 528 Hz    | Love frequency, DNA repair      |
| 639 Hz    | Connection, relationships       |
| 741 Hz    | Awakening, intuition            |
| 852 Hz    | Spiritual order                 |
| 7.83 Hz   | Earth resonance (Schumann)      |

## Building for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

### EAS Build (Recommended)
```bash
eas build --platform ios
eas build --platform android
```

## License

MIT License - see LICENSE file for details

## Credits

- Inspired by the work of Nikola Tesla (3-6-9)
- Fibonacci sequence and Golden Ratio mathematics
- Solfeggio frequency research
- Brainwave entrainment studies
