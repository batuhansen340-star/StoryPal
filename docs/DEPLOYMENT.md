# StoryPal — App Store Deployment Guide

## Prerequisites

### 1. Apple Developer Program ($99/year)
- Go to https://developer.apple.com/programs/enroll/
- Sign in with your Apple ID
- Pay the $99/year fee
- Approval takes 24-48 hours
- Continue once approved

### 2. Supabase Edge Functions Deploy
In the project directory:
```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login
supabase login

# Link (get project ID from Supabase dashboard)
supabase link --project-ref YOUR_PROJECT_ID

# Deploy all edge functions
supabase functions deploy ai-text
supabase functions deploy ai-image
supabase functions deploy analyze-face
```

Add environment variables to edge functions:
- Supabase Dashboard -> Edge Functions -> Secrets
- `OPENAI_API_KEY`: your OpenAI API key
- `REPLICATE_API_TOKEN`: your Replicate API token (for image generation)

### 3. Privacy Policy Publish
```bash
# Create a new repo: storypal-privacy
# Copy docs/privacy-policy.md content into index.html
# Enable GitHub Pages: Settings -> Pages -> main branch
# URL: https://batuhansen340-star.github.io/storypal-privacy/
```

### 4. EAS CLI + Expo Account
```bash
npm install -g eas-cli
eas login
# If you don't have an Expo account: https://expo.dev/signup
```

### 5. iOS Build
```bash
# First time will ask for Apple Developer credentials
eas build --platform ios --profile production

# Build takes 15-20 minutes
# When done, .ipa file appears in Expo dashboard
```

### 6. App Store Connect
1. Go to https://appstoreconnect.apple.com
2. "My Apps" -> "+" -> "New App"
3. Fill in details:
   - Name: StoryPal
   - Primary Language: English
   - Bundle ID: com.storypal.app
   - SKU: storypal-v1
4. Select the build (from EAS)
5. Upload screenshots (from Simulator)
6. Age rating: 4+
7. Privacy Policy URL: your GitHub Pages link
8. Pricing: Free
9. Submit for Review

### 7. App Store Metadata
- **App Name:** StoryPal
- **Subtitle:** AI Story Creator for Kids
- **Keywords:** kids stories,bedtime,AI,children books,storytelling,personalized,educational,reading,fairy tales
- **Category:** Education (Primary), Books (Secondary)
- **Age Rating:** 4+
- **Description:**

Create magical, personalized stories for your child with AI!

StoryPal creates unique, illustrated bedtime stories tailored to your child. Choose a theme, pick a character, and watch AI craft a beautiful story with illustrations.

Features:
- 10 story themes & 60+ characters
- 10 languages supported
- 3 educational mini games per story
- Photo-based character creation
- Voice narration with multiple voices
- Story library with offline reading
- No ads, COPPA compliant, child-safe

- **What's New (v1.0.0):** Welcome to StoryPal! Create magical AI stories for your child.

### 8. App Review Wait
- Usually 1-3 days
- Children's app: COPPA compliance will be checked
- If rejected, read the reason and fix accordingly

## Android (Google Play)

### 1. Google Play Developer Account ($25 one-time)
- Go to https://play.google.com/console/signup
- Pay $25 one-time fee

### 2. Android Build
```bash
eas build --platform android --profile production
# Downloads .aab file
```

### 3. Google Play Console
- Create app -> fill metadata (same as iOS)
- Upload .aab file
- Fill in Data Safety form
- Content rating: Everyone
- Submit for review

## Environment Variables Checklist
Before building for production, ensure `.env` has:
- [x] `EXPO_PUBLIC_OPENAI_API_KEY` - for story generation
- [x] `EXPO_PUBLIC_SUPABASE_URL` - for database
- [x] `EXPO_PUBLIC_SUPABASE_ANON_KEY` - for database auth
- [ ] `EXPO_PUBLIC_ELEVENLABS_API_KEY` - optional, for premium TTS
- [ ] `REVENUECAT_API_KEY` - not needed for V1
