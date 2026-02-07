# Downpour PWA - Development Roadmap

**Last Updated:** 2026-02-07

## Quick Reference

| Item | Value |
|------|-------|
| **Project** | Downpour - Emotional Release Journaling PWA |
| **Target** | Google Play Store deployment |
| **Branch** | main |
| **Tech Stack** | Vue 3 + Vite + Tailwind + Web Audio API |
| **Data Storage** | localStorage (no backend) |
| **Testing Device** | Samsung S24 |
| **Live URL** | downpourphone.vercel.app |
| **TWA Version** | 8 (rebuilt with security + export + error boundary) |
| **Pricing** | $6.99 USD lifetime after 7 free uses |
| **Creator Brand** | Ascensciana - "Quiet tech for loud minds" |

---

## Current State

### What's Working
- Core journaling flow (Write -> Release -> Archive)
- 280-character write limit with 8 emotion tags
- Writing prompts (10 variations, session-based rotation)
- Individual entry deletion with confirmation modal
- Entry count display ("X thoughts released")
- State machine audio system (STORM/NATURE)
- Animated release sequence (text dissolution + sky clearing)
- 5-screen onboarding tutorial (sound toggle removed)
- Haptic feedback across all interactions (tuned for Samsung S24)
- PWA manifest and service worker configured
- "Continue with your day" exit button on release screen
- **AES-GCM encryption for all stored entries**
- **JSON export (Settings > Export data)**
- **Error boundary with recovery UI**
- **Duplicate entry prevention (isSubmitting guard)**
- **Freemium paywall with Google Play Billing**

### What's Fixed (This Session - 2026-02-07, Round 2 - Claude Code)

**Phase 1 - Security:**
- AES-GCM encryption for all localStorage entries (src/composables/crypto.js)
- Key derivation from device fingerprint
- Entries encrypted at rest, decrypted in memory

**Phase 2 - TWA Config:**
- Migrated hosting from Netlify to Vercel (downpourphone.vercel.app)
- Updated asset links with new keystore fingerprint
- TWA version bumped to 8
- Updated build.gradle (compileSdk 36, targetSdk 35)

**Phase 3 - Performance & Bug Fixes:**
- Fixed duplicate entry bug (1 release duplicating 7x, triggering paywall)
  - Added `isSubmitting` flag in WriteScreen.vue
  - Added `isMounted` + `safeCallback()` in ReleaseScreen.vue
  - Added `cancelFade()` in useAudio.js
- Copy tightening: writing prompts and paywall text refined

**Phase 4 - Export + Error Boundary:**
- JSON export feature in Settings (downloads decrypted entries as JSON)
- ErrorBoundary.vue component (catches render errors, shows recovery UI)
- Global error handler in main.js

**Other Fixes:**
- Haptic feedback tuned for Samsung S24 (light:50ms, medium:100ms, heavy:[50,30,80] pattern)
- APK v8 rebuilt via Bubblewrap and tested on S24

### What's Fixed (Previous Session - 2026-02-06)
- Ascensciana landing page redesigned (light/airy aesthetic, personal voice)
- New tagline: "Quiet tech for loud minds"
- 3-beat manifesto copy developed
- Flip card component for projects (click to reveal)
- Scroll fade-in animations
- Downpour landing page updated with actual app icon
- Both landing pages ready in ascensciana-landing/ folder

### What's Fixed (Previous Session - 2026-01-30)
- "Clear All Data" moved from Settings to Archive header
- Changed from trash icon to "Clear all" text button (clearer for destructive action)
- Removed verbose console.log debug statements from audio system (cleaner production console)
- Privacy policy created and hosted: https://gist.github.com/testdev-lar/c105e48d640c86f3f4eae5d050ebe412

### What's Fixed (Previous Session - 2026-01-29)
- "How to use Downpour" guide added to home screen (`?` icon opens modal)
- Onboarding copy revised to sound less AI-written (multiple iterations)
- Full-bleed app icon implemented (fixes launcher icon not filling space on S24)
- "Connect with the creator" link added to Settings (@ascensciana on X)
- Domain updated to downpour2.netlify.app
- Digital asset links configured (URL bar hidden)
- TWA version bumped to 6

