import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import yaml from '@modyfi/vite-plugin-yaml'
import Icons from 'unplugin-icons/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    yaml(),
    Icons({ compiler: 'vue3' }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@config': fileURLToPath(new URL('./site.config.yaml', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress vue-i18n internal warning
        if (warning.code === 'IMPORT_IS_UNDEFINED' && warning.message.includes('currentInstance')) {
          return
        }
        warn(warning)
      },
    },
  },
})
