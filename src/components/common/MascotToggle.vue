<script setup lang="ts">
/**
 * Toggle button to show/hide Fam, the friendly mascot
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMascotState } from '@/composables/useMascotState'
import IconEye from '~icons/lucide/eye'
import IconEyeOff from '~icons/lucide/eye-off'

const { t } = useI18n()
const { isMascotVisible, toggleMascot } = useMascotState()

const icon = computed(() => (isMascotVisible.value ? IconEye : IconEyeOff))
const label = computed(() =>
  isMascotVisible.value ? t('mascotToggle.hideFam') : t('mascotToggle.showFam'),
)
</script>

<template>
  <button class="mascot-toggle" :aria-label="label" :title="label" @click="toggleMascot">
    <component :is="icon" class="mascot-toggle__icon" />
  </button>
</template>

<style scoped lang="scss">
.mascot-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: var(--text-secondary);
  border-radius: var(--radius-md);
  transition:
    color var(--transition-fast),
    background-color var(--transition-fast);

  &:hover {
    color: var(--accent);
    background-color: var(--accent-subtle);
  }

  &__icon {
    width: 20px;
    height: 20px;
  }
}
</style>
