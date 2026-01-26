/**
 * Haptic feedback composable for mobile devices
 * Uses the Vibration API with graceful degradation
 */

export function useHaptics() {
  // Check if vibration is supported
  const isSupported = () => {
    return 'vibrate' in navigator
  }

  /**
   * Trigger haptic feedback
   * @param {string} intensity - 'light', 'medium', or 'heavy'
   */
  const triggerHaptic = (intensity = 'medium') => {
    if (!isSupported()) {
      return
    }

    // Define vibration patterns for different intensities
    // Values are in milliseconds
    const patterns = {
      light: 25,    // Subtle tap
      medium: 50,   // Standard feedback
      heavy: 100    // Strong confirmation
    }

    const duration = patterns[intensity] || patterns.medium

    try {
      navigator.vibrate(duration)
    } catch (error) {
      // Silently fail if vibration not available
      console.debug('Haptic feedback not available:', error)
    }
  }

  return {
    triggerHaptic,
    isSupported
  }
}
