import { ref } from 'vue'

// Audio States
const AudioState = {
  SILENT: 'silent',
  STORM: 'storm',
  NATURE: 'nature'
}

// Shared state (singleton) - persists across all components
const audioContext = ref(null)
const currentState = ref(AudioState.SILENT)
const activeSource = ref(null)
const activeGainNode = ref(null)
const isReady = ref(false)
const isInitialized = ref(false)

// Track one-shot sounds (thunder) so they can be stopped immediately
const oneShotSources = ref([])

// Operation lock to prevent race conditions
const isOperationInProgress = ref(false)

// Track fadeOut timeout so it can be cancelled
const fadeOutTimeoutId = ref(null)

// Load muted state from localStorage (default: sound ON)
const loadMutedState = () => {
  try {
    const settings = JSON.parse(localStorage.getItem('downpour_settings') || '{"soundEnabled":true}')
    return !settings.soundEnabled
  } catch {
    return false
  }
}
const isMuted = ref(loadMutedState())

const audioFiles = {
  storm: '/audio/storm-heavy.mp3',
  thunder: '/audio/thunder-rumble.mp3',
  nature: '/audio/nature-peaceful.mp3'
}

// Cache for loaded audio buffers
const audioBufferCache = {}

const initAudio = async () => {
  if (audioContext.value) return true

  try {
    audioContext.value = new (window.AudioContext || window.webkitAudioContext)()
    isReady.value = true
    return true
  } catch (e) {
    console.error('Web Audio API not supported:', e)
    isReady.value = false
    return false
  }
}

// Set up global event listeners once
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

