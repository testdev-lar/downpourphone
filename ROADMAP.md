# Downpour PWA - Development Roadmap

**Last Updated:** 2026-01-25

## Quick Reference

| Item | Value |
|------|-------|
| **Project** | Downpour - Emotional Release Journaling PWA |
| **Target** | Google Play Store deployment |
| **Branch** | optimistic-bardeen (main development) |
| **Tech Stack** | Vue 3 + Vite + Tailwind + Web Audio API |
| **Data Storage** | localStorage (no backend) |
| **Testing Device** | Samsung S24 |

---

## Current State

### What's Working
- Core journaling flow (Write -> Release -> Archive)
- 280-character write limit with 8 emotion tags
- Writing prompts (10 variations, session-based rotation)
- Individual entry deletion with confirmation modal
- Entry count display ("X thoughts released")
- **NEW: State machine audio system (STORM/NATURE)**
- Animated release sequence (text dissolution + sky clearing)
- 5-screen onboarding tutorial (sound toggle removed)
- Haptic feedback across all interactions
- PWA manifest and service worker configured
- "Continue with your day" exit button on release screen

### What's Fixed (This Session)
- All 12 audio bugs from previous session
- Audio now uses simple state machine (STORM or NATURE)
- Storm plays continuously across screen transitions
- Nature fades in after release with proper timing
- Sound toggle works correctly
- Removed unused rain-light.mp3

### What's Next
1. Update settings icon to minimalist gear/cog design (P0)
2. Test on Samsung S24 - verify PWA installation, audio, haptics (P0)
3. Deploy PWA to public URL (P1)
4. TWA packaging with Bubblewrap (P1)
5. Play Store submission (P1)

---

## Feature Inventory

### Implemented

**Core Journaling:**
- 280-character write limit
- 8 emotion tags: Anxious, Overwhelmed, Frustrated, Sad, Lonely, Exhausted, Angry, Restless
- Writing prompts: 10 variations stored in sessionStorage, rotates after each release
- Release animation: Text dissolution with blur/scale + sky clearing gradient
- Entry persistence: localStorage with save/load/delete

**Audio & Atmosphere:**
- State machine audio: STORM and NATURE states
- Audio files: storm-heavy.mp3, thunder-rumble.mp3, nature-peaceful.mp3
- Soundscape: Storm (all screens) -> Nature (post-release)
- Lightning effects: Random flashes every 5-12s, triggers thunder
- Phase-based rain: Normal (100%) -> Slowing (60%) -> Sparse (30%) -> Fading (10%)
- Sound toggle in settings (immediate on/off)

**Archive (Puddle):**
- Expandable entry cards
- Individual deletion with confirmation modal + feedback message
- Entry count: "1 thought released" or "X thoughts released"
- Emotion tag display with accent colors
- Date/time stamps
- Sorted by newest first

**Onboarding & UX:**
- 5-screen tutorial: Text screens (0-3), emotion selector (4), first write (5)
- Haptic feedback: light (10ms), medium (20ms), heavy (30ms)
- Smooth sky transitions via color interpolation
- Bird animations during release
- "Continue with your day" exit button

**Data & Persistence:**
- localStorage: `downpour_entries`, `downpour_settings`
- sessionStorage: `downpour_current_prompt`
- Entry structure: `{ id, text, emotion, timestamp, date }`

### Not Wanted
- Heavy Mode (600 chars)
- Gentle stats display
- Emotion filtering in archive
- Sound toggle in onboarding

### Remaining P0 (Launch Blockers)

#### 1. Settings Icon Update
**Needed:** Minimalist gear/cog SVG icon
**File:** src/views/HomeScreen.vue

#### 2. Test on Samsung S24
**Verify:**
- PWA installation works
- Audio plays correctly (storm, nature, thunder)
- Haptic feedback works
- "Continue with your day" exits app (in TWA)
- Offline mode works
- localStorage persists

---

## Audio System (Redesigned)

The audio system was completely rewritten with a state machine approach:

### States
- `STORM` - Heavy rain ambient, plays everywhere except post-release
- `NATURE` - Peaceful sounds, plays on release screen after animation
- `SILENT` - No audio (muted or stopped)

