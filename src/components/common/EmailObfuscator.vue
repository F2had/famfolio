<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSettings } from '@/composables/useSettings'

const props = defineProps<{
  email: string
}>()

const { isEmailObfuscationEnabled, isEmailClickToRevealEnabled } = useSettings()

const isRevealed = ref(false)

// Obfuscate email: hello@example.com -> hello [at] example [dot] com
const obfuscatedEmail = computed(() => {
  if (!isEmailObfuscationEnabled.value) return props.email
  return props.email.replace('@', ' [at] ').replace(/\./g, ' [dot] ')
})

// Display value based on reveal state
const displayEmail = computed(() => {
  if (isEmailClickToRevealEnabled.value && !isRevealed.value) {
    return obfuscatedEmail.value
  }
  return isEmailObfuscationEnabled.value && !isRevealed.value ? obfuscatedEmail.value : props.email
})

// Show as link only when revealed or click-to-reveal is disabled
const showAsLink = computed(() => {
  return !isEmailClickToRevealEnabled.value || isRevealed.value
})

const handleClick = () => {
  if (isEmailClickToRevealEnabled.value && !isRevealed.value) {
    isRevealed.value = true
  }
}

const mailtoLink = computed(() => `mailto:${props.email}`)
</script>

<template>
  <span class="email-obfuscator">
    <a v-if="showAsLink" :href="mailtoLink" class="email-obfuscator__link">
      {{ displayEmail }}
    </a>
    <button v-else class="email-obfuscator__reveal" @click="handleClick">
      {{ displayEmail }}
      <span class="email-obfuscator__hint">(click to reveal)</span>
    </button>
  </span>
</template>

<style scoped lang="scss">
.email-obfuscator {
  display: inline;

  &__link {
    color: var(--accent);
    text-decoration: none;
    transition: color var(--transition-fast);

    &:hover {
      color: var(--accent-hover);
      text-decoration: underline;
    }
  }

  &__reveal {
    color: var(--text-secondary);
    font-family: inherit;
    font-size: inherit;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    transition: color var(--transition-fast);

    &:hover {
      color: var(--accent);
    }
  }

  &__hint {
    font-size: var(--text-xs);
    color: var(--text-secondary);
    opacity: 0.7;
    margin-inline-start: var(--space-xs);
  }
}
</style>
