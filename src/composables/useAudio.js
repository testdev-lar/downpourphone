import { ref } from 'vue'

// Shared state (singleton) - persists across all components
const audioContext = ref(null)
const currentSound = ref(null)
const isMuted = ref(false)
const isReady = ref(false)
const isInitialized = ref(false)

const audioFiles = {
  light: '/audio/rain-light.mp3',
  heavy: '/audio/rain-heavy.mp3',
  archive: '/audio/rain-archive.mp3',
  release: '/audio/release.mp3'
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
  const playSound = async (type, loop = false, volume = 0.3) => {
    if (isMuted.value) return

    // Try to init audio if not ready (in case user already clicked)
    if (!audioContext.value) {
      await initAudio()
    }

    if (!isReady.value || !audioContext.value) return

    try {
      await audioContext.value.resume()

      // Check cache first
      let audioBuffer = audioBufferCache[type]

      if (!audioBuffer) {
        const response = await fetch(audioFiles[type])
        if (!response.ok) {
          console.error(`Failed to load audio: ${type}`)
          return
        }

        const arrayBuffer = await response.arrayBuffer()
        audioBuffer = await audioContext.value.decodeAudioData(arrayBuffer)
        audioBufferCache[type] = audioBuffer
      }

      const source = audioContext.value.createBufferSource()
      source.buffer = audioBuffer
      source.loop = loop

      const gainNode = audioContext.value.createGain()
      gainNode.gain.value = volume

      source.connect(gainNode)
      gainNode.connect(audioContext.value.destination)

      currentSound.value = { source, gainNode }
      source.start()

      return { source, gainNode }
    } catch (e) {
      console.error('Error playing sound:', e)
    }
  }

  const stopSound = () => {
    if (currentSound.value) {
      try {
        currentSound.value.source.stop()
        currentSound.value = null
      } catch (e) {
        // Ignore errors when stopping already stopped sounds
      }
    }
  }

  const fadeToSound = async (type) => {
    if (isMuted.value) return

    if (currentSound.value) {
      const { gainNode } = currentSound.value

      const fadeOut = setInterval(() => {
        const currentGain = gainNode.gain.value
        if (currentGain > 0.01) {
          gainNode.gain.value = currentGain * 0.9
        } else {
          clearInterval(fadeOut)
          stopSound()
          playSound(type, true)
        }
      }, 50)
    } else {
      playSound(type, true)
    }
  }

  const toggleMute = () => {
    isMuted.value = !isMuted.value
    if (isMuted.value) {
      stopSound()
    }
  }

  const playReleaseSound = () => {
    playSound('release', false, 0.4)
  }

  return {
    isMuted,
    playSound,
    stopSound,
    fadeToSound,
    toggleMute,
    playReleaseSound,
    isReady
  }
}
