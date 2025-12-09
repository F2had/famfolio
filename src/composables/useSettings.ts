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
  const isContactEmailEnabled = computed(() => sections?.contact?.showEmail ?? true)
  const isContactPhoneEnabled = computed(() => sections?.contact?.showPhone ?? true)
  const isContactTelegramEnabled = computed(() => sections?.contact?.showTelegram ?? true)
  const isContactWhatsappEnabled = computed(() => sections?.contact?.showWhatsapp ?? true)

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

  /** Phone obfuscation enabled (mask middle digits) */
  const isPhoneObfuscationEnabled = computed(() => security?.phone?.obfuscate ?? false)

  /** Phone click-to-reveal enabled */
  const isPhoneClickToRevealEnabled = computed(() => security?.phone?.clickToReveal ?? false)

  /** Telegram obfuscation enabled (mask username/phone) */
  const isTelegramObfuscationEnabled = computed(() => security?.telegram?.obfuscate ?? false)

  /** Telegram click-to-reveal enabled */
  const isTelegramClickToRevealEnabled = computed(() => security?.telegram?.clickToReveal ?? false)

  /** WhatsApp obfuscation enabled (mask phone digits) */
  const isWhatsappObfuscationEnabled = computed(() => security?.whatsapp?.obfuscate ?? false)

  /** WhatsApp click-to-reveal enabled */
  const isWhatsappClickToRevealEnabled = computed(() => security?.whatsapp?.clickToReveal ?? false)

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
    isContactEmailEnabled,
    isContactPhoneEnabled,
    isContactTelegramEnabled,
    isContactWhatsappEnabled,

    // Personal
    isAvatarEnabled,

    // Defaults
    codeForgeUrl,

    // Security
    isEmailObfuscationEnabled,
    isEmailClickToRevealEnabled,
    isPhoneObfuscationEnabled,
    isPhoneClickToRevealEnabled,
    isTelegramObfuscationEnabled,
    isTelegramClickToRevealEnabled,
    isWhatsappObfuscationEnabled,
    isWhatsappClickToRevealEnabled,
    isHoneypotEnabled,
    isNoopenerEnabled,
    isNewTabEnabled,
  }
}