### What's Fixed (Previous Session - 2026-01-26)
- Settings icon updated to minimalist gear/cog design
- Mountain silhouettes added to all stormy screens (Title, Home, Write, Archive, Settings)
- Onboarding auto-advances when emotion tag selected (screen 4)
- Audio toggle now stops ALL sounds immediately (including thunder one-shots)
- Settings "Replay Tutorial" text alignment fixed
- Settings top divider line now spans full width
- HomeScreen nav buttons z-index fixed (clickable over mountains)

### What's Fixed (Previous Session - 2026-01-25)
- All 12 audio bugs from previous session
- Audio now uses simple state machine (STORM or NATURE)
- Storm plays continuously across screen transitions
- Nature fades in after release with proper timing
- Sound toggle works correctly
- Removed unused rain-light.mp3

### What's Next
1. ~~Update settings icon to minimalist gear/cog design (P0)~~ DONE
2. ~~Test on Samsung S24 - basic functionality verified (P0)~~ DONE
3. ~~Deploy PWA to public URL (P1)~~ DONE - downpour2.netlify.app
4. ~~TWA packaging with Bubblewrap (P1)~~ DONE - version 6
5. ~~Digital asset links configured (P1)~~ DONE
6. ~~Full-bleed icon implemented (P1)~~ DONE
7. ~~Privacy policy (P1)~~ DONE
8. ~~Implement freemium paywall (P1)~~ DONE - 7 uses then paywall

**Current Phase: Play Store Submission**

9. **Finalize Play Store listing copy** ← CAN DO NOW
10. ~~Create Downpour landing page~~ DONE (ascensciana-landing/downpour.html)
11. ~~Create Ascensciana landing page~~ DONE (ascensciana-landing/index.html)
12. **Set up @ascensciana on X** ← CAN DO NOW
13. **Draft launch tweet thread** ← CAN DO NOW
14. **Host landing pages** ← CAN DO NOW (GitHub Pages or similar)
15. ~~Integrate Google Play Billing~~ DONE (code complete)
16. ~~Rebuild and test APK~~ DONE (v8 on Vercel, tested on S24)
17. Set up product in Play Console
18. Take screenshots on S24
19. Play Store submission

---

## TWA Packaging Progress (Google Play Store)

### Checklist
- [x] Step 1: Check prerequisites (Node, npm, Java)
- [x] Step 2: Install Bubblewrap CLI
- [x] Step 3: Create app icons (512x512) - full-bleed version
- [x] Step 4: Initialize TWA with Bubblewrap
- [x] Step 5: Review generated configuration
- [x] Step 6: Build the APK ✅
- [x] Step 7: Configure digital asset links ✅ (URL bar hidden)
- [x] Step 8: Test APK on Samsung S24 ✅
- [x] Step 9: Generate AAB for Play Store ✅ (built alongside APK)
- [ ] Step 10: Prepare Play Store assets ← CURRENT

**Current Status:** APK v8 built and tested on S24. Hosted on Vercel. All code features complete. Ready for Play Store submission.

**Issues Resolved:**
- ~~URL bar showing at top~~ FIXED - digital asset links configured
- ~~App icon has white border~~ FIXED - full-bleed icon implemented
- ~~Duplicate entry bug~~ FIXED - race condition guards added
- ~~Haptics imperceptible on S24~~ FIXED - durations increased
- TWA shares localStorage with Chrome (known limitation - not blocking)

**Next Action:** Set up Play Console product, take screenshots, submit

**Generated Files:**
- `app-release-signed.apk` - For testing
- `app-release-bundle.aab` - For Play Store submission
- `android.keystore` - Signing key (KEEP SAFE!)

---

## Freemium Model (IMPLEMENTED)

### Pricing Strategy
- **7 free releases** - enough to experience the full ritual multiple times
- **$6.99 USD one-time** - lifetime unlock via Google Play Billing
- No subscriptions

### Paywall UX (Implemented)
**Screen appears when user hits 7 uses:**

