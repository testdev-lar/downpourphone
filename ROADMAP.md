# Downpour PWA - Development Roadmap

**Last Updated:** 2026-01-24

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

### What's Working ✓
- Core journaling flow (Write → Release → Archive)
- 280-character write limit with 8 emotion tags
- Writing prompts (10 variations, session-based rotation)
- Individual entry deletion with confirmation modal
- Entry count display ("X thoughts released")
- Multi-track audio system with soundscape transitions
- Animated release sequence (text dissolution + sky clearing)
- 6-screen interactive onboarding tutorial
- Haptic feedback across all interactions
- PWA manifest and service worker configured

### What's Broken ⚠️
**CRITICAL - Audio System Bugs** (blocking launch):
1. Heavy rain continues playing during/after release transition (should fade out)
2. Nature sounds don't fade in properly after release
3. Sound toggle (on/off) doesn't work consistently across sessions

**Root cause:** 12 technical bugs in useAudio.js - see "Audio System Bugs" section

### What's Next 🎯
1. Fix all audio bugs comprehensively (P0 - launch blocker)
2. Add "Continue with the day" exit button on ReleaseScreen (P0)
3. Update settings icon to minimalist gear/cog design (P0)
4. Test on Samsung S24 - verify PWA installation, audio, haptics (P1)
5. Prepare Play Store deployment - TWA packaging, privacy policy, listing (P1)

---

## Feature Inventory

### ✓ Implemented

**Core Journaling:**
- 280-character write limit (Heavy Mode not needed - user confirmed)
- 8 emotion tags: Anxious, Overwhelmed, Frustrated, Sad, Lonely, Exhausted, Angry, Restless
- Writing prompts: 10 variations stored in sessionStorage, rotates after each release
- Release animation: Text dissolution with blur/scale + sky clearing gradient
- Entry persistence: localStorage with save/load/delete

**Audio & Atmosphere:**
- Multi-track audio: storm-heavy.mp3, thunder-rumble.mp3, nature-peaceful.mp3, rain-light.mp3
- Soundscape transitions: Storm (Home/Write) → Nature (Release) → Storm (Return)
- Lightning effects: Random flashes every 5-12s, triggers thunder
- Phase-based rain: Normal (100%) → Slowing (60%) → Sparse (30%) → Fading (10%)
- Sound toggle: Persistent mute state (HAS BUGS - see below)

**Archive (Puddle):**
- Expandable entry cards
- Individual deletion with confirmation modal + feedback message
- Entry count: "1 thought released" or "X thoughts released"
- Emotion tag display with accent colors
- Date/time stamps (e.g., "Jan 24, 2026" and "3:45 PM")
- Sorted by newest first

**Onboarding & UX:**
- 6-screen tutorial: Welcome, Write demo, Release demo, Sound, Archive, Privacy
- Haptic feedback: light (10ms), medium (20ms), heavy (30ms)
- Smooth sky transitions via color interpolation
- Bird animations during release
- Settings: Sound toggle, replay tutorial, clear all data

**Data & Persistence:**
- localStorage: `downpour_entries`, `downpour_settings`
- sessionStorage: `downpour_current_prompt`
- Entry structure: `{ id, text, emotion, timestamp, date }`

### ⏸️ Not Wanted
- Heavy Mode (600 chars)
- Gentle stats display
- Emotion filtering in archive

### 🚧 Launch Blockers (P0)

#### 1. "Continue with the day" Exit Button
**Current:** ReleaseScreen has "Return" button → navigates to /home
**Needed:** Button that exits/minimizes app (completes release ritual)
**Implementation:** Use window.close() or about:blank, test on S24 after TWA install
**File:** src/views/ReleaseScreen.vue - replace goHome() function (lines 282-292)

#### 2. Fix Audio Bugs
**Files:** src/composables/useAudio.js, src/views/ReleaseScreen.vue
See "Audio System Bugs" section below for all 12 issues

#### 3. Settings Icon Update
**Needed:** Minimalist gear/cog SVG icon
**File:** src/views/HomeScreen.vue (verify location)

---

## Audio System Bugs (CRITICAL)

All in `src/composables/useAudio.js` unless noted.

### Bug #1: fadeToSound() Race Condition (Lines 259-271)
**Problem:** Fades out sounds for 1000ms but starts new sound after only 500ms
**Impact:** Heavy rain overlaps with nature sounds during release transition
**Fix:** Await fade completion before starting new sound

