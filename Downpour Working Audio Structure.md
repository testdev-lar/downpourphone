# Downpour Working Audio Structure

## Overview

This document explains how the Downpour audio system was built and how it works. This is intended as a reference guide for understanding the architecture and implementation details.

**Deployed PWA:** downpour.netlify.app

## Architecture: State Machine Design

The audio system uses a **state machine pattern** with three distinct states:

```javascript
const AudioState = {
  SILENT: 'silent',  // No audio playing
  STORM: 'storm',    // Heavy rain ambient (storm-heavy.mp3)
  NATURE: 'nature'   // Peaceful nature sounds (nature-peaceful.mp3)
}
```

### Why State Machine?

The previous implementation tried to manage multiple audio tracks simultaneously, leading to:
- Audio overlaps and conflicts
- Race conditions during screen transitions
- Inconsistent behavior when toggling sound
- Complex state management

The state machine approach ensures:
- **Only one ambient sound plays at a time** (STORM or NATURE)
- **Clear state transitions** with no overlaps
- **Predictable behavior** across all screens
- **Simple to reason about** - audio is always in one of three states

## Core Implementation: useAudio.js Composable

### Singleton Pattern

The audio system uses **shared reactive state** at the module level (outside the composable function):

```javascript
// Shared state (singleton) - persists across all components
const audioContext = ref(null)
const currentState = ref(AudioState.SILENT)
const activeSource = ref(null)
const activeGainNode = ref(null)
const isReady = ref(false)
const isInitialized = ref(false)
const oneShotSources = ref([])
const isMuted = ref(loadMutedState())
```

**Why singleton?**
- All components using `useAudio()` share the same audio state
- Storm continues playing when navigating between screens
- No need to pass state through props or provide/inject
- One audio context for the entire application

### Initialization: User Interaction Requirement

Web browsers require user interaction before playing audio (autoplay policy). The system handles this with **global event listeners**:

```javascript
const setupGlobalListeners = () => {
  if (isInitialized.value) return
  isInitialized.value = true

  const handleUserInteraction = () => {
    initAudio()
    document.removeEventListener('click', handleUserInteraction)
    document.removeEventListener('touchstart', handleUserInteraction)
  }

  document.addEventListener('click', handleUserInteraction)
  document.addEventListener('touchstart', handleUserInteraction)
}

// Initialize listeners immediately when module loads
setupGlobalListeners()
```

**How it works:**
1. Listeners are set up when the module first loads
2. First click/touch anywhere on the page initializes AudioContext
3. Listeners remove themselves after first interaction
4. `isInitialized` flag prevents duplicate listeners

### Audio Buffer Caching

Audio files are fetched once and cached:

```javascript
const audioBufferCache = {}

const loadAudioBuffer = async (type) => {
  if (audioBufferCache[type]) return audioBufferCache[type]

  // Fetch, decode, cache
  const arrayBuffer = await response.arrayBuffer()
  const audioBuffer = await audioContext.value.decodeAudioData(arrayBuffer)
  audioBufferCache[type] = audioBuffer
  return audioBuffer
}
```

**Benefits:**
- First play loads from network
- Subsequent plays use cached buffer
- No repeated network requests
- Instant playback after initial load

## Key Functions

### 1. playStorm() - Start Storm Audio

```javascript
const playStorm = async () => {
  // Guard: Skip if muted
  if (isMuted.value) return

  // Guard: Skip if already playing storm (no-op)
  if (currentState.value === AudioState.STORM) return

  // CRITICAL: Set state IMMEDIATELY to prevent race condition
  currentState.value = AudioState.STORM

  // Ensure audio context is ready
  if (!(await ensureAudioReady())) {
    currentState.value = AudioState.SILENT
    return
  }

  // Stop any existing audio
  stopAll()

  // Load buffer, create source, connect to gain node
  const audioBuffer = await loadAudioBuffer('storm')
  const source = audioContext.value.createBufferSource()
  source.buffer = audioBuffer
  source.loop = true

  const gainNode = audioContext.value.createGain()
  gainNode.gain.value = 0.3  // Volume: 30%

  source.connect(gainNode)
  gainNode.connect(audioContext.value.destination)

  // Store references
  activeSource.value = source
  activeGainNode.value = gainNode

  source.start()
}
```

**Key patterns:**
- **Immediate state update** prevents race conditions when called rapidly
- **No-op if already playing** - essential for screen transitions
- **Volume at 30%** for storm ambient
- **Loop enabled** for continuous playback
- **GainNode** for volume control and fading

### 2. fadeOutCurrent() - Fade Out with Promise

