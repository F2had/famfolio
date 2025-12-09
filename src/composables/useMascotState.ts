import { ref } from 'vue'

/**
 * Runtime state for Fam (the mascot) visibility
 * Allows users to toggle the mascot on/off without changing config
 */
const isMascotVisible = ref(true)

export const useMascotState = () => {
  const toggleMascot = () => {
    isMascotVisible.value = !isMascotVisible.value
  }

  const hideMascot = () => {
    isMascotVisible.value = false
  }

  const showMascot = () => {
    isMascotVisible.value = true
  }

  return {
    isMascotVisible,
    toggleMascot,
    hideMascot,
    showMascot,
  }
}
