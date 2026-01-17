<template>
  <div class="min-h-screen flex flex-col items-center justify-center safe-area-top safe-area-bottom px-6">
    <transition name="fade">
      <div v-if="showText" class="max-w-lg w-full">
        <div 
          class="relative bg-bg-secondary/30 border border-border rounded-2xl p-6 backdrop-blur-sm"
          :class="isDissolving ? 'dissolve' : ''"
        >
          <p class="text-text-primary text-lg leading-relaxed">{{ text }}</p>
          
          <div v-if="emotion" class="mt-4 inline-block px-3 py-1 rounded-full text-sm text-accent-light bg-accent-light/10">
            {{ emotion }}
          </div>
        </div>
      </div>
    </transition>
    
    <transition name="fade">
      <div v-if="!showText" class="text-center">
        <div class="mb-8">
          <div class="w-32 h-32 mx-auto">
            <svg viewBox="0 0 100 100" class="w-full h-full animate-pulse-slow" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="45" r="30" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.3"/>
              <path d="M40 75 L45 85 L50 75 L55 85 L60 75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/>
              <path d="M35 65 L38 72 L42 65" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.4"/>
              <path d="M58 68 L61 75 L65 68" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.4"/>
            </svg>
          </div>
        </div>
        
        <p class="text-text-muted text-lg mb-8">It's gone now.</p>
        
        <button 
          @click="goHome"
          class="touch-target px-8 py-3 bg-accent-light/10 hover:bg-accent-light/20 text-accent-light rounded-full transition-all duration-300 border border-accent-light/30 backdrop-blur-sm active:scale-95"
        >
          Return
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAudio } from '../composables/useAudio'

const router = useRouter()
const { fadeToSound } = useAudio()

const text = ref('')
const mode = ref('')
const emotion = ref('')
const showText = ref(true)
const isDissolving = ref(false)

onMounted(() => {
  const historyState = router.options.history.state
  if (historyState) {
    text.value = historyState.text || ''
    mode.value = historyState.mode || 'light'
    emotion.value = historyState.emotion || null
  }
  
  startDissolve()
})

const startDissolve = () => {
  setTimeout(() => {
    isDissolving.value = true
  }, 500)
  
  setTimeout(() => {
    showText.value = false
  }, 2500)
}

const goHome = () => {
  fadeToSound('light')
  router.push('/home')
}
</script>

<style scoped>
.dissolve {
  animation: dissolve 2s ease-out forwards;
}

@keyframes dissolve {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
  30% {
    opacity: 0.8;
    transform: translateY(-20px) scale(1.02);
    filter: blur(1px);
  }
  60% {
    opacity: 0.4;
    transform: translateY(-50px) scale(0.95);
    filter: blur(4px);
  }
  100% {
    opacity: 0;
    transform: translateY(-100px) scale(0.8);
    filter: blur(10px);
  }
}
</style>
