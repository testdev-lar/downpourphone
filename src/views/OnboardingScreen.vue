<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center safe-area-top safe-area-bottom px-8 transition-all duration-[2000ms]"
    :style="skyStyle"
  >
    <!-- Skip button (appears after first screen) -->
    <transition name="fade">
      <button
        v-if="currentScreen > 0"
        @click="skipOnboarding"
        class="fixed top-8 right-8 z-50 touch-target px-4 py-2 text-text-muted hover:text-text-primary transition-colors text-sm"
      >
        Skip
      </button>
    </transition>

    <!-- Mountain silhouettes (same as release screen) -->
    <div class="fixed bottom-0 left-0 right-0 h-[25vh] pointer-events-none">
      <svg viewBox="0 0 400 100" preserveAspectRatio="none" class="w-full h-full relative z-10">
        <path
          d="M0 100 L0 60 L50 30 L100 50 L150 20 L200 45 L250 25 L300 55 L350 35 L400 50 L400 100 Z"
          fill="rgba(30, 41, 59, 0.3)"
        />
        <path
          d="M0 100 L0 70 L80 45 L140 65 L200 40 L280 60 L340 50 L400 70 L400 100 Z"
          fill="rgba(30, 41, 59, 0.5)"
        />
      </svg>
    </div>

    <!-- Onboarding content -->
    <div class="relative z-20 w-full max-w-md">
      <!-- Screens 1-4: Text-only screens -->
      <transition name="fade" mode="out-in">
        <div v-if="currentScreen <= 3" :key="currentScreen" class="text-center space-y-6">
          <div class="space-y-3">
            <transition-group name="line-fade" tag="div">
              <p
                v-for="(line, index) in currentScreenLines"
                :key="`${currentScreen}-${index}`"
                class="text-amber-100/90 text-2xl font-light tracking-wide"
              >
                {{ line }}
              </p>
            </transition-group>
          </div>
        </div>

        <!-- Screen 4: Soundscape Feature -->
        <div v-else-if="currentScreen === 4" :key="currentScreen" class="space-y-8">
          <p class="text-amber-100/90 text-2xl font-light tracking-wide text-center">
            Listen to the world wash clean.
          </p>

          <div class="flex justify-center">
            <div
              class="relative bg-bg-secondary/30 border-2 rounded-2xl p-6 backdrop-blur-sm transition-all duration-500"
              :class="highlightSoundscape ? 'border-accent-light shadow-lg shadow-accent-light/30' : 'border-border'"
            >
              <div class="flex items-center justify-between gap-6">
                <div>
                  <p class="text-text-primary font-medium">Sound</p>
                  <p class="text-text-muted text-sm">{{ isMuted ? 'Off' : 'On' }}</p>
                </div>

                <button
                  @click="toggleSound"
                  class="touch-target w-14 h-8 rounded-full transition-all duration-300 relative flex-shrink-0"
                  :class="isMuted ? 'bg-bg-secondary border border-border' : 'bg-accent-light/30'"
                >
                  <div
                    class="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full transition-all duration-300"
                    :class="isMuted ? 'left-1 bg-text-muted' : 'left-[calc(100%-1.75rem)] bg-accent-light'"
                  ></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Screen 5: Emotion Selector -->
        <div v-else-if="currentScreen === 5" :key="currentScreen" class="space-y-8">
          <p class="text-amber-100/90 text-2xl font-light tracking-wide text-center">
            Name what you feel.
          </p>

          <div
            class="p-6 rounded-2xl backdrop-blur-sm transition-all duration-500"
            :class="highlightEmotions ? 'bg-accent-light/5 ring-2 ring-accent-light/40' : 'bg-transparent'"
          >
            <div class="flex flex-wrap justify-center gap-2">
              <button
                v-for="emotion in emotions"
                :key="emotion"
                @click="selectEmotion(emotion)"
                class="touch-target px-5 py-2.5 rounded-full text-sm transition-all border backdrop-blur-sm"
                :class="selectedEmotion === emotion
                  ? 'bg-accent-light/20 border-accent-light/50 text-accent-light'
                  : 'bg-bg-secondary/30 border-border text-text-muted hover:border-accent-light/30'"
              >
                {{ emotion }}
              </button>
            </div>
          </div>
        </div>

        <!-- Screen 6: First Write -->
        <div v-else-if="currentScreen === 6" :key="currentScreen" class="space-y-8">
          <p class="text-amber-100/90 text-2xl font-light tracking-wide text-center mb-8">
            Now, let it fall.
          </p>

          <div class="space-y-4">
            <!-- Emotion selector (smaller, not highlighted) -->
            <div>
              <p class="text-text-muted text-sm mb-3 text-center">How does it feel? (optional)</p>
              <div class="flex flex-wrap justify-center gap-2">
                <button
                  v-for="emotion in emotions"
                  :key="emotion"
                  @click="selectEmotion(emotion)"
                  class="touch-target px-4 py-2 rounded-full text-xs transition-all border backdrop-blur-sm"
                  :class="selectedEmotion === emotion
                    ? 'bg-accent-light/20 border-accent-light/50 text-accent-light'
                    : 'bg-bg-secondary/30 border-border text-text-muted hover:border-accent-light/30'"
                >
                  {{ emotion }}
                </button>
              </div>
            </div>

            <!-- Text input (highlighted) -->
            <div
              class="transition-all duration-500 rounded-2xl"
              :class="highlightTextInput ? 'ring-2 ring-accent-light/40' : ''"
            >
              <textarea
                ref="textInput"
                v-model="text"
                @input="handleInput"
                :maxlength="charLimit"
                rows="5"
                class="w-full bg-bg-secondary/30 border border-border rounded-2xl p-4 text-text-primary placeholder-text-muted/50 resize-none focus:outline-none focus:border-accent-light/50 transition-all backdrop-blur-sm"
                :placeholder="currentPrompt"
              ></textarea>

              <div class="flex justify-between items-center mt-2 px-2">
                <span class="text-sm text-text-muted">
                  {{ text.length }} / {{ charLimit }}
                </span>
              </div>
            </div>

            <!-- Release button -->
            <transition name="fade">
              <button
                v-if="text.trim()"
                @click="handleRelease"
                class="touch-target w-full py-4 mt-4 bg-accent-light/10 hover:bg-accent-light/20 text-accent-light rounded-2xl transition-all duration-300 border border-accent-light/30 backdrop-blur-sm active:scale-95"
              >
                Release
              </button>
            </transition>
          </div>
        </div>
      </transition>
    </div>

    <!-- Tap to continue indicator (pulsing glow at bottom) -->
    <transition name="fade">
      <div
        v-if="showTapIndicator"
        @click="nextScreen"
        class="fixed bottom-12 left-1/2 -translate-x-1/2 z-30 cursor-pointer touch-target"
      >
        <div class="relative w-16 h-16 flex items-center justify-center">
          <div class="absolute inset-0 rounded-full bg-accent-light/20 animate-pulse"></div>
          <div class="absolute inset-2 rounded-full bg-accent-light/30 animate-pulse" style="animation-delay: 0.15s;"></div>
          <div class="absolute inset-4 rounded-full bg-accent-light/40"></div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAudio } from '../composables/useAudio'
