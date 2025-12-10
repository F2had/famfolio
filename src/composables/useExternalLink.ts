import { ref, computed } from 'vue'
import { useSettings } from '@/composables/useSettings'

export const useExternalLink = () => {
  const { isNoopenerEnabled, isNewTabEnabled, isConfirmLeaveEnabled } = useSettings()

  const showDialog = ref(false)
  const pendingUrl = ref('')

  const relAttr = computed(() => (isNoopenerEnabled.value ? 'noopener noreferrer' : undefined))
  const targetAttr = computed(() => (isNewTabEnabled.value ? '_blank' : undefined))

  const isExternal = (href: string) => {
    return (
      !href.startsWith('/') &&
      !href.startsWith('#') &&
      !href.startsWith('mailto:') &&
      !href.startsWith('tel:')
    )
  }

  const getDomain = (href: string) => {
    try {
      const url = new URL(href)
      return url.hostname
    } catch {
      return href
    }
  }

  const handleClick = (e: MouseEvent, href: string) => {
    if (isExternal(href) && isConfirmLeaveEnabled.value) {
      e.preventDefault()
      pendingUrl.value = href
      showDialog.value = true
    }
  }

  const confirmNavigation = () => {
    if (pendingUrl.value) {
      window.open(
        pendingUrl.value,
        targetAttr.value ?? '_self',
        isNoopenerEnabled.value ? 'noopener,noreferrer' : '',
      )
    }
    showDialog.value = false
    pendingUrl.value = ''
  }

  const cancelNavigation = () => {
    showDialog.value = false
    pendingUrl.value = ''
  }

  return {
    relAttr,
    targetAttr,
    showDialog,
    pendingUrl,
    isExternal,
    getDomain,
    handleClick,
    confirmNavigation,
    cancelNavigation,
  }
}
