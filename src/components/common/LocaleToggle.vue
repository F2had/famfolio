<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocale } from '@/composables/useLocale'
import IconGlobe from '~icons/lucide/globe'

defineProps<{
  showLabel?: boolean
}>()

const emit = defineEmits<{
  beforeToggle: [data: { x: number; y: number; fromLocale: string; toLocale: string }]
}>()

const { t } = useI18n()
const { locale, supportedLocales, getNextLocale } = useLocale()

const buttonRef = ref<HTMLButtonElement | null>(null)

const currentLocale = computed(() => {
  return supportedLocales.find((l) => l.code === locale.value)
})

const handleToggle = () => {
  if (buttonRef.value) {
    const rect = buttonRef.value.getBoundingClientRect()
    const nextLocale = getNextLocale()
    emit('beforeToggle', {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      fromLocale: locale.value,
      toLocale: nextLocale,
    })
  }
  // Note: Don't call toggle() here - LocaleTransition handles it
}
</script>

<template>
  <button
    ref="buttonRef"
    class="locale-toggle"
    :class="{ 'locale-toggle--with-label': showLabel }"
    :aria-label="t('language.select')"
    @click="handleToggle"
  >
    <span class="locale-toggle__icon">
      <IconGlobe />
    </span>
    <span v-if="showLabel !== false" class="locale-toggle__label">
      {{ currentLocale?.nativeName }}
    </span>
  </button>
</template>

<style scoped lang="scss">
.locale-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding-inline: var(--space-sm);
  gap: var(--space-xs);
  color: var(--text-secondary);
  border-radius: var(--radius-md);
  transition:
    color var(--transition-fast),
    background-color var(--transition-fast),
    transform var(--transition-fast);

  &:hover {
    color: var(--accent);
    background-color: var(--accent-subtle);
  }

  &:active {
    transform: scale(0.95);
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 20px;
      height: 20px;
      transition: transform var(--transition-fast);
    }
  }

  &:hover &__icon svg {
    transform: rotate(15deg);
  }

  &__label {
    font-family: var(--font-display);
    font-size: var(--text-sm);
    font-weight: 500;

    @media (max-width: 480px) {
      display: none;
    }
  }
}
</style>
