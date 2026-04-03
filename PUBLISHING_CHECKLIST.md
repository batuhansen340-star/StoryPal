# StoryPal — App Store Publishing Checklist

## 1. Pre-Build Checks

- [ ] `app.json` → iOS `buildNumber` and Android `versionCode` are in sync (currently: 3)
- [ ] `app.json` → `version` is correct (currently: 1.0.0)
- [ ] `app.json` → `bundleIdentifier` = `com.storypal.app`
- [ ] `app.json` → `privacyUrl` points to live GitHub Pages URL
- [ ] All API keys (OpenAI, Supabase, RevenueCat) are in `.env` and NOT committed to git
- [ ] `eas.json` has a `production` profile configured
- [ ] TypeScript compiles without errors: `npx tsc --noEmit`

## 2. GitHub Pages (Marketing & Legal)

- [ ] Push `docs/` folder to GitHub repo
- [ ] Enable GitHub Pages (Settings → Pages → Source: `main`, folder: `/docs`)
- [ ] Verify live URLs:
  - Landing: `https://<username>.github.io/<repo>/`
  - Privacy: `https://<username>.github.io/<repo>/privacy.html`
  - Support: `https://<username>.github.io/<repo>/support.html`
- [ ] Update `app.json` → `privacyUrl` with the actual live URL

## 3. App Store Screenshots

- [ ] Install Puppeteer: `npm install puppeteer --save-dev`
- [ ] Render PNGs: `node screenshots/render-screenshots.js`
- [ ] Verify 6 PNG files in `screenshots/output/` (each 1290x2796px)
- [ ] Screenshots required for App Store Connect:
  - iPhone 6.7" (1290x2796) — our mockups ✓
  - iPhone 6.5" (1284x2778) — can reuse 6.7" with minor crop
  - iPad 12.9" (2048x2732) — optional but recommended

## 4. App Store Connect Setup

### App Information
- [ ] App Name: **StoryPal — AI Story Maker**
- [ ] Subtitle: **Personalized Storybooks for Kids**
- [ ] Category: **Education** (Primary), **Books** (Secondary)
- [ ] Content Rights: Confirm you own or have rights to all content
- [ ] Age Rating: Fill out the questionnaire → expected rating: **4+**

### Privacy
- [ ] Privacy Policy URL: paste GitHub Pages URL
- [ ] App Privacy → Data Collection:
  - Photos (optional, for custom characters) → Linked to User
  - Usage Data (analytics) → Not Linked to User
  - Identifiers (user ID) → Linked to User

### Pricing & Availability
- [ ] Price: Free (with in-app purchases)
- [ ] Availability: All territories (or select specific ones)
- [ ] In-App Purchases configured in App Store Connect:
  - `storypal_monthly` → $4.99/month (auto-renewable)
  - `storypal_yearly` → $29.99/year (auto-renewable)
  - `storypal_lifetime` → $59.99 (non-consumable)
- [ ] Each IAP has: display name, description, review screenshot, review notes

### App Review Information
- [ ] Contact info: name, phone, email
- [ ] Demo account (if login required): provide test credentials
- [ ] Review notes: explain how to test the app
  ```
  StoryPal creates AI-generated storybooks for children.
  To test: Open app → Tap "Create Story" → Select any theme and character → Tap Create.
  Free tier allows 2 stories/day. No login required for basic use.
  ```

### Version Information
- [ ] What's New: "Initial release — create magical AI storybooks for your kids!"
- [ ] Description (max 4000 chars):
  ```
  Create personalized AI storybooks your kids will love!

  StoryPal uses AI to generate unique stories with beautiful illustrations.
  Pick from 10 magical themes, choose a character, and watch as a
  personalized picture book appears in minutes.

  FEATURES:
  • 10 Themes: Space, Ocean, Forest, Castle, Dinosaur, Fairy, Pirate, Robot, Animal, Superhero
  • 20+ Characters including custom characters with your child's name & photo
  • AI Illustrations: Unique watercolor-style artwork on every page
  • Bedtime Mode: Dark theme with soothing narration and auto-play
  • Voice Narration: Multiple voices, adjustable speed, record your own
  • 10 Languages: English, Spanish, French, German, Turkish, and more
  • Reading Stats & Achievements: Track streaks and unlock milestones
  • Story Library: Save and re-read favorites anytime

  SAFE & KID-FRIENDLY
  All content is AI-generated with strict child safety filters.
  No ads. No scary content. Just magical stories.

  FREE TO START
  Create 2 stories per day for free. Upgrade for unlimited stories,
  premium voices, PDF export, and all languages.
  ```
- [ ] Keywords (max 100 chars): `storybook,kids,AI,bedtime,stories,children,personalized,reading,fairy,tale`
- [ ] Upload all 6 screenshots for iPhone 6.7"
- [ ] App icon (1024x1024, no alpha, no rounded corners — Apple rounds them)

## 5. Build & Submit

```bash
# Login to EAS
eas login

# Build for iOS App Store
eas build --platform ios --profile production

# Once build is complete, submit to App Store
eas submit --platform ios --latest
```

- [ ] Build completes without errors
- [ ] Binary uploaded to App Store Connect
- [ ] Select build in App Store Connect → Version
- [ ] Submit for Review

## 6. Post-Submission

- [ ] Monitor App Store Connect for review status
- [ ] Typical review time: 24-48 hours
- [ ] If rejected: read rejection reason carefully, fix, rebuild, resubmit
- [ ] Common rejection reasons for AI apps:
  - Missing privacy disclosures for AI-generated content
  - Subscription description not clear enough
  - Screenshots don't match actual app UI

## 7. After Approval

- [ ] Verify app is live on App Store
- [ ] Test download on a real device
- [ ] Update `docs/index.html` with real App Store link (replace placeholder)
- [ ] Share the link!

---

**Estimated time from start to App Store approval: 3-5 days**
(1 day setup + 1 day build/test + 1-2 days Apple review)
