<script setup lang="ts">
import { computed } from 'vue'
import { useSettings } from '@/composables/useSettings'

const props = defineProps<{
  href: string
  ariaLabel?: string
}>()

const { isNoopenerEnabled, isNewTabEnabled } = useSettings()

// Check if the link is external (not starting with / or #)
const isExternal = computed(() => {
  return !props.href.startsWith('/') && !props.href.startsWith('#')
})

// Compute rel attribute
const relAttr = computed(() => {
  if (!isExternal.value) return undefined
  if (isNoopenerEnabled.value) return 'noopener noreferrer'
  return undefined
})

// Compute target attribute
const targetAttr = computed(() => {
  if (!isExternal.value) return undefined
  if (isNewTabEnabled.value) return '_blank'
  return undefined
})
</script>

<template>
  <a :href="href" :rel="relAttr" :target="targetAttr" :aria-label="ariaLabel">
    <slot />
  </a>
</template>
