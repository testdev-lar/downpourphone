import { ref } from 'vue'

// Shared state (singleton) - persists across all components
const audioContext = ref(null)
const activeSounds = ref({})  // Track multiple sounds by key
const isReady = ref(false)
const isInitialized = ref(false)

// Load muted state from localStorage
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
  light: '/audio/rain-light.mp3',
  storm: '/audio/storm-heavy.mp3',
  thunder: '/audio/thunder-rumble.mp3',
  nature: '/audio/nature-peaceful.mp3'
}

// Cache for loaded audio buffers
const audioBufferCache = {}

const initAudio = async () => {
  if (audioContext.value) return

  try {
    audioContext.value = new (window.AudioContext || window.webkitAudioContext)()
    isReady.value = true
  } catch (e) {
    console.error('Web Audio API not supported:', e)
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

  // Play ambient/looping sound
  const playAmbient = async (type, volume = 0.3) => {
    if (isMuted.value) return

    if (!audioContext.value) {
      await initAudio()
    }

    if (!isReady.value || !audioContext.value) return

    try {
      await audioContext.value.resume()

      const audioBuffer = await loadAudioBuffer(type)
      if (!audioBuffer) return

      const source = audioContext.value.createBufferSource()
      source.buffer = audioBuffer
      source.loop = true

      const gainNode = audioContext.value.createGain()
      gainNode.gain.value = volume

      source.connect(gainNode)
      gainNode.connect(audioContext.value.destination)

      // Store in active sounds
      activeSounds.value[type] = { source, gainNode, volume }
      source.start()

      return { source, gainNode }
    } catch (e) {
      console.error('Error playing ambient:', e)
    }
  }

  // Play one-shot sound (doesn't stop other sounds)
  const playOneShot = async (type, volume = 0.5) => {
    if (isMuted.value) return

    if (!audioContext.value) {
      await initAudio()
    }

    if (!isReady.value || !audioContext.value) return

    try {
      await audioContext.value.resume()

      const audioBuffer = await loadAudioBuffer(type)
      if (!audioBuffer) return

      const source = audioContext.value.createBufferSource()
      source.buffer = audioBuffer
      source.loop = false

      const gainNode = audioContext.value.createGain()
      gainNode.gain.value = volume

      source.connect(gainNode)
      gainNode.connect(audioContext.value.destination)

      source.start()

      // Clean up when done
      source.onended = () => {
        source.disconnect()
        gainNode.disconnect()
      }
    } catch (e) {
      console.error('Error playing one-shot:', e)
    }
  }

  // Fade out a specific sound
  const fadeOutSound = (type, duration = 2000) => {
    const sound = activeSounds.value[type]
    if (!sound) return

    const { gainNode, source } = sound
    const startVolume = gainNode.gain.value
    const steps = 20
    const stepTime = duration / steps
    const volumeStep = startVolume / steps
    let currentStep = 0

    const fadeInterval = setInterval(() => {
      currentStep++
      const newVolume = Math.max(0, startVolume - (volumeStep * currentStep))
      gainNode.gain.value = newVolume

      if (currentStep >= steps) {
        clearInterval(fadeInterval)
        try {
          source.stop()
        } catch (e) {
          // Already stopped
        }
        delete activeSounds.value[type]
      }
    }, stepTime)
  }

  // Fade in a new ambient sound
  const fadeInSound = async (type, duration = 2000, targetVolume = 0.3) => {
    if (isMuted.value) return

    if (!audioContext.value) {
      await initAudio()
    }

    if (!isReady.value || !audioContext.value) return

    try {
      await audioContext.value.resume()

      const audioBuffer = await loadAudioBuffer(type)
      if (!audioBuffer) return

      const source = audioContext.value.createBufferSource()
      source.buffer = audioBuffer
      source.loop = true

      const gainNode = audioContext.value.createGain()
      gainNode.gain.value = 0

      source.connect(gainNode)
      gainNode.connect(audioContext.value.destination)

      activeSounds.value[type] = { source, gainNode, volume: targetVolume }
      source.start()

      // Fade in
      const steps = 20
      const stepTime = duration / steps
      const volumeStep = targetVolume / steps
      let currentStep = 0

      const fadeInterval = setInterval(() => {
        currentStep++
        gainNode.gain.value = Math.min(targetVolume, volumeStep * currentStep)

        if (currentStep >= steps) {
          clearInterval(fadeInterval)
        }
      }, stepTime)
    } catch (e) {
      console.error('Error fading in sound:', e)
    }
  }

  // Crossfade from one sound to another
  const crossfade = async (fromType, toType, duration = 3000, toVolume = 0.3) => {
    fadeOutSound(fromType, duration)
    await fadeInSound(toType, duration, toVolume)
  }

  // Stop a specific sound immediately
  const stopSoundByType = (type) => {
    const sound = activeSounds.value[type]
    if (sound) {
      try {
        sound.source.stop()
      } catch (e) {
        // Already stopped
      }
      delete activeSounds.value[type]
    }
  }

  // Stop all sounds
  const stopSound = () => {
    Object.keys(activeSounds.value).forEach(type => {
      stopSoundByType(type)
    })
  }

  // Fade to a new sound (legacy compatibility)
  const fadeToSound = async (type, volume = 0.3) => {
    if (isMuted.value) return

    // Fade out all current sounds
    Object.keys(activeSounds.value).forEach(soundType => {
      fadeOutSound(soundType, 1000)
    })

    // Wait a bit then start new sound
    setTimeout(() => {
      playAmbient(type, volume)
    }, 500)
  }

  const toggleMute = () => {
    isMuted.value = !isMuted.value
    if (isMuted.value) {
      stopSound()
    }
  }

  // Check if a specific sound is currently playing
  const isPlaying = (type) => {
    return !!activeSounds.value[type]
  }

  return {
    isMuted,
    isReady,
    activeSounds,
    isPlaying,
    playAmbient,
    playOneShot,
    fadeOutSound,
    fadeInSound,
    crossfade,
    stopSound,
    stopSoundByType,
    fadeToSound,
    toggleMute
  }
}
