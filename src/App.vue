<template>
  <div class="relative min-h-screen">
    <BackgroundRain />
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import BackgroundRain from './components/BackgroundRain.vue'
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
