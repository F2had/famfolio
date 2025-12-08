<script setup lang="ts">
import { computed, type Component } from 'vue'

type Props = {
  icon: Component
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
})

const iconStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
}))
</script>

<template>
  <component :is="icon" :style="iconStyle" class="base-icon" />
</template>

<style scoped lang="scss">
.base-icon {
  flex-shrink: 0;
}
</style>
