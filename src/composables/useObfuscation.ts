import { ref, computed, type Ref } from 'vue'
import { useSettings } from '@/composables/useSettings'

export type ObfuscationType = 'email' | 'phone' | 'telegram' | 'whatsapp'

export const useObfuscation = (type: ObfuscationType, value: Ref<string> | string) => {
  const {
    isEmailObfuscationEnabled,
    isEmailClickToRevealEnabled,
    isPhoneObfuscationEnabled,
    isPhoneClickToRevealEnabled,
    isTelegramObfuscationEnabled,
    isTelegramClickToRevealEnabled,
    isWhatsappObfuscationEnabled,
    isWhatsappClickToRevealEnabled,
  } = useSettings()

  const isRevealed = ref(false)

  const rawValue = computed(() => (typeof value === 'string' ? value : value.value))

  const shouldObfuscate = computed(() => {
    switch (type) {
      case 'email':
        return isEmailObfuscationEnabled.value
      case 'phone':
        return isPhoneObfuscationEnabled.value
      case 'telegram':
        return isTelegramObfuscationEnabled.value
      case 'whatsapp':
        return isWhatsappObfuscationEnabled.value
      default:
        return false
    }
  })

  const shouldClickToReveal = computed(() => {
    switch (type) {
      case 'email':
        return isEmailClickToRevealEnabled.value
      case 'phone':
        return isPhoneClickToRevealEnabled.value
      case 'telegram':
        return isTelegramClickToRevealEnabled.value
      case 'whatsapp':
        return isWhatsappClickToRevealEnabled.value
      default:
        return false
    }
  })

  const needsReveal = computed(() => shouldClickToReveal.value && !isRevealed.value)

  const obfuscatedValue = computed(() => {
    if (!shouldObfuscate.value || isRevealed.value) return rawValue.value

    switch (type) {
      case 'email':
        return rawValue.value.replace('@', ' [at] ').replace(/\./g, ' [dot] ')

      case 'phone':
      case 'whatsapp': {
        const digits = rawValue.value.replace(/\D/g, '')
        if (digits.length > 5) {
          const start = digits.slice(0, 3)
          const end = digits.slice(-2)
          const middle = '*'.repeat(digits.length - 5)
          return `${start}${middle}${end}`
        }
        return rawValue.value.replace(/\d/g, '*')
      }

      case 'telegram': {
        if (rawValue.value.startsWith('@')) {
          const username = rawValue.value.slice(1)
          if (username.length > 2) {
            return `@${username[0]}${'*'.repeat(username.length - 2)}${username[username.length - 1]}`
          }
          return `@${'*'.repeat(username.length)}`
        }
        const digits = rawValue.value.replace(/\D/g, '')
        if (digits.length > 5) {
          const start = digits.slice(0, 3)
          const end = digits.slice(-2)
          const middle = '*'.repeat(digits.length - 5)
          return `${start}${middle}${end}`
        }
        return rawValue.value.replace(/\d/g, '*')
      }

      default:
        return rawValue.value
    }
  })

  const displayValue = computed(() => {
    if (needsReveal.value || (shouldObfuscate.value && !isRevealed.value)) {
      return obfuscatedValue.value
    }
    return rawValue.value
  })

  const href = computed(() => {
    if (needsReveal.value) return undefined

    switch (type) {
      case 'email':
        return `mailto:${rawValue.value}`
      case 'phone':
        return `tel:${rawValue.value}`
      case 'telegram': {
        if (rawValue.value.startsWith('@')) {
          return `https://t.me/${rawValue.value.slice(1)}`
        }
        const phone = rawValue.value.startsWith('+') ? rawValue.value : `+${rawValue.value}`
        return `https://t.me/${phone}`
      }
      case 'whatsapp': {
        const phone = rawValue.value.replace(/\D/g, '')
        return `https://wa.me/${phone}`
      }
      default:
        return undefined
    }
  })

  const reveal = () => {
    if (shouldClickToReveal.value) {
      isRevealed.value = true
    }
  }

  return {
    isRevealed,
    needsReveal,
    shouldObfuscate,
    shouldClickToReveal,
    displayValue,
    href,
    reveal,
  }
}
