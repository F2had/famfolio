<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useConfig } from '@/composables/useConfig'
import SocialIcon from '@/components/common/SocialIcon.vue'

const { t } = useI18n()
const { personal, socials } = useConfig()

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="footer__container">
      <div class="footer__socials">
        <SocialIcon
          v-for="social in socials"
          :key="social.platform"
          :platform="social.platform"
          :icon="social.icon"
          :url="social.url"
          :size="20"
        />
      </div>

      <p class="footer__copyright">
        &copy; {{ currentYear }} {{ personal.name.en }}. {{ t('footer.copyright') }}
      </p>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  padding-block: var(--space-xl);
  border-top: 1px solid var(--border);
  background-color: var(--bg-secondary);

  &__container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-md);
    max-width: var(--container-max);
    margin-inline: auto;
    padding-inline: var(--container-padding);

    @media (min-width: 768px) {
      flex-direction: row;
      justify-content: space-between;
    }
  }

  &__socials {
    display: flex;
    gap: var(--space-xs);
  }

  &__copyright {
    font-size: var(--text-sm);
    color: var(--text-secondary);
    text-align: center;
  }
}
</style>
