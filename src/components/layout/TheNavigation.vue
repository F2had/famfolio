<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useConfig } from '@/composables/useConfig'
import { useTheme } from '@/composables/useTheme'
import { useLocale } from '@/composables/useLocale'

// Icons
import IconSun from '~icons/lucide/sun'
import IconMoon from '~icons/lucide/moon'
import IconGlobe from '~icons/lucide/globe'
import IconMenu from '~icons/lucide/menu'
import IconX from '~icons/lucide/x'

const { t } = useI18n()
const { sections } = useConfig()
const { isDark, toggle: toggleTheme } = useTheme()
const { locale, supportedLocales, toggle: toggleLocale } = useLocale()

const isVisible = ref(false)
const isMobileMenuOpen = ref(false)

const navItems = [
  { id: 'about', label: 'nav.about', enabled: sections.about.enabled },
  { id: 'projects', label: 'nav.projects', enabled: sections.projects.enabled },
  { id: 'blog', label: 'nav.blog', enabled: sections.blog.enabled },
  { id: 'contact', label: 'nav.contact', enabled: sections.contact.enabled },
]

const activeItems = navItems.filter((item) => item.enabled)

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

const currentLocaleNative = supportedLocales.find((l) => l.code === locale.value)?.nativeName
</script>

<template>
  <header class="nav" :class="{ 'nav--visible': isVisible }">
    <nav class="nav__container">
      <!-- Desktop Navigation -->
      <ul class="nav__links">
        <li v-for="item in activeItems" :key="item.id">
          <button class="nav__link" @click="scrollToSection(item.id)">
            {{ t(item.label) }}
          </button>
        </li>
      </ul>

      <div class="nav__actions">
        <!-- Theme Toggle -->
        <button
          class="nav__icon-btn"
          :aria-label="isDark ? t('theme.switchToLight') : t('theme.switchToDark')"
          @click="toggleTheme"
        >
          <IconMoon v-if="isDark" />
          <IconSun v-else />
        </button>

        <!-- Locale Toggle -->
        <button class="nav__icon-btn nav__locale-btn" :aria-label="t('language.select')" @click="toggleLocale">
          <IconGlobe />
          <span class="nav__locale-label">{{ currentLocaleNative }}</span>
        </button>

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

  &__locale-btn {
    width: auto;
    padding-inline: var(--space-sm);
    gap: var(--space-xs);
  }

  &__locale-label {
    font-family: var(--font-display);
    font-size: var(--text-sm);
    font-weight: 500;

    @media (max-width: 480px) {
      display: none;
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
