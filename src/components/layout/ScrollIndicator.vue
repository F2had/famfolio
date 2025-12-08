<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import IconChevronDown from '~icons/lucide/chevron-down'

const { t } = useI18n()

const scrollDown = () => {
  const nextSection = document.getElementById('about')
  if (nextSection) {
    nextSection.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <button class="scroll-indicator" :aria-label="t('hero.scrollHint')" @click="scrollDown">
    <span class="scroll-indicator__text">{{ t('hero.scrollHint') }}</span>
    <IconChevronDown class="scroll-indicator__icon" />
  </button>
</template>

<style scoped lang="scss">
.scroll-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  color: var(--text-secondary);
  transition: color var(--transition-fast);

  &:hover {
    color: var(--accent);
  }

  &__text {
    font-family: var(--font-display);
    font-size: var(--text-sm);
    font-weight: 500;
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }

  &__icon {
    width: 24px;
    height: 24px;
    animation: bounce 2s ease-in-out infinite;
  }
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-6px);
  }
  60% {
    transform: translateY(-3px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .scroll-indicator__icon {
    animation: none;
  }
}
</style>
