<template>
  <div class="min-h-screen flex flex-col safe-area-top safe-area-bottom relative">
    <!-- Mountain silhouettes -->
    <div class="fixed bottom-0 left-0 right-0 h-[25vh] pointer-events-none z-0">
      <svg viewBox="0 0 400 100" preserveAspectRatio="none" class="w-full h-full">
        <path d="M0 100 L0 60 L50 30 L100 50 L150 20 L200 45 L250 25 L300 55 L350 35 L400 50 L400 100 Z" fill="rgba(30, 41, 59, 0.3)"/>
        <path d="M0 100 L0 70 L80 45 L140 65 L200 40 L280 60 L340 50 L400 70 L400 100 Z" fill="rgba(30, 41, 59, 0.5)"/>
      </svg>
    </div>

    <div class="px-6 py-6 border-b border-border bg-bg-primary/95 backdrop-blur-sm relative z-10">
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
        
        <h1 class="text-xl font-light text-text-primary">{{ entryCountText }}</h1>
        
        <button
          @click="confirmClear"
          class="touch-target w-12 h-12 flex items-center justify-center rounded-full hover:bg-red-500/10 transition-colors"
          title="Clear all entries"
        >
          <svg viewBox="0 0 24 24" class="w-5 h-5 text-text-muted hover:text-red-400" fill="none">
            <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
    
    <div class="flex-1 overflow-y-auto px-6 py-4 bg-bg-archive relative z-10">
      <div class="max-w-lg mx-auto space-y-4">
        <div
          v-if="entries.length === 0"
          class="text-center py-16"
        >
          <p class="text-text-muted text-lg">Nothing here yet.</p>
          <p class="text-text-muted/60 text-sm mt-2">Your releases will land here.</p>
        </div>
        
        <div
          v-for="entry in entries"
          :key="entry.id"
          class="bg-bg-secondary/40 border border-border rounded-2xl overflow-hidden backdrop-blur-sm transition-all hover:bg-bg-secondary/50"
        >
          <div class="flex items-center gap-3 px-4 py-3">
            <button
              @click="toggleExpand(entry.id)"
              class="flex-1 flex items-center gap-3 text-left min-w-0"
            >
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <div class="w-4 h-4 rounded-full bg-accent-light"></div>
                  <span class="text-sm text-text-muted">{{ formatDateTime(entry.timestamp) }}</span>
                </div>
              </div>

              <svg
                viewBox="0 0 24 24"
                class="w-5 h-5 text-text-muted transition-transform flex-shrink-0"
                :class="{ 'rotate-180': expandedEntries.has(entry.id) }"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M19 9L12 16L5 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>

            <button
              @click="confirmDelete(entry.id)"
              class="p-2 text-text-muted hover:text-red-400 transition-colors flex-shrink-0"
              aria-label="Delete thought"
            >
              <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          
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

    <!-- Delete confirmation modal -->
    <transition name="modal">
      <div
        v-if="showDeleteConfirm"
        class="fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/50 backdrop-blur-sm"
        @click="cancelDelete"
      >
        <div
          class="bg-bg-secondary border border-border rounded-2xl p-6 max-w-sm w-full"
          @click.stop
        >
          <h2 class="text-lg font-light text-text-primary mb-4">Delete thought?</h2>
          <div class="flex gap-3">
            <button
              @click="cancelDelete"
              class="flex-1 px-4 py-2 bg-bg-primary border border-border text-text-primary rounded-lg hover:bg-bg-secondary/50 transition-colors"
            >
              No
            </button>
            <button
              @click="executeDelete"
              class="flex-1 px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Delete feedback message -->
    <transition name="fade">
      <div
        v-if="showDeleteFeedback"
        class="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-bg-secondary/95 border border-border rounded-full text-text-primary backdrop-blur-sm z-50"
      >
        Thought deleted
      </div>
    </transition>

    <!-- Clear all data confirmation modal -->
    <div
      v-if="showClearConfirm"
      class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center px-6 z-50"
    >
      <div class="bg-bg-secondary border border-border rounded-2xl p-6 max-w-sm w-full backdrop-blur-sm">
        <h3 class="text-xl font-light text-text-primary mb-2">Clear All Data?</h3>
        <p class="text-text-muted mb-6">This will delete all your entries. This cannot be undone.</p>
        <div class="flex gap-3">
          <button
            @click="showClearConfirm = false"
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLocalStorage } from '../composables/useLocalStorage'
import { useHaptics } from '../composables/useHaptics'

const router = useRouter()
const { getEntriesSortedByDate, deleteEntry, clearAllEntries } = useLocalStorage()
// Storm continues playing - no audio changes needed on this screen
const { triggerHaptic } = useHaptics()

const entries = ref([])
const expandedEntries = ref(new Set())
const deletingEntry = ref(null)
const showDeleteConfirm = ref(false)
const showDeleteFeedback = ref(false)
const showClearConfirm = ref(false)

const entryCountText = computed(() => {
  const count = entries.value.length
  return count === 1 ? '1 thought released' : `${count} thoughts released`
})

onMounted(() => {
  entries.value = getEntriesSortedByDate.value
})

const toggleExpand = (id) => {
  triggerHaptic('medium')
  if (expandedEntries.value.has(id)) {
    expandedEntries.value.delete(id)
  } else {
    expandedEntries.value.add(id)
  }
}

const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

const formatDateTime = (timestamp) => {
  return `${formatDate(timestamp)} at ${formatTime(timestamp)}`
}

const confirmDelete = (id) => {
  triggerHaptic('medium')
  deletingEntry.value = id
  showDeleteConfirm.value = true
}

const cancelDelete = () => {
  triggerHaptic('medium')
  deletingEntry.value = null
  showDeleteConfirm.value = false
}

const executeDelete = () => {
  if (deletingEntry.value) {
    triggerHaptic('medium')
    deleteEntry(deletingEntry.value)
    entries.value = getEntriesSortedByDate.value
    expandedEntries.value.delete(deletingEntry.value)
    showDeleteConfirm.value = false
    deletingEntry.value = null

    // Show feedback
    showDeleteFeedback.value = true
    setTimeout(() => {
      showDeleteFeedback.value = false
    }, 2000)
  }
}

const goBack = () => {
  triggerHaptic('medium')
  // Storm continues playing
  router.push('/home')
}

const confirmClear = () => {
  triggerHaptic('medium')
  showClearConfirm.value = true
}

const clearAllData = () => {
  triggerHaptic('medium')
  clearAllEntries()
  showClearConfirm.value = false
  router.push('/home')
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
