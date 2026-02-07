<template>
  <div class="min-h-screen flex flex-col items-center justify-center safe-area-top safe-area-bottom px-6 relative">
    <!-- Mountain silhouettes -->
    <MountainBackground />

    <div class="w-full max-w-md relative z-10">
      <div class="mb-6">
        <button
          @click="goBack"
          class="touch-target flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors mb-6"
        >
          <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Back
        </button>

        <h2 class="text-2xl font-light text-text-primary text-center">
          What needs to fall away?
        </h2>
      </div>

      <div class="flex flex-col gap-4">
        <textarea
          v-model="text"
          @input="handleInput"
          :maxlength="charLimit"
          rows="5"
          class="w-full bg-bg-secondary/30 border border-border rounded-2xl p-4 text-text-primary placeholder-text-muted/50 resize-none focus:outline-none focus:border-accent-light/50 transition-all backdrop-blur-sm"
          :class="{
            'border-red-500/50': isNearLimit,
            'border-red-500': isAtLimit
          }"
          :placeholder="currentPrompt"
        ></textarea>

        <div class="flex justify-between items-center">
          <span
            class="text-sm transition-colors"
            :class="{
              'text-red-400': isAtLimit,
              'text-red-400/70': isNearLimit && !isAtLimit,
              'text-text-muted': !isNearLimit
            }"
          >
            {{ text.length }} / {{ charLimit }}
          </span>
          <span v-if="isAtLimit" class="text-sm text-red-400">Limit reached</span>
        </div>

        <div class="mt-2">
          <p class="text-text-muted text-sm mb-3 text-center">How does it feel? (optional)</p>
          <div class="flex flex-wrap justify-center gap-2">
            <button
              v-for="emotion in emotions"
              :key="emotion"
              @click="toggleEmotion(emotion)"
              class="touch-target px-5 py-2.5 rounded-full text-sm transition-all border backdrop-blur-sm"
              :class="selectedEmotion === emotion
                ? 'bg-accent-light/20 border-accent-light/50 text-accent-light'
                : 'bg-bg-secondary/30 border-border text-text-muted hover:border-accent-light/30'"
            >
              {{ emotion }}
            </button>
          </div>
        </div>

        <button
          @click="handleRelease"
          :disabled="!text.trim() || isSubmitting"
          class="touch-target w-full py-4 mt-4 bg-accent-light/10 hover:bg-accent-light/20 disabled:bg-bg-secondary/30 disabled:border-border disabled:text-text-muted/50 text-accent-light rounded-2xl transition-all duration-300 border border-accent-light/30 backdrop-blur-sm active:scale-95 disabled:active:scale-100"
        >
          {{ isSubmitting ? 'Releasing...' : 'Release' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MountainBackground from '../components/MountainBackground.vue'
import { CHAR_LIMIT, EMOTIONS, WRITING_PROMPTS } from '../constants/app'
import { useLocalStorage } from '../composables/useLocalStorage'
import { useHaptics } from '../composables/useHaptics'

const router = useRouter()
const { saveEntry, hasReachedLimit } = useLocalStorage()
const { triggerHaptic } = useHaptics()

const charLimit = CHAR_LIMIT

const text = ref('')
const selectedEmotion = ref(null)
const isSubmitting = ref(false)

const emotions = EMOTIONS
const writingPrompts = WRITING_PROMPTS

const currentPrompt = ref('')

// Get or set session prompt (changes after each release)
const getSessionPrompt = () => {
  const storedPrompt = sessionStorage.getItem('downpour_current_prompt')
  if (storedPrompt) {
    return storedPrompt
  }
  // No stored prompt, generate a new one
  const randomIndex = Math.floor(Math.random() * writingPrompts.length)
  const newPrompt = writingPrompts[randomIndex]
  sessionStorage.setItem('downpour_current_prompt', newPrompt)
  return newPrompt
}

onMounted(() => {
  // Redirect to paywall if limit reached
  if (hasReachedLimit.value) {
    router.replace('/paywall')
    return
  }
  currentPrompt.value = getSessionPrompt()
})

const isNearLimit = computed(() => {
  const threshold = Math.floor(charLimit * 0.9)
  return text.value.length >= threshold && text.value.length < charLimit
})

const isAtLimit = computed(() => {
  return text.value.length >= charLimit
})

const sanitizeInput = (text) => {
  return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
}

const handleInput = () => {
  text.value = sanitizeInput(text.value)
  if (isAtLimit.value) {
    text.value = text.value.slice(0, charLimit)
  }
}

const toggleEmotion = (emotion) => {
  triggerHaptic('medium')
  selectedEmotion.value = selectedEmotion.value === emotion ? null : emotion
}

const handleRelease = async () => {
  if (!text.value.trim()) return
  if (isSubmitting.value) return // Prevent duplicate submissions

  // Safety check for paywall limit
  if (hasReachedLimit.value) {
    router.push('/paywall')
    return
  }

  isSubmitting.value = true
  triggerHaptic('medium')

  await saveEntry({
    text: text.value,
    emotion: selectedEmotion.value
  })

  // Clear the session prompt so a new one is generated next time
  sessionStorage.removeItem('downpour_current_prompt')

  router.push({
    name: 'release',
    state: {
      text: text.value,
      emotion: selectedEmotion.value
    }
  })
}

const goBack = () => {
  triggerHaptic('medium')
  router.push('/home')
}
</script>

<style scoped>
textarea::placeholder {
  color: rgba(139, 146, 153, 0.5);
}
</style>
