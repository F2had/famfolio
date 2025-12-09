import { fileURLToPath, URL } from 'node:url'
import { readFileSync, existsSync } from 'node:fs'
import { parse as parseYaml } from 'yaml'

import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import yaml from '@modyfi/vite-plugin-yaml'
import Icons from 'unplugin-icons/vite'

// Resolve config file path from CONFIG_FILE env var
// Usage: CONFIG_FILE=demo bun run build (uses site.config.demo.yaml)
//        CONFIG_FILE=custom.yaml bun run build (uses custom.yaml)
//        bun run build (uses site.config.yaml)
const resolveConfigPath = (): string => {
  const configFile = process.env.CONFIG_FILE
  if (!configFile) {
    return fileURLToPath(new URL('./config/site.config.yaml', import.meta.url))
  }
  // Shorthand: "demo" -> "config/site.config.demo.yaml"
  if (configFile === 'demo') {
    return fileURLToPath(new URL('./config/site.config.demo.yaml', import.meta.url))
  }
  // Full path or relative path
  if (configFile.startsWith('/')) {
    return configFile
  }
  return fileURLToPath(new URL(`./config/${configFile}`, import.meta.url))
}

const configPath = resolveConfigPath()
if (!existsSync(configPath)) {
  throw new Error(`Config file not found: ${configPath}`)
}
console.log(`Using config: ${configPath}`)
const siteConfig = parseYaml(readFileSync(configPath, 'utf-8'))

// Custom plugin to inject SEO meta from site.config.yaml
const seoPlugin = (): Plugin => {
  const { site, personal, theme } = siteConfig
  const defaultLocale = site.defaultLocale || 'en'

  // Get localized value helper
  const loc = (obj: Record<string, string>) =>
    obj?.[defaultLocale] || Object.values(obj || {})[0] || ''

  return {
    name: 'seo-injection',
    transformIndexHtml: (html) => {
      const title =
        site.title || `${loc(personal.name)} ${loc(personal.lastName)} | ${loc(personal.title)}`
      const description = site.description || loc(personal.tagline)
      const url = site.url || 'https://yoursite.dev'
      const themeColor = theme.colors?.light?.accent || '#C8873D'
      const faviconSvg = site.favicon?.svg || '/favicon.svg'
      const faviconIco = site.favicon?.ico || '/favicon.ico'

      return html
        .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
        .replace(/<meta name="title" content=".*?">/, `<meta name="title" content="${title}">`)
        .replace(
          /<meta name="description" content=".*?">/,
          `<meta name="description" content="${description}">`,
        )
        .replace(
          /<meta property="og:url" content=".*?">/,
          `<meta property="og:url" content="${url}">`,
        )
        .replace(
          /<meta property="og:title" content=".*?">/,
          `<meta property="og:title" content="${title}">`,
        )
        .replace(
          /<meta property="og:description" content=".*?">/,
          `<meta property="og:description" content="${description}">`,
        )
        .replace(
          /<meta property="twitter:url" content=".*?">/,
          `<meta property="twitter:url" content="${url}">`,
        )
        .replace(
          /<meta property="twitter:title" content=".*?">/,
          `<meta property="twitter:title" content="${title}">`,
        )
        .replace(
          /<meta property="twitter:description" content=".*?">/,
          `<meta property="twitter:description" content="${description}">`,
        )
        .replace(
          /<meta name="theme-color" content=".*?">/,
          `<meta name="theme-color" content="${themeColor}">`,
        )
        .replace(
          /<link rel="icon" type="image\/svg\+xml" href=".*?">/,
          `<link rel="icon" type="image/svg+xml" href="${faviconSvg}">`,
        )
        .replace(
          /<link rel="icon" type="image\/x-icon" href=".*?">/,
          `<link rel="icon" type="image/x-icon" href="${faviconIco}">`,
        )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: process.env.BASE_URL || '/',
  plugins: [vue(), vueDevTools(), yaml(), Icons({ compiler: 'vue3' }), seoPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@config': configPath,
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