### Bug #2-3: Memory Leaks in Fades (Lines 156-182, 185-230)
**Problem:** setInterval() in fadeOutSound() and fadeInSound() not tracked for cleanup
**Impact:** Orphaned intervals drain memory/battery on rapid screen transitions
**Fix:** Store interval IDs in array, expose cleanup function, clear in onUnmounted()

### Bug #4: Crossfade Race Condition (Lines 233-236)
**Problem:** fadeOut and fadeIn run simultaneously without synchronization
**Impact:** Both sounds at different volumes play together
**Fix:** Implement proper crossfade timing

### Bug #5: ReleaseScreen Missing Cleanup (Lines 203-273)
**Location:** src/views/ReleaseScreen.vue
**Problem:** 10+ setTimeout calls not cleared on unmount
**Impact:** Timers trigger audio changes on unmounted component
**Fix:** Store all setTimeout IDs, clear in onUnmounted()

### Bug #6: AudioContext Resume State (Lines 85-92, 121-128, 188-195)
**Problem:** Multiple functions call resume() without state validation
**Impact:** Silent failures, no user feedback
**Fix:** Centralize state management, validate before operations

### Bugs #7-12 (Medium/Low Severity)
7. Disconnection order in playOneShot() (lines 146-149) - may cause audio pops
8. Mobile autoplay policy not handled (lines 30-39) - fails on first load
9. stopSound() doesn't handle fading sounds (lines 252-256) - abrupt cuts
10. Audio buffer failures not cached (lines 61-79) - endless retries
11. Missing null checks (lines 156-182) - could crash
12. No volume bounds validation - could set invalid volumes

**See CLAUDE_HANDOFF.md for more detailed analysis.**

---

## Google Play Store Deployment Guide

### Prerequisites
- [x] Node.js installed
- [x] Samsung S24 for testing
- [ ] JDK 11+ for signing APK
- [ ] Google Play Developer account ($25 one-time - need to create)
- [ ] All P0 bugs fixed

### Step 1: Install Bubblewrap
```bash
npm install -g @bubblewrap/cli
```

### Step 2: Deploy PWA to Public URL
Choose hosting: Netlify, Vercel, Firebase Hosting
- Deploy current build
- Get production URL (e.g., downpour.netlify.app)
- Verify PWA works at URL

### Step 3: Initialize TWA
```bash
cd "C:\Users\bayle\.claude-worktrees\Downpour Round 2 - Claude Code\optimistic-bardeen"
bubblewrap init --manifest https://your-deployed-url.com/manifest.webmanifest
```

**Configuration:**
- App name: Downpour
- Package name: com.downpour.app
- Starting URL: /
- Theme/background color: #1a1d23
- Icon/Maskable icon: /icons/icon-512x512.png
- Display: standalone
- Orientation: portrait

### Step 4: Build APK
```bash
bubblewrap build
```

Generates: `twa/app-release-unsigned.apk`

### Step 5: Sign APK
**Generate keystore (first time):**
```bash
keytool -genkey -v -keystore downpour-release.keystore -alias downpour -keyalg RSA -keysize 2048 -validity 10000
```

**CRITICAL:** Save keystore file and password securely - needed for all future updates

**Sign:**
```bash
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore downpour-release.keystore app-release-unsigned.apk downpour
```

**Optimize:**
```bash
zipalign -v 4 app-release-unsigned.apk downpour-release.apk
```

### Step 6: Test on S24
**Enable Developer Mode:**
Settings → About phone → Software info → Tap "Build number" 7 times
Settings → Developer options → Enable USB debugging

**Install:**
```bash
adb install downpour-release.apk
```

**Verify:**
- App installs, icon displays
- Audio plays (storm, thunder, nature sounds)
- Haptic feedback works
- "Continue with the day" exits app
- Offline mode works
- localStorage persists across restarts

### Step 7: Create Play Store Assets
**Screenshots (8 recommended):** 1080x2400 from S24
1. Home screen (storm background)
2. Write screen (prompt + emotion tags)
3. Release animation (text dissolving)
4. Sky clearing (mid-transition)
5. Birds flying (final peaceful state)
6. Archive with entries
7. Settings screen
8. Onboarding welcome

**Feature Graphic:** 1024x500 banner for Play Store header

**App Icon:** 512x512 PNG (already have in /icons/icon-512x512.png)

**Short Description (80 chars):**
"Release what weighs on you. Minimalist emotional journaling with soundscapes."

