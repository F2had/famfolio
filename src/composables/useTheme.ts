import { ref, computed, watch, onMounted } from 'vue'
import { usePreferredDark, useStorage } from '@vueuse/core'
import config from '@config'

type ThemeMode = 'light' | 'dark' | 'system'

const mode = ref<ThemeMode>(config.theme.defaultMode)
const storageKey = 'famfolio-theme'

export const useTheme = () => {
  const prefersDark = usePreferredDark()
  const stored = useStorage<ThemeMode>(storageKey, config.theme.defaultMode)

  const resolved = computed<'light' | 'dark'>(() => {
    if (mode.value === 'system') {
      return prefersDark.value ? 'dark' : 'light'
    }
    return mode.value
  })

  const isDark = computed(() => resolved.value === 'dark')

  const applyTheme = () => {
    const root = document.documentElement
    root.dataset.theme = resolved.value
    root.classList.remove('light', 'dark')
    root.classList.add(resolved.value)
  }

  const setMode = (newMode: ThemeMode) => {
    mode.value = newMode
    stored.value = newMode
  }

  const toggle = () => {
    setMode(resolved.value === 'light' ? 'dark' : 'light')
  }

  watch(resolved, applyTheme, { immediate: false })

  watch(prefersDark, () => {
    if (mode.value === 'system') {
      applyTheme()
    }
  })

  onMounted(() => {
    mode.value = stored.value
    applyTheme()
  })

  return {
    mode,
    resolved,
    isDark,
    setMode,
    toggle,
    colors: computed(() => config.theme.colors[resolved.value]),
  }
}
