import { ref } from 'vue'

// Shared state for theme transition - used to hide hero mascot during transition
const isThemeTransitionActive = ref(false)

export const useThemeTransitionState = () => ({
  isThemeTransitionActive,
})
