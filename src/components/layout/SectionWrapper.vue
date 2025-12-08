<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useConfig } from '@/composables/useConfig'

type Props = {
  id: string
  dark?: boolean
}

defineProps<Props>()

const { animations } = useConfig()
const sectionRef = ref<HTMLElement | null>(null)
const isRevealed = ref(false)

onMounted(() => {
  if (!animations.scrollReveal || !sectionRef.value) {
    isRevealed.value = true
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isRevealed.value = true
          observer.disconnect()
        }
      })
    },
    { threshold: 0.1 }
  )

  observer.observe(sectionRef.value)
})
</script>

<template>
  <section
    :id="id"
    ref="sectionRef"
    class="section-wrapper"
    :class="{ 'section-wrapper--dark': dark, 'section-wrapper--revealed': isRevealed }"
  >
    <div class="section-wrapper__container">
      <slot />
    </div>
  </section>
</template>

<style scoped lang="scss">
.section-wrapper {
  padding-block: var(--space-3xl);
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity var(--transition-slow),
    transform var(--transition-slow);

  @media (min-width: 768px) {
    padding-block: var(--space-4xl);
  }

  &--revealed {
    opacity: 1;
    transform: translateY(0);
  }

  &--dark {
    background-color: var(--bg-secondary);
  }

  &__container {
    width: 100%;
    max-width: var(--container-max);
    margin-inline: auto;
    padding-inline: var(--container-padding);
  }
}

@media (prefers-reduced-motion: reduce) {
  .section-wrapper {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
