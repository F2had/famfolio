import { ref, computed, watch, onMounted } from 'vue'
import { usePreferredDark, useStorage } from '@vueuse/core'
import config from '@config'

type ThemeMode = 'light' | 'dark' | 'system'

const mode = ref<ThemeMode>(config.theme.defaultMode)
const storageKey = 'famfolio-theme'

// Map config color keys to CSS variable names
const colorVarMap: Record<string, string> = {
  bgPrimary: '--bg-primary',
  bgSecondary: '--bg-secondary',
  textPrimary: '--text-primary',
  textSecondary: '--text-secondary',
  accent: '--accent',
  accentHover: '--accent-hover',
  accentSubtle: '--accent-subtle',
  border: '--border',
}

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

    // Apply colors from config to CSS variables
    const colors = config.theme.colors[resolved.value]
    if (colors) {
      for (const [key, varName] of Object.entries(colorVarMap)) {
        const value = colors[key as keyof typeof colors]
        if (value) {
          root.style.setProperty(varName, value)
        }
      }
    }
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
