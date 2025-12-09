<script setup lang="ts">
import { reactive, computed, type Component } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSpring } from '@vueuse/motion'
import { useLocalizedValue } from '@/composables/useLocalizedValue'
import { useSettings } from '@/composables/useSettings'
import type { Project } from '@/types/config'

// Icons
import IconExternalLink from '~icons/lucide/external-link'
import IconCode from '~icons/lucide/code'
import IconGithub from '~icons/simple-icons/github'
import IconGitlab from '~icons/simple-icons/gitlab'
import IconBitbucket from '~icons/simple-icons/bitbucket'
import IconCodeberg from '~icons/simple-icons/codeberg'
import IconForgejo from '~icons/simple-icons/forgejo'
import IconGitea from '~icons/simple-icons/gitea'

type Props = {
  project: Project
}

const props = defineProps<Props>()

const { t } = useI18n()
const { localizedRef } = useLocalizedValue()
const { isNoopenerEnabled, isNewTabEnabled } = useSettings()

const title = localizedRef(props.project.title)
const description = localizedRef(props.project.description)

// Security attributes for external links
const relAttr = computed(() => (isNoopenerEnabled.value ? 'noopener noreferrer' : undefined))
const targetAttr = computed(() => (isNewTabEnabled.value ? '_blank' : undefined))

// Icon map for code hosting platforms
const codeIconMap: Record<string, Component> = {
  github: IconGithub,
  gitlab: IconGitlab,
  bitbucket: IconBitbucket,
  codeberg: IconCodeberg,
  forgejo: IconForgejo,
  gitea: IconGitea,
}

// Auto-detect platform from URL or use override
const codeIcon = computed(() => {
  // Use explicit override if provided
  if (props.project.links.codeIcon) {
    return codeIconMap[props.project.links.codeIcon] || IconCode
  }

  // Auto-detect from URL
  const url = props.project.links.code?.toLowerCase() || ''
  if (url.includes('github.com')) return IconGithub
  if (url.includes('gitlab.com') || url.includes('gitlab')) return IconGitlab
  if (url.includes('bitbucket.org')) return IconBitbucket
  if (url.includes('codeberg.org')) return IconCodeberg
  if (url.includes('sr.ht') || url.includes('sourcehut')) return IconCode // Sourcehut uses generic icon
  if (url.includes('forgejo') || url.includes('gitea')) return IconForgejo

  // Fallback to generic code icon
  return IconCode
})

// Spring-based hover animation
const cardMotion = reactive({ y: 0, scale: 1, shadow: 0 })
const cardSpring = useSpring(cardMotion, {
  stiffness: 300,
  damping: 20,
})
const cardValues = cardSpring.values as unknown as { y: number; scale: number; shadow: number }
const setCard = cardSpring.set as (v: { y: number; scale: number; shadow: number }) => void

const handleMouseEnter = () => {
  setCard({ y: -4, scale: 1, shadow: 1 })
}

const handleMouseLeave = () => {
  setCard({ y: 0, scale: 1, shadow: 0 })
}

const handleMouseDown = () => {
  setCard({ y: -2, scale: 0.99, shadow: 0.5 })
}

const handleMouseUp = () => {
  setCard({ y: -4, scale: 1, shadow: 1 })
}

const cardStyle = computed(() => ({
  transform: `translateY(${cardValues.y}px) scale(${cardValues.scale})`,
  boxShadow: `0 ${10 + cardValues.shadow * 15}px ${20 + cardValues.shadow * 20}px rgba(0, 0, 0, ${0.05 + cardValues.shadow * 0.1})`,
}))

// Spring-based link hover animations
const liveLink = reactive({ scale: 1 })
const liveLinkSpring = useSpring(liveLink, { stiffness: 400, damping: 15 })
const liveLinkValues = liveLinkSpring.values as unknown as { scale: number }
const setLiveLink = liveLinkSpring.set as (v: { scale: number }) => void

const codeLink = reactive({ scale: 1 })
const codeLinkSpring = useSpring(codeLink, { stiffness: 400, damping: 15 })
const codeLinkValues = codeLinkSpring.values as unknown as { scale: number }
const setCodeLink = codeLinkSpring.set as (v: { scale: number }) => void

const liveLinkStyle = computed(() => ({
  transform: `scale(${liveLinkValues.scale})`,
}))

const codeLinkStyle = computed(() => ({
  transform: `scale(${codeLinkValues.scale})`,
}))
</script>

<template>
  <article
    class="project-card"
    :style="cardStyle"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
  >
    <div class="project-card__image-wrapper">
      <img :src="project.image" :alt="title" class="project-card__image" />
    </div>

    <div class="project-card__content">
      <h3 class="project-card__title">{{ title }}</h3>
      <p class="project-card__description">{{ description }}</p>

      <div class="project-card__tech">
        <span v-for="tech in project.tech" :key="tech" class="project-card__tech-tag">
          {{ tech }}
        </span>
      </div>

      <div class="project-card__links">
        <a
          v-if="project.links.live"
          :href="project.links.live"
          :target="targetAttr"
          :rel="relAttr"
          class="project-card__link"
          :style="liveLinkStyle"
          @mouseenter="setLiveLink({ scale: 1.1 })"
          @mouseleave="setLiveLink({ scale: 1 })"
          @mousedown="setLiveLink({ scale: 0.95 })"
          @mouseup="setLiveLink({ scale: 1.1 })"
        >
          <IconExternalLink />
          {{ t('projects.viewLive') }}
        </a>
        <a
          v-if="project.links.code"
          :href="project.links.code"
          :target="targetAttr"
          :rel="relAttr"
          class="project-card__link"
          :style="codeLinkStyle"
          @mouseenter="setCodeLink({ scale: 1.1 })"
          @mouseleave="setCodeLink({ scale: 1 })"
          @mousedown="setCodeLink({ scale: 0.95 })"
          @mouseup="setCodeLink({ scale: 1.1 })"
        >
          <component :is="codeIcon" />
          {{ t('projects.viewCode') }}
        </a>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.project-card {
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  will-change: transform, box-shadow;

  &__image-wrapper {
    position: relative;
    aspect-ratio: 16 / 10;
    overflow: hidden;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-slow);

    .project-card:hover & {
      transform: scale(1.05);
    }
  }

  &__content {
    padding: var(--space-lg);
  }

  &__title {
    font-size: var(--text-xl);
    font-weight: 600;
    margin-bottom: var(--space-sm);
  }

  &__description {
    font-size: var(--text-base);
    color: var(--text-secondary);
    line-height: var(--leading-relaxed);
    margin-bottom: var(--space-md);
  }

  &__tech {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
    margin-bottom: var(--space-md);
  }

  &__tech-tag {
    padding: var(--space-xs) var(--space-sm);
    font-size: var(--text-xs);
    font-weight: 500;
    color: var(--text-secondary);
    background-color: var(--bg-primary);
    border-radius: var(--radius-sm);
  }

  &__links {
    display: flex;
    gap: var(--space-md);
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    font-family: var(--font-display);
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--accent);
    transition: color var(--transition-fast);
    will-change: transform;

    &:hover {
      color: var(--accent-hover);
    }

    svg {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
