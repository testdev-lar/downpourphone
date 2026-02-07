<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center safe-area-top safe-area-bottom px-6 transition-all duration-[2000ms]"
    :style="skyStyle"
  >
    <!-- Sun glow -->
    <div
      class="fixed top-0 left-1/2 -translate-x-1/2 w-[200%] h-[60%] transition-opacity duration-[2000ms] pointer-events-none"
      :class="animationStage >= 3 ? 'opacity-100' : 'opacity-0'"
    >
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-radial from-amber-200/30 via-amber-100/10 to-transparent"></div>
    </div>

    <!-- Mountain silhouettes with sunrise glow -->
    <div class="fixed bottom-0 left-0 right-0 h-[25vh] pointer-events-none">
      <!-- Sunrise glow behind mountains -->
      <transition name="sunrise-glow">
        <div
          v-if="showSunriseGlow"
          class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-[150%] sunrise-glow"
        >
          <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full rounded-full bg-gradient-radial from-amber-300/40 via-amber-200/20 to-transparent blur-2xl"></div>
        </div>
      </transition>

      <svg viewBox="0 0 400 100" preserveAspectRatio="none" class="w-full h-full relative z-10">
        <!-- Far mountains -->
        <path
          d="M0 100 L0 60 L50 30 L100 50 L150 20 L200 45 L250 25 L300 55 L350 35 L400 50 L400 100 Z"
          :fill="animationStage >= 3 ? 'rgba(100, 116, 139, 0.5)' : 'rgba(30, 41, 59, 0.3)'"
          class="transition-all duration-[2000ms]"
        />
        <!-- Near mountains -->
        <path
          d="M0 100 L0 70 L80 45 L140 65 L200 40 L280 60 L340 50 L400 70 L400 100 Z"
          :fill="animationStage >= 3 ? 'rgba(71, 85, 105, 0.7)' : 'rgba(30, 41, 59, 0.5)'"
          class="transition-all duration-[2000ms]"
        />
      </svg>
    </div>

    <!-- Bird animation -->
    <transition name="bird">
      <div v-if="showBird" class="fixed inset-0 pointer-events-none z-5">
        <div class="bird-container">
          <svg class="bird-silhouette" viewBox="0 0 30 15" width="30" height="15">
            <!-- Body -->
            <ellipse cx="15" cy="8" rx="2" ry="3" fill="black" />
            <!-- Left wing -->
            <path
              class="wing-left"
              d="M 15 8 Q 6 4, 1 7"
              stroke="black"
              stroke-width="1.5"
              fill="none"
              stroke-linecap="round"
            />
            <!-- Right wing -->
            <path
              class="wing-right"
              d="M 15 8 Q 24 4, 29 7"
              stroke="black"
              stroke-width="1.5"
              fill="none"
              stroke-linecap="round"
            />
          </svg>
        </div>
      </div>
    </transition>

    <!-- Dissolving text card -->
    <transition name="fade">
      <div v-if="showText" class="max-w-lg w-full relative z-10">
        <div
          class="relative bg-bg-secondary/30 border border-border rounded-2xl p-6 backdrop-blur-sm"
          :class="isDissolving ? 'dissolve' : ''"
        >
          <p class="text-text-primary text-lg leading-relaxed">{{ text }}</p>

          <div v-if="emotion" class="mt-4 inline-block px-3 py-1 rounded-full text-sm text-accent-light bg-accent-light/10">
            {{ emotion }}
          </div>
        </div>
      </div>
    </transition>

    <!-- Final state content -->
    <div v-if="!showText" class="text-center relative z-10 w-full">
      <!-- Closing message -->
      <div class="mb-12 space-y-3">
        <transition name="gentle-fade">
          <p v-if="showFirstLine" class="text-amber-100/90 text-3xl font-light tracking-wide text-center">
            Breathe.
          </p>
        </transition>
        <transition name="gentle-fade">
          <p v-if="showSecondLine" class="text-amber-100/50 text-lg font-light tracking-wide text-center">
            The sky clears.
          </p>
        </transition>
      </div>

      <!-- Exit button (appears last) -->
      <transition name="gentle-fade">
        <div v-if="showButton" class="flex flex-col items-center">
          <button
            @click="exitApp"
            class="touch-target px-8 py-3 bg-amber-200/10 hover:bg-amber-200/20 text-amber-200/80 rounded-full transition-all duration-300 border border-amber-200/20 backdrop-blur-sm active:scale-95"
          >
            Continue with your day
          </button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useAudio } from '../composables/useAudio'
