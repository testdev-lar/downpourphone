<template>
  <div class="min-h-screen flex flex-col safe-area-top safe-area-bottom relative">
    <!-- Mountain silhouettes -->
    <div class="fixed bottom-0 left-0 right-0 h-[25vh] pointer-events-none z-0">
      <svg viewBox="0 0 400 100" preserveAspectRatio="none" class="w-full h-full">
        <path d="M0 100 L0 60 L50 30 L100 50 L150 20 L200 45 L250 25 L300 55 L350 35 L400 50 L400 100 Z" fill="rgba(30, 41, 59, 0.3)"/>
        <path d="M0 100 L0 70 L80 45 L140 65 L200 40 L280 60 L340 50 L400 70 L400 100 Z" fill="rgba(30, 41, 59, 0.5)"/>
      </svg>
    </div>

    <div class="px-6 py-6 border-b border-border bg-bg-primary/95 backdrop-blur-sm relative z-10">
      <div class="flex items-center justify-between max-w-lg mx-auto">
        <button
          @click="goBack"
          class="touch-target flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors"
        >
          <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Back
        </button>

        <h1
          class="text-xl font-light text-text-primary"
          @touchstart="handleTitlePress"
          @touchend="handleTitleRelease"
          @mousedown="handleTitlePress"
          @mouseup="handleTitleRelease"
        >
          Settings
        </h1>

        <div class="w-12"></div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto py-6 px-6 relative z-10">
      <div class="max-w-lg mx-auto space-y-6">
        <div class="bg-bg-secondary/40 border border-border rounded-2xl p-4 backdrop-blur-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-text-primary font-medium">Sound</p>
              <p class="text-text-muted text-sm">{{ isMuted ? 'Off' : 'On' }}</p>
            </div>

            <button
              @click="toggleSound"
              class="touch-target w-14 h-8 rounded-full transition-all duration-300 relative flex-shrink-0"
              :class="isMuted ? 'bg-bg-secondary border border-border' : 'bg-accent-light/30'"
            >
              <div
                class="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full transition-all duration-300"
                :class="isMuted ? 'left-1 bg-text-muted' : 'left-[calc(100%-1.75rem)] bg-accent-light'"
              ></div>
            </button>
          </div>
        </div>

        <div class="bg-bg-secondary/40 border border-border rounded-2xl p-4 backdrop-blur-sm">
          <button
            @click="handleReplayTutorial"
            class="touch-target w-full flex items-center justify-between"
          >
            <div class="text-left">
              <p class="text-text-primary font-medium">Replay Tutorial</p>
              <p class="text-text-muted text-sm">See the onboarding again</p>
            </div>

            <svg viewBox="0 0 24 24" class="w-6 h-6 text-text-muted" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <div class="bg-bg-secondary/40 border border-border rounded-2xl p-4 backdrop-blur-sm">
          <div>
            <p class="text-text-primary font-medium mb-1">About</p>
            <p class="text-text-muted text-sm">Downpour</p>
            <p class="text-text-muted/60 text-xs mt-1">Version 1.0.0</p>
            <p class="text-text-muted text-xs mt-2">
              A minimalist emotional release journaling app. Write what's weighing on you, then let it rain away.
            </p>
          </div>
        </div>

        <div class="bg-bg-secondary/40 border border-border rounded-2xl overflow-hidden backdrop-blur-sm">
          <a
            href="https://x.com/ascensciana"
            target="_blank"
            rel="noopener noreferrer"
            class="touch-target w-full px-4 py-4 flex items-center gap-3 text-left hover:bg-accent-light/10 transition-colors"
          >
            <div class="w-10 h-10 rounded-full bg-accent-light/10 flex items-center justify-center">
              <svg viewBox="0 0 24 24" class="w-5 h-5 text-accent-light" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-text-primary font-medium">Connect with the creator</p>
              <p class="text-text-muted text-sm">@ascensciana on X</p>
            </div>
            <svg viewBox="0 0 24 24" class="w-6 h-6 text-text-muted" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>

        <div class="bg-bg-secondary/40 border border-border rounded-2xl overflow-hidden backdrop-blur-sm">
          <a
            href="https://testdev-lar.github.io/ascensciana-landing/"
            target="_blank"
            rel="noopener noreferrer"
            class="touch-target w-full px-4 py-4 flex items-center gap-3 text-left hover:bg-accent-light/10 transition-colors"
          >
            <div class="w-10 h-10 rounded-full bg-accent-light/10 flex items-center justify-center">
              <svg viewBox="0 0 24 24" class="w-5 h-5 text-accent-light" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-text-primary font-medium">Visit Ascensciana</p>
              <p class="text-text-muted text-sm">Official website</p>
            </div>
            <svg viewBox="0 0 24 24" class="w-6 h-6 text-text-muted" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAudio } from '../composables/useAudio'
import { useHaptics } from '../composables/useHaptics'
import { useLocalStorage } from '../composables/useLocalStorage'

const router = useRouter()
const { toggleMute, isMuted, stopAll, playStorm } = useAudio()
const { triggerHaptic } = useHaptics()
const { resetUsageForDemo } = useLocalStorage()

let longPressTimer = null

const handleTitlePress = () => {
  longPressTimer = setTimeout(() => {
    triggerHaptic('heavy')
    if (confirm('Reset usage counter for demo?')) {
      resetUsageForDemo()
      alert('Demo reset complete! App now shows as if it has 0 uses.')
    }
  }, 3000) // 3 second long press
}

const handleTitleRelease = () => {
  if (longPressTimer) {
    clearTimeout(longPressTimer)
    longPressTimer = null
  }
}

const toggleSound = () => {
  triggerHaptic('medium')
  toggleMute() // Now handles localStorage internally

  // If sound was just enabled, start playing storm immediately
  if (!isMuted.value) {
    playStorm()
  }
}

const handleReplayTutorial = () => {
  triggerHaptic('medium')
  localStorage.removeItem('downpour_onboarding_complete')
  // Storm continues playing through onboarding
  router.push('/onboarding')
}

const goBack = () => {
  triggerHaptic('medium')
  // Storm continues playing
  router.push('/home')
}
</script>
