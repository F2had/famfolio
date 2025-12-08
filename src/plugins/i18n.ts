import { createI18n } from 'vue-i18n'
import config from '@config'
import en from '@/locales/en.json'
import ar from '@/locales/ar.json'

export const i18n = createI18n({
  legacy: false,
  locale: config.site.defaultLocale,
  fallbackLocale: 'en',
  messages: {
    en,
    ar,
  },
})
