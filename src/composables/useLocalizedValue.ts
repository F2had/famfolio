import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { LocalizedString, LocaleCode } from '@/types/config'

export const useLocalizedValue = () => {
  const { locale } = useI18n()

  const localize = (obj: LocalizedString): string => {
    const key = locale.value as LocaleCode
    return obj[key] || obj.en
  }

  const localizedRef = (obj: LocalizedString) => {
    return computed(() => localize(obj))
  }

  return {
    localize,
    localizedRef,
  }
}
