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
Home Screen → Write Screen → Release Screen → Home Screen
     ↓
  Archive (Puddle)
     ↓
  Settings
```

### Screens

1. **TitleScreen.vue** - Landing page with Downpour logo and "Begin" button (triggers light rain, navigates to onboarding)
2. **OnboardingScreen.vue** - First-time user tutorial (6 screens)
3. **HomeScreen.vue** - Main page with "Let it fall away" button, links to Archive and Settings
4. **WriteScreen.vue** - Textarea for writing (280 char limit), emotion tags, "Release" button
5. **ReleaseScreen.vue** - Animated sequence: text dissolves, sky clears (gradient interpolation), rain stops, "Breathe. The sky clears." message appears
6. **ArchiveScreen.vue** - "Puddle" - list of past entries, expandable cards
7. **SettingsScreen.vue** - Sound toggle, replay tutorial, clear all data

---

## Key Files

| File | Purpose |
|------|---------|
| `src/App.vue` | Root component, provides rain clearing state, handles lightning→thunder |
| `src/components/BackgroundRain.vue` | Canvas-based rain animation, lightning flashes, 4 clearing phases |
| `src/composables/useAudio.js` | **HAS 12 CRITICAL BUGS** - Singleton audio system, multi-track, crossfade, one-shots |
| `src/composables/useHaptics.js` | Haptic feedback system - light (10ms), medium (20ms), heavy (30ms) |
| `src/composables/useLocalStorage.js` | Entry storage - save, load, **deleteEntry(id)**, clear |
| `src/router.js` | Vue Router configuration |
| `src/views/TitleScreen.vue` | Landing page with "Begin" button |
| `src/views/OnboardingScreen.vue` | 6-screen tutorial |
| `src/views/HomeScreen.vue` | Main page, "Let it fall away" button |
| `src/views/WriteScreen.vue` | **10 rotating prompts** (lines 104-134), emotion tags, 280 char limit |
| `src/views/ReleaseScreen.vue` | **10+ setTimeout cleanup needed** (lines 203-273), animated sequence |
| `src/views/ArchiveScreen.vue` | **Entry deletion** (lines 59-67, 92-120), entry count (line 154) |
| `src/views/SettingsScreen.vue` | Sound toggle, replay tutorial, clear all data |
| `public/audio/` | Audio files: storm-heavy.mp3, thunder-rumble.mp3, nature-peaceful.mp3, rain-light.mp3 |
| `vite.config.js` | PWA manifest, service worker, workbox config |

---

## Audio System

The `useAudio.js` composable manages all sound:

- **Singleton pattern** - shared state across components
- **Multi-track support** - multiple sounds can play simultaneously
- **Key functions:**
  - `playAmbient(type, volume)` - looping background sound
  - `playOneShot(type, volume)` - one-time sound (thunder)
  - `fadeInSound(type, duration, volume)` - gradual fade in
  - `fadeOutSound(type, duration)` - gradual fade out
  - `crossfade(from, to, duration)` - smooth transition between tracks
  - `stopSound()` - stop all sounds

**Audio files:**
- `storm-heavy.mp3` - Heavy rain + thunder ambient
- `thunder-rumble.mp3` - Single thunder crack
- `nature-peaceful.mp3` - Birds, gentle breeze
- `rain-light.mp3` - Light rain (used in archive)

**Soundscape journey:**
- Home/Write: Storm sound
- Release: Storm fades out → Nature fades in
- Return home: Nature crossfades back to storm

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

### Latest Session (2026-01-24)
1. **Comprehensive documentation system**:
   - Created ROADMAP.md - Primary reference for session starts with complete feature inventory
   - Updated CLAUDE_HANDOFF.md with current implementation state
   - Added TWA deployment step-by-step guide with troubleshooting
   - Included Play Store privacy policy template
   - Documented all 12 audio bugs with detailed analysis

2. **Feature discovery and documentation**:
   - Confirmed individual entry deletion is implemented (ArchiveScreen.vue lines 59-67, 92-120)
   - Confirmed writing prompts system is implemented (WriteScreen.vue lines 104-134)
   - Confirmed entry count display (ArchiveScreen.vue line 154)
   - Identified "Continue with the day" exit button as P0 requirement

3. **Audio system comprehensive analysis**:
   - Identified 12 bugs in useAudio.js and ReleaseScreen.vue
   - User-reported symptoms: heavy rain persists after release, sound toggle inconsistent
   - Prioritized fixes: memory leaks → race conditions → error handling

### Previous Session (2026-01-23)
1. **Onboarding overhaul** - Complete redesign to 6-screen journey:
   - Screen 1: Welcome - "Your thoughts deserve room to breathe"
   - Screen 2: Write - Interactive 280-char demo with emotion tags
   - Screen 3: Release - Animated sky clearing demonstration
   - Screen 4: Sound - Audio toggle with storm/nature preview
   - Screen 5: Archive - Puddle metaphor explanation
   - Screen 6: Privacy - localStorage explanation, "Begin" button
   - Removed all icons, text-focused, poetic language
   - Added interactive feature demonstrations
2. **Haptic feedback system** - New `useHaptics.js` composable:
   - Light taps for button presses
   - Medium impact for emotion selection
   - Heavy impact for release action
   - Works across all user interactions
3. **Daily writing prompts** - 10 variations on WriteScreen placeholder:
   - Session-based rotation (changes each write session)
   - Prompts like "What's taking up space in your mind?", "What would you rather not carry today?"
4. **Bird animation on release** - Subtle bird silhouettes fly across during sky clearing

### Earlier Session
1. **Lightning effect** - Random flashes every 5-12s during phase 0, triggers thunder sound
2. **Smooth gradient transitions** - Sky color interpolation instead of class switching
3. **Multi-track audio** - Complete rewrite of audio system
4. **Sound transitions** - Storm fades out gradually, nature fades in
5. **UI updates** - Button text "Let it fall away", fixed text positioning on release screen

---

## Implemented Features ✓

### Core Experience
- ✓ Minimalist emotional release journaling
- ✓ 280-character write limit (single mode - Heavy Mode not wanted)
- ✓ 8 emotion tags: Anxious, Overwhelmed, Frustrated, Sad, Lonely, Exhausted, Angry, Restless
- ✓ Animated release sequence (text dissolves, sky clears)
- ✓ Multi-track audio system with soundscape transitions (HAS BUGS - see Known Issues)
- ✓ Lightning and thunder effects during storm
- ✓ Bird animations during release
- ✓ Writing prompts (10 variations, session-based rotation via sessionStorage)

### Onboarding & UX
- ✓ 6-screen onboarding with interactive demos
- ✓ Haptic feedback on all interactions (light/medium/heavy)
- ✓ Smooth gradient sky transitions (color interpolation)
- ✓ Individual entry deletion with confirmation modal
- ✓ Entry count display ("X thoughts released")

### Data & Settings
- ✓ localStorage persistence (no backend): `downpour_entries`, `downpour_settings`
- ✓ sessionStorage for prompts: `downpour_current_prompt`
- ✓ Archive (Puddle) with expandable entries
- ✓ Individual entry deletion (trash icon → confirmation → feedback message)
- ✓ Sound toggle in settings (HAS BUGS - see Known Issues)
- ✓ Clear all data option
- ✓ Replay tutorial option

### Features NOT Wanted (Confirmed)
- Heavy Mode (600 chars) - keeping single 280-char mode
- Gentle stats display - no analytics/tracking
- Emotion filtering in archive - simple chronological list preferred

## Known Issues

### CRITICAL: Audio System Bugs (Blocking Launch)

**User-reported symptoms:**
- Heavy rain continues playing during/after release transition (should fade out completely)
- Nature sounds don't fade in properly after release
- Sound toggle (on/off) doesn't work consistently across sessions

**Root cause - 12 technical bugs identified in useAudio.js and ReleaseScreen.vue:**

#### CRITICAL Severity (Must Fix First)

1. **fadeToSound() Race Condition** (useAudio.js lines 259-271)
   - Problem: Fades out sounds for 1000ms but starts new sound after only 500ms
   - Impact: Multiple sounds play simultaneously - heavy rain overlaps with nature sounds during release
   - Solution: Await fade completion before starting new sound
   - Affected: HomeScreen, TitleScreen, ArchiveScreen, SettingsScreen, OnboardingScreen

2. **Memory Leak in fadeOutSound()** (useAudio.js lines 156-182)
   - Problem: setInterval() created but not stored/tracked for cleanup
   - Impact: Orphaned intervals drain memory and battery on rapid screen transitions
   - Solution: Store interval IDs in array, expose cleanup function, clear in onUnmounted()

3. **Memory Leak in fadeInSound()** (useAudio.js lines 185-230)
   - Problem: Same as #2 - setInterval() not tracked
   - Impact: Orphaned intervals if component unmounts before fade completes
   - Solution: Same as #2

4. **Crossfade Race Condition** (useAudio.js lines 233-236)
   - Problem: fadeOut and fadeIn run simultaneously without synchronization
   - Impact: Both sounds play together at different volumes for entire crossfade duration
   - Solution: Implement proper crossfade timing where fade-in peaks as fade-out reaches zero

5. **ReleaseScreen Missing Cleanup** (ReleaseScreen.vue lines 203-273)
   - Problem: 10+ setTimeout calls in startClearingSequence() not cleared on unmount
   - Impact: Timers trigger audio state changes on unmounted component, multiple sequences overlap
   - Solution: Store all setTimeout IDs in array, clear in onUnmounted()

6. **AudioContext Resume State Management** (useAudio.js lines 85-92, 121-128, 188-195)
   - Problem: Multiple functions call resume() without state validation
   - Impact: Silent failures, no user feedback if audio fails to initialize
   - Solution: Centralize state management, validate before operations

#### MEDIUM/LOW Severity

7. **Disconnection Order in playOneShot()** (useAudio.js lines 146-149)
   - Impact: May cause audio pops when sounds end

8. **Mobile Autoplay Policy Not Handled** (useAudio.js lines 30-39)
   - Impact: First audio playback fails silently on mobile (iOS Safari requires explicit user interaction)

9. **stopSound() Doesn't Handle Fading Sounds** (useAudio.js lines 252-256)
   - Impact: Abrupt audio cuts instead of smooth fades when toggling sound

10. **Audio Buffer Failures Not Cached** (useAudio.js lines 61-79)
    - Impact: Failed audio loads retry endlessly, wasting bandwidth

11. **Missing Null Checks in Volume Calculations** (useAudio.js lines 156-182)
    - Impact: Could crash if activeSounds is corrupted

12. **No Volume Bounds Validation** (throughout useAudio.js)
    - Impact: Could theoretically set invalid volumes (negative or > 1)

**Priority:** Fix bugs #1-6 first (CRITICAL), then #7-12 (MEDIUM/LOW)

**See ROADMAP.md for detailed analysis of each bug with code examples.**

---

### Other Launch Blockers

1. **"Continue with the day" Exit Button Missing**
   - Current: ReleaseScreen has "Return" button that navigates to /home
   - Needed: Button that exits/minimizes app (completes release ritual)
   - File: src/views/ReleaseScreen.vue line 282-292

2. **Settings Icon Visual Update**
   - Needed: Minimalist gear/cog SVG icon matching aesthetic
   - File: src/views/HomeScreen.vue (verify location)
   - Problem: `loadMutedState()` returns `!settings.soundEnabled` (backwards)
   - Impact: Settings toggle randomly inverts on page reload
   - Solution: Fix boolean logic or use `settings.isMuted`

3. **No audio cleanup on navigation**
   - Location: All views, especially `ReleaseScreen.vue`
   - Problem: 17 timeouts/intervals in ReleaseScreen never cleaned up
   - Impact: Memory leaks, orphaned audio intervals, console errors
   - Solution: Store interval/timeout IDs, clear in `onUnmounted()` hooks

4. **Crossfade race conditions**
   - Location: `src/views/ReleaseScreen.vue` lines 289-291
   - Problem: Multiple overlapping fade intervals conflict during rapid navigation
   - Impact: Audio stuttering and glitches
   - Solution: Implement abort controller pattern, cancel active fades before starting new ones

5. **Audio context ready state not properly awaited**
   - Location: `src/composables/useAudio.js` line 35
   - Problem: `isReady` flag set before context actually running
   - Impact: Audio may not play even though code thinks it's ready
   - Solution: `await audioContext.resume()` and verify `state === 'running'`

6. **No error handling for failed audio loads**
   - Location: `src/composables/useAudio.js` lines 64-78
   - Problem: Silent failures when audio files don't load
   - Impact: App appears broken with no user feedback
   - Solution: User-friendly error, retry mechanism, graceful fallback

## Planned Features

See `ROADMAP.md` for comprehensive prioritized task list and step-by-step deployment guide.

### P0 - Launch Blockers (Must Fix Before Play Store)
1. **Fix all 12 audio bugs** - See Known Issues section above
2. **Add "Continue with the day" exit button** - ReleaseScreen needs app exit behavior
3. **Update settings icon** - Minimalist gear/cog SVG
4. **Test on Samsung S24** - Verify PWA installation, audio, haptics on real device

### P1 - Play Store Deployment Requirements
1. Deploy PWA to public URL (Netlify/Vercel/Firebase)
2. TWA packaging with Bubblewrap
3. Privacy policy hosting (GitHub Pages or separate site)
4. Screenshots on S24 (8 recommended)
5. Create Google Play Developer account ($25 one-time fee)
6. Complete Play Store listing
7. Submit for review

### P2 - Post-Launch (v1.1+)
- Export/backup functionality
- Additional soundscapes (ocean waves, campfire, café ambience)
- Accessibility improvements (screen reader support, high contrast)
- Weekly reflection prompts
- Dark/light theme toggle

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
│   ├── useAudio.js         # Audio singleton (HAS CRITICAL BUGS - see Known Issues)
│   ├── useHaptics.js       # Haptic feedback
│   └── useLocalStorage.js  # Entry persistence
└── views/
    ├── TitleScreen.vue      # Landing page (root route "/")
    ├── OnboardingScreen.vue # 6-screen tutorial
    ├── HomeScreen.vue       # Main app entry
    ├── WriteScreen.vue      # Writing interface
    ├── ReleaseScreen.vue    # Animated release sequence
    ├── ArchiveScreen.vue    # Past entries (puddle)
    └── SettingsScreen.vue   # Sound, tutorial, clear data

public/
├── audio/
│   ├── storm-heavy.mp3
│   ├── thunder-rumble.mp3
│   ├── nature-peaceful.mp3
│   └── rain-light.mp3
└── ... (icons, manifest)
```

