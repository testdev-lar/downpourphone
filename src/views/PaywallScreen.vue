<template>
  <div class="min-h-screen flex flex-col safe-area-top safe-area-bottom relative">
    <!-- Mountain silhouettes -->
    <div class="fixed bottom-0 left-0 right-0 h-[25vh] pointer-events-none">
      <svg viewBox="0 0 400 100" preserveAspectRatio="none" class="w-full h-full">
        <path d="M0 100 L0 60 L50 30 L100 50 L150 20 L200 45 L250 25 L300 55 L350 35 L400 50 L400 100 Z" fill="rgba(30, 41, 59, 0.3)"/>
        <path d="M0 100 L0 70 L80 45 L140 65 L200 40 L280 60 L340 50 L400 70 L400 100 Z" fill="rgba(30, 41, 59, 0.5)"/>
      </svg>
    </div>

    <div class="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
      <div class="max-w-sm w-full text-center">
        <h1 class="text-2xl font-light text-text-primary mb-6">
          You've found something that helps.
        </h1>

        <p class="text-text-muted mb-8 leading-relaxed">
          You've released 7 storms. That means Downpour is working for you.
        </p>

        <p class="text-text-primary mb-8">
          Unlock unlimited releases for just $6.99 — yours forever.
        </p>

        <button
          @click="handleUnlock"
          class="touch-target w-full py-4 bg-accent-light/20 hover:bg-accent-light/30 rounded-xl border border-accent-light/50 text-accent-light text-lg font-medium transition-all active:scale-95 mb-4"
        >
          Unlock Downpour — $6.99
        </button>

        <p class="text-text-muted text-sm mb-8">
          One-time purchase. No subscriptions.
        </p>

        <div class="flex flex-col gap-3">
          <button
            @click="goToArchive"
            class="touch-target py-3 text-text-muted hover:text-text-primary transition-colors"
          >
            Browse your archive
          </button>

          <button
            @click="goToHome"
            class="touch-target py-3 text-text-muted hover:text-text-primary transition-colors"
          >
            Back to home
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAudio } from '../composables/useAudio'
import { useHaptics } from '../composables/useHaptics'
import { useLocalStorage } from '../composables/useLocalStorage'

const router = useRouter()
const { playStorm, syncMutedState } = useAudio()
const { triggerHaptic } = useHaptics()
const { setUnlocked } = useLocalStorage()

onMounted(() => {
  syncMutedState()
  playStorm()
})

const handleUnlock = () => {
  triggerHaptic('heavy')
  // TODO: Integrate Google Play Billing
  // For now, this is a placeholder that will call setUnlocked() after successful purchase
  // setUnlocked()
  // router.push('/home')
}

const goToArchive = () => {
  triggerHaptic('medium')
  router.push('/archive')
}

const goToHome = () => {
  triggerHaptic('medium')
  router.push('/home')
}
</script>
