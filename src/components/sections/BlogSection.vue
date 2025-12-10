<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useConfig } from '@/composables/useConfig'
import { useLocalizedValue } from '@/composables/useLocalizedValue'
import { useExternalLink } from '@/composables/useExternalLink'
import SectionWrapper from '@/components/layout/SectionWrapper.vue'
import ExternalLinkDialog from '@/components/common/ExternalLinkDialog.vue'
import IconArrowRight from '~icons/lucide/arrow-right'

const { t } = useI18n()
const { blog } = useConfig()
const { localize } = useLocalizedValue()
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
</script>

<template>
  <SectionWrapper id="blog">
    <h2 class="section-title">{{ t('blog.title') }}</h2>
    <p class="section-subtitle">{{ t('blog.subtitle') }}</p>

    <div class="blog__list">
      <article v-for="post in blog.posts" :key="post.id" class="blog__post">
        <a
          :href="post.url"
          :target="targetAttr"
          :rel="relAttr"
          class="blog__post-link"
          @click="(e) => handleClick(e, post.url)"
        >
          <div class="blog__post-content">
            <time class="blog__post-date">{{ post.date }}</time>
            <h3 class="blog__post-title">{{ localize(post.title) }}</h3>
            <p class="blog__post-excerpt">{{ localize(post.excerpt) }}</p>
          </div>
          <IconArrowRight class="blog__post-arrow" />
        </a>
      </article>
    </div>

    <ExternalLinkDialog
      :show="showDialog"
      :domain="getDomain(pendingUrl)"
      @confirm="confirmNavigation"
      @cancel="cancelNavigation"
    />
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

.blog {
  &__list {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  &__post {
    border-radius: var(--radius-lg);
    background-color: var(--bg-secondary);
    transition:
      transform var(--transition-fast),
      box-shadow var(--transition-fast);

    &:hover {
      transform: translateX(4px);
      box-shadow: var(--shadow-md);
    }
  }

  &__post-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-lg);
    color: inherit;
    text-decoration: none;
  }

  &__post-content {
    flex: 1;
  }

  &__post-date {
    font-size: var(--text-sm);
    color: var(--text-secondary);
    margin-bottom: var(--space-xs);
    display: block;
  }

  &__post-title {
    font-size: var(--text-lg);
    font-weight: 600;
    margin-bottom: var(--space-xs);
    transition: color var(--transition-fast);

    .blog__post:hover & {
      color: var(--accent);
    }
  }

  &__post-excerpt {
    font-size: var(--text-base);
    color: var(--text-secondary);
    line-height: var(--leading-relaxed);
  }

  &__post-arrow {
    width: 20px;
    height: 20px;
    color: var(--text-secondary);
    flex-shrink: 0;
    margin-inline-start: var(--space-md);
    transition:
      color var(--transition-fast),
      transform var(--transition-fast);

    .blog__post:hover & {
      color: var(--accent);
      transform: translateX(4px);
    }
  }
}

[dir='rtl'] {
  .blog__post:hover {
    transform: translateX(-4px);
  }

  .blog__post-arrow {
    transform: rotate(180deg);

    .blog__post:hover & {
      transform: rotate(180deg) translateX(4px);
    }
  }
}
</style>
