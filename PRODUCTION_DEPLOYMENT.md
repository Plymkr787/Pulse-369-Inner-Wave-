# Pulse 369 Inner Wave - Production Deployment Guide

## 📦 Step 1: Get All Project Files

### Option A: Download from Sandbox (Current Location)

All files are located at:
```
/mnt/okcomputer/output/pulse-369-app/
```

Copy the entire folder to your local machine or development environment.

### Option B: Create a Git Repository

```bash
# Initialize git
cd pulse-369-app
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Pulse 369 Inner Wave"

# Add remote (create repo on GitHub first)
git remote add origin https://github.com/yourusername/pulse-369.git
git push -u origin main
```

### Option C: Create ZIP Archive

```bash
cd /mnt/okcomputer/output
zip -r pulse-369-app.zip pulse-369-app/
```

---

## 🔧 Step 2: Environment Setup

### 2.1 Install Node.js & Dependencies

```bash
# Check Node version (need 18+)
node --version

# Install dependencies
cd pulse-369-app
npm install

# If you get peer dependency issues:
npm install --legacy-peer-deps
```

### 2.2 Install Expo CLI

```bash
npm install -g expo-cli eas-cli
```

### 2.3 Login to Expo

```bash
expo login
# Enter your Expo account credentials
```

---

## 🗄️ Step 3: Supabase Backend Setup (REQUIRED)

### 3.1 Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Name: `pulse-369`
4. Database Password: (save this securely!)
5. Region: Choose closest to your users
6. Click "Create new project"

### 3.2 Get API Keys

1. Wait for project to initialize (~2 minutes)
2. Go to **Project Settings** → **API**
3. Copy:
   - **Project URL**: `https://xxxxxx.supabase.co`
   - **anon public** API key (starts with `eyJ...`)

### 3.3 Update App Configuration

Edit `app.json`:

```json
{
  "expo": {
    "name": "Pulse 369 Inner Wave",
    "slug": "pulse-369-inner-wave",
    "version": "1.0.0",
    "extra": {
      "supabaseUrl": "https://your-project.supabase.co",
      "supabaseAnonKey": "your-anon-key-here"
    },
    "ios": {
      "bundleIdentifier": "com.yourcompany.pulse369"
    },
    "android": {
      "package": "com.yourcompany.pulse369"
    }
  }
}
```

### 3.4 Create Database Tables

Go to **SQL Editor** in Supabase Dashboard and run:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table
create table users (
  id uuid references auth.users primary key,
  email text not null,
  subscription_status text default 'free',
  subscription_expires timestamp,
  preferences jsonb default '{
    "defaultDuration": 900,
    "defaultBrainwaveState": "alpha",
    "defaultAmbientSound": "none",
    "visualizationEnabled": true,
    "hapticFeedback": true
  }'::jsonb,
  created_at timestamp default now()
);

-- Saved sessions table
create table saved_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) on delete cascade,
  name text not null,
  config jsonb not null,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Session analytics table
create table session_analytics (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) on delete cascade,
  session_id uuid references saved_sessions(id) on delete set null,
  brainwave_state text not null,
  duration integer not null,
  completed boolean default false,
  created_at timestamp default now()
);

-- Enable RLS
alter table users enable row level security;
alter table saved_sessions enable row level security;
alter table session_analytics enable row level security;

-- RLS Policies
create policy "Users can view own data" on users
  for select using (auth.uid() = id);

create policy "Users can update own data" on users
  for update using (auth.uid() = id);

create policy "Users can view own sessions" on saved_sessions
  for select using (auth.uid() = user_id);

create policy "Users can create own sessions" on saved_sessions
  for insert with check (auth.uid() = user_id);

create policy "Users can update own sessions" on saved_sessions
  for update using (auth.uid() = user_id);

create policy "Users can delete own sessions" on saved_sessions
  for delete using (auth.uid() = user_id);

create policy "Users can view own analytics" on session_analytics
  for select using (auth.uid() = user_id);

create policy "Users can create own analytics" on session_analytics
  for insert with check (auth.uid() = user_id);

-- Auto-create user on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

---

## 💳 Step 4: In-App Purchases Setup

### iOS - App Store Connect

1. Go to https://appstoreconnect.apple.com
2. Click **Apps** → **+** → **New App**
3. Fill in:
   - Platform: iOS
   - Name: Pulse 369 Inner Wave
   - Primary Language: English
   - Bundle ID: `com.yourcompany.pulse369`
   - SKU: pulse369-v1
4. Click **Create**

5. Go to **Features** → **In-App Purchases**
6. Click **+**
7. Select **Auto-Renewable Subscriptions**
8. Configure:
   - Reference Name: Premium Monthly
   - Product ID: `pulse369_premium_monthly`
   - Subscription Group: Create new "Premium"
   - Subscription Duration: 1 Month
   - Price: $9.99

### Android - Google Play Console

1. Go to https://play.google.com/console
2. Click **Create app**
3. Fill in app details
4. Go to **Monetize** → **Products** → **Subscriptions**
5. Click **Create subscription**
6. Configure:
   - Product ID: `pulse369_premium_monthly`
   - Name: Premium Monthly
   - Description: Unlock all premium features
   - Benefits: List all premium features
   - Price: $9.99
   - Billing period: Monthly

---

## 🎨 Step 5: Create App Assets

### App Icon (Required)

Create icon at these sizes:
- 1024×1024px (App Store)
- 512×512px (Play Store)
- 1024×1024px (iOS)

Save to:
- `assets/icon.png`
- `assets/adaptive-icon.png` (Android)

### Splash Screen (Required)