### API
```javascript
const { playStorm, playNature, stopAll, fadeOutCurrent, playOneShot, toggleMute, isMuted } = useAudio()

playStorm()           // Start storm (no-op if already playing)
playNature(2000)      // Fade in nature over 2 seconds
stopAll()             // Immediate stop
fadeOutCurrent(2000)  // Fade out current audio, returns promise
playOneShot('thunder', 0.5)  // One-shot sound
toggleMute()          // Toggle mute state
```

### Screen Audio Behavior
| Screen | Audio |
|--------|-------|
| Title | playStorm() on mount |
| Onboarding | Storm continues |
| Home | playStorm() (no-op if already playing) |
| Write | Storm continues |
| Release | fadeOutCurrent() -> 1.5s silence -> playNature() |
| Archive | Storm continues |
| Settings | toggleMute() controls sound |

### Release Timeline
```
0ms:     User presses "Release"
500ms:   Storm begins fading out (2000ms fade)
2500ms:  Storm silent
4000ms:  Nature begins fading in (2000ms fade)
6000ms:  Nature at full volume, loops indefinitely
Exit:    stopAll() immediately
```

---

## Google Play Store Deployment Guide

### Prerequisites
- [x] Node.js installed
- [x] Samsung S24 for testing
- [ ] JDK 11+ for signing APK
- [ ] Google Play Developer account ($25 one-time)
- [x] Audio bugs fixed
- [ ] Settings icon updated
- [ ] S24 testing complete

### Step 1: Install Bubblewrap
```bash
npm install -g @bubblewrap/cli
```

### Step 2: Deploy PWA to Public URL
Choose hosting: Netlify, Vercel, Firebase Hosting
- Deploy current build
- Get production URL
- Verify PWA works at URL

### Step 3: Initialize TWA
```bash
bubblewrap init --manifest https://your-deployed-url.com/manifest.webmanifest
```

### Step 4: Build and Sign APK
```bash
bubblewrap build
```

### Step 5: Test on S24
```bash
adb install downpour-release.apk
```

### Step 6: Create Play Store Assets
- Screenshots (8 recommended): 1080x2400
- Feature Graphic: 1024x500
- App Icon: 512x512 PNG

### Step 7: Upload to Play Console
1. Create developer account ($25)
2. Create new app
3. Fill store listing
4. Upload APK
5. Submit for review

---

## Development Workflow

### Starting New Session
1. Read this ROADMAP.md
2. Check git status, verify app runs: `npm run dev`
3. Identify next priority from "What's Next"
4. Confirm approach with user

### After Major Changes
1. Update ROADMAP.md (current state, completed features)
2. Update CLAUDE_HANDOFF.md (recent changes, technical details)
3. Git commit with descriptive message

### Commit Guidelines
Format: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
Include: `Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>`

---

## Priority Levels

**P0 - Blocking:**
1. ~~Fix audio bugs~~ DONE
2. ~~Add "Continue with the day" exit button~~ DONE
3. Update settings icon
4. Test on S24

**P1 - Launch:**
1. Deploy PWA to public URL
2. TWA packaging (Bubblewrap)
3. Privacy policy hosting
4. Screenshots on S24
5. Play Store submission

**P2 - Post-Launch:**
- Export functionality
- Additional soundscapes
- Accessibility improvements

---

## File Reference

**Audio:**
- src/composables/useAudio.js (state machine: STORM/NATURE)

**Screens:**
- src/views/TitleScreen.vue (no icon, playStorm on mount)
- src/views/OnboardingScreen.vue (5 screens, no sound toggle)
- src/views/ReleaseScreen.vue ("Continue with your day" button)
- src/views/HomeScreen.vue (settings icon needs update)

**Data:**
- src/composables/useLocalStorage.js
- localStorage: `downpour_entries`, `downpour_settings`
- sessionStorage: `downpour_current_prompt`

**Config:**
- vite.config.js (PWA manifest, service worker)

---

## Notes

- User prefers quick fixes over lengthy explanations
- No emojis unless requested
- Minimalist aesthetic - no clutter
- Privacy-first - all data stays on device
- No gamification pressure
- Sound is critical to release ritual
- Mobile-first - target Android/Samsung S24

---

**For technical architecture details, see CLAUDE_HANDOFF.md**
