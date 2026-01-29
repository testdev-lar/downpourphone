# Downpour - Claude Handoff Document

## What is Downpour?

Downpour is a **minimalist emotional release journaling PWA** (Progressive Web App). The concept: users write what's weighing on them, then "release" it - watching their words dissolve while the stormy sky clears to sunshine, accompanied by a soundscape transition from heavy rain to peaceful nature sounds.

**Target:** Google Play Store release as a PWA.

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
3. **HomeScreen.vue** - Main page with "Let it fall away" button, links to Archive and Settings
4. **WriteScreen.vue** - Textarea for writing (280 char limit), emotion tags, "Release" button
5. **ReleaseScreen.vue** - Animated sequence: text dissolves, sky clears, "Continue with your day" button exits app
6. **ArchiveScreen.vue** - "Puddle" - list of past entries, expandable cards
7. **SettingsScreen.vue** - Sound toggle, replay tutorial, clear all data

---

## Key Files

| File | Purpose |
|------|---------|
| `src/App.vue` | Root component, provides rain clearing state, handles lightning→thunder |
| `src/components/BackgroundRain.vue` | Canvas-based rain animation, lightning flashes, 4 clearing phases |
| `src/composables/useAudio.js` | **REWRITTEN** - State machine audio (STORM/NATURE), singleton pattern |
| `src/composables/useHaptics.js` | Haptic feedback system - light (10ms), medium (20ms), heavy (30ms) |
| `src/composables/useLocalStorage.js` | Entry storage - save, load, deleteEntry(id), clear |
| `src/router.js` | Vue Router configuration |
| `src/views/*.vue` | All screen components |
| `public/audio/` | Audio files: storm-heavy.mp3, thunder-rumble.mp3, nature-peaceful.mp3 |
| `vite.config.js` | PWA manifest, service worker, workbox config |

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

### Latest Session (2026-01-27)
**TWA Packaging for Play Store**

1. **Bubblewrap TWA initialized** - Project configured for Android packaging
2. **Signing keystore created** - `android.keystore` generated for APK signing
3. **twa-manifest.json generated** with configuration:
   - Package ID: `app.downpour.twa`
   - Host: `downpour.netlify.app`
   - Theme colors match dark stormy aesthetic (#1A1D23)
   - Portrait orientation
   - Min SDK 21 (Android 5.0+)
4. **APK built successfully** - Both APK and AAB generated
5. **Tested on Samsung S24** - App installs and runs

**Issues Found During Testing:**
- URL bar showing at top of app (needs digital asset links)
- App icon has white border (needs solid background color instead of transparent)
- TWA shares localStorage with Chrome (onboarding skipped if user visited site in Chrome before)

**Generated Files:**
- `android.keystore` - Signing key (KEEP SAFE - required for all future updates)
- `twa-manifest.json` - TWA configuration
- `app/` - Android project directory
- `app-release-signed.apk` - For testing
- `app-release-bundle.aab` - For Play Store submission

**Next Steps:**
1. Configure digital asset links (to hide URL bar)
2. Update app icon with solid #1A1D23 background
3. Rebuild APK
4. Prepare Play Store assets

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
1. ~~Deploy PWA to public URL~~ DONE (downpour.netlify.app)
2. **TWA packaging with Bubblewrap** ← IN PROGRESS (APK building)
3. Configure digital asset links
4. Test APK on Samsung S24
5. Privacy policy hosting
6. Screenshots on S24
7. Play Store listing and submission

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
    ├── ArchiveScreen.vue    # Past entries (puddle)
    └── SettingsScreen.vue   # Sound, tutorial, clear data

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

**Branch:** optimistic-bardeen (main development)

---

## Notes for Claude

- User prefers **quick fixes over lengthy explanations**
- User wants **no emojis** unless requested
- All data is in **localStorage** - keys are `downpour_entries` and `downpour_settings`
- Current prompts in **sessionStorage** - key is `downpour_current_prompt`
- The audio system is a **state machine singleton** - STORM or NATURE state
- Storm continues seamlessly across screen transitions (no restart)
- The haptic system is a **composable** - import and use `triggerHaptic(type)` for feedback
- Writing prompts rotate **after each release** - 10 variations stored in sessionStorage
- Entry deletion uses **`deleteEntry(id)`** from useLocalStorage.js
- Main development branch is **`optimistic-bardeen`**
- Working directory is **`C:\Users\bayle\Desktop\Downpour Round 2 - Claude Code`**
- Target deployment: **Google Play Store** via TWA (Trusted Web Activity)
- Testing device: **Samsung S24**
