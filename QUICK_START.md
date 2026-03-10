# Pulse 369 Inner Wave - Quick Start

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
cd pulse-369-app
npm install
```

### 2. Configure Supabase (Required for auth & saving)
```bash
# 1. Create free account at https://supabase.com
# 2. Create new project
# 3. Go to Settings → API
# 4. Copy URL and anon key to app.json
```

### 3. Run the App
```bash
npx expo start
```

Then press:
- `i` for iOS Simulator
- `a` for Android Emulator
- Scan QR with Expo Go app for physical device

## 📱 Features Overview

### 🎵 Audio Features
- **5 Brainwave States**: Delta, Theta, Alpha, Beta, Gamma
- **7 Solfeggio Frequencies**: 417, 432, 528, 639, 741, 852 Hz
- **Earth Resonance**: 7.83 Hz (Schumann)
- **Binaural Beats**: Left/right ear differentiation
- **Harmonic Expansion**: Fibonacci, Golden Ratio, 3-6-9

### 🎨 Visual Features
- Real-time wave visualizations
- Fibonacci spirals
- Sacred geometry patterns
- Particle systems
- State-based color schemes

### 💎 Premium Features ($9.99/month)
- Voice frequency scan
- Adaptive resonance sessions
- Unlimited duration
- Session saving
- All visualizations

## 🏗️ Project Structure

```
src/
├── components/     # 8 UI components
├── screens/        # 4 main screens
├── hooks/          # 3 custom hooks
├── services/       # Audio engine & Supabase
├── store/          # Zustand state management
├── types/          # TypeScript definitions
└── constants/      # App constants
```

## 🎮 Usage Guide

### Creating a Session
1. Select brainwave state (Delta for sleep, Alpha for relaxation, etc.)
2. Choose base frequency (528Hz for love/healing)
3. Enable harmonic expansion (Fibonacci recommended)
4. Turn on binaural beats for entrainment
5. Set duration and ambient sound
6. Press Play ▶

### Using Voice Scan (Premium)
1. Go to Voice Scanner section
2. Press Record and hum/sing for 5 seconds
3. App analyzes your dominant frequency
4. Use recommended personalized session

### Saving Sessions (Premium)
1. Configure your perfect session
2. Sessions are auto-saved to cloud
3. Access from Sessions tab
4. Tap to load, long-press to delete

## ⚙️ Configuration

### app.json
```json
{
  "extra": {
    "supabaseUrl": "YOUR_SUPABASE_URL",
    "supabaseAnonKey": "YOUR_SUPABASE_ANON_KEY"
  }
}
```

### Environment Variables (.env)
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 🔧 Customization

### Add New Frequency Preset
Edit `src/constants/index.ts`:
```typescript
export const FREQUENCY_PRESETS = {
  '963': {
    id: '963',
    frequency: 963,
    name: '963 Hz',
    description: 'Crown chakra, enlightenment',
    color: '#9C27B0'
  }
};
```

### Add New Visualization
Edit `src/components/Visualization.tsx`:
Add new case to `renderVisualization()` switch statement.

### Change Color Scheme
Edit `src/constants/index.ts`:
```typescript
export const VISUALIZATION_COLORS = {
  alpha: ['#your', '#custom', '#colors']
};
```

## 📊 Building for Production

### Using EAS (Recommended)
```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Build
eas build --platform ios    # iOS
eas build --platform android # Android
```

### Classic Build
```bash
expo build:ios
expo build:android
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Metro error | `npx expo start --clear` |
| iOS build fails | `cd ios && pod install` |
| Android build fails | `cd android && ./gradlew clean` |
| Audio not playing | Check permissions in app.json |
| Supabase errors | Verify URL and API key |

## 📚 Documentation

- **README.md** - Full documentation
- **PROJECT_SUMMARY.md** - Architecture overview
- **SETUP_GUIDE.md** - Detailed setup instructions
- **QUICK_START.md** - This file

## 🎯 Next Steps

1. ✅ Set up Supabase backend
2. ✅ Test on physical device
3. ✅ Configure in-app purchases
4. ✅ Design app icons
5. ✅ Build and deploy

## 💡 Tips

- Use headphones for binaural beats
- Start with shorter sessions (5-15 min)
- Experiment with different frequencies
- Keep volume moderate for comfort
- Use consistently for best results

## 📞 Support

For issues:
1. Check documentation files
2. Review error logs
3. Test on clean install
4. Open GitHub issue

---

**Enjoy your harmonic journey! 🌊✨**
