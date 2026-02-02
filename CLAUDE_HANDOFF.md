# Downpour - Claude Handoff Document

## What is Downpour?

Downpour is a **minimalist emotional release journaling PWA** (Progressive Web App). The concept: users write what's weighing on them, then "release" it - watching their words dissolve while the stormy sky clears to sunshine, accompanied by a soundscape transition from heavy rain to peaceful nature sounds.

**Target:** Google Play Store release as a TWA (Trusted Web Activity).
**Pricing:** $6.99 USD lifetime unlock after 7 free uses.
**Creator Brand:** Ascensciana - "Beautiful, digitalized rituals"

---

## Tech Stack

- **Vue 3** with Composition API (`<script setup>`)
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Vue Router** for navigation
- **Web Audio API** for soundscape (custom composable)
- **localStorage** for data persistence (no backend)

---

## App Flow

```
Title Screen → Onboarding → Home Screen → Write Screen → Release Screen → (Exit App)
                                ↓
                             Archive (Puddle)
                                ↓
                             Settings
```

### Screens

1. **TitleScreen.vue** - Landing page with "Downpour" title and "Begin" button (no icon)
2. **OnboardingScreen.vue** - First-time user tutorial (5 screens - sound toggle removed)
3. **HomeScreen.vue** - Main page with "Let it fall away" button, `?` help icon (opens guide modal), Settings icon, Archive icon
4. **WriteScreen.vue** - Textarea for writing (280 char limit), emotion tags, "Release" button
5. **ReleaseScreen.vue** - Animated sequence: text dissolves, sky clears, "Continue with your day" button exits app
6. **ArchiveScreen.vue** - "Puddle" - list of past entries, expandable cards, "Clear all" button in header
7. **SettingsScreen.vue** - Sound toggle, replay tutorial, "Connect with creator" link (@ascensciana on X)

---

## Key Files

| File | Purpose |
|------|---------|
| `src/App.vue` | Root component, provides rain clearing state, handles lightning→thunder |
| `src/components/BackgroundRain.vue` | Canvas-based rain animation, lightning flashes, 4 clearing phases |
| `src/composables/useAudio.js` | State machine audio (STORM/NATURE), singleton pattern |
| `src/composables/useHaptics.js` | Haptic feedback system - light (10ms), medium (20ms), heavy (30ms) |
| `src/composables/useLocalStorage.js` | Entry storage + usage tracking for freemium paywall |
| `src/views/PaywallScreen.vue` | **NEW** - Freemium paywall UI |
| `src/router.js` | Vue Router configuration (includes /paywall route) |
| `src/views/*.vue` | All screen components |
| `public/audio/` | Audio files: storm-heavy.mp3, thunder-rumble.mp3, nature-peaceful.mp3 |
| `vite.config.js` | PWA manifest, service worker, workbox config |
| `CLAUDE.md` | **NEW** - Workflow orchestration rules for Claude |
| `tasks/lessons.md` | **NEW** - Pattern tracking for self-improvement |

---

## Audio System (REWRITTEN)

The `useAudio.js` composable was completely rewritten with a **state machine approach**:

### Two Audio States
- **STORM** - Heavy rain/thunder (`storm-heavy.mp3`) - plays everywhere except post-release
- **NATURE** - Peaceful sounds (`nature-peaceful.mp3`) - plays only on release screen after animation

### Key Functions
- `playStorm()` - Start storm if not already playing (no-op if already in STORM state)
- `playNature(duration)` - Fade in nature sounds
- `stopAll()` - Immediate stop all audio
- `fadeOutCurrent(duration)` - Returns promise, used for release transition
- `playOneShot(type, volume)` - One-time sound (thunder)
- `toggleMute()` - Toggle mute state

### Soundscape Journey
- **Title/Onboarding/Home/Write/Archive/Settings**: STORM plays continuously
- **Release animation**: STORM fades out → 1.5s silence → NATURE fades in
- **Exit app**: Sound stops immediately

### Audio Files
- `storm-heavy.mp3` - Heavy rain + thunder ambient
- `thunder-rumble.mp3` - Single thunder crack (one-shot)
- `nature-peaceful.mp3` - Birds, gentle breeze

**Removed:** `rain-light.mp3` (no longer needed)

---

## Rain Clearing System

