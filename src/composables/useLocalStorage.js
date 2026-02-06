import { ref, computed } from 'vue'

const STORAGE_KEY = 'downpour_entries'
const ONBOARDING_KEY = 'downpour_onboarding_complete'
const SETTINGS_KEY = 'downpour_settings'
const USAGE_KEY = 'downpour_usage_count'
const UNLOCKED_KEY = 'downpour_unlocked'
const FREE_LIMIT = 7

export function useLocalStorage() {
  const entries = ref([])

  const loadEntries = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        entries.value = JSON.parse(stored)
      }
    } catch (e) {
      console.error('Failed to load entries:', e)
      entries.value = []
    }
  }

  const saveEntry = (entry) => {
    const newEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...entry
    }
    entries.value.unshift(newEntry)
    persistEntries()
    incrementUsageCount()
    return newEntry
  }

  const persistEntries = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.value))
    } catch (e) {
      console.error('Failed to save entries:', e)
    }
  }

  const deleteEntry = (id) => {
    entries.value = entries.value.filter(entry => entry.id !== id)
    persistEntries()
  }

  const clearAllEntries = () => {
    entries.value = []
    localStorage.removeItem(STORAGE_KEY)
  }

  const hasCompletedOnboarding = computed(() => {
    return localStorage.getItem(ONBOARDING_KEY) === 'true'
  })

  const setOnboardingComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true')
  }

  const getSettings = () => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (e) {
      console.error('Failed to load settings:', e)
    }
    return {
      soundEnabled: true
    }
  }

  const saveSettings = (settings) => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    } catch (e) {
      console.error('Failed to save settings:', e)
    }
  }

  // Usage tracking for freemium paywall
  const getUsageCount = () => {
    return parseInt(localStorage.getItem(USAGE_KEY) || '0', 10)
  }

  const incrementUsageCount = () => {
    const count = getUsageCount() + 1
    localStorage.setItem(USAGE_KEY, count.toString())
    return count
  }

  const isUnlocked = computed(() => {
    return localStorage.getItem(UNLOCKED_KEY) === 'true'
  })

  const hasReachedLimit = computed(() => {
    return getUsageCount() >= FREE_LIMIT && !isUnlocked.value
  })

  const setUnlocked = () => {
    localStorage.setItem(UNLOCKED_KEY, 'true')
  }

  const getEntriesSortedByDate = computed(() => {
    return [...entries.value].sort((a, b) =>
      new Date(b.timestamp) - new Date(a.timestamp)
    )
  })

  const resetUsageForDemo = () => {
    localStorage.removeItem(USAGE_KEY)
    localStorage.removeItem(UNLOCKED_KEY)
    console.log('Demo reset: Usage counter cleared')
  }

  loadEntries()

  return {
    entries,
    getEntriesSortedByDate,
    saveEntry,
    deleteEntry,
    clearAllEntries,
    hasCompletedOnboarding,
    setOnboardingComplete,
    getSettings,
    saveSettings,
    getUsageCount,
    hasReachedLimit,
    isUnlocked,
    setUnlocked,
    resetUsageForDemo
  }
}
