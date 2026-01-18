<template>
  <div class="min-h-screen flex flex-col safe-area-top safe-area-bottom">
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
        
        <h1 class="text-xl font-light text-text-primary">Puddle</h1>
        
        <div class="w-12"></div>
      </div>
    </div>
    
    <div class="flex-1 overflow-y-auto px-6 py-4 bg-bg-archive">
      <div class="max-w-lg mx-auto space-y-4">
        <div 
          v-if="entries.length === 0"
          class="text-center py-16"
        >
          <div class="w-20 h-20 mx-auto mb-4 opacity-30">
            <svg viewBox="0 0 100 100" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="50" cy="55" rx="35" ry="25" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M40 70 L45 80 L50 70 L55 80 L60 70" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <p class="text-text-muted">Nothing here yet.</p>
          <p class="text-text-muted/60 text-sm mt-2">Your releases will land here.</p>
        </div>
        
        <div 
          v-for="entry in entries"
          :key="entry.id"
          class="bg-bg-secondary/40 border border-border rounded-2xl overflow-hidden backdrop-blur-sm transition-all hover:bg-bg-secondary/50"
        >
          <button 
            @click="toggleExpand(entry.id)"
            class="w-full px-4 py-3 flex items-start gap-3 text-left"
          >
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <div
                  class="w-4 h-4 rounded-full bg-accent-light"
                ></div>
                <span class="text-xs text-text-muted">{{ formatDate(entry.timestamp) }}</span>
              </div>
              <p 
                class="text-sm"
                :class="expandedEntries.has(entry.id) ? 'text-text-primary' : 'text-text-muted'"
              >
                {{ entry.text }}
              </p>
            </div>
            
            <svg 
              viewBox="0 0 24 24" 
              class="w-5 h-5 text-text-muted transition-transform flex-shrink-0 mt-1"
              :class="{ 'rotate-180': expandedEntries.has(entry.id) }"
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19 9L12 16L5 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          
          <div 
            v-if="expandedEntries.has(entry.id)"
            class="px-4 pb-4 border-t border-border/50"
          >
            <div class="pt-3">
              <p class="text-text-primary leading-relaxed">{{ entry.text }}</p>
              
              <div class="flex items-center gap-3 mt-3">
                <span v-if="entry.emotion" class="px-2 py-1 rounded-full text-xs text-accent-light bg-accent-light/10">
                  {{ entry.emotion }}
                </span>

                <span class="text-xs text-text-muted ml-auto">
                  {{ formatTime(entry.timestamp) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLocalStorage } from '../composables/useLocalStorage'
import { useAudio } from '../composables/useAudio'

const router = useRouter()
const { getEntriesSortedByDate } = useLocalStorage()
const { fadeToSound } = useAudio()

const entries = ref([])
const expandedEntries = ref(new Set())

onMounted(() => {
  entries.value = getEntriesSortedByDate.value
})

const toggleExpand = (id) => {
  if (expandedEntries.value.has(id)) {
    expandedEntries.value.delete(id)
  } else {
    expandedEntries.value.add(id)
  }
}

const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return 'Today'
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'long' })
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

const goBack = () => {
  fadeToSound('light')
  router.push('/home')
}
</script>
