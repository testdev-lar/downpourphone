<template>
  <div class="min-h-screen flex flex-col safe-area-top safe-area-bottom relative">
    <div class="flex-1 flex flex-col items-center justify-center px-8">
      <div class="mb-16 text-center animate-fade-in">
        <h1 class="text-3xl font-light text-text-primary mb-2">Downpour</h1>
        <p class="text-text-muted text-sm">What feels right now?</p>
      </div>
      
      <div class="flex flex-col gap-8 w-full max-w-sm">
        <button 
          @click="selectMode('light')"
          class="touch-target relative group p-8 bg-bg-secondary/50 hover:bg-bg-secondary/70 rounded-3xl border border-accent-light/20 transition-all duration-300 active:scale-95 backdrop-blur-sm"
        >
          <div class="flex flex-col items-center gap-4">
            <div class="w-20 h-20">
              <svg viewBox="0 0 100 100" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="50" cy="50" rx="35" ry="25" stroke="#a8b5c9" stroke-width="2" stroke-linecap="round"/>
                <ellipse cx="40" cy="60" rx="25" ry="18" stroke="#a8b5c9" stroke-width="2" stroke-linecap="round"/>
                <ellipse cx="60" cy="55" rx="28" ry="20" stroke="#a8b5c9" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <span class="text-accent-light text-xl font-light">Light</span>
          </div>
          <div class="absolute inset-0 bg-accent-light/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
        
        <button 
          @click="selectMode('heavy')"
          class="touch-target relative group p-8 bg-bg-secondary/50 hover:bg-bg-secondary/70 rounded-3xl border border-accent-heavy/20 transition-all duration-300 active:scale-95 backdrop-blur-sm"
        >
          <div class="flex flex-col items-center gap-4">
            <div class="w-24 h-24">
              <svg viewBox="0 0 100 100" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="50" cy="45" rx="40" ry="30" stroke="#4a5568" stroke-width="3" stroke-linecap="round"/>
                <ellipse cx="35" cy="55" rx="28" ry="22" stroke="#4a5568" stroke-width="3" stroke-linecap="round"/>
                <ellipse cx="65" cy="50" rx="32" ry="24" stroke="#4a5568" stroke-width="3" stroke-linecap="round"/>
              </svg>
            </div>
            <span class="text-accent-heavy text-xl font-light">Heavy</span>
          </div>
          <div class="absolute inset-0 bg-accent-heavy/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
      </div>
    </div>
    
    <div class="fixed bottom-8 left-8 right-8 flex justify-between items-center">
      <button
        @click="goToArchive"
        class="touch-target w-12 h-12 flex items-center justify-center rounded-full bg-bg-secondary/50 border border-border hover:bg-bg-secondary/70 transition-all active:scale-95 backdrop-blur-sm"
        title="Puddle"
      >
        <svg viewBox="0 0 24 24" class="w-6 h-6 text-text-muted" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Water droplet with ripples -->
          <path d="M12 2C12 2 6 9 6 13C6 16.3137 8.68629 19 12 19C15.3137 19 18 16.3137 18 13C18 9 12 2 12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <ellipse cx="12" cy="21" rx="5" ry="1.5" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
        </svg>
      </button>
      
      <button 
        @click="goToSettings"
        class="touch-target w-12 h-12 flex items-center justify-center rounded-full bg-bg-secondary/50 border border-border hover:bg-bg-secondary/70 transition-all active:scale-95 backdrop-blur-sm"
        title="Settings"
      >
        <svg viewBox="0 0 24 24" class="w-6 h-6 text-text-muted" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
          <path d="M19.4 15C19.2667 15.3019 19.2272 15.6362 19.286 15.96M19.286 15.96L19.8 18.6C19.8637 18.9538 19.7915 19.3192 19.5986 19.6186C19.4058 19.918 19.1082 20.1286 18.768 20.208L16.128 20.852C15.8049 20.9289 15.4663 20.8982 15.164 20.764M15.164 20.764C14.5133 21.439 13.7367 21.9776 12.88 22.35M12.88 22.35L10.24 21.706C9.8998 21.6266 9.6022 21.416 9.40936 21.1166C9.21654 20.8172 9.1443 20.4518 9.208 20.098L9.722 17.458M9.722 17.458C9.78134 17.0935 9.74204 16.7589 9.608 16.456M9.608 16.456C8.93296 15.8053 8.39438 15.0287 8.022 14.172M8.022 14.172L8.666 11.532C8.74537 11.1918 8.956 10.8942 9.2554 10.7014C9.5548 10.5085 9.9202 10.4363 10.274 10.5L12.914 11.014M12.914 11.014C13.2785 11.0733 13.6131 11.034 13.916 10.9M13.916 10.9C14.5667 10.225 15.3433 9.68638 16.2 9.314M16.2 9.314L17.844 11.958C17.9234 12.2982 17.8968 12.6564 17.7688 12.9816C17.6409 13.3068 17.4178 13.5838 17.128 13.778M17.128 13.778L15.09 15.222M15.09 15.222C15.0067 15.5778 14.8185 15.9022 14.55 16.156M14.55 16.156L11.906 17.8C11.5897 18.0006 11.2131 18.0778 10.8468 18.0164C10.4805 17.955 10.1485 17.7593 9.914 17.466M9.914 17.466L7.056 16.592C6.71578 16.5126 6.41823 16.302 6.22539 16.0026C6.03256 15.7032 5.96031 15.3378 6.024 14.984L6.538 12.344M6.538 12.344C6.59734 11.9795 6.55804 11.6449 6.424 11.342M6.424 11.342L3.566 10.468C3.22578 10.3886 2.92823 10.178 2.73539 9.87864C2.54256 9.57924 2.47031 9.2138 2.534 8.86L3.178 6.22C3.25737 5.87982 3.468 5.58222 3.7674 5.38939C4.0668 5.19656 4.4322 5.12431 4.786 5.188L7.426 5.702M7.426 5.702C7.7905 5.76134 8.1251 5.72204 8.428 5.588M8.428 5.588C9.0787 4.91296 9.8553 4.37438 10.712 4.002M10.712 4.002L13.352 4.646C13.6922 4.72537 13.9898 4.936 14.1826 5.2354C14.3754 5.5348 14.4477 5.9002 14.384 6.254L13.87 8.894M13.87 8.894C13.8107 9.2585 13.85 9.5931 13.984 9.896M13.984 9.896L16.842 10.77C17.1822 10.8494 17.4798 11.06 17.6726 11.3594C17.8654 11.6588 17.9377 12.0242 17.874 12.378L17.23 15.018M17.23 15.018C17.1707 15.3825 17.21 15.7171 17.344 16.02M17.344 16.02L20.202 16.894C20.5422 16.9734 20.8398 17.184 21.0326 17.4834C21.2254 17.7828 21.2977 18.1482 21.234 18.502L20.59 21.142C20.5106 21.4822 20.3 21.7798 20.0006 21.9726C19.7012 22.1654 19.3358 22.2377 18.982 22.174L16.342 21.66M16.342 21.66C15.9775 21.6007 15.6429 21.64 15.34 21.774M15.34 21.774C14.6893 22.449 13.9127 22.9876 13.056 23.36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAudio } from '../composables/useAudio'

const router = useRouter()
const { fadeToSound, isMuted } = useAudio()

onMounted(() => {
  // Start ambient rain sound for returning users (after first click)
  if (!isMuted.value) {
    fadeToSound('light')
  }
})

const selectMode = (mode) => {
  fadeToSound(mode)
  router.push(`/write/${mode}`)
}

const goToArchive = () => {
  fadeToSound('archive')
  router.push('/archive')
}

const goToSettings = () => {
  router.push('/settings')
}
</script>
