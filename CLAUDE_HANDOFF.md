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

1. **HomeScreen.vue** - Landing page with "Let it fall away" button, links to Archive and Settings
2. **WriteScreen.vue** - Textarea for writing (280 char limit), emotion tags, "Release" button
3. **ReleaseScreen.vue** - Animated sequence: text dissolves, sky clears (gradient interpolation), rain stops, "Breathe. The sky clears." message appears
4. **ArchiveScreen.vue** - "Puddle" - list of past entries, expandable cards
5. **SettingsScreen.vue** - Sound toggle, replay tutorial, clear all data
6. **OnboardingScreen.vue** - First-time user tutorial

---

## Key Files

| File | Purpose |
|------|---------|
| `src/App.vue` | Root component, provides rain clearing state, handles lightning→thunder |
| `src/components/BackgroundRain.vue` | Canvas-based rain animation, lightning flashes |
| `src/composables/useAudio.js` | Singleton audio system - multi-track, crossfade, one-shots |
| `src/composables/useLocalStorage.js` | Entry storage - save, load, clear |
| `src/router.js` | Vue Router configuration |
| `src/views/*.vue` | All screen components |
| `public/audio/` | Audio files (storm, thunder, nature, light rain) |

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

## Recent Changes (Current Commit)

1. **Lightning effect** - Random flashes every 5-12s during phase 0, triggers thunder sound
2. **Smooth gradient transitions** - Sky color interpolation instead of class switching
3. **Multi-track audio** - Complete rewrite of audio system
4. **Sound transitions** - Storm fades out gradually, nature fades in
5. **UI updates** - Button text "Let it fall away", fixed text positioning on release screen

---

## Planned Features (Not Yet Implemented)

### Engagement Features
1. **Daily prompts** - Random writing prompts as placeholder text
2. **Gentle stats** - "12 thoughts released" on home screen
3. **Streak indicator** (optional) - Subtle consecutive day tracking

### Archive Improvements
1. **Delete individual entries** - Currently no way to remove single entries
2. **Emotion filter** - Filter chips at top of archive
3. **Simple stats** - Total count, most common emotion, date range

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
│   ├── useAudio.js         # Audio singleton
│   └── useLocalStorage.js  # Entry persistence
└── views/
    ├── HomeScreen.vue
    ├── WriteScreen.vue
    ├── ReleaseScreen.vue
    ├── ArchiveScreen.vue
    ├── SettingsScreen.vue
    └── OnboardingScreen.vue

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

https://github.com/testdev-lar/downpour

---

## Next Steps for Continuation

1. Implement delete functionality for archive entries
2. Add daily writing prompts
3. Add gentle stats display
4. Consider emotion filtering in archive
5. PWA manifest verification for Play Store
6. Test offline functionality
7. Accessibility review

---

## Notes for Claude

- User prefers **quick fixes over lengthy explanations**
- User wants **no emojis** unless requested
- All data is in **localStorage** - keys are `downpour_entries` and `downpour_settings`
- The audio system is a **singleton** - state persists across route changes
- Phase transitions in release screen use **setTimeout chains** - be careful with timing
