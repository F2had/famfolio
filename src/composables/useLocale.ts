import { computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'
import config from '@config'
import type { LocaleCode } from '@/types/config'

const storageKey = 'famfolio-locale'

export const useLocale = () => {
  const { locale } = useI18n()
  const stored = useStorage<LocaleCode>(storageKey, config.site.defaultLocale)

  const currentLocale = computed(() => {
    return config.site.supportedLocales.find((l) => l.code === locale.value)
  })

  const direction = computed(() => currentLocale.value?.dir ?? 'ltr')
  const isRTL = computed(() => direction.value === 'rtl')

  const applyLocale = () => {
    const root = document.documentElement
    root.setAttribute('lang', locale.value)
    root.setAttribute('dir', direction.value)
  }

  const setLocale = (code: LocaleCode) => {
    const supported = config.site.supportedLocales.find((l) => l.code === code)
    if (supported) {
      locale.value = code
      stored.value = code
    }
  }

  const toggle = () => {
    const codes = config.site.supportedLocales.map((l) => l.code)
    const currentIndex = codes.indexOf(locale.value as LocaleCode)
    const nextIndex = (currentIndex + 1) % codes.length
    const nextCode = codes[nextIndex]
    if (nextCode) {
      setLocale(nextCode)
    }
  }

  watch(locale, applyLocale, { immediate: false })

  onMounted(() => {
    locale.value = stored.value
    applyLocale()
  })

  return {
    locale,
    currentLocale,
    direction,
    isRTL,
    supportedLocales: config.site.supportedLocales,
    setLocale,
    toggle,
  }
}
