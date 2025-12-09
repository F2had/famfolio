<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useSpring } from '@vueuse/motion'
import { useSettings } from '@/composables/useSettings'
import IconMail from '~icons/lucide/mail'
import IconPhone from '~icons/lucide/phone'
import IconCopy from '~icons/lucide/copy'
import IconCheck from '~icons/lucide/check'
import IconTelegram from '~icons/simple-icons/telegram'
import IconWhatsapp from '~icons/simple-icons/whatsapp'

type Props = {
  type: 'email' | 'phone' | 'telegram' | 'whatsapp'
  value: string
}

const props = defineProps<Props>()

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
const isCopied = ref(false)

// Determine if obfuscation/reveal applies based on type
const shouldObfuscate = computed(() => {
  if (props.type === 'email') return isEmailObfuscationEnabled.value
  if (props.type === 'phone') return isPhoneObfuscationEnabled.value
  if (props.type === 'telegram') return isTelegramObfuscationEnabled.value
  if (props.type === 'whatsapp') return isWhatsappObfuscationEnabled.value
  return false
})

const shouldClickToReveal = computed(() => {
  if (props.type === 'email') return isEmailClickToRevealEnabled.value
  if (props.type === 'phone') return isPhoneClickToRevealEnabled.value
  if (props.type === 'telegram') return isTelegramClickToRevealEnabled.value
  if (props.type === 'whatsapp') return isWhatsappClickToRevealEnabled.value
  return false
})

const needsReveal = computed(() => shouldClickToReveal.value && !isRevealed.value)

// Obfuscate the value
const obfuscatedValue = computed(() => {
  if (!shouldObfuscate.value || isRevealed.value) return props.value

  if (props.type === 'email') {
    return props.value.replace('@', ' [at] ').replace(/\./g, ' [dot] ')
  }

  if (props.type === 'phone' || props.type === 'whatsapp') {
    // Show first 3 and last 2 digits, hide rest
    const digits = props.value.replace(/\D/g, '')
    if (digits.length > 5) {
      const start = digits.slice(0, 3)
      const end = digits.slice(-2)
      const middle = '*'.repeat(digits.length - 5)
      return `${start}${middle}${end}`
    }
    return props.value.replace(/\d/g, '*')
  }

  if (props.type === 'telegram') {
    // For telegram username (@username) or phone
    if (props.value.startsWith('@')) {
      // Obfuscate username: @user -> @u***r
      const username = props.value.slice(1)
      if (username.length > 2) {
        return `@${username[0]}${'*'.repeat(username.length - 2)}${username[username.length - 1]}`
      }
      return `@${'*'.repeat(username.length)}`
    }
    // Phone number format
    const digits = props.value.replace(/\D/g, '')
    if (digits.length > 5) {
      const start = digits.slice(0, 3)
      const end = digits.slice(-2)
      const middle = '*'.repeat(digits.length - 5)
      return `${start}${middle}${end}`
    }
    return props.value.replace(/\d/g, '*')
  }

  return props.value
})

// Display value (obfuscated or real)
const displayValue = computed(() => {
  if (needsReveal.value) return obfuscatedValue.value
  if (shouldObfuscate.value && !isRevealed.value) return obfuscatedValue.value
  return props.value
})

const icon = computed(() => {
  switch (props.type) {
    case 'email':
      return IconMail
    case 'phone':
      return IconPhone
    case 'telegram':
      return IconTelegram
    case 'whatsapp':
      return IconWhatsapp
    default:
      return IconMail
  }
})

const href = computed(() => {
  if (needsReveal.value) return undefined

  switch (props.type) {
    case 'email':
      return `mailto:${props.value}`
    case 'phone':
      return `tel:${props.value}`
    case 'telegram': {
      // Username format (@username) or phone number
      if (props.value.startsWith('@')) {
        return `https://t.me/${props.value.slice(1)}`
      }
      // Phone format: ensure it starts with +
      const phone = props.value.startsWith('+') ? props.value : `+${props.value}`
      return `https://t.me/${phone}`
    }
    case 'whatsapp': {
      // Remove all non-digits for wa.me link
      const phone = props.value.replace(/\D/g, '')
      return `https://wa.me/${phone}`
    }
    default:
      return undefined
  }
})

const handleReveal = () => {
  if (shouldClickToReveal.value) {
    isRevealed.value = true
  }
}

const handleCopy = async () => {
  if (needsReveal.value) {
    handleReveal()
    return
  }

  try {
    await navigator.clipboard.writeText(props.value)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

// Spring animation for copy button
const copySpring = reactive({ scale: 1 })
const spring = useSpring(copySpring, { stiffness: 400, damping: 15 })
const springValues = spring.values as unknown as { scale: number }
const setSpring = spring.set as (v: { scale: number }) => void

const handleCopyMouseDown = () => setSpring({ scale: 0.85 })
const handleCopyMouseUp = () => setSpring({ scale: 1 })

const copyButtonStyle = computed(() => ({
  transform: `scale(${springValues.scale})`,
}))
</script>

<template>
  <div
    class="contact-card"
    :class="{ 'contact-card--needs-reveal': needsReveal }"
    @click="needsReveal ? handleReveal() : undefined"
  >
    <component :is="icon" class="contact-card__icon" />

    <a v-if="href" :href="href" class="contact-card__value">
      {{ displayValue }}
    </a>
    <span v-else class="contact-card__value contact-card__value--masked">
      {{ displayValue }}
      <span v-if="needsReveal" class="contact-card__hint">(click to reveal)</span>
    </span>

    <button
      class="contact-card__copy"
      :class="{ 'contact-card__copy--success': isCopied }"
      :style="copyButtonStyle"
      :disabled="needsReveal"
      :aria-label="isCopied ? 'Copied!' : 'Copy to clipboard'"
      @click.stop="handleCopy"
      @mousedown="handleCopyMouseDown"
      @mouseup="handleCopyMouseUp"
      @mouseleave="handleCopyMouseUp"
    >
      <Transition name="copy-icon" mode="out-in">
        <IconCheck v-if="isCopied" class="contact-card__copy-icon" />
        <IconCopy v-else class="contact-card__copy-icon" />
      </Transition>
    </button>
  </div>
</template>

<style scoped lang="scss">
.contact-card {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  font-family: ui-monospace, 'SF Mono', 'Cascadia Code', 'Source Code Pro', Menlo, Consolas,
    monospace;
  font-size: var(--text-sm);
  background-color: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);

  &:hover {
    border-color: var(--accent);
  }

  &--needs-reveal {
    cursor: pointer;

    &:hover {
      background-color: var(--accent-subtle);
    }
  }

  &__icon {
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    color: var(--accent);
  }

  &__value {
    flex: 1;
    color: var(--text-primary);
    text-decoration: none;
    word-break: break-all;

    &:hover {
      color: var(--accent);
    }

    &--masked {
      color: var(--text-secondary);
      user-select: none;
    }
  }

  &__hint {
    margin-inline-start: var(--space-xs);
    font-size: var(--text-xs);
    color: var(--text-secondary);
    font-style: italic;
  }

  &__copy {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
    color: var(--text-secondary);
    background: transparent;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
    will-change: transform;

    &:hover:not(:disabled) {
      color: var(--accent);
      background-color: var(--accent-subtle);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &--success {
      color: var(--success, #22c55e);
    }
  }

  &__copy-icon {
    width: 16px;
    height: 16px;
  }
}

// Copy icon transition
.copy-icon-enter-active,
.copy-icon-leave-active {
  transition: all 0.15s ease;
}

.copy-icon-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.copy-icon-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
