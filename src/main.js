import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)
app.config.errorHandler = (err) => {
  console.error('Unhandled error:', err)
}
app.use(router)
app.mount('#app')