> **"You've found something that helps."**
>
> You've released 7 storms. That means Downpour is working for you.
>
> Unlock unlimited releases for just $6.99 — yours forever.
>
> **[Unlock Downpour - $6.99]**
>
> *One-time purchase. No subscriptions.*

**Blocked:** Writing new entries, release ritual
**Still accessible:** Archive, Settings

### Implementation (DONE)
| File | Change | Status |
|------|--------|--------|
| `src/composables/useLocalStorage.js` | Added usage counter + unlock tracking | DONE |
| `src/views/WriteScreen.vue` | Redirects to paywall if limit reached | DONE |
| `src/views/HomeScreen.vue` | Redirects to paywall if limit reached | DONE |
| `src/views/PaywallScreen.vue` | Paywall UI with placeholder unlock button | DONE |
| `src/router.js` | Added `/paywall` route | DONE |

### Google Play Billing (CODE COMPLETE)
| File | Status |
|------|--------|
| `src/composables/useBilling.js` | DONE - Digital Goods API integration |
| `src/views/PaywallScreen.vue` | DONE - Purchase + restore flows |

**Product ID:** `downpour_unlimited`

**Remaining:** Set up product in Play Console + test on device

---

## Marketing Plan

### Brand Identity
- **Creator:** Ascensciana
- **Tagline:** "Beautiful, digitalized rituals."
- **Voice:** Warm & supportive, minimal & calm
- **Avoid:** Therapy-speak, tech jargon
- **Embrace:** Weather metaphors, human/conversational tone

### Play Store Listing

**App Name:** Downpour: Let It Go

**Short Description (80 chars):**
> Write what weighs you down. Watch it dissolve. Find closure.

**Full Description:** (See CLAUDE_HANDOFF.md for full copy)

**Keywords:** journaling app, anxiety relief, emotional release, mental wellness, stress relief, private journal, mood tracker, mindfulness, calm app, let it go

### Screenshot Copy (5 Screenshots)
1. "Let it out." (Title screen)
2. "Pour out what's heavy." (Write screen)
3. "Watch it dissolve." (Release animation)
4. "The storm clears." (Peaceful state)
5. "Your private archive." (Archive screen)

### Landing Pages (DONE - ascensciana-landing/)

**Ascensciana Page (index.html):**
- Hero: "Ascensciana" + "Quiet tech for loud minds"
- Manifesto: 3-beat personal copy
- Projects: Flip card with Downpour icon (click to reveal description)
- Contact: @ascensciana on X
- Light/airy aesthetic with sky/periwinkle accent

**Downpour Page (downpour.html):**
- Hero: App icon + "Some thoughts are too heavy to carry."
- The Ritual: Write → Release → Breathe
- Why Downpour: No pressure, Truly private, Designed for closure
- Pricing: $6.99 one-time
- Dark stormy aesthetic (matches app)

**Next:** Host on GitHub Pages or similar

### Launch Strategy (Low/No Budget)

**Pre-Launch (Now - Feb 9):**
- Set up @ascensciana X account
- Create both landing pages
- Draft launch tweet thread (5-7 tweets)
- Join communities: r/androidapps, r/journaling, r/anxiety
- Prepare Product Hunt listing

**Launch Week:**
- Post and pin launch thread on X
- Submit to Product Hunt
- Post in Reddit communities (genuine, value-first)
- Personal IG story (350 followers)
- Reply to all reviews

**Ongoing:**
- Share user testimonials when received
- Occasional behind-the-scenes posts
- Email indie app blogs for coverage

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
- "Clear all" button in header (text, not icon) with confirmation modal
- Entry count: "1 thought released" or "X thoughts released"
- Emotion tag display with accent colors
- Date/time stamps
- Sorted by newest first

**Onboarding & UX:**
- 5-screen tutorial: Text screens (0-3), emotion selector (4), first write (5)
- "How to use Downpour" guide accessible via `?` icon on home screen
- Haptic feedback: light (50ms), medium (100ms), heavy ([50,30,80] pattern)
- Smooth sky transitions via color interpolation
- Bird animations during release
- "Continue with your day" exit button
- "Connect with the creator" link to @ascensciana on X in Settings

