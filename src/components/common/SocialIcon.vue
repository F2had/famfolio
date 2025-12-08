<script setup lang="ts">
import { computed, type Component } from 'vue'

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
</script>

<template>
  <a
    :href="url"
    target="_blank"
    rel="noopener noreferrer"
    class="social-icon"
    :aria-label="ariaLabel"
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
    background-color var(--transition-fast),
    transform var(--transition-fast);

  &:hover {
    color: var(--accent);
    background-color: var(--accent-subtle);
    animation: wobble 0.5s ease-in-out;
  }

  &:active {
    transform: scale(0.95);
  }
}

@keyframes wobble {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-5deg);
  }
  75% {
    transform: rotate(5deg);
  }
}
</style>