```javascript
const fadeOutCurrent = (duration = 4000) => {
  return new Promise((resolve) => {
    // Guard: Nothing to fade
    if (!activeGainNode.value || currentState.value === AudioState.SILENT) {
      resolve()
      return
    }

    const startVolume = activeGainNode.value.gain.value
    const steps = 20  // 20 volume steps
    const stepTime = duration / steps  // Time per step
    const volumeStep = startVolume / steps  // Volume decrease per step
    let currentStep = 0

    const fadeInterval = setInterval(() => {
      currentStep++
      const newVolume = Math.max(0, startVolume - (volumeStep * currentStep))

      if (activeGainNode.value) {
        activeGainNode.value.gain.value = newVolume
      }

      if (currentStep >= steps) {
        clearInterval(fadeInterval)
        stopAll()  // Complete stop after fade
        resolve()  // Promise resolves when fade complete
      }
    }, stepTime)
  })
}
```

**Manual fade implementation:**
- **No Web Audio API ramps** (exponentialRampToValueAtTime, etc.)
- **Manual interval-based fading** for precise control
- **20 steps** over the duration (smooth but not excessive)
- **Returns Promise** so callers can wait for fade completion
- **Calls stopAll()** at the end to fully clean up

**Why manual fading?**
- More predictable timing
- Easier to debug and log
- Works consistently across browsers
- Complete control over fade curve (linear)

### 3. playNature() - Fade In Nature Sounds

```javascript
const playNature = async (duration = 2000) => {
  // Guards: Skip if muted or already playing
  if (isMuted.value) return
  if (currentState.value === AudioState.NATURE) return

  // CRITICAL: Set state IMMEDIATELY
  currentState.value = AudioState.NATURE

  if (!(await ensureAudioReady())) {
    currentState.value = AudioState.SILENT
    return
  }

  stopAll()

  // Load and start with volume at 0
  const audioBuffer = await loadAudioBuffer('nature')
  const source = audioContext.value.createBufferSource()
  source.buffer = audioBuffer
  source.loop = true

  const gainNode = audioContext.value.createGain()
  gainNode.gain.value = 0  // Start silent

  source.connect(gainNode)
  gainNode.connect(audioContext.value.destination)

  activeSource.value = source
  activeGainNode.value = gainNode

  source.start()

  // Fade in to target volume
  const targetVolume = 0.4  // 40% volume
  const steps = 20
  const stepTime = duration / steps
  const volumeStep = targetVolume / steps
  let currentStep = 0

  const fadeInterval = setInterval(() => {
    currentStep++
    const newVolume = Math.min(targetVolume, volumeStep * currentStep)

    if (activeGainNode.value) {
      activeGainNode.value.gain.value = newVolume
    }

    if (currentStep >= steps) {
      clearInterval(fadeInterval)
    }
  }, stepTime)
}
```

**Fade in pattern:**
- Start audio with `gain.value = 0` (silent)
- Incrementally increase volume to 40%
- 20 steps over 2 seconds (default)
- No Promise needed - fire and forget

### 4. stopAll() - Immediate Stop

```javascript
const stopAll = () => {
  // Stop main audio source (storm/nature)
  if (activeSource.value) {
    try {
      activeSource.value.stop()
      activeGainNode.value?.disconnect()
      activeSource.value.disconnect()
    } catch (e) {
      // Already stopped - ignore
    }
    activeSource.value = null
    activeGainNode.value = null
  }

  // Stop all one-shot sounds (thunder)
  oneShotSources.value.forEach(({ source, gainNode }) => {
    try {
      source.stop()
      gainNode?.disconnect()
      source.disconnect()
    } catch (e) {
      // Already stopped
    }
  })
  oneShotSources.value = []

  currentState.value = AudioState.SILENT
}
```

**Complete cleanup:**
- Stops main ambient sound
- Stops ALL one-shot sounds (thunder)
- Disconnects all audio nodes
- Clears all references
- Sets state to SILENT

### 5. playOneShot() - Thunder and Effects

```javascript
const playOneShot = async (type, volume = 0.5) => {
  if (isMuted.value) return
  if (!(await ensureAudioReady())) return

  const audioBuffer = await loadAudioBuffer(type)
  const source = audioContext.value.createBufferSource()
  source.buffer = audioBuffer
  source.loop = false  // One-shot: no looping

  const gainNode = audioContext.value.createGain()
  gainNode.gain.value = Math.max(0, Math.min(1, volume))

  source.connect(gainNode)
  gainNode.connect(audioContext.value.destination)

  // Track for cleanup when muted
  const oneShotEntry = { source, gainNode }
  oneShotSources.value.push(oneShotEntry)

  source.start()

  // Auto-cleanup when finished
  source.onended = () => {
    const index = oneShotSources.value.indexOf(oneShotEntry)
    if (index > -1) {
      oneShotSources.value.splice(index, 1)
    }
    gainNode.disconnect()
    source.disconnect()
  }
}
```