**Data & Persistence:**
- localStorage: `downpour_entries` (AES-GCM encrypted), `downpour_settings`
- sessionStorage: `downpour_current_prompt`
- Entry structure: `{ id, text, emotion, timestamp, date }` (encrypted at rest)
- JSON export available in Settings

**Error Handling:**
- ErrorBoundary component wraps router-view (catches render errors)
- Global error handler in main.js (catches uncaught async errors)
- Recovery UI: "Something went wrong" + "Try again" button

### Not Wanted
- Heavy Mode (600 chars)
- Gentle stats display
- Emotion filtering in archive
- Sound toggle in onboarding

### Remaining P0 (Launch Blockers)

#### 1. ~~Settings Icon Update~~ DONE

#### 2. ~~Test on Samsung S24~~ DONE (Basic Testing)
**Verified:**
- [x] Mountains visible on all screens
- [x] Audio toggle stops all sounds immediately
- [x] Onboarding auto-advances on emotion selection
- [x] Settings UI aligned correctly
- [x] Nav buttons clickable
- [ ] PWA installation (needs deployed URL)
- [ ] Offline mode (needs deployed URL)

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
- [x] Settings icon updated
- [x] S24 testing complete (basic functionality)

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

**P0 - Blocking:** ALL DONE
1. ~~Fix audio bugs~~ DONE
2. ~~Add "Continue with the day" exit button~~ DONE
3. ~~Update settings icon~~ DONE
4. ~~Test on S24~~ DONE

**P1 - Launch (Current):**
1. ~~Deploy PWA to public URL~~ DONE (downpour2.netlify.app)
2. ~~TWA packaging (Bubblewrap)~~ DONE (version 6)
3. ~~Digital asset links~~ DONE
4. ~~Full-bleed icon~~ DONE
5. ~~Privacy policy~~ DONE
6. ~~Freemium paywall implementation~~ DONE (UI complete, billing placeholder)
7. Play Store listing copy ← READY (see Marketing Plan above)
8. Landing pages (Downpour + Ascensciana)
9. Google Play Billing integration
10. Rebuild APK
11. Screenshots on S24
12. Play Store submission

**P2 - Post-Launch:**
- ~~Export functionality~~ DONE (JSON export in Settings)
- Additional soundscapes
- Accessibility improvements

---

## File Reference

**Audio:**
- src/composables/useAudio.js (state machine: STORM/NATURE)

**Screens:**
- src/views/TitleScreen.vue (playStorm on mount, mountains)
- src/views/OnboardingScreen.vue (5 screens, auto-advance on emotion, revised copy)
- src/views/ReleaseScreen.vue ("Continue with your day" button, isMounted guard)
- src/views/HomeScreen.vue (`?` guide icon + modal, gear icon, mountains, paywall check)
- src/views/WriteScreen.vue (paywall check on mount and release, isSubmitting guard)
- src/views/PaywallScreen.vue (freemium paywall UI, Google Play Billing)
- src/views/ArchiveScreen.vue (past entries, "Clear all" button, individual delete)
- src/views/SettingsScreen.vue (sound toggle, replay tutorial, export data, creator link)

**Components:**
- src/components/ErrorBoundary.vue (catches render errors, recovery UI)
- src/components/BackgroundRain.vue (canvas rain + lightning)
- src/components/MountainBackground.vue (mountain silhouettes)

**Data & Security:**
- src/composables/useLocalStorage.js (entry CRUD, usage tracking, unlock state)
- src/composables/crypto.js (AES-GCM encryption/decryption)
- src/composables/useBilling.js (Digital Goods API for Play Billing)
- src/composables/useHaptics.js (vibration feedback, tuned for Samsung S24)
- localStorage: `downpour_entries` (encrypted), `downpour_settings`, `downpour_usage_count`, `downpour_unlocked`
- sessionStorage: `downpour_current_prompt`

**Constants:**
- src/constants/app.js (emotions, prompts, storage keys, free release limit)

**Config:**
- vite.config.js (PWA manifest, service worker)
- twa-manifest.json (TWA config, v8)
- app/build.gradle (Android build config)

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
