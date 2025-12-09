<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from '@/composables/useTheme'
import IconSun from '~icons/lucide/sun'
import IconMoon from '~icons/lucide/moon'

defineProps<{
  showLabel?: boolean
}>()

const emit = defineEmits<{
  beforeToggle: [position: { x: number; y: number }]
}>()

const { t } = useI18n()
const { isDark } = useTheme()

const buttonRef = ref<HTMLButtonElement | null>(null)

const handleToggle = () => {
  if (buttonRef.value) {
    const rect = buttonRef.value.getBoundingClientRect()
    emit('beforeToggle', {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    })
  }
  // Note: Don't call toggle() here - ThemeTransition handles it
}
</script>

<template>
  <button
    ref="buttonRef"
    class="theme-toggle"
    :class="{ 'theme-toggle--with-label': showLabel }"
    :aria-label="isDark ? t('theme.switchToLight') : t('theme.switchToDark')"
    @click="handleToggle"
  >
    <span class="theme-toggle__icon">
      <IconMoon v-if="isDark" class="theme-toggle__moon" />
      <IconSun v-else class="theme-toggle__sun" />
    </span>
    <span v-if="showLabel" class="theme-toggle__label">
      {{ isDark ? t('theme.dark') : t('theme.light') }}
    </span>
  </button>
</template>

<style scoped lang="scss">
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
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

  &--with-label {
    width: auto;
    padding-inline: var(--space-sm);
    gap: var(--space-xs);
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 20px;
      height: 20px;
    }
  }

  &__sun {
    animation: sunRise 0.3s ease-out;
  }

  &__moon {
    animation: moonRise 0.3s ease-out;
  }

  &__label {
    font-family: var(--font-display);
    font-size: var(--text-sm);
    font-weight: 500;
  }
}

@keyframes sunRise {
  from {
    opacity: 0;
    transform: rotate(-90deg) scale(0.5);
  }
  to {
    opacity: 1;
    transform: rotate(0deg) scale(1);
  }
}

@keyframes moonRise {
  from {
    opacity: 0;
    transform: rotate(90deg) scale(0.5);
  }
  to {
    opacity: 1;
    transform: rotate(0deg) scale(1);
  }
}
</style>
