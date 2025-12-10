<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useSpring } from '@vueuse/motion'
import { useExternalLink } from '@/composables/useExternalLink'
import ExternalLinkDialog from '@/components/common/ExternalLinkDialog.vue'

type Props = {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  href?: string
  external?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  external: false,
})

const {
  relAttr,
  targetAttr,
  showDialog,
  pendingUrl,
  getDomain,
  handleClick,
  confirmNavigation,
  cancelNavigation,
} = useExternalLink()

const component = props.href ? 'a' : 'button'
const linkAttrs = computed(() =>
  props.href
    ? {
        href: props.href,
        target: props.external ? targetAttr.value : undefined,
        rel: props.external ? relAttr.value : undefined,
      }
    : {},
)

// Spring-based press animation
const pressTarget = reactive({ scale: 1 })
const pressSpring = useSpring(pressTarget, {
  stiffness: 400,
  damping: 15,
})
const pressValues = pressSpring.values as unknown as { scale: number }
const setPress = pressSpring.set as (v: { scale: number }) => void

const handleMouseDown = () => {
  if (!props.disabled && !props.loading) {
    setPress({ scale: 0.95 })
  }
}

const handleMouseUp = () => {
  setPress({ scale: 1 })
}

const handleMouseLeave = () => {
  setPress({ scale: 1 })
}

const buttonStyle = computed(() => ({
  transform: `scale(${pressValues.scale})`,
}))
</script>

<template>
  <component
    :is="component"
    v-bind="linkAttrs"
    class="base-button"
    :class="[
      `base-button--${variant}`,
      `base-button--${size}`,
      { 'base-button--loading': loading, 'base-button--disabled': disabled },
    ]"
    :style="buttonStyle"
    :disabled="disabled || loading"
    @click="(e: MouseEvent) => props.external && props.href && handleClick(e, props.href)"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseLeave"
  >
    <span v-if="loading" class="base-button__spinner" />
    <span class="base-button__content" :class="{ 'base-button__content--hidden': loading }">
      <slot />
    </span>
  </component>

  <ExternalLinkDialog
    :show="showDialog"
    :domain="getDomain(pendingUrl)"
    @confirm="confirmNavigation"
    @cancel="cancelNavigation"
  />
</template>

<style scoped lang="scss">
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  font-family: var(--font-display);
  font-weight: 500;
  text-decoration: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition:
    background-color var(--transition-fast),
    color var(--transition-fast),
    box-shadow var(--transition-fast);
  position: relative;
  will-change: transform;

  // Variants
  &--primary {
    background-color: var(--accent);
    color: white;

    &:hover:not(:disabled) {
      background-color: var(--accent-hover);
    }
  }

  &--secondary {
    background-color: var(--bg-secondary);
    color: var(--text-primary);

    &:hover:not(:disabled) {
      background-color: var(--border);
    }
  }

  &--outline {
    background-color: transparent;
    color: var(--accent);
    border: 2px solid var(--accent);

    &:hover:not(:disabled) {
      background-color: var(--accent-subtle);
    }
  }

  &--ghost {
    background-color: transparent;
    color: var(--text-primary);

    &:hover:not(:disabled) {
      background-color: var(--accent-subtle);
      color: var(--accent);
    }
  }

  // Sizes
  &--sm {
    padding: var(--space-xs) var(--space-md);
    font-size: var(--text-sm);
    height: 32px;
  }

  &--md {
    padding: var(--space-sm) var(--space-lg);
    font-size: var(--text-base);
    height: 40px;
  }

  &--lg {
    padding: var(--space-md) var(--space-xl);
    font-size: var(--text-lg);
    height: 48px;
  }

  // States
  &--disabled,
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &--loading {
    cursor: wait;
  }

  // Content
  &__content {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    transition: opacity var(--transition-fast);

    &--hidden {
      opacity: 0;
    }
  }

  // Spinner
  &__spinner {
    position: absolute;
    width: 18px;
    height: 18px;
    border: 2px solid transparent;
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
