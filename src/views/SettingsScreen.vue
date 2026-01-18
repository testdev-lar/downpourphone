<template>
  <div class="min-h-screen flex flex-col safe-area-top safe-area-bottom px-6">
    <div class="px-6 py-6 border-b border-border bg-bg-primary/95 backdrop-blur-sm">
      <div class="flex items-center justify-between max-w-lg mx-auto">
        <button 
          @click="goBack"
          class="touch-target flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors"
        >
          <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Back
        </button>
        
        <h1 class="text-xl font-light text-text-primary">Settings</h1>
        
        <div class="w-12"></div>
      </div>
    </div>
    
    <div class="flex-1 overflow-y-auto py-6">
      <div class="max-w-lg mx-auto space-y-6">
        <div class="bg-bg-secondary/40 border border-border rounded-2xl p-4 backdrop-blur-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-text-primary font-medium">Sound</p>
              <p class="text-text-muted text-sm">{{ isMuted ? 'Off' : 'On' }}</p>
            </div>
            
            <button
              @click="toggleSound"
              class="touch-target w-14 h-8 rounded-full transition-all duration-300 relative flex-shrink-0"
              :class="isMuted ? 'bg-bg-secondary border border-border' : 'bg-accent-light/30'"
            >
              <div
                class="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full transition-all duration-300"
                :class="isMuted ? 'left-1 bg-text-muted' : 'left-[calc(100%-1.75rem)] bg-accent-light'"
              ></div>
            </button>
          </div>
        </div>
        
        <div class="bg-bg-secondary/40 border border-border rounded-2xl p-4 backdrop-blur-sm">
          <button 
            @click="handleReplayTutorial"
            class="touch-target w-full flex items-center justify-between"
          >
            <div>
              <p class="text-text-primary font-medium">Replay Tutorial</p>
              <p class="text-text-muted text-sm">See the onboarding again</p>
            </div>
            
            <svg viewBox="0 0 24 24" class="w-6 h-6 text-text-muted" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div class="bg-bg-secondary/40 border border-border rounded-2xl overflow-hidden backdrop-blur-sm">
          <button 
            @click="confirmClear"
            class="touch-target w-full px-4 py-4 flex items-center gap-3 text-left hover:bg-red-500/10 transition-colors"
          >
            <div class="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <svg viewBox="0 0 24 24" class="w-5 h-5 text-red-400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div>
              <p class="text-red-400 font-medium">Clear All Data</p>
              <p class="text-text-muted text-sm">Delete all your entries</p>
            </div>
          </button>
        </div>
        
        <div class="bg-bg-secondary/40 border border-border rounded-2xl p-4 backdrop-blur-sm">
          <div>
            <p class="text-text-primary font-medium mb-1">About</p>
            <p class="text-text-muted text-sm">Downpour</p>
            <p class="text-text-muted/60 text-xs mt-1">Version 1.0.0</p>
            <p class="text-text-muted text-xs mt-2">
              A minimalist emotional release journaling app. Write what's weighing on you, then let it rain away.
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <div 
      v-if="showConfirmDialog"
      class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center px-6 z-50"
    >
      <div class="bg-bg-secondary border border-border rounded-2xl p-6 max-w-sm w-full backdrop-blur-sm">
        <h3 class="text-xl font-light text-text-primary mb-2">Clear All Data?</h3>
        <p class="text-text-muted mb-6">This will delete all your entries. This cannot be undone.</p>
        
        <div class="flex gap-3">
          <button 
            @click="showConfirmDialog = false"
            class="touch-target flex-1 py-3 bg-bg-secondary border border-border rounded-xl text-text-primary hover:bg-bg-secondary/80 transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="clearAllData"
            class="touch-target flex-1 py-3 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLocalStorage } from '../composables/useLocalStorage'
import { useAudio } from '../composables/useAudio'

const router = useRouter()
const { clearAllEntries } = useLocalStorage()
const { toggleMute, isMuted, stopSound, fadeToSound } = useAudio()

const showConfirmDialog = ref(false)

const toggleSound = () => {
  toggleMute()
  // After toggle, isMuted reflects the new state
  // soundEnabled is the opposite of isMuted
  const settings = { soundEnabled: !isMuted.value }
  localStorage.setItem('downpour_settings', JSON.stringify(settings))

  // If sound was just enabled, start playing storm
  if (!isMuted.value) {
    fadeToSound('storm')
  }
}

const handleReplayTutorial = () => {
  localStorage.removeItem('downpour_onboarding_complete')
  router.push('/onboarding')
}

const confirmClear = () => {
  showConfirmDialog.value = true
}

const clearAllData = () => {
  clearAllEntries()
  showConfirmDialog.value = false

  stopSound()

  setTimeout(() => {
    fadeToSound('storm')
    router.push('/home')
  }, 500)
}

const goBack = () => {
  router.push('/home')
}
</script>