The `BackgroundRain.vue` component uses a phase-based clearing system:

```javascript
// Phase 0: Normal storm (100% rain, lightning active)
// Phase 1: Slowing (60% rain)
// Phase 2: Sparse (30% rain)
// Phase 3: Fading out (10% rain, then stops)
```

State is shared via Vue's provide/inject from `App.vue`.

---

## Recent Changes (Session History)

### Latest Session (2026-02-02)
**Freemium Paywall Implementation**

1. **Usage tracking added to useLocalStorage.js**
   - New localStorage keys: `downpour_usage_count`, `downpour_unlocked`
   - `getUsageCount()` - returns current usage count
   - `incrementUsageCount()` - called after each release
   - `hasReachedLimit` - computed, true if count >= 7 and not unlocked
   - `isUnlocked` - computed, checks unlock status
   - `setUnlocked()` - marks app as unlocked (for billing callback)

2. **PaywallScreen.vue created**
   - Warm copy: "You've found something that helps."
   - Unlock button (placeholder for Google Play Billing)
   - "Browse your archive" and "Back to home" navigation
   - Mountain silhouettes, matches app aesthetic

3. **Paywall checks added**
   - HomeScreen.vue: "Let it fall away" redirects to paywall if limit reached
   - WriteScreen.vue: Redirects on mount and on release attempt if limit reached

4. **Router updated**
   - Added `/paywall` route

5. **Workflow documentation created**
   - CLAUDE.md - workflow orchestration rules
   - tasks/lessons.md - pattern tracking for self-improvement

### Previous Session (2026-01-30)
**UX Improvements: Clear All Data Relocation + Code Cleanup**

1. **"Clear All Data" moved from Settings to Archive** - Now in top-right of Archive header
   - Changed from trash icon to "Clear all" text button (clearer intent for destructive action)
   - Same confirmation modal with "Cancel" and "Clear" buttons
   - Navigates to home after clearing

2. **Removed verbose console.log statements from useAudio.js**
   - 23 debug log statements removed (chatty status updates)
   - 8 console.error statements kept (actual error reporting)
   - Cleaner browser console for production users

3. **Privacy policy created and hosted**
   - URL: https://gist.github.com/testdev-lar/c105e48d640c86f3f4eae5d050ebe412
   - Developer: Ascensciana, Contact: @ascensciana on X
   - Age requirement: 13+, No analytics, localStorage only

### Previous Session (2026-01-29)
**UX Improvements: Guide, Copy, Icon, Creator Link**

1. **"How to use Downpour" guide added** - `?` icon on home screen opens modal with:
   - "When to use it" - Describes emotional moments suited for the app
   - "What to do" - Simple instructions: write, release, close app
   - "The idea" - Not about tracking/analyzing, just releasing
   - "Your archive" - Saved locally, optional to revisit

2. **Onboarding copy revised** - Multiple iterations to sound less AI-written:
   - Changed "No analysis. No fixing. No judgment." → "There's nothing to solve here."
   - Changed "Your words dissolve from view" → "Your thoughts dissolve from view."
   - Changed archive line to "They're kept quietly in your archive. You can choose whether to revisit."
   - Changed "Just... let it out." → "Just...let it out." (no space after ellipsis)
   - Removed "Everything stays on your phone." and "This is release, not reflection."

3. **Full-bleed app icon** - Replaced all icons with new full-bleed design to fix icon not filling launcher space on S24

4. **Creator link in Settings** - Added "Connect with the creator" card linking to @ascensciana on X

5. **Domain updated** - Now using `downpour2.netlify.app`

6. **TWA version 6** - Bumped for icon and domain changes

### Previous Session (2026-01-27)
**TWA Packaging for Play Store**

