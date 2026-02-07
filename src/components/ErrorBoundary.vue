<template>
  <slot v-if="!hasError" />
  <div v-else class="min-h-screen flex flex-col items-center justify-center px-8 bg-bg-primary">
    <div class="max-w-sm w-full text-center">
      <h1 class="text-2xl font-light text-text-primary mb-4">Something went wrong</h1>
      <p class="text-text-muted mb-8">An unexpected error occurred.</p>
      <button
        @click="recover"
        class="touch-target px-8 py-3 bg-accent-light/20 hover:bg-accent-light/30 rounded-xl border border-accent-light/50 text-accent-light font-medium transition-all active:scale-95"
      >
        Try again
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const hasError = ref(false)

onErrorCaptured((err) => {
  console.error('ErrorBoundary caught:', err)
  hasError.value = true
  return false
})

const recover = () => {
  hasError.value = false
  router.push('/home')
}
</script>
