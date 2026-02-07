<template>
  <div class="min-h-screen flex flex-col safe-area-top safe-area-bottom relative">
    <!-- Mountain silhouettes -->
    <MountainBackground />

    <div class="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
      <div class="max-w-sm w-full text-center">
        <h1 class="text-2xl font-light text-text-primary mb-6">
          You've found something that helps.
        </h1>

        <p class="text-text-muted mb-8 leading-relaxed">
          You've released 7 times. That means Downpour is working for you.
        </p>

        <p class="text-text-primary mb-8">
          Unlock unlimited releases for just $6.99 — yours forever.
        </p>

        <!-- Error message -->
        <p v-if="errorMessage" class="text-red-400 text-sm mb-4">
          {{ errorMessage }}
        </p>

        <!-- Main unlock button -->
        <button
          @click="handleUnlock"
          :disabled="isPurchasing"
          class="touch-target w-full py-4 bg-accent-light/20 hover:bg-accent-light/30 disabled:bg-bg-secondary/30 disabled:border-border disabled:text-text-muted/50 rounded-xl border border-accent-light/50 text-accent-light text-lg font-medium transition-all active:scale-95 disabled:active:scale-100 mb-4"
        >
          <span v-if="isPurchasing">Processing...</span>
          <span v-else>Unlock Downpour — $6.99</span>
        </button>

        <p class="text-text-muted text-sm mb-8">
          One-time purchase. No subscriptions.
        </p>

        <div class="flex flex-col gap-3">
          <!-- Restore purchase option -->
          <button
            v-if="billingAvailable"
            @click="handleRestore"
            :disabled="isRestoring"
            class="touch-target py-3 text-text-muted hover:text-text-primary transition-colors"
          >
            <span v-if="isRestoring">Restoring...</span>
            <span v-else>Restore purchase</span>
          </button>

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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MountainBackground from '../components/MountainBackground.vue'
import { useAudio } from '../composables/useAudio'
import { useHaptics } from '../composables/useHaptics'
import { useBilling } from '../composables/useBilling'

const router = useRouter()
const { playStorm, syncMutedState } = useAudio()
const { triggerHaptic } = useHaptics()
const {
  isPurchasing,
  error,
  initialize,
  purchase,
  restorePurchases,
  checkAvailability
} = useBilling()

const billingAvailable = ref(false)
const isRestoring = ref(false)
const errorMessage = ref('')

onMounted(async () => {
  syncMutedState()
  playStorm()

  // Check if billing is available (only in TWA)
  billingAvailable.value = await checkAvailability()
})

const handleUnlock = async () => {
  triggerHaptic('heavy')
  errorMessage.value = ''

  // If billing is available, use it
  if (billingAvailable.value) {
    const result = await purchase()

    if (result.success) {
      triggerHaptic('heavy')
      router.push('/home')
    } else if (result.cancelled) {
      // User cancelled, do nothing
    } else if (result.error) {
      errorMessage.value = error.value || 'Purchase failed. Please try again.'
    }
  } else {
    // Not in TWA - show message (dev mode)
    errorMessage.value = 'Purchases are only available in the Google Play app'
  }
}

const handleRestore = async () => {
  triggerHaptic('medium')
  isRestoring.value = true
  errorMessage.value = ''

  const result = await restorePurchases()
  isRestoring.value = false

  if (result.restored) {
    triggerHaptic('heavy')
    router.push('/home')
  } else if (result.success && !result.restored) {
    errorMessage.value = 'No previous purchase found'
  } else if (result.error) {
    errorMessage.value = error.value || 'Could not restore purchases'
  }
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
