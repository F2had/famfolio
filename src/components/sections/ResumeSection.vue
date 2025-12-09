<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useConfig } from '@/composables/useConfig'
import SectionWrapper from '@/components/layout/SectionWrapper.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import IconDownload from '~icons/lucide/download'

const { t } = useI18n()
const { sections } = useConfig()
</script>

<template>
  <SectionWrapper id="resume" dark>
    <div class="resume">
      <h2 class="resume__title">{{ t('resume.title') }}</h2>
      <p class="resume__description">{{ t('resume.description') }}</p>

      <BaseButton :href="sections.resume.pdfPath" external variant="primary" size="lg">
        <IconDownload class="resume__icon" />
        {{ t('resume.download') }}
      </BaseButton>
    </div>
  </SectionWrapper>
</template>

<style scoped lang="scss">
.resume {
  text-align: center;
  max-width: 600px;
  margin-inline: auto;

  &__title {
    font-size: var(--text-3xl);
    font-weight: 700;
    margin-bottom: var(--space-md);

    @media (min-width: 768px) {
      font-size: var(--text-4xl);
    }
  }

  &__description {
    font-size: var(--text-lg);
    color: var(--text-secondary);
    margin-bottom: var(--space-xl);
    line-height: var(--leading-relaxed);
  }

  &__icon {
    width: 20px;
    height: 20px;
  }
}
</style>
