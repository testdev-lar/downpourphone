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
    currentState.value = AudioState.SILENT
  }

  // Play storm sound (only if not already playing)
  const playStorm = async () => {
    if (isMuted.value) return
    if (currentState.value === AudioState.STORM) return // Already playing

    if (!(await ensureAudioReady())) return

    // Stop any current audio first
    stopAll()

    try {
      const audioBuffer = await loadAudioBuffer('storm')
      if (!audioBuffer) return

      const source = audioContext.value.createBufferSource()
      source.buffer = audioBuffer
      source.loop = true

      const gainNode = audioContext.value.createGain()
      gainNode.gain.value = 0.3

      source.connect(gainNode)
      gainNode.connect(audioContext.value.destination)

      activeSource.value = source
      activeGainNode.value = gainNode
      currentState.value = AudioState.STORM

      source.start()
    } catch (e) {
      console.error('Error playing storm:', e)
    }
  }

  // Fade out current audio and return promise
  const fadeOutCurrent = (duration = 2000) => {
    return new Promise((resolve) => {
      if (!activeGainNode.value || currentState.value === AudioState.SILENT) {
        resolve()
        return
      }

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
        }

        if (currentStep >= steps) {
          clearInterval(fadeInterval)
          stopAll()
          resolve()
        }
      }, stepTime)
    })
  }

  // Play nature sounds (with fade in)
  const playNature = async (duration = 2000) => {
    if (isMuted.value) return
    if (currentState.value === AudioState.NATURE) return // Already playing

    if (!(await ensureAudioReady())) return

    // Stop any current audio first (should already be stopped after fadeOutCurrent)
    stopAll()

    try {
      const audioBuffer = await loadAudioBuffer('nature')
      if (!audioBuffer) return

      const source = audioContext.value.createBufferSource()
      source.buffer = audioBuffer
      source.loop = true

      const gainNode = audioContext.value.createGain()
      gainNode.gain.value = 0 // Start silent for fade in

      source.connect(gainNode)
      gainNode.connect(audioContext.value.destination)

      activeSource.value = source
      activeGainNode.value = gainNode
      currentState.value = AudioState.NATURE

      source.start()

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
        }
      }, stepTime)
    } catch (e) {
      console.error('Error playing nature:', e)
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

      source.start()

      source.onended = () => {
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
