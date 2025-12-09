<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useSpring } from '@vueuse/motion'
import { useSettings } from '@/composables/useSettings'

type Props = {
  id: string
  dark?: boolean
}

defineProps<Props>()

const { isScrollRevealEnabled } = useSettings()
const sectionRef = ref<HTMLElement | null>(null)
const isRevealed = ref(false)

// Spring-based reveal animation
const revealTarget = reactive({ opacity: 0, y: 30 })
const revealSpring = useSpring(revealTarget, {
  stiffness: 100,
  damping: 20,
})
const revealValues = revealSpring.values as unknown as { opacity: number; y: number }
const setReveal = revealSpring.set as (v: { opacity: number; y: number }) => void

const revealStyle = computed(() => ({
  opacity: revealValues.opacity,
  transform: `translateY(${revealValues.y}px)`,
}))

onMounted(() => {
  // Skip animations if disabled globally or scrollReveal specifically
  if (!isScrollRevealEnabled.value || !sectionRef.value) {
    setReveal({ opacity: 1, y: 0 })
    isRevealed.value = true
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setReveal({ opacity: 1, y: 0 })
          isRevealed.value = true
          observer.disconnect()
        }
      })
    },
    { threshold: 0.1 },
  )

  observer.observe(sectionRef.value)
})
</script>

<template>
  <section
    :id="id"
    ref="sectionRef"
    class="section-wrapper"
    :class="{ 'section-wrapper--dark': dark }"
    :style="revealStyle"
  >
    <div class="section-wrapper__container">
      <slot />
    </div>
  </section>
</template>

<style scoped lang="scss">
.section-wrapper {
  padding-block: var(--space-3xl);
  will-change: opacity, transform;

  @media (min-width: 768px) {
    padding-block: var(--space-4xl);
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
</style>