import { useHaptics } from '../composables/useHaptics'

const router = useRouter()
const { fadeOutCurrent, playNature, stopAll, syncMutedState, cancelFade } = useAudio()
const { triggerHaptic } = useHaptics()

const rainClearing = inject('rainClearing')

const text = ref('')
const emotion = ref('')
const showText = ref(true)
const isDissolving = ref(false)

// Animation stages: 0=initial, 1=dissolving, 2=sky lightening, 3=sun emerging, 4=mountains, 5=final
const animationStage = ref(0)

// Text reveal states
const showFirstLine = ref(false)
const showSecondLine = ref(false)
const showButton = ref(false)

// Sunrise glow state
const showSunriseGlow = ref(false)

// Bird animation
const showBird = ref(false)
const birdInterval = ref(null)

// Track all timeouts for cleanup
const activeTimeouts = []

// Mount tracking for defensive callback guards
const isMounted = ref(false)

// Color interpolation helper
const interpolateColor = (from, to, progress) => {
  return from.map((f, i) => Math.round(f + (to[i] - f) * progress))
}

// Smooth sky gradient based on animation progress
const skyStyle = computed(() => {
  // Map animation stage to 0-1 progress
  const progress = Math.min(animationStage.value / 5, 1)

  // Color stops: stormy (stage 0) → clearing (stage 5)
  const topColor = interpolateColor(
    [30, 41, 59],      // slate-800 (stormy)
    [96, 165, 250],    // blue-400 (clear)
    progress
  )
  const midColor = interpolateColor(
    [51, 65, 85],      // slate-700
    [147, 197, 253],   // blue-300
    progress
  )
  const bottomColor = interpolateColor(
    [71, 85, 105],     // slate-600
    [254, 243, 199],   // amber-100
    progress
  )

  return {
    background: `linear-gradient(to bottom, rgb(${topColor.join(',')}), rgb(${midColor.join(',')}) 50%, rgb(${bottomColor.join(',')}))`
  }
})

// Wrapper function to safely execute callbacks only when component is mounted
const safeCallback = (callback) => {
  return () => {
    if (!isMounted.value) return
    callback()
  }
}

onMounted(() => {
  // Mark component as mounted for defensive callback guards
  isMounted.value = true

  // Sync muted state from localStorage in case it changed
  syncMutedState()

  const historyState = router.options.history.state
  if (historyState) {
    text.value = historyState.text || ''
    emotion.value = historyState.emotion || null
  }

  startClearingSequence()
})

onUnmounted(() => {
  // Set isMounted to false FIRST so callbacks exit immediately
  isMounted.value = false

  // Reset clearing state when leaving
  if (rainClearing) {
    rainClearing.setPhase(0)
  }

  // Clear bird interval
  if (birdInterval.value) {
    clearInterval(birdInterval.value)
    birdInterval.value = null
  }

  // Clear all tracked timeouts
  activeTimeouts.forEach(timeout => clearTimeout(timeout))
  activeTimeouts.length = 0

  // Cancel any pending fade timeout to prevent it from stopping audio after navigation
  cancelFade()
})