**Full Description:**
```
🌧️ Let it fall away.

Downpour is a minimalist emotional release journal. Write what's weighing on you, choose an emotion, and release it—watching your words dissolve as the stormy sky clears to peaceful sunshine.

✨ FEATURES
• 280-character releases
• 8 emotion tags
• Atmospheric soundscape
• Beautiful animations
• Archive (The Puddle)
• Daily prompts
• Privacy-first

🎨 PHILOSOPHY
No gamification. No pressure. No guilt. Just a quiet space to acknowledge what you're feeling and let it go.

🔒 YOUR DATA, YOUR DEVICE
Everything stays local. No account required. No analytics. No ads. Your thoughts are yours alone.

💙 PERFECT FOR
• Daily emotional check-ins
• Releasing anxious thoughts
• Processing difficult feelings
• Mindful journaling practice
• Letting go of what you can't control

Start your release ritual today.
```

### Step 8: Privacy Policy
**Host on GitHub Pages or Netlify:**

```markdown
# Privacy Policy for Downpour
Last Updated: January 24, 2026

## Data Collection
Downpour stores data **locally on your device only**:
- Journal entries (text, emotion tags, timestamps)
- App settings (sound preferences, tutorial status)
- Session data (current writing prompt)

## Data Storage
Uses localStorage/sessionStorage. **No external servers.** No backend, no cloud sync, no analytics.

## Data We Do NOT Collect
- Personal information (name, email, phone)
- Location data
- Usage analytics
- Device identifiers
- Third-party tracking

## Data Sharing
We do not share, sell, or transmit your data. Your entries never leave your device.

## Data Retention
Data persists until you delete it via:
- Individual entry deletion (Archive trash icon)
- "Clear all data" (Settings)
- Browser cache clearing

## Your Rights
- View all entries (Archive/Puddle)
- Delete individual entries
- Clear all data
- Export data (coming soon)

## Children's Privacy
Not designed for children under 13. No age verification required.

## Contact
[Your email]

## Open Source
Code available at: https://github.com/testdev-lar/downpourphone
```

**Add to manifest.json:**
```json
"privacy_policy": "https://your-domain.com/privacy-policy.html"
```

### Step 9: Upload to Play Console
1. Go to https://play.google.com/console
2. Create developer account ($25)
3. Create new app: Downpour, English, App, Free
4. Fill store listing
5. Content rating (Expected: Everyone or Teen)
6. Upload downpour-release.apk
7. Submit for review (1-3 days)

### Troubleshooting

**"App not installed" on S24:**
- Uninstall previous version
- Enable "Install unknown apps" for file manager
- Use ADB: `adb install downpour-release.apk`

**Audio doesn't play after install:**
- Check service worker caches audio in vite.config.js
- Verify manifest includeAssets: `['audio/*']`
- Clear app cache, reinstall

**Digital Asset Links failed:**
- Host `/.well-known/assetlinks.json` on your domain
- Get SHA-256: `keytool -list -v -keystore downpour-release.keystore`

**Icons cropped/pixelated:**
- Verify 512x512 PNG with transparency
- Check maskable safe zone: https://maskable.app/

---

## Development Workflow

### Starting New Session
1. Read this ROADMAP.md
2. Check git status, verify app runs: `npm run dev`
3. Identify next priority from "What's Next"
4. Confirm approach with user

### After Major Changes
User will request:
1. Update ROADMAP.md (feature inventory, current state)
2. Update CLAUDE_HANDOFF.md (recent changes, technical details)
3. Git commit with descriptive message

### Commit Guidelines
Format: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
Include: `Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`

---

## Priority Levels

**P0 - Blocking:**
1. Fix audio bugs (all 12 issues)
2. Add "Continue with the day" exit button
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
- Weekly reflection prompts

---

## File Reference

**Audio Fixes:**
- src/composables/useAudio.js (12 bugs, lines 30-271)
- src/views/ReleaseScreen.vue (setTimeout cleanup, lines 203-273)
- src/views/HomeScreen.vue (init race condition, lines 53-58)

**Exit Button:**
- src/views/ReleaseScreen.vue (replace goHome(), lines 282-292)

**Settings Icon:**
- src/views/HomeScreen.vue (verify location)

**Data:**
- src/composables/useLocalStorage.js
- localStorage: `downpour_entries`, `downpour_settings`
- sessionStorage: `downpour_current_prompt`

**UI:**
- src/views/WriteScreen.vue (prompts array, lines 104-115)
- src/views/ArchiveScreen.vue (delete modal, lines 92-120; count, line 154)

**Config:**
- vite.config.js (PWA manifest, service worker)
- package.json (dependencies)

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
