<template>
  <div class="min-h-screen flex flex-col safe-area-top safe-area-bottom relative">
    <div class="flex-1 flex flex-col items-center justify-center px-8">
      <div class="mb-12 text-center animate-fade-in">
        <h1 class="text-4xl font-light text-text-primary">Downpour</h1>
      </div>

      <button
        @click="goToWrite"
        class="touch-target relative group px-12 py-6 bg-bg-secondary/50 hover:bg-bg-secondary/70 rounded-full border border-accent-light/30 transition-all duration-300 active:scale-95 backdrop-blur-sm"
      >
        <span class="text-accent-light text-xl font-light">Let it fall away</span>
        <div class="absolute inset-0 bg-accent-light/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </button>
    </div>

    <div class="fixed bottom-8 left-8 right-8 flex justify-between items-center">
      <button
        @click="goToArchive"
        class="touch-target w-12 h-12 flex items-center justify-center rounded-full bg-bg-secondary/50 border border-border hover:bg-bg-secondary/70 transition-all active:scale-95 backdrop-blur-sm"
        title="Puddle"
      >
        <svg viewBox="0 0 24 24" class="w-6 h-6 text-text-muted" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C12 2 6 9 6 13C6 16.3137 8.68629 19 12 19C15.3137 19 18 16.3137 18 13C18 9 12 2 12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <ellipse cx="12" cy="21" rx="5" ry="1.5" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
        </svg>
      </button>

      <button
        @click="goToSettings"
        class="touch-target w-12 h-12 flex items-center justify-center rounded-full bg-bg-secondary/50 border border-border hover:bg-bg-secondary/70 transition-all active:scale-95 backdrop-blur-sm"
        title="Settings"
      >
        <svg viewBox="0 0 24 24" class="w-6 h-6 text-text-muted" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" stroke-width="2"/>
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1.08-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1.08 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33h.08a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.08a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAudio } from '../composables/useAudio'
import { useHaptics } from '../composables/useHaptics'

const router = useRouter()
const { playStorm } = useAudio()
const { triggerHaptic } = useHaptics()

onMounted(() => {
  // Ensure storm is playing (will be no-op if already playing)
  playStorm()
})

const goToWrite = () => {
  triggerHaptic('medium')
  router.push('/write')
}

const goToArchive = () => {
  triggerHaptic('medium')
  // Storm continues playing
  router.push('/archive')
}

const goToSettings = () => {
  triggerHaptic('medium')
  // Storm continues playing
  router.push('/settings')
}
</script>
