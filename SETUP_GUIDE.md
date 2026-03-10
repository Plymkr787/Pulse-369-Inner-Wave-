# Pulse 369 Inner Wave - Setup Guide

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator
- Supabase account (free tier works)

## Step 1: Project Setup

```bash
# Navigate to project directory
cd pulse-369-app

# Install dependencies
npm install

# If you encounter peer dependency issues
npm install --legacy-peer-deps
```

## Step 2: Supabase Configuration

### 2.1 Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Enter project name: "pulse-369"
4. Choose region closest to your users
5. Create project (takes ~2 minutes)

### 2.2 Get API Credentials

1. In Supabase dashboard, go to Settings → API
2. Copy "Project URL" and "anon public" API key
3. Update `app.json`:

```json
{
  "expo": {
    "extra": {
      "supabaseUrl": "https://your-project.supabase.co",
      "supabaseAnonKey": "your-anon-key"
    }
  }
}
```

### 2.3 Create Database Tables

Go to Supabase SQL Editor and run:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends auth.users)
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

-- Enable Row Level Security
alter table users enable row level security;
alter table saved_sessions enable row level security;
alter table session_analytics enable row level security;

-- Create RLS policies
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

-- Create function to handle user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## Step 3: In-App Purchases Setup (Optional for testing)

### iOS (App Store Connect)

1. Go to https://appstoreconnect.apple.com
2. Select your app → Features → In-App Purchases
3. Click "+" to add new IAP
4. Type: Auto-Renewable Subscription
5. Reference Name: "Premium Monthly"
6. Product ID: `pulse369_premium_monthly`
7. Price: $9.99
8. Save

### Android (Google Play Console)

1. Go to https://play.google.com/console
2. Select your app → Monetize → Products → Subscriptions
5. Click "Create subscription"
6. Product ID: `pulse369_premium_monthly`
7. Name: "Premium Monthly"
8. Price: $9.99
9. Billing period: Monthly
10. Save

## Step 4: Running the App

### Start Development Server

```bash
# Start Expo
npx expo start

# Or with clearing cache
npx expo start --clear
```

### Run on iOS Simulator

```bash
# Press 'i' in Expo CLI
# Or
npx expo run:ios
```

### Run on Android Emulator

```bash
# Press 'a' in Expo CLI
# Or
npx expo run:android
```

### Run on Physical Device

1. Install Expo Go app from App Store / Play Store
2. Scan QR code from terminal
3. App will load on device

## Step 5: Building for Production

### Using EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Build for both
eas build --platform all
```

### Using Expo Classic Build

```bash
# iOS
expo build:ios

# Android
expo build:android
```

## Troubleshooting

### Common Issues

#### 1. Metro Bundler Issues
```bash
# Clear cache
npx expo start --clear

# Or manually
rm -rf node_modules
rm -rf .expo
npm install
npx expo start --clear
```

#### 2. iOS Build Fails
```bash
# Clean build
cd ios
xcodebuild clean
rm -rf build
pod deintegrate
pod install
cd ..
npx expo run:ios
```

#### 3. Android Build Fails
```bash
# Clean build
cd android
./gradlew clean
cd ..
npx expo run:android
```

#### 4. Supabase Connection Issues
- Verify URL and API key in app.json
- Check RLS policies are correct
- Ensure tables exist

#### 5. Audio Not Playing
- Check audio permissions in app.json
- Verify AudioContext is supported
- Check for browser autoplay restrictions (web)

### Development Tips

1. **Hot Reload**: Press 'r' in terminal to reload
2. **Debug Mode**: Shake device or press Cmd+D (iOS) / Cmd+M (Android)
3. **Logs**: Check terminal and device console
4. **Network**: Use React Native Debugger for network inspection

## Environment Variables

Create `.env` file for local development:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Note: Variables must start with `EXPO_PUBLIC_` to be accessible in app.

## Testing

### Unit Tests
```bash
# Run tests
npm test

# With coverage
npm test -- --coverage
```

### E2E Tests
```bash
# Install Detox (for E2E)
npm install -g detox-cli

# Build for testing
detox build

# Run tests
detox test
```

## Deployment Checklist

### Pre-Deployment
- [ ] Test on physical devices
- [ ] Verify all features work
- [ ] Check premium features are locked
- [ ] Test subscription flow
- [ ] Verify analytics tracking
- [ ] Check accessibility
- [ ] Optimize images/assets

### App Store Submission (iOS)
- [ ] Create App Store Connect record
- [ ] Configure signing certificates
- [ ] Build with EAS
- [ ] Upload to App Store Connect
- [ ] Fill app information
- [ ] Add screenshots
- [ ] Submit for review

### Play Store Submission (Android)
- [ ] Create Play Console record
- [ ] Configure signing keystore
- [ ] Build with EAS
- [ ] Upload to Play Console
- [ ] Fill app information
- [ ] Add screenshots
- [ ] Submit for review

## Support

For issues or questions:
- Check README.md for detailed documentation
- Review PROJECT_SUMMARY.md for architecture
- Open issue on GitHub

## License

MIT License - See LICENSE file
