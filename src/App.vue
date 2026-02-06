<template>
  <div class="relative min-h-screen">
    <BackgroundRain :clearingPhase="clearingPhase" @lightning="onLightning" />
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { ref, provide, onMounted, onBeforeUnmount } from 'vue'
import BackgroundRain from './components/BackgroundRain.vue'
import { useAudio } from './composables/useAudio'

const { playOneShot, stopAll } = useAudio()

// Phase-based clearing: 0=normal, 1=slowing, 2=sparse, 3=fading out
const clearingPhase = ref(0)

const setPhase = (phase) => {
  clearingPhase.value = phase
}

const onLightning = () => {
  playOneShot('thunder', 0.4)
}

provide('rainClearing', {
  clearingPhase,
  setPhase
})

// Stop audio when app goes to background or is hidden
const handleVisibilityChange = () => {
  if (document.hidden || document.visibilityState === 'hidden') {
    stopAll()
  }
}

const handlePageHide = () => {
  stopAll()
}

onMounted(() => {
  document.addEventListener('visibilitychange', handleVisibilityChange)
  window.addEventListener('pagehide', handlePageHide)
  window.addEventListener('blur', stopAll)
})

onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  window.removeEventListener('pagehide', handlePageHide)
  window.removeEventListener('blur', stopAll)
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes dissolve {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
  50% {
    opacity: 0.6;
    transform: translateY(-10px) scale(1.05);
    filter: blur(2px);
  }
  100% {
    opacity: 0;
    transform: translateY(-100px) scale(0.8);
    filter: blur(10px);
  }
}

.text-dissolve {
  animation: dissolve 2s ease-out forwards;
}

@keyframes fragment {
  0% {
    opacity: 1;
    transform: translate(0, 0);
  }
  100% {
    opacity: 0;
    transform: translate(var(--tx), var(--ty));
  }
}

.text-fragment {
  position: absolute;
  animation: fragment 2s ease-out forwards;
}
</style>
