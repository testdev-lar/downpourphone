<template>
  <div class="min-h-screen flex flex-col items-center justify-center safe-area-top safe-area-bottom">
    <div class="text-center animate-fade-in">
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
