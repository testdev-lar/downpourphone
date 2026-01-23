import { ref, computed } from 'vue'

const STORAGE_KEY = 'downpour_entries'
const ONBOARDING_KEY = 'downpour_onboarding_complete'
const SETTINGS_KEY = 'downpour_settings'

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

  const getEntriesSortedByDate = computed(() => {
    return [...entries.value].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    )
  })

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
    saveSettings
  }
}