**One-shot pattern:**
- Doesn't affect main audio state
- Tracked in `oneShotSources` array
- Can be stopped immediately via `stopAll()`
- Self-cleanup when finished playing

### 6. toggleMute() - Mute Control

```javascript
const toggleMute = () => {
  isMuted.value = !isMuted.value

  // Persist to localStorage
  const settings = { soundEnabled: !isMuted.value }
  localStorage.setItem('downpour_settings', JSON.stringify(settings))

  // Stop everything if muted
  if (isMuted.value) {
    stopAll()
  }
}
```

**Mute behavior:**
- Toggles reactive ref
- Immediately persists to localStorage
- Stops ALL audio when muted (including one-shots)
- Restored from localStorage on page load

## Screen-by-Screen Audio Behavior

### TitleScreen.vue - Audio Start

```javascript
onMounted(() => {
  playStorm()  // First audio start

  if (localStorage.getItem('downpour_onboarding_complete') === 'true') {
    router.push('/home')
  }
})
```

**Behavior:**
- First screen user sees
- Calls `playStorm()` on mount
- User's first interaction initializes AudioContext
- Storm starts playing after first click/touch

### HomeScreen.vue - Keep Storm Playing

```javascript
onMounted(() => {
  playStorm()  // No-op if already playing
})
```

**Behavior:**
- Calls `playStorm()` on mount
- **No-op** since storm is already in STORM state
- Ensures storm continues if user navigated here directly

### WriteScreen.vue - Storm Continues

No audio code in WriteScreen. Storm continues playing from previous screen.

### ReleaseScreen.vue - The Audio Transition

This is where the magic happens. The release sequence has precise audio timing:

```javascript
const startClearingSequence = () => {
  // Stage 1 (500ms): Start fading out storm
  setTimeout(async () => {
    isDissolving.value = true
    animationStage.value = 1
    await fadeOutCurrent(4000)  // 4 second fade
  }, 500)

  // ... visual animation stages ...

  // 4000ms: Start fading in nature (1.5s after storm silent)
  setTimeout(() => {
    playNature(2000)  // 2 second fade in
  }, 4000)
}
```

**Complete timeline:**

```
0ms:     User presses "Release"
500ms:   fadeOutCurrent(4000) starts - storm begins fading
2500ms:  Storm reaches silence (500ms + 4000ms fade)
4000ms:  playNature(2000) starts - nature begins fading in
6000ms:  Nature reaches full volume (4000ms + 2000ms fade)
∞:       Nature loops until user exits
```

**Key insights:**
- 1.5 second silence between storm and nature (2500ms → 4000ms)
- Overlapping fade times create smooth transition
- Storm fully stops before nature starts
- Nature fades in slowly (2 seconds) for gentle transition

**Exit behavior:**

```javascript
const exitApp = () => {
  stopAll()  // Immediate stop
  window.close()
}
```

### SettingsScreen.vue - Mute Control

```javascript
const toggleSound = () => {
  toggleMute()

  // If sound was just enabled, restart storm
  if (!isMuted.value) {
    playStorm()
  }
}
```

**Behavior:**
- `toggleMute()` stops all audio if muting
- Immediately restarts storm if unmuting
- State persists to localStorage

### ArchiveScreen.vue - Storm Continues

No audio code. Storm continues playing throughout.

## Race Condition Prevention

The system prevents race conditions with **immediate state updates**:

```javascript
const playStorm = async () => {
  // ❌ WRONG: Set state after async work
  // await ensureAudioReady()
  // currentState.value = AudioState.STORM  // Too late!

  // ✅ CORRECT: Set state immediately
  currentState.value = AudioState.STORM  // Prevents re-entry
  await ensureAudioReady()
}
```

**Problem scenario without immediate state update:**
1. User rapidly clicks through Title → Onboarding → Home
2. Each screen calls `playStorm()`
3. All three calls check `currentState.value === AudioState.STORM`
4. All three see SILENT (before async work completes)
5. All three proceed to create audio sources
6. Multiple storms play simultaneously

**Solution:**
- Set state FIRST, before any async work
- Subsequent calls see STORM state immediately
- Return early (no-op) if already in target state

## Audio Files

Located in `/public/audio/`:

| File | Type | Duration | Purpose | Volume |
|------|------|----------|---------|--------|
| storm-heavy.mp3 | Ambient | ~3:00 (loops) | Heavy rain + distant thunder | 30% |
| thunder-rumble.mp3 | One-shot | ~2s | Lightning strike sound | 50% |
| nature-peaceful.mp3 | Ambient | ~3:00 (loops) | Birds, breeze, distant nature | 40% |

**File characteristics:**
- All loopable (seamless start/end)
- Compressed MP3 format
- Mono or stereo (stereo preferred for ambience)
- 128-192 kbps bitrate
- Normalized volume levels

## Debugging & Logging

The system includes extensive console logging:

```javascript
console.log('[Audio] playStorm called', {
  isMuted: isMuted.value,
  currentState: currentState.value,
  hasActiveGainNode: !!activeGainNode.value
})
```

**Log patterns:**
- Prefix all logs with `[Audio]`
- Log state transitions
- Log volume changes during fade
- Log errors with context

**Common debug scenarios:**

1. **Storm won't start:**
   - Check: User interaction happened? (click/touch)
   - Check: `isMuted.value === false`?
   - Check: Audio files loaded?

2. **Multiple storms playing:**
   - Check: State set immediately in `playStorm()`?
   - Check: No-op check before async work?

3. **Fade not working:**
   - Check: `activeGainNode.value` still exists?
   - Check: Interval clearing correctly?
   - Check: Volume calculations (0-1 range)?

## Best Practices

### When to Call playStorm()

**DO:**
- Call in `onMounted()` of entry screens (Title, Home)
- Call after unmuting in settings

**DON'T:**
- Call on every navigation
- Call in intermediate screens (Write, Archive)

**Why:** Storm continues automatically. Only restart if you KNOW it stopped.

### When to Call stopAll()

**DO:**
- When muting sound
- When exiting the app
- Before starting new audio (in `playStorm`/`playNature`)

**DON'T:**
- Between normal screen transitions
- When you just want to change volume

### Fade Duration Guidelines

- **Storm fade out:** 4000ms (4 seconds) - slow, dramatic
- **Nature fade in:** 2000ms (2 seconds) - gentle, peaceful
- **One-shots:** No fade (immediate)

### Volume Levels

- **Storm:** 0.3 (30%) - ambient, not overwhelming
- **Nature:** 0.4 (40%) - slightly louder, peaceful
- **Thunder:** 0.5 (50%) - noticeable but not jarring

**Why these levels?**
- Storm is constant, needs to be subtle
- Nature is the "reward", slightly more prominent
- Thunder is punctuation, mid-level impact

## Testing Checklist

When modifying audio system, test:

- [ ] Title screen starts storm after first interaction
- [ ] Storm continues through Title → Onboarding → Home
- [ ] Storm continues through Home → Write → Home
- [ ] Release sequence: Storm fades → Silence → Nature fades in
- [ ] Exit from release stops all audio immediately
- [ ] Mute toggle stops storm AND thunder
- [ ] Unmute restarts storm
- [ ] No audio overlaps during transitions
- [ ] No "pop" or "click" sounds during fades
- [ ] Audio state persists through navigation
- [ ] One-shot thunder doesn't affect storm state

## Common Issues & Solutions

### Issue: Audio doesn't start on mobile

**Cause:** Mobile autoplay policy requires user gesture

**Solution:** Already handled by global event listeners. Ensure first interaction happens before expecting audio.

### Issue: Storm restarts on every screen

**Cause:** Not checking state before calling `playStorm()`

**Solution:**
```javascript
if (currentState.value === AudioState.STORM) return
```

### Issue: Fade sounds choppy

**Cause:** Too few steps or inconsistent timing

**Solution:** Use 20 steps minimum, consistent interval timing

### Issue: Audio continues after mute

**Cause:** One-shots not tracked

**Solution:** All one-shots must be in `oneShotSources` array for cleanup

## Future Enhancements

Potential improvements (not currently implemented):

1. **Crossfade** - Overlap storm fade-out and nature fade-in
2. **Volume curves** - Exponential instead of linear fades
3. **Audio sprites** - Multiple sounds in one file
4. **Spatial audio** - Panning effects for thunder
5. **Dynamic mixing** - Adjust volumes based on ambient noise
6. **Offline caching** - Service worker audio caching

## Summary

The Downpour audio system demonstrates:

✅ **State machine pattern** for clear audio states
✅ **Singleton pattern** for shared state across components
✅ **Race condition prevention** with immediate state updates
✅ **Manual fade implementation** for precise control
✅ **One-shot tracking** for complete cleanup
✅ **User interaction compliance** for mobile autoplay
✅ **Persistent mute state** via localStorage

**Core principle:** Simple, predictable, debuggable. One state at a time.