---

## Design Philosophy

- **Minimalist** - Clean, uncluttered UI
- **Atmospheric** - Rain, storms, clearing skies create emotional resonance
- **No gamification pressure** - No aggressive streaks, notifications, or guilt
- **Privacy-first** - All data stays on device (localStorage)
- **Smooth transitions** - Everything fades, nothing jarring

---

## Color Palette

Defined in `tailwind.config.js`:
- `bg-primary`: Dark slate background
- `bg-secondary`: Slightly lighter slate
- `text-primary`: Light gray text
- `text-muted`: Dimmed text
- `accent-light`: Soft blue accent
- `border`: Subtle borders

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

**Note:** Repository name is `downpourphone` (not `downpour`)

---

## Next Steps for Continuation

See `ROADMAP.md` for prioritized task list and current project status.

---

## Starting a New Claude Session

To maintain context across sessions, follow this workflow:

### Step 1: Read the Roadmap
```
Read ROADMAP.md first - it contains current state, completed features, and prioritized next steps
```

### Step 2: Check Project Status
- Review "Current State" section for latest development status
- Check "In Progress" for any active work
- Note any known issues or blockers

### Step 3: Verify Git Status
```bash
git status                    # Check for uncommitted changes
git log -1 --oneline         # See last commit message for context
git branch                   # Confirm current branch
```

