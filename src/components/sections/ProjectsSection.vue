<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useConfig } from '@/composables/useConfig'
import SectionWrapper from '@/components/layout/SectionWrapper.vue'
import ProjectCard from '@/components/common/ProjectCard.vue'

const { t } = useI18n()
const { projects } = useConfig()
</script>

<template>
  <SectionWrapper id="projects" dark>
    <h2 class="section-title">{{ t('projects.title') }}</h2>
    <p class="section-subtitle">{{ t('projects.subtitle') }}</p>

    <div class="projects__grid">
      <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
    </div>
  </SectionWrapper>
</template>

<style scoped lang="scss">
.section-title {
  font-size: var(--text-3xl);
  font-weight: 700;
  margin-bottom: var(--space-sm);

  @media (min-width: 768px) {
    font-size: var(--text-4xl);
  }
}

.section-subtitle {
  font-size: var(--text-lg);
  color: var(--text-secondary);
  margin-bottom: var(--space-2xl);
  max-width: 600px;
}

.projects__grid {
  display: grid;
  gap: var(--space-lg);

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
