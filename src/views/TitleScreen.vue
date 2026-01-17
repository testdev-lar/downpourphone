<template>
  <div class="min-h-screen flex flex-col items-center justify-center safe-area-top safe-area-bottom">
    <div class="text-center animate-fade-in">
      <div class="mb-8">
        <div class="w-24 h-24 mx-auto mb-4">
          <svg viewBox="0 0 100 100" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="45" r="30" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
            <path d="M40 75 L45 85 L50 75 L55 85 L60 75" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M35 65 L38 72 L42 65" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M58 68 L61 75 L65 68" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h1 class="text-5xl font-light text-text-primary mb-2">Downpour</h1>
        <p class="text-text-muted text-lg">Let it fall away</p>
      </div>
      
      <button 
        @click="handleBegin"
        class="touch-target px-12 py-4 bg-accent-light/10 hover:bg-accent-light/20 text-accent-light rounded-full transition-all duration-300 border border-accent-light/30 backdrop-blur-sm active:scale-95"
      >
        Begin
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useAudio } from '../composables/useAudio'

const router = useRouter()
const { fadeToSound } = useAudio()

onMounted(() => {
  if (localStorage.getItem('downpour_onboarding_complete') === 'true') {
    router.push('/home')
  }
})

const handleBegin = () => {
  fadeToSound('light')
  router.push('/onboarding')
}
</script>
