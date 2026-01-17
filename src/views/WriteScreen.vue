<template>
  <div class="min-h-screen flex flex-col safe-area-top safe-area-bottom px-6">
    <div class="flex-1 flex flex-col max-w-lg mx-auto w-full">
      <div class="mb-6">
        <button 
          @click="goBack"
          class="touch-target flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors mb-4"
        >
          <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Back
        </button>
        
        <h2 class="text-2xl font-light text-text-primary mb-2">
          What needs to fall away?
        </h2>
        <p class="text-text-muted text-sm">
          {{ mode === 'light' ? 'Light mode' : 'Heavy mode' }}
        </p>
      </div>
      
      <div class="flex-1 flex flex-col gap-4">
        <textarea
          v-model="text"
          @input="handleInput"
          :maxlength="charLimit"
          class="flex-1 w-full bg-bg-secondary/30 border border-border rounded-2xl p-4 text-text-primary placeholder-text-muted/50 resize-none focus:outline-none focus:border-accent-light/50 transition-all backdrop-blur-sm"
          :class="{
            'border-red-500/50': isNearLimit,
            'border-red-500': isAtLimit
          }"
          placeholder="Write what's weighing on you..."
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
        
        <div class="mb-4">
          <p class="text-text-muted text-sm mb-3">How does it feel? (optional)</p>
          <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              v-for="emotion in emotions"
              :key="emotion"
              @click="toggleEmotion(emotion)"
              class="touch-target px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all border backdrop-blur-sm"
              :class="selectedEmotion === emotion 
                ? 'bg-accent-light/20 border-accent-light/50 text-accent-light' 
                : 'bg-bg-secondary/30 border-border text-text-muted hover:border-accent-light/30'"
            >
              {{ emotion }}
            </button>
          </div>
        </div>
      </div>
      
      <button
        @click="handleRelease"
        :disabled="!text.trim() || isAtLimit"
        class="touch-target w-full py-4 bg-accent-light/10 hover:bg-accent-light/20 disabled:bg-bg-secondary/30 disabled:border-border disabled:text-text-muted/50 text-accent-light rounded-2xl transition-all duration-300 border border-accent-light/30 backdrop-blur-sm active:scale-95 disabled:active:scale-100"
      >
        Release
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAudio } from '../composables/useAudio'
import { useLocalStorage } from '../composables/useLocalStorage'

const router = useRouter()
const route = useRoute()
const { fadeToSound, playReleaseSound } = useAudio()
const { saveEntry } = useLocalStorage()

const mode = computed(() => route.params.mode)
const charLimit = computed(() => mode.value === 'light' ? 280 : 600)

const text = ref('')
const selectedEmotion = ref(null)

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

const isNearLimit = computed(() => {
  const threshold = Math.floor(charLimit.value * 0.9)
  return text.value.length >= threshold && text.value.length < charLimit.value
})

const isAtLimit = computed(() => {
  return text.value.length >= charLimit.value
})

onMounted(() => {
  fadeToSound(mode.value)
})

const handleInput = () => {
  if (isAtLimit.value) {
    text.value = text.value.slice(0, charLimit.value)
  }
}

const toggleEmotion = (emotion) => {
  selectedEmotion.value = selectedEmotion.value === emotion ? null : emotion
}

const handleRelease = () => {
  if (!text.value.trim()) return
  
  saveEntry({
    text: text.value,
    mode: mode.value,
    emotion: selectedEmotion.value
  })
  
  playReleaseSound()
  router.push({
    name: 'release',
    state: {
      text: text.value,
      mode: mode.value,
      emotion: selectedEmotion.value
    }
  })
}

const goBack = () => {
  fadeToSound('light')
  router.push('/home')
}
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

textarea::placeholder {
  color: rgba(139, 146, 153, 0.5);
}
</style>
