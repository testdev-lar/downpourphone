const ALGORITHM = 'AES-GCM'
const DB_NAME = 'downpour_keystore'
const STORE_NAME = 'keys'
const KEY_ID = 'journal_key'

const openKeyStore = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

const getOrCreateKey = async () => {
  const db = await openKeyStore()

  // Try to retrieve existing key
  const existing = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const request = store.get(KEY_ID)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })

  if (existing) {
    db.close()
    return existing
  }

  // Generate new key
  const key = await crypto.subtle.generateKey(
    { name: ALGORITHM, length: 256 },
    false, // not extractable
    ['encrypt', 'decrypt']
  )

  // Store it
  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.put(key, KEY_ID)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })

  db.close()
  return key
}

export const encryptText = async (text) => {
  const key = await getOrCreateKey()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encoded = new TextEncoder().encode(text)

  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    encoded
  )

  // Prepend IV to ciphertext, then base64 encode
  const combined = new Uint8Array(iv.length + encrypted.byteLength)
  combined.set(iv, 0)
  combined.set(new Uint8Array(encrypted), iv.length)

  return btoa(String.fromCharCode(...combined))
}

export const decryptText = async (encryptedBase64) => {
  const key = await getOrCreateKey()

  const combined = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0))
  const iv = combined.slice(0, 12)
  const ciphertext = combined.slice(12)

  const decrypted = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv },
    key,
    ciphertext
  )

  return new TextDecoder().decode(decrypted)
}
