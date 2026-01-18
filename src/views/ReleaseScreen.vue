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

    <!-- Mountain silhouettes - ALWAYS visible, colors transition from dark/obscured to clear -->
    <div class="fixed bottom-0 left-0 right-0 h-[25vh] pointer-events-none">
      <svg viewBox="0 0 400 100" preserveAspectRatio="none" class="w-full h-full">
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
    <transition name="fade">
      <div v-if="!showText" class="text-center relative z-10 w-full">
        <!-- Closing message -->
        <div class="mb-12 relative h-24">
          <transition name="gentle-fade">
            <p v-if="showFirstLine" class="absolute inset-x-0 top-0 text-amber-100/90 text-3xl font-light tracking-wide text-center">
              Breathe.
            </p>
          </transition>
          <transition name="gentle-fade">
            <p v-if="showSecondLine" class="absolute inset-x-0 top-12 text-amber-100/50 text-lg font-light tracking-wide text-center">
              The sky clears.
            </p>
          </transition>
        </div>

        <!-- Return button (appears last) -->
        <transition name="gentle-fade">
          <button
            v-if="showButton"
            @click="goHome"
            class="touch-target px-8 py-3 bg-amber-200/10 hover:bg-amber-200/20 text-amber-200/80 rounded-full transition-all duration-300 border border-amber-200/20 backdrop-blur-sm active:scale-95"
          >
            Return
          </button>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useAudio } from '../composables/useAudio'

const router = useRouter()
const { fadeToSound, fadeOutSound, fadeInSound, crossfade, stopSound } = useAudio()

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

onMounted(() => {
  const historyState = router.options.history.state
  if (historyState) {
    text.value = historyState.text || ''
    emotion.value = historyState.emotion || null
  }

  startClearingSequence()
})

onUnmounted(() => {
  // Reset clearing state when leaving
  if (rainClearing) {
    rainClearing.setPhase(0)
  }
})

const startClearingSequence = () => {
  // Stage 1: Text dissolving (500ms)
  setTimeout(() => {
    isDissolving.value = true
    animationStage.value = 1
  }, 500)

  // Stage 2: Rain slowing, sky lightening (1200ms)
  setTimeout(() => {
    animationStage.value = 2
    if (rainClearing) {
      rainClearing.setPhase(1)
    }
    // Start fading out storm gradually (3 second fade)
    fadeOutSound('storm', 3000)
  }, 1200)

  // Stage 3: Sun emerging, rain sparse (2500ms)
  setTimeout(() => {
    animationStage.value = 3
    if (rainClearing) {
      rainClearing.setPhase(2)
    }
    // Storm is already fading from stage 2, no need to stop abruptly
  }, 2500)

  // Hide text (3000ms)
  setTimeout(() => {
    showText.value = false
  }, 3000)

  // Stage 4: Full clearing (4000ms)
  setTimeout(() => {
    animationStage.value = 4
    if (rainClearing) {
      rainClearing.setPhase(3)
    }
    // Fade in nature sounds (louder volume)
    fadeInSound('nature', 3000, 0.6)
  }, 4000)

  // Stage 5 + first line (5000ms)
  setTimeout(() => {
    animationStage.value = 5
    showFirstLine.value = true
  }, 5000)

  // Second line (6000ms)
  setTimeout(() => {
    showSecondLine.value = true
  }, 6000)

  // Button (7000ms)
  setTimeout(() => {
    showButton.value = true
  }, 7000)
}

const goHome = () => {
  // Reset clearing before navigating
  animationStage.value = 0
  if (rainClearing) {
    rainClearing.setPhase(0)
  }
  // Crossfade from nature back to storm
  crossfade('nature', 'storm', 2000, 0.3)
  router.push('/home')
}
</script>

<style scoped>
.dissolve {
  animation: dissolve 2.5s ease-out forwards;
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
</style>
