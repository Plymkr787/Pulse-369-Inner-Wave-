#!/bin/bash

# Pulse 369 Inner Wave - Production Packaging Script
# This script packages the app for production deployment

echo "🌊 Pulse 369 Inner Wave - Production Packager"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo -e "${BLUE}Step 1: Checking project structure...${NC}"

# Check if all required files exist
REQUIRED_FILES=(
    "App.tsx"
    "package.json"
    "app.json"
    "tsconfig.json"
    "src/components/BrainwaveSelector.tsx"
    "src/screens/HomeScreen.tsx"
    "src/services/audioEngine.ts"
    "src/store/appStore.ts"
)

MISSING_FILES=0
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ Missing: $file${NC}"
        MISSING_FILES=$((MISSING_FILES + 1))
    fi
done

if [ $MISSING_FILES -gt 0 ]; then
    echo -e "${RED}Error: $MISSING_FILES required files are missing!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All required files present${NC}"
echo ""

# Create production directory
echo -e "${BLUE}Step 2: Creating production package...${NC}"
PROD_DIR="pulse-369-production"
mkdir -p "$PROD_DIR"

# Copy all source files
echo "Copying source files..."
cp -r src "$PROD_DIR/"
cp -r assets "$PROD_DIR/" 2>/dev/null || mkdir -p "$PROD_DIR/assets"
cp *.tsx *.json *.js *.md .env.example "$PROD_DIR/" 2>/dev/null || true

# Create production checklist
echo -e "${BLUE}Step 3: Creating production checklist...${NC}"

cat > "$PROD_DIR/PRODUCTION_CHECKLIST.txt" << 'EOF'
PULSE 369 INNER WAVE - PRODUCTION CHECKLIST
===========================================

□ STEP 1: ENVIRONMENT SETUP
  □ Install Node.js 18+
  □ Run: npm install
  □ Install Expo CLI: npm install -g expo-cli eas-cli

□ STEP 2: SUPABASE SETUP
  □ Create account at https://supabase.com
  □ Create new project
  □ Run SQL migrations (see SETUP_GUIDE.md)
  □ Copy Project URL and Anon Key
  □ Update app.json with credentials

□ STEP 3: APP STORE SETUP
  □ Create App Store Connect record
  □ Configure In-App Purchase (pulse369_premium_monthly)
  □ Set bundle identifier in app.json

□ STEP 4: PLAY STORE SETUP
  □ Create Google Play Console record
  □ Configure subscription product
  □ Set package name in app.json

□ STEP 5: ASSETS
  □ Create app icon (1024x1024px)
  □ Create splash screen (1242x2436px)
  □ Place in assets/ folder

□ STEP 6: TESTING
  □ Test on iOS device/simulator
  □ Test on Android device/emulator
  □ Verify all features work
  □ Test subscription flow

□ STEP 7: BUILD
  □ Configure EAS: eas build:configure
  □ Build iOS: eas build --platform ios
  □ Build Android: eas build --platform android

□ STEP 8: DEPLOY
  □ Upload iOS build to App Store Connect
  □ Upload Android build to Play Console
  □ Fill store listings
  □ Submit for review

□ STEP 9: POST-LAUNCH
  □ Monitor analytics
  □ Respond to user feedback
  □ Plan updates

RESOURCES:
- README.md - Full documentation
- SETUP_GUIDE.md - Detailed setup
- PRODUCTION_DEPLOYMENT.md - Deployment guide
- QUICK_START.md - Quick reference

SUPPORT:
- Expo: https://docs.expo.dev
- Supabase: https://supabase.com/docs
- React Native: https://reactnative.dev
EOF

echo -e "${GREEN}✅ Checklist created${NC}"
echo ""

# Create environment setup script
echo -e "${BLUE}Step 4: Creating setup script...${NC}"

cat > "$PROD_DIR/setup.sh" << 'EOF'
#!/bin/bash

echo "🌊 Setting up Pulse 369 Inner Wave..."
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18+. Current: $(node --version)"
    exit 1
fi

echo "✅ Node.js $(node --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed"
else
    echo "⚠️  Trying with legacy peer deps..."
    npm install --legacy-peer-deps
fi

# Install global tools
echo ""
echo "🔧 Installing Expo CLI..."
npm install -g expo-cli eas-cli

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure Supabase (see SETUP_GUIDE.md)"
echo "2. Update app.json with your credentials"
echo "3. Run: npx expo start"
echo ""
EOF

chmod +x "$PROD_DIR/setup.sh"

echo -e "${GREEN}✅ Setup script created${NC}"
echo ""

# Create ZIP archive
echo -e "${BLUE}Step 5: Creating ZIP archive...${NC}"

# Get parent directory
cd ..
zip -r "pulse-369-production.zip" "$PROD_DIR" -x "*/node_modules/*" -x "*/.expo/*" -x "*/.git/*"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Archive created: pulse-369-production.zip${NC}"
else
    echo -e "${YELLOW}⚠️  Could not create ZIP. Using tar instead...${NC}"
    tar -czf "pulse-369-production.tar.gz" "$PROD_DIR" --exclude="node_modules" --exclude=".expo" --exclude=".git"
    echo -e "${GREEN}✅ Archive created: pulse-369-production.tar.gz${NC}"
fi

# Cleanup
rm -rf "$PROD_DIR"

echo ""
echo "=============================================="
echo -e "${GREEN}🎉 Production package ready!${NC}"
echo ""
echo "Files created:"
echo "  - pulse-369-production.zip (or .tar.gz)"
echo ""
echo "Next steps:"
echo "1. Extract the archive"
echo "2. Run: ./setup.sh"
echo "3. Follow PRODUCTION_CHECKLIST.txt"
echo "4. See PRODUCTION_DEPLOYMENT.md for full guide"
echo ""
echo -e "${YELLOW}Good luck with your launch! 🚀${NC}"
