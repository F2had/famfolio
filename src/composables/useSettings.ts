import { computed } from 'vue'
import { useConfig } from '@/composables/useConfig'

/**
 * Centralized settings composable
 * Provides computed properties for common config checks
 */
export const useSettings = () => {
  const { animations, sections, personal, defaults, security } = useConfig()

  // ============================================
  // ANIMATIONS
  // ============================================

  /** Master animation toggle - respects both config and reduced motion */
  const areAnimationsEnabled = computed(() => {
    if (!animations?.enabled) return false
    if (
      animations?.respectReducedMotion &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return false
    }
    return true
  })

  /** Hero mascot/toy enabled */
  const isToyEnabled = computed(
    () => areAnimationsEnabled.value && (animations?.hero?.toy ?? false),
  )

  /** Scroll reveal animations enabled */
  const isScrollRevealEnabled = computed(
    () => areAnimationsEnabled.value && (animations?.scrollReveal ?? false),
  )

  /** Hover effects enabled */
  const areHoverEffectsEnabled = computed(
    () => areAnimationsEnabled.value && (animations?.hoverEffects ?? true),
  )

  // ============================================
  // TRANSITIONS
  // ============================================

  /** Theme transition (mascot + ripple) enabled */
  const isThemeTransitionEnabled = computed(
    () => areAnimationsEnabled.value && (animations?.transitions?.theme?.enabled ?? true),
  )

  /** Locale transitions enabled */
  const isLocaleTransitionEnabled = computed(
    () => areAnimationsEnabled.value && (animations?.transitions?.locale?.enabled ?? true),
  )

  /** Locale transition type for direction change (RTL↔LTR): "pageFlip" or "cardFlip" */
  const localeDirectionChangeTransition = computed(
    () => animations?.transitions?.locale?.directionChange ?? 'pageFlip',
  )

  /** Locale transition type for same direction: "ripple" or "fade" */
  const localeSameDirectionTransition = computed(
    () => animations?.transitions?.locale?.sameDirection ?? 'fade',
  )

  // ============================================
  // SECTIONS
  // ============================================

  const isHeroEnabled = computed(() => sections?.hero?.enabled ?? true)
  const isAboutEnabled = computed(() => sections?.about?.enabled ?? true)
  const isProjectsEnabled = computed(() => sections?.projects?.enabled ?? true)
  const isBlogEnabled = computed(() => sections?.blog?.enabled ?? false)
  const isResumeEnabled = computed(() => sections?.resume?.enabled ?? true)
  const isContactEnabled = computed(() => sections?.contact?.enabled ?? true)
  const isContactFormEnabled = computed(() => sections?.contact?.showForm ?? false)

  // ============================================
  // PERSONAL
  // ============================================

  const isAvatarEnabled = computed(() => personal?.avatar?.enabled ?? false)

  // ============================================
  // DEFAULTS
  // ============================================

  const codeForgeUrl = computed(() => defaults?.codeForge ?? '')

  // ============================================
  // SECURITY
  // ============================================

  /** Email obfuscation enabled (replace @ with [at]) */
  const isEmailObfuscationEnabled = computed(() => security?.email?.obfuscate ?? false)

  /** Email click-to-reveal enabled */
  const isEmailClickToRevealEnabled = computed(() => security?.email?.clickToReveal ?? false)

  /** Honeypot field in contact form enabled */
  const isHoneypotEnabled = computed(() => security?.contact?.honeypot ?? false)

  /** Add rel="noopener noreferrer" to external links */
  const isNoopenerEnabled = computed(() => security?.externalLinks?.noopener ?? true)

  /** Open external links in new tab */
  const isNewTabEnabled = computed(() => security?.externalLinks?.newTab ?? true)

  return {
    // Animations
    areAnimationsEnabled,
    isToyEnabled,
    isScrollRevealEnabled,
    areHoverEffectsEnabled,

    // Transitions
    isThemeTransitionEnabled,
    isLocaleTransitionEnabled,
    localeDirectionChangeTransition,
    localeSameDirectionTransition,

    // Sections
    isHeroEnabled,
    isAboutEnabled,
    isProjectsEnabled,
    isBlogEnabled,
    isResumeEnabled,
    isContactEnabled,
    isContactFormEnabled,

    // Personal
    isAvatarEnabled,

    // Defaults
    codeForgeUrl,

    // Security
    isEmailObfuscationEnabled,
    isEmailClickToRevealEnabled,
    isHoneypotEnabled,
    isNoopenerEnabled,
    isNewTabEnabled,
  }
}
