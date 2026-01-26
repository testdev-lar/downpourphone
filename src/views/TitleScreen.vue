<template>
  <div class="min-h-screen flex flex-col items-center justify-center safe-area-top safe-area-bottom relative">
    <!-- Mountain silhouettes -->
    <div class="fixed bottom-0 left-0 right-0 h-[25vh] pointer-events-none">
      <svg viewBox="0 0 400 100" preserveAspectRatio="none" class="w-full h-full">
        <path d="M0 100 L0 60 L50 30 L100 50 L150 20 L200 45 L250 25 L300 55 L350 35 L400 50 L400 100 Z" fill="rgba(30, 41, 59, 0.3)"/>
        <path d="M0 100 L0 70 L80 45 L140 65 L200 40 L280 60 L340 50 L400 70 L400 100 Z" fill="rgba(30, 41, 59, 0.5)"/>
      </svg>
    </div>

    <div class="text-center animate-fade-in relative z-10">
      <div class="mb-8">
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
const { playStorm } = useAudio()

onMounted(() => {
  // Start storm sound immediately on title screen
  playStorm()

  // If onboarding complete, redirect to home
  if (localStorage.getItem('downpour_onboarding_complete') === 'true') {
    router.push('/home')
  }
})

const handleBegin = () => {
  // Storm continues playing - no audio change needed
  router.push('/onboarding')
}
</script>
