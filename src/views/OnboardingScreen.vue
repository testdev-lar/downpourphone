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

    <!-- Mountain silhouettes -->
    <MountainBackground />

    <!-- Onboarding content -->
    <div class="relative z-20 w-full max-w-md">
      <!-- Screens 0-3: Text-only screens -->
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

        <!-- Screen 4: Emotion Selector -->
        <div v-else-if="currentScreen === 4" :key="currentScreen" class="space-y-8">
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

        <!-- Screen 5: First Write -->
        <div v-else-if="currentScreen === 5" :key="currentScreen" class="space-y-8">
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
import MountainBackground from '../components/MountainBackground.vue'
import { CHAR_LIMIT, EMOTIONS, WRITING_PROMPTS } from '../constants/app'
import { useLocalStorage } from '../composables/useLocalStorage'
import { useHaptics } from '../composables/useHaptics'

const router = useRouter()
const { saveEntry } = useLocalStorage()
const { triggerHaptic } = useHaptics()

const currentScreen = ref(0)
const selectedEmotion = ref(null)
const text = ref('')
const charLimit = CHAR_LIMIT
const textInput = ref(null)

// Highlight states for feature screens
const highlightEmotions = ref(false)
const highlightTextInput = ref(false)

const emotions = EMOTIONS
const writingPrompts = WRITING_PROMPTS

const currentPrompt = ref('')

// Screen content (screens 0-3 are text-only)
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
      "There's nothing to solve here."
    ]
  },
  {
    lines: [
      'Your thoughts dissolve from view.',
      "They're kept quietly in your archive.",
      'You can choose whether to revisit.'
    ]
  },
  {
    lines: [
      'Just...let it out.'
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
  // Show on screens 0-3, hide on screen 4 (emotion selector auto-advances) and 5 (first write)
  return currentScreen.value < 4
})

onMounted(() => {
  // Select a random prompt
  const randomIndex = Math.floor(Math.random() * writingPrompts.length)
  currentPrompt.value = writingPrompts[randomIndex]
})

const nextScreen = () => {
  if (currentScreen.value < 5) {
    triggerHaptic('medium')
    currentScreen.value++

    // Reset all highlights
    highlightEmotions.value = false
    highlightTextInput.value = false

    // Trigger new highlights based on screen
    setTimeout(() => {
      if (currentScreen.value === 4) {
        highlightEmotions.value = true
      } else if (currentScreen.value === 5) {
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

const selectEmotion = (emotion) => {
  triggerHaptic('medium')
  selectedEmotion.value = selectedEmotion.value === emotion ? null : emotion

  // Auto-advance from screen 4 (emotion selector) to screen 5 (first write)
  if (currentScreen.value === 4 && selectedEmotion.value) {
    setTimeout(() => {
      nextScreen()
    }, 300)
  }
}

const handleInput = () => {
  if (text.value.length > charLimit) {
    text.value = text.value.slice(0, charLimit)
  }
}

const handleRelease = async () => {
  if (!text.value.trim()) return

  triggerHaptic('medium')

  await saveEntry({
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