export function useAudio() {
  // Load audio buffer (with caching)
  const loadAudioBuffer = async (type) => {
    if (audioBufferCache[type]) return audioBufferCache[type]

    try {
      const response = await fetch(audioFiles[type])
      if (!response.ok) {
        console.error(`Failed to load audio: ${type}`)
        return null
      }

      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await audioContext.value.decodeAudioData(arrayBuffer)
      audioBufferCache[type] = audioBuffer
      return audioBuffer
    } catch (e) {
      console.error(`Error loading audio ${type}:`, e)
      return null
    }
  }

  // Ensure AudioContext is ready
  const ensureAudioReady = async () => {
    // If context is closed or in bad state, recreate it
    if (audioContext.value &&
        (audioContext.value.state === 'closed')) {
      console.log('[Audio] Context is closed, recreating')
      audioContext.value = null
      isReady.value = false
    }

    if (!audioContext.value) {
      const success = await initAudio()
      if (!success) return false
    }

    if (!isReady.value || !audioContext.value) {
      return false
    }

    // Resume context if suspended (mobile autoplay policy)
    if (audioContext.value.state === 'suspended') {
      try {
        await audioContext.value.resume()
      } catch (e) {
        console.error('[Audio] Failed to resume, recreating context')
        audioContext.value = null
        isReady.value = false
        // Retry with fresh context (one attempt)
        const success = await initAudio()
        if (!success) return false
        try {
          await audioContext.value.resume()
        } catch (e2) {
          console.error('[Audio] Still failed after recreate:', e2)
          return false
        }
      }
    }

    return audioContext.value.state === 'running'
  }

  // Stop current audio immediately
  const stopAll = () => {
    console.log('[Audio] stopAll called', {
      hadActiveSource: !!activeSource.value,
      previousState: currentState.value
    })

    // Stop main audio source (storm/nature)
    if (activeSource.value) {
      try {
        // Cancel any scheduled automation (fades) first
        if (activeGainNode.value && audioContext.value) {
          activeGainNode.value.gain.cancelScheduledValues(audioContext.value.currentTime)
          activeGainNode.value.gain.setValueAtTime(0, audioContext.value.currentTime)
        }
        activeSource.value.stop()
        activeGainNode.value?.disconnect()
        activeSource.value.disconnect()
      } catch (e) {
        console.log('[Audio] stopAll error (may be already stopped):', e.message)
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
    console.log('[Audio] stopAll complete, state now SILENT')
  }

  // Play storm sound (only if not already playing)
  const playStorm = async () => {
    console.log('[Audio] playStorm called', {
      isMuted: isMuted.value,
      currentState: currentState.value,
      hasActiveGainNode: !!activeGainNode.value,
      isOperationInProgress: isOperationInProgress.value
    })

    if (isMuted.value) {
      console.log('[Audio] playStorm: Muted, skipping')
      return
    }
    if (currentState.value === AudioState.STORM) {
      console.log('[Audio] playStorm: Already playing storm')
      return // Already playing
    }
    if (isOperationInProgress.value) {
      console.log('[Audio] playStorm: Operation in progress, skipping')
      return
    }

    isOperationInProgress.value = true

    try {
      // Set state IMMEDIATELY to prevent race condition
      currentState.value = AudioState.STORM
      console.log('[Audio] playStorm: State set to STORM immediately')

      if (!(await ensureAudioReady())) {
        console.log('[Audio] playStorm: Audio not ready')
        currentState.value = AudioState.SILENT // Reset on failure
        return
      }

      // Stop any current audio first
      stopAll()

      const audioBuffer = await loadAudioBuffer('storm')
      if (!audioBuffer) {
        console.log('[Audio] playStorm: Failed to load storm buffer')
        currentState.value = AudioState.SILENT // Reset on failure
        return
      }

      const source = audioContext.value.createBufferSource()
      source.buffer = audioBuffer
      source.loop = true

      const gainNode = audioContext.value.createGain()
      gainNode.gain.value = 0.3

      source.connect(gainNode)
      gainNode.connect(audioContext.value.destination)

      activeSource.value = source
      activeGainNode.value = gainNode
      currentState.value = AudioState.STORM // Set state after stopAll cleared it

      source.start()

      console.log('[Audio] playStorm: Storm started successfully', {
        hasActiveGainNode: !!activeGainNode.value,
        currentState: currentState.value
      })
    } catch (e) {
      console.error('Error playing storm:', e)
      currentState.value = AudioState.SILENT // Reset on error
    } finally {
      isOperationInProgress.value = false
    }
  }

  // Fade out current audio and return promise
  // Uses Web Audio API's linearRampToValueAtTime for reliable mobile performance
  const fadeOutCurrent = (duration = 4000) => {
    return new Promise((resolve) => {
      if (!activeGainNode.value || !audioContext.value || currentState.value === AudioState.SILENT) {
        console.log('[Audio] fadeOutCurrent: No active audio to fade')
        resolve()
        return
      }

      console.log('[Audio] fadeOutCurrent: Starting fade with linearRamp', {
        duration,
        currentState: currentState.value,
        startVolume: activeGainNode.value.gain.value
      })

      const gainNode = activeGainNode.value
      const now = audioContext.value.currentTime
      const durationInSeconds = duration / 1000

      // Use Web Audio API's native scheduling - much more reliable than setInterval
      gainNode.gain.setValueAtTime(gainNode.gain.value, now)
      gainNode.gain.linearRampToValueAtTime(0, now + durationInSeconds)

      console.log('[Audio] fadeOutCurrent: Scheduled linearRamp from', gainNode.gain.value, 'to 0 over', durationInSeconds, 'seconds')

      // Clear any previous fade timeout
      if (fadeOutTimeoutId.value) {
        clearTimeout(fadeOutTimeoutId.value)
      }

      // Wait for fade to complete, then stop all audio
      fadeOutTimeoutId.value = setTimeout(() => {
        fadeOutTimeoutId.value = null
        console.log('[Audio] Fade complete, stopping all audio')
        stopAll()
        resolve()
      }, duration + 100) // Small buffer to ensure fade completes
    })
  }

  // Play nature sounds (with fade in)
  const playNature = async (duration = 2000) => {
    console.log('[Audio] playNature called', {
      isMuted: isMuted.value,
      currentState: currentState.value,
      isOperationInProgress: isOperationInProgress.value
    })

    if (isMuted.value) return
    if (currentState.value === AudioState.NATURE) return // Already playing
    if (isOperationInProgress.value) {
      console.log('[Audio] playNature: Operation in progress, skipping')
      return
    }

    isOperationInProgress.value = true

    try {
      // Set state IMMEDIATELY to prevent race condition
      currentState.value = AudioState.NATURE
      console.log('[Audio] playNature: State set to NATURE immediately')

      if (!(await ensureAudioReady())) {
        currentState.value = AudioState.SILENT // Reset on failure
        return
      }

      // Stop any current audio first (should already be stopped after fadeOutCurrent)
      stopAll()

      const audioBuffer = await loadAudioBuffer('nature')
      if (!audioBuffer) {
        currentState.value = AudioState.SILENT // Reset on failure
        return
      }

      const source = audioContext.value.createBufferSource()
      source.buffer = audioBuffer
      source.loop = true

      const gainNode = audioContext.value.createGain()
      gainNode.gain.value = 0 // Start silent for fade in

      source.connect(gainNode)
      gainNode.connect(audioContext.value.destination)

      activeSource.value = source
      activeGainNode.value = gainNode
      currentState.value = AudioState.NATURE // Restore state after stopAll cleared it

      source.start()

      console.log('[Audio] playNature: Nature started, fading in with linearRamp')

      // Fade in using Web Audio API's native scheduling
      const targetVolume = 0.4
      const now = audioContext.value.currentTime
      const durationInSeconds = duration / 1000

      gainNode.gain.setValueAtTime(0, now)
      gainNode.gain.linearRampToValueAtTime(targetVolume, now + durationInSeconds)

      console.log('[Audio] playNature: Scheduled linearRamp from 0 to', targetVolume, 'over', durationInSeconds, 'seconds')
    } catch (e) {
      console.error('Error playing nature:', e)
      currentState.value = AudioState.SILENT // Reset on error
    } finally {
      isOperationInProgress.value = false
    }
  }

  // Play one-shot sound (thunder) - doesn't affect main audio state
  const playOneShot = async (type, volume = 0.5) => {
    if (isMuted.value) return

    if (!(await ensureAudioReady())) return

    try {
      const audioBuffer = await loadAudioBuffer(type)
      if (!audioBuffer) return

      const source = audioContext.value.createBufferSource()
      source.buffer = audioBuffer
      source.loop = false

      const gainNode = audioContext.value.createGain()
      gainNode.gain.value = Math.max(0, Math.min(1, volume))

      source.connect(gainNode)
      gainNode.connect(audioContext.value.destination)

      // Track this one-shot so it can be stopped if muted
      const oneShotEntry = { source, gainNode }
      oneShotSources.value.push(oneShotEntry)

      source.start()

      source.onended = () => {
        // Remove from tracking array
        const index = oneShotSources.value.indexOf(oneShotEntry)
        if (index > -1) {
          oneShotSources.value.splice(index, 1)
        }
        try {
          gainNode.disconnect()
          source.disconnect()
        } catch (e) {
          // Already disconnected
        }
      }
    } catch (e) {
      console.error('Error playing one-shot:', e)
    }
  }

  // Sync muted state from localStorage (call when entering a screen)
  const syncMutedState = () => {
    const stored = loadMutedState()
    if (isMuted.value !== stored) {
      console.log('[Audio] syncMutedState: Syncing from localStorage', { old: isMuted.value, new: stored })
      isMuted.value = stored
      // If now muted, stop any playing audio
      if (isMuted.value) {
        stopAll()
      }
    }
  }

  // Toggle mute state
  const toggleMute = () => {
    isMuted.value = !isMuted.value

    // Save to localStorage immediately
    const settings = { soundEnabled: !isMuted.value }
    localStorage.setItem('downpour_settings', JSON.stringify(settings))

    console.log('[Audio] toggleMute:', { isMuted: isMuted.value, soundEnabled: !isMuted.value })

    if (isMuted.value) {
      stopAll()
    }
  }

  // Check if storm is currently playing
  const isStormPlaying = () => {
    return currentState.value === AudioState.STORM
  }

  // Cancel any pending fade timeout (call when navigating away mid-fade)
  const cancelFade = () => {
    if (fadeOutTimeoutId.value) {
      clearTimeout(fadeOutTimeoutId.value)
      fadeOutTimeoutId.value = null
    }
  }

  return {
    isMuted,
    isReady,
    currentState,
    playStorm,
    playNature,
    playOneShot,
    stopAll,
    fadeOutCurrent,
    toggleMute,
    syncMutedState,
    isStormPlaying,
    cancelFade
  }
}
