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
          <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAudio } from '../composables/useAudio'

const router = useRouter()
const { fadeToSound, isMuted, isPlaying } = useAudio()

onMounted(() => {
  // Start storm sound if not muted and no sound is playing
  if (!isMuted.value && !isPlaying('storm') && !isPlaying('nature')) {
    fadeToSound('storm')
  }
})

const goToWrite = () => {
  router.push('/write')
}

const goToArchive = () => {
  fadeToSound('light')
  router.push('/archive')
}

const goToSettings = () => {
  router.push('/settings')
}
</script>
