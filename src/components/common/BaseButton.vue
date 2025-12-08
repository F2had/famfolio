<script setup lang="ts">
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

const component = props.href ? 'a' : 'button'
const linkAttrs = props.href
  ? {
      href: props.href,
      target: props.external ? '_blank' : undefined,
      rel: props.external ? 'noopener noreferrer' : undefined,
    }
  : {}
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
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="base-button__spinner" />
    <span class="base-button__content" :class="{ 'base-button__content--hidden': loading }">
      <slot />
    </span>
  </component>
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
    transform var(--transition-fast),
    box-shadow var(--transition-fast);
  position: relative;

  &:active:not(:disabled) {
    transform: scale(0.97);
  }

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
