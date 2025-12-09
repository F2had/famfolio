<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useConfig } from '@/composables/useConfig'
import { useLocalizedValue } from '@/composables/useLocalizedValue'
import SectionWrapper from '@/components/layout/SectionWrapper.vue'

const { t } = useI18n()
const { about, skills } = useConfig()
const { localizedRef } = useLocalizedValue()

const content = localizedRef(about.content)
</script>

<template>
  <SectionWrapper id="about">
    <h2 class="section-title">{{ t('about.title') }}</h2>

    <div class="about__content">
      <p class="about__text">{{ content }}</p>

      <div v-if="skills.length" class="about__skills">
        <span v-for="skill in skills" :key="skill" class="about__skill">
          {{ skill }}
        </span>
      </div>
    </div>
  </SectionWrapper>
</template>

<style scoped lang="scss">
.section-title {
  font-size: var(--text-3xl);
  font-weight: 700;
  margin-bottom: var(--space-xl);

  @media (min-width: 768px) {
    font-size: var(--text-4xl);
  }
}

.about {
  &__content {
    max-width: 800px;
  }

  &__text {
    font-size: var(--text-lg);
    line-height: var(--leading-relaxed);
    color: var(--text-secondary);
    white-space: pre-line;
    margin-bottom: var(--space-xl);

    @media (min-width: 768px) {
      font-size: var(--text-xl);
    }
  }

  &__skills {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-md);
  }

  &__skill {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-md) var(--space-xl);
    font-family: var(--font-display);
    font-size: var(--text-base);
    font-weight: 500;
    color: var(--text-secondary);
    background-color: transparent;
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    transition:
      color var(--transition-fast),
      border-color var(--transition-fast),
      background-color var(--transition-fast),
      transform var(--transition-fast);

    &:hover {
      color: var(--accent);
      border-color: var(--accent);
      background-color: var(--accent-subtle);
      transform: translateY(-2px);
    }
  }
}
</style>
