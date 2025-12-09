<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useConfig } from '@/composables/useConfig'
import { useSettings } from '@/composables/useSettings'
import SectionWrapper from '@/components/layout/SectionWrapper.vue'
import SocialIcon from '@/components/common/SocialIcon.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import ContactCard from '@/components/common/ContactCard.vue'

const { t } = useI18n()
const { personal, socials, sections } = useConfig()
const {
  isHoneypotEnabled,
  isContactEmailEnabled,
  isContactPhoneEnabled,
  isContactTelegramEnabled,
  isContactWhatsappEnabled,
} = useSettings()

const form = ref({
  name: '',
  email: '',
  message: '',
})

// Honeypot field - if filled, it's likely a bot
const honeypot = ref('')

const handleSubmit = () => {
  // If honeypot is filled, silently reject (bot detected)
  if (isHoneypotEnabled.value && honeypot.value) {
    console.warn('Bot detected via honeypot')
    return
  }

  const subject = encodeURIComponent(`Contact from ${form.value.name}`)
  const body = encodeURIComponent(
    `Name: ${form.value.name}\nEmail: ${form.value.email}\n\nMessage:\n${form.value.message}`,
  )
  window.location.href = `mailto:${personal.email}?subject=${subject}&body=${body}`
}
</script>

<template>
  <SectionWrapper id="contact">
    <h2 class="section-title">{{ t('contact.title') }}</h2>
    <p class="section-subtitle">{{ t('contact.subtitle') }}</p>

    <div class="contact__content">
      <!-- Contact Form -->
      <form v-if="sections.contact.showForm" class="contact__form" @submit.prevent="handleSubmit">
        <!-- Honeypot field - hidden from humans, visible to bots -->
        <div v-if="isHoneypotEnabled" class="contact__honeypot" aria-hidden="true">
          <label for="website">Website</label>
          <input
            id="website"
            v-model="honeypot"
            type="text"
            name="website"
            tabindex="-1"
            autocomplete="off"
          />
        </div>

        <div class="contact__field">
          <label for="name" class="contact__label">{{ t('contact.form.name') }}</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            class="contact__input"
            :placeholder="t('contact.form.namePlaceholder')"
            required
          />
        </div>

        <div class="contact__field">
          <label for="email" class="contact__label">{{ t('contact.form.email') }}</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="contact__input"
            :placeholder="t('contact.form.emailPlaceholder')"
            required
          />
        </div>

        <div class="contact__field">
          <label for="message" class="contact__label">{{ t('contact.form.message') }}</label>
          <textarea
            id="message"
            v-model="form.message"
            class="contact__textarea"
            :placeholder="t('contact.form.messagePlaceholder')"
            rows="5"
            required
          />
        </div>

        <BaseButton type="submit" variant="primary" size="lg">
          {{ t('contact.form.send') }}
        </BaseButton>
      </form>

      <!-- Contact Cards -->
      <div class="contact__cards">
        <ContactCard
          v-if="personal.email && isContactEmailEnabled"
          type="email"
          :value="personal.email"
        />
        <ContactCard
          v-if="personal.phone && isContactPhoneEnabled"
          type="phone"
          :value="personal.phone"
        />
        <ContactCard
          v-if="personal.telegram && isContactTelegramEnabled"
          type="telegram"
          :value="personal.telegram"
        />
        <ContactCard
          v-if="personal.whatsapp && isContactWhatsappEnabled"
          type="whatsapp"
          :value="personal.whatsapp"
        />
      </div>

      <!-- Socials -->
      <div class="contact__socials">
        <SocialIcon
          v-for="social in socials"
          :key="social.platform"
          :platform="social.platform"
          :icon="social.icon"
          :url="social.url"
          :size="28"
        />
      </div>
    </div>
  </SectionWrapper>
</template>

<style scoped lang="scss">
.section-title {
  font-size: var(--text-3xl);
  font-weight: 700;
  margin-bottom: var(--space-sm);

  @media (min-width: 768px) {
    font-size: var(--text-4xl);
  }
}

.section-subtitle {
  font-size: var(--text-lg);
  color: var(--text-secondary);
  margin-bottom: var(--space-2xl);
  max-width: 600px;
}

.contact {
  &__content {
    max-width: 500px;
  }

  // Honeypot - visually hidden but accessible to bots
  &__honeypot {
    position: absolute;
    left: -9999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
    opacity: 0;
    pointer-events: none;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
    margin-bottom: var(--space-2xl);
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  &__label {
    font-family: var(--font-display);
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--text-primary);
  }

  &__input,
  &__textarea {
    padding: var(--space-md);
    font-family: var(--font-body);
    font-size: var(--text-base);
    color: var(--text-primary);
    background-color: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    transition:
      border-color var(--transition-fast),
      box-shadow var(--transition-fast);

    &::placeholder {
      color: var(--text-secondary);
    }

    &:focus {
      outline: none;
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-subtle);
    }
  }

  &__textarea {
    resize: vertical;
    min-height: 120px;
  }

  &__cards {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    margin-bottom: var(--space-xl);
  }

  &__socials {
    display: flex;
    gap: var(--space-sm);
  }
}
</style>
