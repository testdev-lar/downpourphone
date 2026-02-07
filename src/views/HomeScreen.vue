<template>
  <div class="min-h-screen flex flex-col safe-area-top safe-area-bottom relative">
    <!-- Mountain silhouettes -->
    <MountainBackground />

    <div class="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
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

    <div class="fixed bottom-8 left-8 right-8 flex justify-between items-center z-10">
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

      <div class="flex items-center gap-3">
        <button
          @click="showGuide = true"
          class="touch-target w-12 h-12 flex items-center justify-center rounded-full bg-bg-secondary/50 border border-border hover:bg-bg-secondary/70 transition-all active:scale-95 backdrop-blur-sm"
          title="How to use"
        >
          <svg viewBox="0 0 24 24" class="w-6 h-6 text-text-muted" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="17" r="1" fill="currentColor"/>
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

    <!-- How to use guide modal -->
    <div
      v-if="showGuide"
      class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center px-6 z-50"
      @click.self="showGuide = false"
    >
      <div class="bg-bg-secondary border border-border rounded-2xl p-6 max-w-sm w-full backdrop-blur-sm max-h-[80vh] overflow-y-auto">
        <h3 class="text-xl font-light text-text-primary mb-4">How it works</h3>

        <div class="space-y-4 text-sm">
          <div>
            <p class="text-text-primary font-medium mb-1">When to use it</p>
            <p class="text-text-muted">Those nights when your brain won't quiet down. When you're still carrying something you couldn't say. When you need to get something out but there's no one to say it to.</p>
          </div>

          <div>
            <p class="text-text-primary font-medium mb-1">What to do</p>
            <p class="text-text-muted">Write whatever's stuck in your head. It doesn't need to make sense. Hit release, watch it dissolve, then close the app and move on.</p>
          </div>

          <div>
            <p class="text-text-primary font-medium mb-1">The idea</p>
            <p class="text-text-muted">This isn't about tracking feelings or analysing what you wrote. It's just a place to set things down.</p>
          </div>

          <div>
            <p class="text-text-primary font-medium mb-1">Your archive</p>
            <p class="text-text-muted">Everything is saved privately on your device. Look back if you want, or never open it.</p>
          </div>
        </div>

        <button
          @click="showGuide = false"
          class="touch-target w-full py-3 mt-6 bg-bg-secondary border border-border rounded-xl text-text-primary hover:bg-bg-secondary/80 transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MountainBackground from '../components/MountainBackground.vue'
import { useRouter } from 'vue-router'
import { useAudio } from '../composables/useAudio'
import { useHaptics } from '../composables/useHaptics'
import { useLocalStorage } from '../composables/useLocalStorage'

const router = useRouter()
const { playStorm, syncMutedState } = useAudio()
const { triggerHaptic } = useHaptics()
const { hasReachedLimit } = useLocalStorage()

const showGuide = ref(false)

onMounted(() => {
  // Sync muted state from localStorage in case it changed
  syncMutedState()
  // Ensure storm is playing (will be no-op if already playing)
  playStorm()
})

const goToWrite = () => {
  triggerHaptic('medium')
  if (hasReachedLimit.value) {
    router.push('/paywall')
  } else {
    router.push('/write')
  }
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
