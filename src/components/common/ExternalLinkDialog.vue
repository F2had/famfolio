<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  show: boolean
  domain: string
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const { t } = useI18n()
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="show" class="external-link-dialog" @click.self="emit('cancel')">
        <div class="external-link-dialog__content">
          <h3 class="external-link-dialog__title">{{ t('externalLink.title', 'Leaving Site') }}</h3>
          <p class="external-link-dialog__message">
            {{ t('externalLink.message', 'You are about to visit an external website:') }}
          </p>
          <p class="external-link-dialog__url">{{ domain }}</p>
          <div class="external-link-dialog__actions">
            <button
              class="external-link-dialog__btn external-link-dialog__btn--cancel"
              @click="emit('cancel')"
            >
              {{ t('externalLink.cancel', 'Cancel') }}
            </button>
            <button
              class="external-link-dialog__btn external-link-dialog__btn--confirm"
              @click="emit('confirm')"
            >
              {{ t('externalLink.confirm', 'Continue') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.external-link-dialog {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);

  &__content {
    background-color: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: var(--space-xl);
    max-width: 400px;
    width: 90%;
    text-align: center;
    box-shadow: var(--shadow-lg);
  }

  &__title {
    font-size: var(--text-xl);
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--space-md);
  }

  &__message {
    font-size: var(--text-base);
    color: var(--text-secondary);
    margin-bottom: var(--space-sm);
  }

  &__url {
    font-family: ui-monospace, 'SF Mono', 'Cascadia Code', monospace;
    font-size: var(--text-sm);
    color: var(--accent);
    background-color: var(--bg-secondary);
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--radius-md);
    margin-bottom: var(--space-lg);
    word-break: break-all;
  }

  &__actions {
    display: flex;
    gap: var(--space-md);
    justify-content: center;
  }

  &__btn {
    padding: var(--space-sm) var(--space-lg);
    border-radius: var(--radius-md);
    font-size: var(--text-base);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);

    &--cancel {
      background-color: var(--bg-secondary);
      border: 1px solid var(--border);
      color: var(--text-primary);

      &:hover {
        background-color: var(--border);
      }
    }

    &--confirm {
      background-color: var(--accent);
      border: 1px solid var(--accent);
      color: var(--bg-primary);

      &:hover {
        background-color: var(--accent-hover);
        border-color: var(--accent-hover);
      }
    }
  }
}

.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.2s ease;

  .external-link-dialog__content {
    transition: transform 0.2s ease;
  }
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;

  .external-link-dialog__content {
    transform: scale(0.95);
  }
}
</style>