import { useLocalStorage } from '../composables/useLocalStorage'
import { useHaptics } from '../composables/useHaptics'

const router = useRouter()
const { toggleMute, isMuted, fadeToSound } = useAudio()
const { saveEntry } = useLocalStorage()
const { triggerHaptic } = useHaptics()

const currentScreen = ref(0)
const selectedEmotion = ref(null)
const text = ref('')
const charLimit = 280
const textInput = ref(null)

// Highlight states for feature screens
const highlightSoundscape = ref(false)
const highlightEmotions = ref(false)
const highlightTextInput = ref(false)

const emotions = [
  'Anxious',
  'Overwhelmed',
  'Frustrated',
  'Sad',
  'Lonely',
  'Exhausted',
  'Angry',
  'Restless'
]

// Daily writing prompts
const writingPrompts = [
  "What's one thing you'd like to let go of today?",
  "What thought keeps circling back?",
  "What are you holding onto that no longer serves you?",
  "What feels too heavy to carry right now?",
  "What would you say if no one was listening?",
  "What needs to fall away?",
  "What emotion is asking to be acknowledged?",
  "What are you resisting feeling?",
  "What truth are you avoiding?",
  "What do you need to release to move forward?"
]

const currentPrompt = ref('')

// Screen content
const screens = [
  {
    lines: [
      'Some feelings are too heavy to carry.',
      'This is a place to set them down.'
    ]
  },
  {
    lines: [
      'Emotions are weather passing through you.',
      'Here, you can let them fall like rain.',
      'No analysis. No fixing. No judgment.'
    ]
  },
  {
    lines: [
      'What you write dissolves from view.',
      "It's saved in your archive, untouched.",
      'This is release, not reflection.'
    ]
  },
  {
    lines: [
      'Just... let it out.'
    ]
  }
]