1. **Bubblewrap TWA initialized** - Project configured for Android packaging
2. **Signing keystore created** - `android.keystore` generated for APK signing
3. **twa-manifest.json generated** with configuration:
   - Package ID: `app.downpour.twa`
   - Host: `downpour2.netlify.app`
   - Theme colors match dark stormy aesthetic (#1A1D23)
   - Portrait orientation
   - Min SDK 21 (Android 5.0+)
4. **APK built successfully** - Both APK and AAB generated
5. **Tested on Samsung S24** - App installs and runs

**Issues Found During Testing:**
- ~~URL bar showing at top of app~~ FIXED - digital asset links configured
- ~~App icon has white border~~ FIXED - full-bleed icon implemented
- TWA shares localStorage with Chrome (onboarding skipped if user visited site in Chrome before)

**Generated Files:**
- `android.keystore` - Signing key (KEEP SAFE - required for all future updates)
- `twa-manifest.json` - TWA configuration
- `app/` - Android project directory
- `app-release-signed.apk` - For testing
- `app-release-bundle.aab` - For Play Store submission

### Previous Session (2026-01-26)
**S24 Testing and UI Fixes**

1. **Settings icon updated** to minimalist gear/cog design
2. **Mountain silhouettes** added to all stormy screens (Title, Home, Write, Archive, Settings)
3. **Onboarding auto-advance** - selecting emotion on screen 4 auto-advances to screen 5
4. **Audio toggle fix** - now stops ALL sounds immediately including thunder one-shots
   - Added `oneShotSources` tracking array
   - `stopAll()` now iterates and stops all tracked one-shots
5. **Settings UI fixes**:
   - "Replay Tutorial" text alignment fixed
   - Top divider line now spans full width
6. **HomeScreen nav z-index** - fixed buttons not clickable over mountains

### Previous Session (2026-01-25)
**MAJOR: Complete Audio System Redesign**

1. **Rewrote useAudio.js with state machine approach**:
   - Two states: STORM and NATURE (removed complex multi-track logic)
   - Storm plays continuously across all screens except post-release
   - Nature sounds fade in after release animation
   - Simplified API: playStorm(), playNature(), stopAll(), fadeOutCurrent()
   - Fixed all 12 previously identified audio bugs

2. **Updated all screen components**:
   - TitleScreen: Calls playStorm() on mount, removed circular icon
   - HomeScreen: Simplified to playStorm() (no-op if already playing)
   - ArchiveScreen: Removed fadeToSound calls - storm continues
   - SettingsScreen: Simplified toggle - stopAll() on mute, playStorm() on unmute
   - ReleaseScreen: New audio timeline, changed "Return" to "Continue with your day"

3. **Updated OnboardingScreen**:
   - Removed sound toggle screen (screen 4)
   - Now 5 screens instead of 6
   - Storm plays throughout onboarding

4. **Cleanup**:
   - Deleted rain-light.mp3 (no longer needed)
   - Removed unused audio functions

### Previous Session (2026-01-24)
1. Comprehensive documentation system (ROADMAP.md, CLAUDE_HANDOFF.md)
2. Audio system bug analysis (12 bugs identified - now fixed)
3. Feature discovery and documentation

### Earlier Sessions
- Onboarding overhaul (6 screens with interactive demos)
- Haptic feedback system
- Daily writing prompts (10 variations)
- Bird animation on release
- Lightning/thunder effects
- Smooth gradient transitions

---

## Implemented Features

### Core Experience
- Minimalist emotional release journaling
- 280-character write limit
- 8 emotion tags: Anxious, Overwhelmed, Frustrated, Sad, Lonely, Exhausted, Angry, Restless
- Animated release sequence (text dissolves, sky clears)
- State machine audio system (STORM/NATURE)
- Lightning and thunder effects during storm
- Bird animations during release
- Writing prompts (10 variations, session-based rotation)

### Onboarding & UX
- 5-screen onboarding (text screens, emotion selector, first write)
- Haptic feedback on all interactions
- Smooth gradient sky transitions
- Individual entry deletion with confirmation modal
- Entry count display ("X thoughts released")
- "Continue with your day" exit button on release screen

### Data & Settings
- localStorage persistence: `downpour_entries`, `downpour_settings`
- sessionStorage for prompts: `downpour_current_prompt`
- Archive (Puddle) with expandable entries
- Sound toggle in settings
- Clear all data option
- Replay tutorial option

### Features NOT Wanted (Confirmed)
- Heavy Mode (600 chars)
- Gentle stats display
- Emotion filtering in archive
- Sound toggle in onboarding

---

## Remaining Launch Blockers

### P0 - COMPLETE
All P0 items done:
- ~~Settings icon~~ DONE (gear/cog design)
- ~~S24 testing~~ DONE (basic functionality verified)

### P1 - Play Store Deployment
1. ~~Deploy PWA to public URL~~ DONE (downpour2.netlify.app)
2. ~~TWA packaging with Bubblewrap~~ DONE (APK/AAB built, version 6)
3. ~~Configure digital asset links~~ DONE (URL bar hidden)
4. ~~Test APK on Samsung S24~~ DONE
5. ~~Privacy policy hosting~~ DONE (https://gist.github.com/testdev-lar/c105e48d640c86f3f4eae5d050ebe412)
6. ~~Implement freemium paywall~~ DONE (UI complete, billing placeholder)
7. Integrate Google Play Billing
8. Rebuild APK after billing implementation
9. Screenshots on S24
10. Play Store listing and submission

**Note:** Launch delayed until after Feb 9 (Netlify free tier credits exceeded)

---

## Freemium Model (IMPLEMENTED)

### Pricing
- **7 free releases** then paywall
- **$6.99 USD one-time** lifetime unlock (Google Play Billing)

### Paywall UX (Live at `/paywall`)
When user hits 7 uses, PaywallScreen shows:

> **"You've found something that helps."**
>
> You've released 7 storms. That means Downpour is working for you.
>
> Unlock unlimited releases for just $6.99 — yours forever.
>
> **[Unlock Downpour - $6.99]**
>
> *One-time purchase. No subscriptions.*

**What's blocked:** Writing new entries, release ritual
**What's still accessible:** Archive (browse past releases), Settings

### Implementation Status
| File | Status |
|------|--------|
| `src/composables/useLocalStorage.js` | DONE - usage counter + unlock tracking |
| `src/views/WriteScreen.vue` | DONE - redirects to paywall |
| `src/views/HomeScreen.vue` | DONE - redirects to paywall |
| `src/views/PaywallScreen.vue` | DONE - paywall UI (placeholder unlock button) |
| `src/router.js` | DONE - /paywall route added |

### Remaining: Google Play Billing
- `setUnlocked()` ready to call after successful purchase
- Need to integrate Play Billing Library
- Need to set up Product ID in Play Console

---

## Marketing Plan

### Brand Voice
- Warm & supportive + Minimal & calm
- Weather metaphors encouraged
- Avoid therapy-speak ("self-care journey", "mental wellness toolkit")
- Avoid tech jargon ("PWA", "cloud-free", "encrypted locally")
- Keep it human and conversational

### Play Store Listing

**App Name:** Downpour: Let It Go (or just "Downpour")

**Short Description (80 chars):**
> Write what weighs you down. Watch it dissolve. Find closure.

**Full Description:**
```
Some thoughts are too heavy to carry.

Downpour is a simple ritual for letting go. Write what's weighing you down — anxiety, frustration, overwhelm, whatever's storming in your mind. Then release it. Watch your words dissolve into rain. Feel the storm clear.

No journals to maintain. No streaks to keep. No stats to analyze. Just write, release, and move on with your day.

HOW IT WORKS
• Write what's on your mind (up to 280 characters)
• Tag your emotion — anxious, overwhelmed, frustrated, sad, lonely, exhausted, angry, restless
• Press release and watch your words wash away
• The storm clears. Birds sing. You breathe.

YOUR PRIVATE STORM
Everything stays on your device. No accounts. No cloud. No one reads your words but you. They exist only long enough to be released.

DESIGNED FOR CLOSURE
Most journaling apps want you to reflect, revisit, analyze. Downpour is different. This is about letting go, not holding on. Write it. Release it. It's done.

THE RITUAL
Rain falls. Thunder rumbles. You pour out your thoughts. Then — silence. The storm passes. Peaceful sounds emerge. The ritual is complete.

---

Try 7 releases free. If it helps, unlock unlimited releases for $6.99 (one-time, lifetime access).

Made with care by Ascensciana.
```

**Keywords:** journaling app, anxiety relief, emotional release, mental wellness, stress relief, private journal, mood tracker, mindfulness, calm app, let it go

### Screenshot Copy (5 Screenshots)
1. **"Let it out."** - Title screen with rain
2. **"Pour out what's heavy."** - Write screen with emotion tags
3. **"Watch it dissolve."** - Release animation mid-flow
4. **"The storm clears."** - Cleared sky, peaceful state
5. **"Your private archive."** - Archive screen

### Landing Pages (To Create)

**Downpour Landing Page** (Carrd.co free tier)
- Hero: "Some thoughts are too heavy to carry."
- The Ritual: Write → Release → Breathe
- Why Downpour: No pressure, Truly private, Designed for closure
- App preview screenshots
- Download button + link to Ascensciana

**Ascensciana Landing Page** (Carrd.co)
- "Beautiful, digitalized rituals."
- Projects: Downpour (first app)
- About: Brief personal intro
- Connect: @ascensciana on X

### Pre-Launch Marketing (Free)
- Set up @ascensciana on X
- Draft launch tweet thread (5-7 tweets)
- Join communities: r/androidapps, r/journaling, r/anxiety
- Prepare Product Hunt listing

### Launch Week
- Post launch thread on X
- Submit to Product Hunt
- Post in Reddit communities (genuine, not spammy)
- Personal IG story

---

## File Structure

```
src/
├── App.vue                 # Root, rain clearing provider
├── main.js                 # App entry point
├── router.js               # Route definitions
├── style.css               # Global styles, Tailwind imports
├── components/
│   └── BackgroundRain.vue  # Rain canvas + lightning
├── composables/
│   ├── useAudio.js         # State machine audio (STORM/NATURE)
│   ├── useHaptics.js       # Haptic feedback
│   └── useLocalStorage.js  # Entry persistence
└── views/
    ├── TitleScreen.vue      # Landing page (no icon)
    ├── OnboardingScreen.vue # 5-screen tutorial
    ├── HomeScreen.vue       # Main app entry
    ├── WriteScreen.vue      # Writing interface
    ├── ReleaseScreen.vue    # Release sequence + exit button
    ├── ArchiveScreen.vue    # Past entries (puddle), clear all button
    └── SettingsScreen.vue   # Sound, tutorial, creator link

public/
├── audio/
│   ├── storm-heavy.mp3
│   ├── thunder-rumble.mp3
│   └── nature-peaceful.mp3
└── ... (icons, manifest)
```

---

## Design Philosophy

- **Minimalist** - Clean, uncluttered UI
- **Atmospheric** - Rain, storms, clearing skies create emotional resonance
- **No gamification pressure** - No aggressive streaks, notifications, or guilt
- **Privacy-first** - All data stays on device (localStorage)
- **Smooth transitions** - Everything fades, nothing jarring
- **Ritual completion** - "Continue with your day" exits app after release

---

## Running the App

```bash
npm install
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

---

## GitHub Repository

https://github.com/testdev-lar/downpourphone

**Branch:** main

---

## Claude Workflow Rules

### Orchestration
- **Plan mode default** - Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- **Stop and re-plan** - If something goes sideways, STOP and re-plan immediately
- **Subagent strategy** - Offload research/exploration to subagents to keep main context clean
- **One task per subagent** - For focused execution

### Self-Improvement
- After ANY correction: update `tasks/lessons.md` with the pattern
- Write rules to prevent the same mistake
- Review lessons at session start

### Verification
- Never mark a task complete without proving it works
- Ask: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### Task Management
1. Write plan to `ROADMAP.md` with checkable items
2. Check in before starting implementation
3. Mark items complete as you go
4. Update `tasks/lessons.md` after corrections

### Core Principles
- **Simplicity First** - Make every change as simple as possible
- **No Laziness** - Find root causes, no temporary fixes
- **Minimal Impact** - Changes should only touch what's necessary

---

## Notes for Claude

- User prefers **quick fixes over lengthy explanations**
- User wants **no emojis** unless requested
- All data is in **localStorage** - keys are `downpour_entries`, `downpour_settings`, `downpour_usage_count`, `downpour_unlocked`
- Current prompts in **sessionStorage** - key is `downpour_current_prompt`
- The audio system is a **state machine singleton** - STORM or NATURE state
- Storm continues seamlessly across screen transitions (no restart)
- The haptic system is a **composable** - import and use `triggerHaptic(type)` for feedback
- Writing prompts rotate **after each release** - 10 variations stored in sessionStorage
- Entry deletion uses **`deleteEntry(id)`** from useLocalStorage.js
- Main development branch is **`main`**
- Working directory is **`C:\Users\bayle\Desktop\Downpour Round 2 - Claude Code`**
- Target deployment: **Google Play Store** via TWA (Trusted Web Activity)
- Testing device: **Samsung S24**
