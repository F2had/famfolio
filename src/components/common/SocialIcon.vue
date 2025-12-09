<script setup lang="ts">
import { reactive, computed, type Component } from 'vue'
import { useSpring } from '@vueuse/motion'
import { useSettings } from '@/composables/useSettings'

// Brand icons from Simple Icons
import IconGithub from '~icons/simple-icons/github'
import IconLinkedin from '~icons/simple-icons/linkedin'
import IconTwitter from '~icons/simple-icons/twitter'
import IconX from '~icons/simple-icons/x'
import IconYoutube from '~icons/simple-icons/youtube'
import IconInstagram from '~icons/simple-icons/instagram'
import IconFacebook from '~icons/simple-icons/facebook'
import IconDribbble from '~icons/simple-icons/dribbble'
import IconFigma from '~icons/simple-icons/figma'
import IconCodepen from '~icons/simple-icons/codepen'
import IconGitlab from '~icons/simple-icons/gitlab'
import IconTwitch from '~icons/simple-icons/twitch'
import IconDiscord from '~icons/simple-icons/discord'
import IconTelegram from '~icons/simple-icons/telegram'
import IconWhatsapp from '~icons/simple-icons/whatsapp'

// UI icons from Lucide
import IconMail from '~icons/lucide/mail'
import IconGlobe from '~icons/lucide/globe'
import IconRss from '~icons/lucide/rss'

type Props = {
  platform: string
  icon?: string
  url: string
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
})

const { isNoopenerEnabled, isNewTabEnabled } = useSettings()

// Security attributes for external links
const relAttr = computed(() => (isNoopenerEnabled.value ? 'noopener noreferrer' : undefined))
const targetAttr = computed(() => (isNewTabEnabled.value ? '_blank' : undefined))

// Map platform names to icons
const iconMap: Record<string, Component> = {
  github: IconGithub,
  linkedin: IconLinkedin,
  twitter: IconTwitter,
  x: IconX,
  email: IconMail,
  mail: IconMail,
  website: IconGlobe,
  globe: IconGlobe,
  youtube: IconYoutube,
  instagram: IconInstagram,
  facebook: IconFacebook,
  dribbble: IconDribbble,
  figma: IconFigma,
  codepen: IconCodepen,
  gitlab: IconGitlab,
  twitch: IconTwitch,
  discord: IconDiscord,
  telegram: IconTelegram,
  whatsapp: IconWhatsapp,
  rss: IconRss,
}

const resolvedIcon = computed(() => {
  const key = (props.icon || props.platform).toLowerCase()
  return iconMap[key] || IconGlobe
})

const ariaLabel = computed(() => `Visit ${props.platform}`)

const iconStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
}))

// Spring-based hover animation
const motionTarget = reactive({ scale: 1 })
const motionSpring = useSpring(motionTarget, {
  stiffness: 400,
  damping: 15,
})
const motionValues = motionSpring.values as unknown as { scale: number }
const setMotion = motionSpring.set as (v: { scale: number }) => void

const handleMouseEnter = () => {
  setMotion({ scale: 1.1 })
}

const handleMouseLeave = () => {
  setMotion({ scale: 1 })
}

const handleMouseDown = () => {
  setMotion({ scale: 0.95 })
}

const handleMouseUp = () => {
  setMotion({ scale: 1.1 })
}

const springStyle = computed(() => ({
  transform: `scale(${motionValues.scale})`,
}))
</script>

<template>
  <a
    :href="url"
    :target="targetAttr"
    :rel="relAttr"
    class="social-icon"
    :style="springStyle"
    :aria-label="ariaLabel"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
  >
    <component :is="resolvedIcon" :style="iconStyle" />
  </a>
</template>

<style scoped lang="scss">
.social-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-sm);
  color: var(--text-secondary);
  border-radius: var(--radius-md);
  transition:
    color var(--transition-fast),
    background-color var(--transition-fast);
  will-change: transform;

  &:hover {
    color: var(--accent);
    background-color: var(--accent-subtle);
  }
}
</style>
