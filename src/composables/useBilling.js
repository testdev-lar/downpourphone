import { ref } from 'vue'
import { useLocalStorage } from './useLocalStorage'

const PRODUCT_ID = 'downpour_unlimited'
const PLAY_BILLING_SERVICE = 'https://play.google.com/billing'

// Singleton state
let digitalGoodsService = null
const isInitialized = ref(false)
const isAvailable = ref(false)
const productDetails = ref(null)
const isPurchasing = ref(false)
const error = ref(null)

export function useBilling() {
  const { setUnlocked, isUnlocked } = useLocalStorage()

  /**
   * Initialize the Digital Goods API
   * Only available when running as a TWA from Play Store
   */
  const initialize = async () => {
    if (isInitialized.value) return isAvailable.value

    try {
      if ('getDigitalGoodsService' in window) {
        digitalGoodsService = await window.getDigitalGoodsService(PLAY_BILLING_SERVICE)
        isAvailable.value = true
      } else {
        isAvailable.value = false
      }
    } catch (e) {
      console.error('Digital Goods API not available:', e)
      isAvailable.value = false
    }

    isInitialized.value = true
    return isAvailable.value
  }

  /**
   * Get product details from Play Store
   */
  const getProductDetails = async () => {
    if (!digitalGoodsService) {
      await initialize()
    }

    if (!digitalGoodsService) {
      return null
    }

    try {
      const details = await digitalGoodsService.getDetails([PRODUCT_ID])
      if (details && details.length > 0) {
        productDetails.value = details[0]
        return details[0]
      }
    } catch (e) {
      console.error('Failed to get product details:', e)
      error.value = 'Could not load product information'
    }

    return null
  }

  /**
   * Initiate a purchase using Payment Request API
   */
  const purchase = async () => {
    error.value = null
    isPurchasing.value = true

    try {
      // Ensure we have product details
      if (!productDetails.value) {
        await getProductDetails()
      }

      if (!productDetails.value) {
        throw new Error('Product not available')
      }

      // Create payment request
      const paymentMethods = [{
        supportedMethods: PLAY_BILLING_SERVICE,
        data: {
          sku: PRODUCT_ID
        }
      }]

      const paymentDetails = {
        total: {
          label: productDetails.value.title || 'Unlimited Releases',
          amount: {
            currency: productDetails.value.price?.currency || 'USD',
            value: productDetails.value.price?.value || '6.99'
          }
        }
      }

      const request = new PaymentRequest(paymentMethods, paymentDetails)
      const response = await request.show()

      // Get the purchase token from the response
      const { purchaseToken } = response.details

      // Acknowledge the purchase (required for consumables, good practice for all)
      if (purchaseToken && digitalGoodsService) {
        await digitalGoodsService.acknowledge(purchaseToken, 'onetime')
      }

      // Complete the payment
      await response.complete('success')

      // Unlock the app
      setUnlocked()
      isPurchasing.value = false

      return { success: true }
    } catch (e) {
      isPurchasing.value = false

      if (e.name === 'AbortError') {
        // User cancelled - not an error
        return { success: false, cancelled: true }
      }

      console.error('Purchase failed:', e)
      error.value = 'Purchase failed. Please try again.'
      return { success: false, error: e.message }
    }
  }

  /**
   * Check for existing purchases (restore purchase)
   * Useful for users who reinstall or switch devices
   */
  const restorePurchases = async () => {
    error.value = null

    try {
      if (!digitalGoodsService) {
        await initialize()
      }

      if (!digitalGoodsService) {
        error.value = 'Restore not available in browser'
        return { success: false, restored: false }
      }

      // List existing purchases
      const purchases = await digitalGoodsService.listPurchases()

      // Check if user has purchased our product
      const hasPurchased = purchases.some(p => p.itemId === PRODUCT_ID)

      if (hasPurchased) {
        setUnlocked()
        return { success: true, restored: true }
      }

      return { success: true, restored: false }
    } catch (e) {
      console.error('Restore failed:', e)
      error.value = 'Could not restore purchases'
      return { success: false, error: e.message }
    }
  }

  /**
   * Check if billing is available (for UI display)
   */
  const checkAvailability = async () => {
    await initialize()
    return isAvailable.value
  }

  return {
    // State
    isAvailable,
    productDetails,
    isPurchasing,
    error,
    isUnlocked,

    // Methods
    initialize,
    getProductDetails,
    purchase,
    restorePurchases,
    checkAvailability
  }
}