const currentScreenLines = computed(() => {
  if (currentScreen.value <= 3) {
    return screens[currentScreen.value].lines
  }
  return []
})

const skyStyle = computed(() => {
  return {
    background: 'linear-gradient(to bottom, #1e293b 0%, #334155 100%)'
  }
})

const showTapIndicator = computed(() => {
  // Show on screens 0-5, hide on screen 6 (first write)
  return currentScreen.value < 6
})

onMounted(() => {
  // Select a random prompt
  const randomIndex = Math.floor(Math.random() * writingPrompts.length)
  currentPrompt.value = writingPrompts[randomIndex]

  // Trigger highlights for feature screens
  setTimeout(() => {
    if (currentScreen.value === 4) {
      highlightSoundscape.value = true
    }
  }, 500)
})

const nextScreen = () => {
  if (currentScreen.value < 6) {
    triggerHaptic('medium')
    currentScreen.value++

    // Reset all highlights
    highlightSoundscape.value = false
    highlightEmotions.value = false
    highlightTextInput.value = false

    // Trigger new highlights based on screen
    setTimeout(() => {
      if (currentScreen.value === 4) {
        highlightSoundscape.value = true
      } else if (currentScreen.value === 5) {
        highlightEmotions.value = true
      } else if (currentScreen.value === 6) {
        highlightTextInput.value = true
        // Focus the text input
        nextTick(() => {
          if (textInput.value) {
            textInput.value.focus()
          }
        })
      }
    }, 500)
  }
}

const toggleSound = () => {
  triggerHaptic('medium')
  toggleMute()
  const settings = { soundEnabled: !isMuted.value }
  localStorage.setItem('downpour_settings', JSON.stringify(settings))

  if (!isMuted.value) {
    fadeToSound('storm')
  }
}

const selectEmotion = (emotion) => {
  triggerHaptic('medium')
  selectedEmotion.value = selectedEmotion.value === emotion ? null : emotion
}

const handleInput = () => {
  if (text.value.length > charLimit) {
    text.value = text.value.slice(0, charLimit)
  }
}

const handleRelease = () => {
  if (!text.value.trim()) return

  triggerHaptic('medium')

  saveEntry({
    text: text.value,
    emotion: selectedEmotion.value
  })

  // Mark onboarding as complete
  localStorage.setItem('downpour_onboarding_complete', 'true')

  // Navigate to release screen
  router.push({
    name: 'release',
    state: {
      text: text.value,
      emotion: selectedEmotion.value
    }
  })
}

const skipOnboarding = () => {
  triggerHaptic('medium')
  localStorage.setItem('downpour_onboarding_complete', 'true')
  router.push('/home')
}
</script>

<style scoped>
.bg-gradient-radial {
  background: radial-gradient(ellipse at center, var(--tw-gradient-from), var(--tw-gradient-via), var(--tw-gradient-to));
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Line fade transition for text */
.line-fade-enter-active {
  transition: all 0.8s ease;
}

.line-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

textarea::placeholder {
  color: rgba(139, 146, 153, 0.5);
}
</style>
