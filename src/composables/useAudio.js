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
        console.error('Failed to resume AudioContext:', e)
        return false
      }
    }

    return true
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
        activeSource.value.stop()
        activeGainNode.value?.disconnect()
        activeSource.value.disconnect()
      } catch (e) {
        // Already stopped
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
      hasActiveGainNode: !!activeGainNode.value
    })

    if (isMuted.value) {
      console.log('[Audio] playStorm: Muted, skipping')
      return
    }
    if (currentState.value === AudioState.STORM) {
      console.log('[Audio] playStorm: Already playing storm')
      return // Already playing
    }

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

    try {
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
    }
  }

  // Fade out current audio and return promise
  const fadeOutCurrent = (duration = 4000) => {
    return new Promise((resolve) => {
      if (!activeGainNode.value || currentState.value === AudioState.SILENT) {
        console.log('[Audio] fadeOutCurrent: No active audio to fade')
        resolve()
        return
      }

      console.log('[Audio] fadeOutCurrent: Starting fade', {
        duration,
        currentState: currentState.value,
        startVolume: activeGainNode.value.gain.value
      })

      const startVolume = activeGainNode.value.gain.value
      const steps = 20
      const stepTime = duration / steps
      const volumeStep = startVolume / steps
      let currentStep = 0

      const fadeInterval = setInterval(() => {
        currentStep++
        const newVolume = Math.max(0, startVolume - (volumeStep * currentStep))

        if (activeGainNode.value) {
          activeGainNode.value.gain.value = newVolume
          if (currentStep % 5 === 0) { // Log every 5 steps
            console.log('[Audio] Fading...', { step: currentStep, volume: newVolume.toFixed(3) })
          }
        }

        if (currentStep >= steps) {
          clearInterval(fadeInterval)
          console.log('[Audio] Fade complete, stopping all audio')
          stopAll()
          resolve()
        }
      }, stepTime)
    })
  }

  // Play nature sounds (with fade in)
  const playNature = async (duration = 2000) => {
    console.log('[Audio] playNature called', {
      isMuted: isMuted.value,
      currentState: currentState.value
    })

    if (isMuted.value) return
    if (currentState.value === AudioState.NATURE) return // Already playing

    // Set state IMMEDIATELY to prevent race condition
    currentState.value = AudioState.NATURE
    console.log('[Audio] playNature: State set to NATURE immediately')

    if (!(await ensureAudioReady())) {
      currentState.value = AudioState.SILENT // Reset on failure
      return
    }

    // Stop any current audio first (should already be stopped after fadeOutCurrent)
    stopAll()

    try {
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

      source.start()

      console.log('[Audio] playNature: Nature started, fading in')

      // Fade in
      const targetVolume = 0.4
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
          console.log('[Audio] playNature: Fade in complete')
        }
      }, stepTime)
    } catch (e) {
      console.error('Error playing nature:', e)
      currentState.value = AudioState.SILENT // Reset on error
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

  // Toggle mute state
  const toggleMute = () => {
    isMuted.value = !isMuted.value

    // Save to localStorage immediately
    const settings = { soundEnabled: !isMuted.value }
    localStorage.setItem('downpour_settings', JSON.stringify(settings))

    if (isMuted.value) {
      stopAll()
    }
  }

  // Check if storm is currently playing
  const isStormPlaying = () => {
    return currentState.value === AudioState.STORM
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
    isStormPlaying
  }
}
