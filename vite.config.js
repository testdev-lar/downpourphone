import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['audio/*'],
      manifest: {
        name: 'Downpour',
        short_name: 'Downpour',
        description: 'An emotional release journaling app',
        theme_color: '#1a1d23',
        background_color: '#1a1d23',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: '/icons/android-launchericon-48-48.png',
            sizes: '48x48',
            type: 'image/png'
          },
          {
            src: '/icons/android-launchericon-72-72.png',
            sizes: '72x72',
            type: 'image/png'
          },
          {
            src: '/icons/android-launchericon-96-96.png',
            sizes: '96x96',
            type: 'image/png'
          },
          {
            src: '/icons/android-launchericon-144-144.png',
            sizes: '144x144',
            type: 'image/png'
          },
          {
            src: '/icons/android-launchericon-192-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/android-launchericon-512-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3,ogg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ]
})
