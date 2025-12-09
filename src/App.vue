<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { useLocale } from '@/composables/useLocale'
import { useSettings } from '@/composables/useSettings'
import { useRoute } from 'vue-router'
import TheNavigation from '@/components/layout/TheNavigation.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import ThemeTransition from '@/components/transitions/ThemeTransition.vue'
import LocaleTransition from '@/components/transitions/LocaleTransition.vue'

// Initialize theme and locale on app mount
const { mode, toggle: toggleTheme } = useTheme()
const { locale, toggle: toggleLocale } = useLocale()
const { isThemeTransitionEnabled, isLocaleTransitionEnabled } = useSettings()

const route = useRoute()

const isHomePage = computed(() => route.name === 'home')

const themeTransitionRef = ref<InstanceType<typeof ThemeTransition> | null>(null)
const localeTransitionRef = ref<InstanceType<typeof LocaleTransition> | null>(null)

const handleThemeToggle = (position: { x: number; y: number }) => {
  if (isThemeTransitionEnabled.value && themeTransitionRef.value) {
    themeTransitionRef.value.triggerTransition(position.x, position.y)
  } else {
    toggleTheme()
  }
}

const handleLocaleToggle = (data: {
  x: number
  y: number
  fromLocale: string
  toLocale: string
}) => {
  if (isLocaleTransitionEnabled.value && localeTransitionRef.value) {
    localeTransitionRef.value.triggerTransition(data.fromLocale, data.toLocale, data.x, data.y)
    // Toggle locale after a short delay to let transition start
    setTimeout(() => toggleLocale(), 50)
  } else {
    toggleLocale()
  }
}

onMounted(() => {
  console.debug(`App initialized - Theme: ${mode.value}, Locale: ${locale.value}`)
})
</script>

<template>
  <div id="portfolio">
    <!-- Transition overlays -->
    <ThemeTransition ref="themeTransitionRef" />
    <LocaleTransition ref="localeTransitionRef" />

    <!-- Navigation only on home page (has scroll behavior) -->
    <TheNavigation
      v-if="isHomePage"
      @theme-toggle="handleThemeToggle"
      @locale-toggle="handleLocaleToggle"
    />

    <!-- Router view for page content -->
    <router-view />

    <!-- Footer only on home page -->
    <TheFooter v-if="isHomePage" />
  </div>
</template>

<style scoped>
#portfolio {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
