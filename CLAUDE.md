# CLAUDE.md — StoryPal Project Rules

## Project Overview
StoryPal is an AI-powered children's storybook maker app. Kids pick a theme and character, AI writes the story and generates illustrations, creating a digital picture book.

## Tech Stack
- **Framework:** React Native with Expo (SDK 52+, Expo Router)
- **Backend:** Supabase (Auth, PostgreSQL, Storage, Edge Functions)
- **AI:** OpenAI GPT-4o-mini (text), Replicate SDXL (images)
- **Monetization:** RevenueCat (subscriptions)
- **Analytics:** Amplitude
- **Language:** TypeScript (strict)

## Project Structure
```
apps-portfolio/
├── packages/shared/          # Shared code (reused across 3 apps later)
│   ├── components/           # PaywallScreen, OnboardingFlow, LoadingAI, ShareCard
│   ├── hooks/                # useSubscription, useAI, useNotification
│   ├── services/             # supabase.ts, ai-gateway.ts, revenue-cat.ts
│   ├── types/                # TypeScript interfaces
│   └── index.ts              # Barrel exports
├── apps/storypal/            # StoryPal app
│   ├── app/                  # Expo Router screens
│   │   ├── (tabs)/           # Tab navigation (home, create, library, settings)
│   │   ├── story/            # Story creation flow screens
│   │   └── _layout.tsx       # Root layout
│   ├── features/             # Story engine, book viewer
│   ├── constants/            # Themes, characters, colors
│   └── assets/               # Images, fonts
├── supabase/
│   ├── migrations/           # SQL schema files
│   └── functions/            # Edge Functions (ai-text, ai-image)
└── CLAUDE.md                 # This file
```

## Workflow Rules (FOLLOW THIS ORDER FOR EVERY TASK)
1. **THINK** — Analyze the task. What are the edge cases? What could go wrong?
2. **READ** — Read relevant files BEFORE editing. Never edit without reading first.
3. **PLAN** — Create a todo list. Define each step.
4. **IMPLEMENT** — Make minimal correct changes. No over-engineering.
5. **VERIFY** — Test it. If error, find root cause, don't guess.
6. **UPDATE** — Mark completed tasks. Update plan if needed.

## Code Rules
- Read file BEFORE editing — ALWAYS (v0/Cursor/Lovable pattern)
- Mimic existing code conventions — don't invent new patterns
- Never assume a library exists — check package.json first
- Add ALL necessary imports
- No unnecessary comments (if code is clear, comment is noise)
- Run independent operations in parallel when possible
- Linter error → fix it, but max 3 attempts per file
- Small, focused components — no monolithic files
- Use TypeScript strict mode — no `any` types unless absolutely necessary

## Design Rules (Antigravity Pattern)
- User must be WOWED at first glance
- No generic colors — use curated color palettes
- Modern typography (Inter or similar)
- Glassmorphism, micro-animations, gradients
- "If it looks simple and basic, you have FAILED"
- Child-friendly: bright, warm, rounded corners, playful

## Communication Rules (Claude Code Pattern)
- Be CONCISE — no unnecessary preamble/postamble
- Don't explain code after writing unless asked
- Don't say "I'll do X" — just do it
- If unclear, ASK before implementing

## Git Rules
- Never modify git config
- Never force push
- Never skip hooks
- Commit message: short summary, conventional commits style
- Don't commit unless explicitly asked

## App-Specific Details

### StoryPal Themes
space, ocean, forest, castle, dinosaur, fairy, pirate, robot, animal, superhero

### StoryPal Characters (Presets)
Luna (brave girl), Max (clever boy), Whiskers (magic cat), Spark (baby dragon),
Professor Hoot (wise owl), Clover (bunny), Beep (robot), Iris (fairy),
Honey (bear cub), Zorp (friendly alien)

### Age Groups
- 3-5 years: 5 pages, max 30 words/page
- 5-7 years: 8 pages, max 50 words/page
- 7-10 years: 10 pages, max 80 words/page

### Color Palette
- Primary: #FF6B6B (warm coral)
- Background: #FFF8F0 (cream white)
- Text: #2D2D2D
- Accent: #4ECDC4 (turquoise)
- Card: #FFFFFF

### Pricing
- Free: 2 stories/day
- Monthly: $4.99
- Yearly: $29.99
- Lifetime: $59.99

### RevenueCat Entitlement
- Entitlement ID: "premium"
- Products: storypal_monthly, storypal_yearly, storypal_lifetime

### Supabase Tables
- profiles (user data, subscription status)
- stories (title, theme, character, language)
- story_pages (text, image_url, page_number)
- usage_logs (daily limit tracking, cost tracking)

### AI Safety
- All image prompts MUST include: "safe for children, no violence, no scary elements"
- Negative prompt MUST include: "scary, violent, dark, horror, blood, weapon, nsfw"
- Story content must be positive, uplifting, age-appropriate
