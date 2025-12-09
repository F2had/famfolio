<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettings } from '@/composables/useSettings'
import { useConfig } from '@/composables/useConfig'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import LocaleToggle from '@/components/common/LocaleToggle.vue'
import MascotToggle from '@/components/common/MascotToggle.vue'

// Icons
import IconMenu from '~icons/lucide/menu'
import IconX from '~icons/lucide/x'

const emit = defineEmits<{
  themeToggle: [position: { x: number; y: number }]
  localeToggle: [data: { x: number; y: number; fromLocale: string; toLocale: string }]
}>()

const { t } = useI18n()
const { site } = useConfig()
const { isAboutEnabled, isProjectsEnabled, isBlogEnabled, isContactEnabled, isToyEnabled } = useSettings()

const logoConfig = computed(() => site.logo)

const isVisible = ref(false)
const isMobileMenuOpen = ref(false)

const activeItems = computed(() =>
  [
    { id: 'about', label: 'nav.about', enabled: isAboutEnabled.value },
    { id: 'projects', label: 'nav.projects', enabled: isProjectsEnabled.value },
    { id: 'blog', label: 'nav.blog', enabled: isBlogEnabled.value },
    { id: 'contact', label: 'nav.contact', enabled: isContactEnabled.value },
  ].filter((item) => item.enabled),
)

const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    isMobileMenuOpen.value = false
  }
}

const handleScroll = () => {
  isVisible.value = window.scrollY > 100
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header class="nav" :class="{ 'nav--visible': isVisible }">
    <nav class="nav__container">
      <!-- Logo -->
      <a
        v-if="logoConfig?.enabled"
        href="#"
        class="nav__logo"
        @click.prevent="scrollToSection('hero')"
      >
        <img :src="logoConfig.src" :alt="logoConfig.alt" class="nav__logo-img" />
      </a>

      <!-- Desktop Navigation -->
      <ul class="nav__links">
        <li v-for="item in activeItems" :key="item.id">
          <button class="nav__link" @click="scrollToSection(item.id)">
            {{ t(item.label) }}
          </button>
        </li>
      </ul>

      <div class="nav__actions">
        <!-- Mascot Toggle (only if mascot is enabled in config) -->
        <MascotToggle v-if="isToyEnabled" />

        <!-- Theme Toggle -->
        <ThemeToggle @before-toggle="(pos) => emit('themeToggle', pos)" />

        <!-- Locale Toggle -->
        <LocaleToggle @before-toggle="(data) => emit('localeToggle', data)" />

        <!-- Mobile Menu Toggle -->
        <button
          class="nav__icon-btn nav__menu-btn"
          aria-label="Toggle menu"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <IconX v-if="isMobileMenuOpen" />
          <IconMenu v-else />
        </button>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <div class="nav__mobile" :class="{ 'nav__mobile--open': isMobileMenuOpen }">
      <ul class="nav__mobile-links">
        <li v-for="item in activeItems" :key="item.id">
          <button class="nav__mobile-link" @click="scrollToSection(item.id)">
            {{ t(item.label) }}
          </button>
        </li>
      </ul>
    </div>
  </header>
</template>

<style scoped lang="scss">
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-sticky);
  background-color: var(--bg-primary);
  border-bottom: 1px solid transparent;
  transform: translateY(-100%);
  opacity: 0;
  transition:
    transform var(--transition-base),
    opacity var(--transition-base),
    background-color var(--transition-theme),
    border-color var(--transition-base);

  &--visible {
    transform: translateY(0);
    opacity: 1;
    border-bottom-color: var(--border);
    backdrop-filter: blur(8px);
    background-color: color-mix(in srgb, var(--bg-primary) 90%, transparent);
  }

  &__container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: var(--container-max);
    margin-inline: auto;
    padding: var(--space-md) var(--container-padding);
  }

  &__logo {
    display: flex;
    align-items: center;
    margin-inline-end: var(--space-lg);
  }

  &__logo-img {
    height: 32px;
    width: auto;
  }

  &__links {
    display: none;
    gap: var(--space-sm);

    @media (min-width: 768px) {
      display: flex;
    }
  }

  &__link {
    padding: var(--space-sm) var(--space-md);
    font-family: var(--font-display);
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--text-secondary);
    border-radius: var(--radius-md);
    transition:
      color var(--transition-fast),
      background-color var(--transition-fast);

    &:hover {
      color: var(--accent);
      background-color: var(--accent-subtle);
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
  }

  &__icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    color: var(--text-secondary);
    border-radius: var(--radius-md);
    transition:
      color var(--transition-fast),
      background-color var(--transition-fast);

    &:hover {
      color: var(--accent);
      background-color: var(--accent-subtle);
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }

  &__menu-btn {
    @media (min-width: 768px) {
      display: none;
    }
  }

  // Mobile Menu
  &__mobile {
    display: none;
    padding: var(--space-md) var(--container-padding);
    border-top: 1px solid var(--border);

    &--open {
      display: block;

      @media (min-width: 768px) {
        display: none;
      }
    }
  }

  &__mobile-links {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  &__mobile-link {
    width: 100%;
    padding: var(--space-md);
    font-family: var(--font-display);
    font-size: var(--text-base);
    font-weight: 500;
    color: var(--text-primary);
    text-align: start;
    border-radius: var(--radius-md);
    transition:
      color var(--transition-fast),
      background-color var(--transition-fast);

    &:hover {
      color: var(--accent);
      background-color: var(--accent-subtle);
    }
  }
}
</style>
