import { ref, computed } from 'vue'
import { STORAGE_KEYS, FREE_RELEASE_LIMIT } from '../constants/app'
import { encryptText, decryptText } from '../utils/crypto'

const STORAGE_KEY = STORAGE_KEYS.ENTRIES
const ONBOARDING_KEY = STORAGE_KEYS.ONBOARDING
const SETTINGS_KEY = STORAGE_KEYS.SETTINGS
const USAGE_KEY = STORAGE_KEYS.USAGE
const UNLOCKED_KEY = STORAGE_KEYS.UNLOCKED
const USAGE_CHECK_KEY = USAGE_KEY + '_check'
const FREE_LIMIT = FREE_RELEASE_LIMIT

const calculateChecksum = (value) => {
  let hash = 0
  const str = 'downpour_' + String(value)
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return hash.toString(36)
}

export function useLocalStorage() {
  const entries = ref([])

  const loadEntries = async () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Decrypt encrypted entries
        const decrypted = await Promise.all(parsed.map(async (entry) => {
          if (entry.encrypted && entry.text) {
            try {
              return { ...entry, text: await decryptText(entry.text) }
            } catch (e) {
              console.error('Failed to decrypt entry:', e)
              return entry // Return as-is if decryption fails
            }
          }
          return entry // Old unencrypted entries pass through
        }))
        entries.value = decrypted
      }
    } catch (e) {
      console.error('Failed to load entries:', e)
      entries.value = []
    }
  }

  const saveEntry = async (entry) => {
    const newEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...entry
    }
    // Keep plaintext in memory for display
    entries.value.unshift(newEntry)
    // Persist with encrypted text
    await persistEntries()
    incrementUsageCount()
    return newEntry
  }

  const persistEntries = async () => {
    try {
      // Encrypt text before storing
      const toStore = await Promise.all(entries.value.map(async (entry) => {
        if (entry.text && !entry.encrypted) {
          try {
            return { ...entry, text: await encryptText(entry.text), encrypted: true }
          } catch (e) {
            console.error('Failed to encrypt entry:', e)
            return entry // Store unencrypted as fallback
          }
        }
        // Already encrypted entries: re-encrypt with current plaintext
        if (entry.text && entry.encrypted) {
          try {
            return { ...entry, text: await encryptText(entry.text) }
          } catch (e) {
            return entry
          }
        }
        return entry
      }))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore))
    } catch (e) {
      console.error('Failed to save entries:', e)
    }
  }

  const deleteEntry = async (id) => {
    entries.value = entries.value.filter(entry => entry.id !== id)
    await persistEntries()
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

  // Usage tracking for freemium paywall (with anti-tampering)
  const getUsageCount = () => {
    const count = parseInt(localStorage.getItem(USAGE_KEY) || '0', 10)
    const storedChecksum = localStorage.getItem(USAGE_CHECK_KEY)

    // If there's a count but no checksum (first run or old data), set the checksum
    if (count > 0 && !storedChecksum) {
      localStorage.setItem(USAGE_CHECK_KEY, calculateChecksum(count))
      return count
    }

    // Verify checksum matches
    if (storedChecksum && storedChecksum !== calculateChecksum(count)) {
      console.warn('Usage count integrity check failed')
      // Reset to 0 - tampering detected
      localStorage.setItem(USAGE_KEY, '0')
      localStorage.setItem(USAGE_CHECK_KEY, calculateChecksum(0))
      return 0
    }

    return count
  }

  const incrementUsageCount = () => {
    const count = getUsageCount() + 1
    localStorage.setItem(USAGE_KEY, count.toString())
    localStorage.setItem(USAGE_CHECK_KEY, calculateChecksum(count))
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
    localStorage.removeItem(USAGE_CHECK_KEY)
    localStorage.removeItem(UNLOCKED_KEY)
    console.log('Demo reset: Usage counter cleared')
  }

  // Load entries asynchronously (entries ref updates when ready)
  const entriesLoaded = loadEntries()

  return {
    entriesLoaded,
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