const startClearingSequence = () => {
  // Helper to track timeouts for cleanup
  const addTimeout = (callback, delay) => {
    const timeoutId = setTimeout(callback, delay)
    activeTimeouts.push(timeoutId)
    return timeoutId
  }

  // Stage 1: Text dissolving starts (500ms)
  // Also start fading out storm audio
  addTimeout(safeCallback(async () => {
    isDissolving.value = true
    animationStage.value = 1
    // Start fading out storm (4000ms fade)
    try {
      await fadeOutCurrent(4000)
    } catch {
      // Audio fade failed silently
    }
  }), 500)

  // Stage 2: Rain slowing, sky lightening (1500ms)
  addTimeout(safeCallback(() => {
    animationStage.value = 2
    if (rainClearing) {
      rainClearing.setPhase(1)
    }
  }), 1500)

  // Stage 3: Sun emerging, rain sparse (3000ms)
  addTimeout(safeCallback(() => {
    animationStage.value = 3
    if (rainClearing) {
      rainClearing.setPhase(2)
    }
  }), 3000)

  // Brief silence period - storm fades from 500ms to 4500ms (4000ms duration)
  // Nature starts fading in at 5000ms (500ms after storm fully silent)
  addTimeout(safeCallback(() => {
    playNature(2000) // 2 second fade in
  }), 5000)

  // Hide text (4500ms - after 4s dissolve completes)
  addTimeout(safeCallback(() => {
    showText.value = false
  }), 4500)

  // Stage 4: Full clearing, rain stops (5500ms)
  addTimeout(safeCallback(() => {
    animationStage.value = 4
    if (rainClearing) {
      rainClearing.setPhase(3)
    }
  }), 5500)

  // Stage 5 + first line (6500ms)
  addTimeout(safeCallback(() => {
    animationStage.value = 5
    showFirstLine.value = true
  }), 6500)

  // Second line (7500ms)
  addTimeout(safeCallback(() => {
    showSecondLine.value = true
  }), 7500)

  // Sunrise glow starts (8000ms - after text fades in)
  addTimeout(safeCallback(() => {
    showSunriseGlow.value = true
  }), 8000)

  // Button (8500ms)
  addTimeout(safeCallback(() => {
    showButton.value = true
  }), 8500)

  // First bird (7 seconds after words fade in)
  addTimeout(safeCallback(() => {
    triggerBird()
  }), 14500) // 7500ms (second line) + 7000ms

  // Occasional birds every 15 seconds
  birdInterval.value = setInterval(safeCallback(() => {
    triggerBird()
  }), 15000)
}

const triggerBird = () => {
  showBird.value = true
  const timeoutId = setTimeout(safeCallback(() => {
    showBird.value = false
  }), 16000) // Bird animation lasts 16 seconds
  activeTimeouts.push(timeoutId)
}

const exitApp = () => {
  triggerHaptic('medium')

  // Stop all audio immediately
  stopAll()

  // Reset clearing state
  animationStage.value = 0
  if (rainClearing) {
    rainClearing.setPhase(0)
  }

  // TWA cannot be closed programmatically (Android security restriction)
  // Navigate to home screen - user can exit via Android back gesture
  router.push('/home')
}
</script>

<style scoped>
.dissolve {
  animation: dissolve 4s ease-out forwards;
}

@keyframes dissolve {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
  30% {
    opacity: 0.7;
    transform: translateY(-20px) scale(1.02);
    filter: blur(1px);
  }
  60% {
    opacity: 0.3;
    transform: translateY(-50px) scale(0.95);
    filter: blur(4px);
  }
  100% {
    opacity: 0;
    transform: translateY(-100px) scale(0.8);
    filter: blur(10px);
  }
}

.bg-gradient-radial {
  background: radial-gradient(ellipse at center top, var(--tw-gradient-from), var(--tw-gradient-via), var(--tw-gradient-to));
}

/* Gentle fade transition for text */
.gentle-fade-enter-active {
  transition: opacity 1.5s ease-out;
}

.gentle-fade-enter-from {
  opacity: 0;
}

/* Standard fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Sunrise glow breathing animation */
.sunrise-glow {
  animation: breathe 4s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% {
    opacity: 0.8;
    transform: translateX(-50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translateX(-50%) scale(1.1);
  }
}

.sunrise-glow-enter-active {
  transition: opacity 2s ease-out;
}

.sunrise-glow-enter-from {
  opacity: 0;
}

/* Bird flight animation */
.bird-container {
  position: absolute;
  animation: fly 16s linear forwards;
}

.wing-left {
  animation: flap-left 1s ease-in-out infinite;
  transform-origin: 15px 8px;
}

.wing-right {
  animation: flap-right 1s ease-in-out infinite;
  transform-origin: 15px 8px;
}

@keyframes fly {
  0% {
    left: -5%;
    bottom: 15%;
    opacity: 0;
  }
  5% {
    opacity: 0.8;
  }
  95% {
    opacity: 0.8;
  }
  100% {
    left: 105%;
    bottom: 85%;
    opacity: 0;
  }
}

@keyframes flap-left {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(-25deg);
  }
}

@keyframes flap-right {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(25deg);
  }
}

.bird-enter-active {
  transition: opacity 0.3s ease-out;
}

.bird-enter-from {
  opacity: 0;
}
</style>
