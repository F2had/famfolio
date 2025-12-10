<script setup lang="ts">
import { ref, reactive, computed, toRef } from 'vue'
import { useSpring } from '@vueuse/motion'
import { useObfuscation, type ObfuscationType } from '@/composables/useObfuscation'
import { useExternalLink } from '@/composables/useExternalLink'
import ExternalLinkDialog from '@/components/common/ExternalLinkDialog.vue'
import IconMail from '~icons/lucide/mail'
import IconPhone from '~icons/lucide/phone'
import IconCopy from '~icons/lucide/copy'
import IconCheck from '~icons/lucide/check'
import IconTelegram from '~icons/simple-icons/telegram'
import IconWhatsapp from '~icons/simple-icons/whatsapp'

const props = withDefaults(
  defineProps<{
    type: ObfuscationType
    value: string
    copiable?: boolean
  }>(),
  {
    copiable: true,
  },
)

const { displayValue, href, needsReveal, reveal } = useObfuscation(
  props.type,
  toRef(() => props.value),
)

const { showDialog, pendingUrl, getDomain, handleClick, confirmNavigation, cancelNavigation } =
  useExternalLink()

const isExternalType = computed(() => props.type === 'telegram' || props.type === 'whatsapp')

const isCopied = ref(false)

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

const handleReveal = () => {
  reveal()
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

    <a
      v-if="href"
      :href="href"
      class="contact-card__value"
      @click="(e) => isExternalType && handleClick(e, href!)"
    >
      {{ displayValue }}
    </a>
    <span v-else class="contact-card__value contact-card__value--masked">
      {{ displayValue }}
      <span v-if="needsReveal" class="contact-card__hint">(click to reveal)</span>
    </span>

    <button
      v-if="copiable"
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

    <ExternalLinkDialog
      :show="showDialog"
      :domain="getDomain(pendingUrl)"
      @confirm="confirmNavigation"
      @cancel="cancelNavigation"
    />
  </div>
</template>

<style scoped lang="scss">
.contact-card {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  font-family:
    ui-monospace, 'SF Mono', 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
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
