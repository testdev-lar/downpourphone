<template>
  <div class="fixed inset-0 pointer-events-none z-0" ref="rainContainer">
    <div 
      v-for="(drop, index) in raindrops" 
      :key="drop.id"
      class="raindrop absolute w-px bg-white/20"
      :style="{
        left: drop.x + '%',
        top: drop.y + '%',
        height: drop.height + 'px',
        animationDuration: drop.duration + 's',
        animationDelay: drop.delay + 's',
        opacity: drop.opacity
      }"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const rainContainer = ref(null)
const raindrops = ref([])

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
      opacity: Math.random() * 0.3 + 0.1
    })
  }
})
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
    opacity: var(--opacity);
  }
  90% {
    opacity: var(--opacity);
  }
  100% {
    transform: translateY(100vh);
    opacity: 0;
  }
}
</style>
