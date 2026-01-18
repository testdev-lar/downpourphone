<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-8 safe-area-top safe-area-bottom">
    <transition name="slide" mode="out-in">
      <div :key="currentScreen" class="text-center max-w-md">
        <div class="mb-12 flex justify-center">
          <div class="w-32 h-32">
            <svg viewBox="0 0 100 100" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="45" r="30" :stroke="getScreenIconColor(currentScreen)" stroke-width="2" stroke-linecap="round" stroke-dasharray="5,5"/>
              <path v-if="currentScreen === 0" d="M50 75 L50 85" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path v-if="currentScreen === 0" d="M40 75 L40 80 M60 75 L60 80" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <text v-if="currentScreen === 1" x="50" y="48" text-anchor="middle" fill="currentColor" font-size="12" font-weight="300">words</text>
              <path v-if="currentScreen === 2" d="M50 60 L50 70 M45 65 L55 65" stroke="#6b7280" stroke-width="2" stroke-linecap="round"/>
              <circle v-if="currentScreen === 3" cx="50" cy="50" r="15" stroke="#f6ad55" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
        
        <h2 class="text-3xl font-light text-text-primary mb-4 animate-fade-in">
          {{ screens[currentScreen].title }}
        </h2>
        <p class="text-text-muted text-lg mb-12 animate-slide-up">
          {{ screens[currentScreen].text }}
        </p>
        
        <button 
          @click="nextScreen"
          class="touch-target px-10 py-3 bg-accent-light/10 hover:bg-accent-light/20 text-accent-light rounded-full transition-all duration-300 border border-accent-light/30 backdrop-blur-sm active:scale-95"
        >
          {{ currentScreen === screens.length - 1 ? 'Start' : 'Continue' }}
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentScreen = ref(0)

const screens = [
  {
    title: 'Some things need to fall away.',
    text: 'Downpour is a space to release what\'s weighing on you.'
  },
  {
    title: 'Write what\'s here.',
    text: 'Then let it go.'
  },
  {
    title: 'Everything lands somewhere.',
    text: 'You can look back if you need to.'
  },
  {
    title: 'That\'s it.',
    text: 'Let it rain.'
  }
]

const getScreenIconColor = (screen) => {
  const colors = ['#a8b5c9', '#4a5568', '#9ca3af', '#f6ad55']
  return colors[screen]
}

const nextScreen = () => {
  if (currentScreen.value < screens.length - 1) {
    currentScreen.value++
  } else {
    localStorage.setItem('downpour_onboarding_complete', 'true')
    router.push('/home')
  }
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
