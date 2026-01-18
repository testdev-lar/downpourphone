<template>
  <div
    class="fixed inset-0 pointer-events-none z-0"
    ref="rainContainer"
  >
    <!-- Lightning flash overlay -->
    <div
      class="fixed inset-0 pointer-events-none z-10 transition-opacity duration-100"
      :class="isLightning ? 'opacity-100' : 'opacity-0'"
      :style="{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }"
    ></div>

    <!-- Rain drops -->
    <div
      v-for="drop in raindrops"
      :key="drop.id"
      class="raindrop absolute w-[2px] bg-white/30"
      :style="getDropStyle(drop)"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  clearingPhase: {
    type: Number,
    default: 0
  }
})

// Emit for thunder sound integration
const emit = defineEmits(['lightning'])

const rainContainer = ref(null)
const raindrops = ref([])
const isLightning = ref(false)
let lightningTimeout = null

onMounted(() => {
  const numDrops = 100

  for (let i = 0; i < numDrops; i++) {
    raindrops.value.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100 - 100,
      height: Math.random() * 20 + 10,
      duration: Math.random() * 1 + 0.5,
      delay: Math.random() * 2,
      opacity: Math.random() * 0.4 + 0.2
    })
  }

  // Start lightning cycle
  scheduleLightning()
})

onUnmounted(() => {
  if (lightningTimeout) {
    clearTimeout(lightningTimeout)
  }
})

// Schedule next lightning strike
const scheduleLightning = () => {
  // Random interval between 5-12 seconds
  const delay = 5000 + Math.random() * 7000

  lightningTimeout = setTimeout(() => {
    // Only trigger lightning during stormy phase
    if (props.clearingPhase === 0) {
      triggerLightning()
    }
    // Schedule next one
    scheduleLightning()
  }, delay)
}

const triggerLightning = () => {
  // First flash
  isLightning.value = true

  setTimeout(() => {
    isLightning.value = false

    // 50% chance of double flash
    if (Math.random() > 0.5) {
      setTimeout(() => {
        isLightning.value = true
        setTimeout(() => {
          isLightning.value = false
        }, 80)
      }, 100)
    }
  }, 100)

  // Emit event for thunder sound (200-500ms after flash)
  setTimeout(() => {
    emit('lightning')
  }, 200 + Math.random() * 300)
}

const getDropStyle = (drop) => {
  // Phase 0: Normal rain
  // Phase 1: Rain slows (3x slower)
  // Phase 2: Drops become sparse (only every 3rd drop visible)
  // Phase 3: All drops fade out

  let duration = drop.duration
  let opacity = drop.opacity

  if (props.clearingPhase >= 1) {
    duration = drop.duration * 3 // Slow down
  }

  if (props.clearingPhase >= 2) {
    // Only show every 3rd drop
    opacity = drop.id % 3 === 0 ? drop.opacity : 0
  }

  if (props.clearingPhase >= 3) {
    opacity = 0 // Fade all out
  }

  return {
    left: drop.x + '%',
    top: drop.y + '%',
    height: drop.height + 'px',
    animationDuration: duration + 's',
    animationDelay: drop.delay + 's',
    opacity: opacity,
    transition: 'opacity 2s ease-out'
  }
}
</script>

<style scoped>
.raindrop {
  animation-name: fall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes fall {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(100vh);
  }
}
</style>
