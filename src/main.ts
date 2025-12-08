import { createApp } from 'vue'
import { MotionPlugin } from '@vueuse/motion'
import App from '@/App.vue'
import { vuetify } from '@/plugins/vuetify'
import { i18n } from '@/plugins/i18n'

// Styles
import '@/assets/styles/main.scss'

const app = createApp(App)

app.use(vuetify)
app.use(i18n)
app.use(MotionPlugin)

app.mount('#app')