Create splash screen:
- 1242×2436px (iPhone X size)
- Dark background (#0a0a0f)
- Center logo/text

Save to:
- `assets/splash.png`

### Quick Asset Generation

```bash
# Install expo-asset tools
npx expo-asset-generator

# Or use online tools:
# https://appicon.co/ (for icons)
# https://www.canva.com/ (for splash)
```

---

## 🧪 Step 6: Test Locally

```bash
# Start development server
npx expo start

# Test on iOS Simulator (press 'i')
# Test on Android Emulator (press 'a')
# Test on physical device (scan QR code)
```

### Test Checklist
- [ ] All screens load correctly
- [ ] Audio plays on device
- [ ] Sign up / Sign in works
- [ ] Sessions save (Premium)
- [ ] Voice scan works (Premium)
- [ ] Subscription flow works
- [ ] Visualizations render

---

## 📱 Step 7: Build for Production

### Using EAS Build (Recommended)

```bash
# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Build for both
eas build --platform all
```

### iOS Specific

```bash
# Generate credentials (first time)
eas credentials

# Build with specific profile
eas build --platform ios --profile production
```

### Android Specific

```bash
# Generate keystore (first time)
eas credentials

# Build APK (for testing)
eas build --platform android --profile preview

# Build AAB (for Play Store)
eas build --platform android --profile production
```

---

## 🚀 Step 8: Deploy to App Stores

### iOS App Store

1. After EAS build completes, download `.ipa` file
2. Go to App Store Connect
3. Select your app → **App Store** tab
4. Click **+** next to "Build"
5. Upload using:
   - **Transporter app** (Mac)
   - Or `xcrun altool` command line

```bash
# Upload via command line
xcrun altool --upload-app --type ios --file "path/to/app.ipa" --apiKey "YOUR_API_KEY" --apiIssuer "YOUR_ISSUER_ID"
```

6. Fill app information:
   - Screenshots (iPhone & iPad)
   - Description
   - Keywords
   - Support URL
   - Marketing URL
   - Privacy Policy URL

7. Submit for Review

### Google Play Store

1. After EAS build completes, download `.aab` file
2. Go to Google Play Console
3. Select your app → **Production** → **Create new release**
4. Upload `.aab` file
5. Fill release notes
6. Review and rollout

---

## 🔐 Step 9: Environment Variables for Production

Create `.env.production`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-production-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
EXPO_PUBLIC_APP_ENV=production
```

**Never commit this file!** Add to `.gitignore`:
```
.env.production
.env.local
```

---

## 📊 Step 10: Post-Launch Monitoring

### Analytics Setup

Add to `app.json`:
```json
{
  "expo": {
    "plugins": [
      ["expo-analytics-amplitude", {
        "apiKey": "YOUR_AMPLITUDE_KEY"
      }]
    ]
  }
}
```

### Crash Reporting

```bash
# Install Sentry
npm install @sentry/react-native

# Configure in App.tsx
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: 'production'
});
```

---

## 🔄 Step 11: Update Strategy

### Version Management

Update `app.json` for each release:
```json
{
  "version": "1.0.1",
  "ios": {
    "buildNumber": "2"
  },
  "android": {
    "versionCode": 2
  }
}
```

### OTA Updates (Expo)

```bash
# Publish update without app store
expo publish

# Users get update automatically on next app open
```

---

## 📋 Production Checklist

### Pre-Launch
- [ ] All features tested on physical devices
- [ ] Supabase backend configured
- [ ] In-app purchases set up
- [ ] App icons created (all sizes)
- [ ] Splash screen created
- [ ] Screenshots for stores
- [ ] App description written
- [ ] Privacy policy created
- [ ] Terms of service created
- [ ] Support email/URL set up

### Build
- [ ] iOS build successful
- [ ] Android build successful
- [ ] No console errors
- [ ] Bundle size optimized
- [ ] Assets optimized

### Submission
- [ ] App Store screenshots uploaded
- [ ] Play Store screenshots uploaded
- [ ] App description complete
- [ ] Keywords optimized
- [ ] Review guidelines met

### Post-Launch
- [ ] Analytics tracking
- [ ] Crash reporting active
- [ ] User feedback channel
- [ ] Update plan ready

---

## 💰 Monetization Setup

### RevenueCat (Optional but Recommended)

```bash
npm install react-native-purchases
```

Configure in `app.json`:
```json
{
  "plugins": [
    ["react-native-purchases", {
      "apiKey": "YOUR_REVENUECAT_API_KEY"
    }]
  ]
}
```

Benefits:
- Unified IAP across platforms
- Analytics dashboard
- A/B testing
- Subscription management

---

## 🆘 Troubleshooting Production Issues

### Build Failures

```bash
# Clear all caches
rm -rf node_modules
rm -rf .expo
rm -rf ios/build
rm -rf android/build
npm install
npx expo start --clear
```

### iOS Signing Issues
```bash
# Reset provisioning profiles
eas credentials:manager

# Or manually in Xcode
open ios/Pulse369.xcworkspace
```

### Android Keystore Issues
```bash
# Backup keystore
cp android/app/my-release-key.keystore ~/backups/

# If lost, create new (will require new Play Store listing)
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

---

## 📞 Support Resources

- **Expo Docs**: https://docs.expo.dev
- **Supabase Docs**: https://supabase.com/docs
- **React Native Docs**: https://reactnative.dev
- **App Store Guidelines**: https://developer.apple.com/app-store/guidelines/
- **Play Store Guidelines**: https://play.google.com/console/about/guides/

---

## 🎉 You're Ready!

Follow this guide step-by-step and you'll have Pulse 369 Inner Wave live on both app stores. Good luck with your launch! 🚀