### Step 4: Verify App Runs
```bash
npm install                  # Ensure dependencies are up to date
npm run dev                  # Start dev server, check for errors
```

### Step 5: Orient with Claude
Ask Claude to:
1. Summarize where we are based on ROADMAP.md
2. Identify recommended next task from priority list
3. Confirm approach before starting work

### Workflow Example
```
User: "Let's continue development"
Claude: [Reads ROADMAP.md]
Claude: "Based on the roadmap, we're currently working on [X].
         The highest priority next task is [Y].
         Would you like to continue with [X] or start [Y]?"
```

---

## Documentation Files

| File | Purpose | Update Frequency |
|------|---------|------------------|
| `ROADMAP.md` | Project status, completed tasks, next steps | After each feature/session |
| `CLAUDE_HANDOFF.md` | Technical details, architecture, recent changes | Weekly or major changes |
| `README.md` | User-facing documentation, setup instructions | Major feature changes |
| `.claude/plans/` | Session-specific implementation plans | Per session (auto) |

---

## Notes for Claude

- User prefers **quick fixes over lengthy explanations**
- User wants **no emojis** unless requested
- All data is in **localStorage** - keys are `downpour_entries` and `downpour_settings`
- Current prompts in **sessionStorage** - key is `downpour_current_prompt`
- The audio system is a **singleton** - state persists across route changes (**HAS 12 BUGS - see Known Issues**)
- The haptic system is a **composable** - import and use `triggerHaptic(type)` for feedback
- Phase transitions in release screen use **setTimeout chains** - 10+ timers need cleanup in onUnmounted()
- Writing prompts rotate **after each release** - 10 variations stored in sessionStorage
- Entry deletion uses **`deleteEntry(id)`** from useLocalStorage.js
- Entry count display at **ArchiveScreen.vue line 154**
- Main development branch is **`optimistic-bardeen`**
- Working directory is **`C:\Users\bayle\.claude-worktrees\Downpour Round 2 - Claude Code\optimistic-bardeen`**
- Target deployment: **Google Play Store** via TWA (Trusted Web Activity)
- Testing device: **Samsung S24**
