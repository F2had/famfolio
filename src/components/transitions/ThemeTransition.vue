<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { useSettings } from '@/composables/useSettings'
import { useConfig } from '@/composables/useConfig'
import { useThemeTransitionState } from '@/composables/useThemeTransitionState'

const { isDark, toggle } = useTheme()
const { isThemeTransitionActive } = useThemeTransitionState()
const { areAnimationsEnabled } = useSettings()
const { theme } = useConfig()

const isTransitioning = ref(false)
const clipProgress = ref(0)
const mascotRef = ref<HTMLElement | null>(null)
const shouldApplyTheme = ref(false)
const isCharging = ref(false)

// Mascot position state
const mascotX = ref(0)
const mascotY = ref(0)
const mascotScale = ref(0.3)

// Get the target theme colors (what we're transitioning TO)
const targetThemeColors = computed(() => {
  // If currently dark, we're going to light (and vice versa)
  const targetTheme = isDark.value ? theme.colors.light : theme.colors.dark
  return {
    bg: targetTheme.bgPrimary,
    accent: targetTheme.accent,
    accentSubtle: targetTheme.accentSubtle,
  }
})

// Get the current theme colors (what we're transitioning FROM) - for the mascot
const currentThemeColors = computed(() => {
  const currentTheme = isDark.value ? theme.colors.dark : theme.colors.light
  return {
    accent: currentTheme.accent,
    accentSubtle: currentTheme.accentSubtle,
  }
})

// Clip path for reveal effect - grows from center outward
const clipPath = computed(() => {
  const size = clipProgress.value
  return `circle(${size}% at 50% 50%)`
})

// Mascot transform style
const mascotStyle = computed(() => ({
  transform: `translate(calc(-50% + ${mascotX.value}px), calc(-50% + ${mascotY.value}px)) scale(${mascotScale.value})`,
}))

// Trigger transition from button position
const triggerTransition = async (x: number, y: number) => {
  if (!areAnimationsEnabled.value || isTransitioning.value) return

  isTransitioning.value = true
  isThemeTransitionActive.value = true // Hide hero mascot
  clipProgress.value = 0
  shouldApplyTheme.value = false
  isCharging.value = false

  // Calculate start position (offset from center)
  const startX = x - window.innerWidth / 2
  const startY = y - window.innerHeight / 2

  // Set initial position at button
  mascotX.value = startX
  mascotY.value = startY
  mascotScale.value = 0.3

  await nextTick()

  // Spring physics for flying to center
  const spring = {
    stiffness: 0.08,
    damping: 0.75,
  }
  let velocityX = 0
  let velocityY = 0
  let velocityScale = 0
  const targetX = 0
  const targetY = 0
  const targetScale = 1

  const animateFlight = () => {
    // Spring physics
    const dx = targetX - mascotX.value
    const dy = targetY - mascotY.value
    const dScale = targetScale - mascotScale.value

    velocityX += dx * spring.stiffness
    velocityY += dy * spring.stiffness
    velocityScale += dScale * spring.stiffness

    velocityX *= spring.damping
    velocityY *= spring.damping
    velocityScale *= spring.damping

    mascotX.value += velocityX
    mascotY.value += velocityY
    mascotScale.value += velocityScale

    // Check if settled (close enough to target)
    const distance = Math.sqrt(dx * dx + dy * dy)
    const settled = distance < 1 && Math.abs(dScale) < 0.01

    if (!settled) {
      requestAnimationFrame(animateFlight)
    } else {
      // Snap to final position
      mascotX.value = 0
      mascotY.value = 0
      mascotScale.value = 1

      // Start charging phase
      startChargingPhase()
    }
  }

  requestAnimationFrame(animateFlight)
}

const startChargingPhase = () => {
  isCharging.value = true
  clipProgress.value = 2 // Tiny hint

  setTimeout(() => {
    // Release phase
    toggle()
    shouldApplyTheme.value = true
    isCharging.value = false

    // Animate clip-path expansion
    const duration = 500
    const startTime = performance.now()
    const startSize = 2

    const animateClip = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease out quart
      const eased = 1 - Math.pow(1 - progress, 4)
      clipProgress.value = startSize + eased * (150 - startSize)

      if (progress < 1) {
        requestAnimationFrame(animateClip)
      } else {
        // Fade out mascot
        fadeOutMascot()
      }
    }

    requestAnimationFrame(animateClip)
  }, 350)
}

const fadeOutMascot = () => {
  if (mascotRef.value) {
    mascotRef.value.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out'
    mascotRef.value.style.opacity = '0'
    mascotScale.value = 1.3
  }

  setTimeout(() => {
    isTransitioning.value = false
    isThemeTransitionActive.value = false // Show hero mascot again
    clipProgress.value = 0
    shouldApplyTheme.value = false
    if (mascotRef.value) {
      mascotRef.value.style.transition = ''
      mascotRef.value.style.opacity = ''
    }
  }, 300)
}

defineExpose({ triggerTransition })
</script>

<template>
  <Teleport to="body">
    <div v-if="isTransitioning" class="theme-transition">
      <!-- New theme reveal overlay - expands from center -->
      <div
        class="theme-transition__reveal"
        :style="{
          clipPath: clipPath,
          backgroundColor: targetThemeColors.bg,
        }"
      />

      <!-- Mascot flying to center -->
      <div
        ref="mascotRef"
        class="theme-transition__mascot"
        :class="{ 'theme-transition__mascot--charging': isCharging }"
        :style="mascotStyle"
      >
        <div
          class="theme-transition__mascot-body"
          :style="{
            borderColor: currentThemeColors.accent,
            backgroundColor: currentThemeColors.accentSubtle,
          }"
        >
          <div class="theme-transition__mascot-eyes">
            <div
              class="theme-transition__mascot-eye"
              :style="{ backgroundColor: currentThemeColors.accent }"
            />
            <div
              class="theme-transition__mascot-eye"
              :style="{ backgroundColor: currentThemeColors.accent }"
            />
          </div>
        </div>
        <div
          class="theme-transition__mascot-glow"
          :style="{ backgroundColor: currentThemeColors.accent }"
        />
        <!-- Extra glow rings during charging -->
        <div
          v-if="isCharging"
          class="theme-transition__charge-ring theme-transition__charge-ring--1"
          :style="{ borderColor: currentThemeColors.accent }"
        />
        <div
          v-if="isCharging"
          class="theme-transition__charge-ring theme-transition__charge-ring--2"
          :style="{ borderColor: currentThemeColors.accent }"
        />
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.theme-transition {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 10000;

  &__reveal {
    position: absolute;
    inset: 0;
    clip-path: circle(0% at 50% 50%);
  }

  &__mascot {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 2;
    will-change: transform, opacity;

    &--charging {
      .theme-transition__mascot-body {
        animation: mascotCharge 0.12s ease-in-out infinite;
      }

      .theme-transition__mascot-glow {
        animation: mascotChargeGlow 0.15s ease-in-out infinite;
      }
    }
  }

  &__mascot-body {
    position: relative;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: 3px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: mascotExcited 0.15s ease-in-out infinite;
    backdrop-filter: blur(4px);
  }

  &__mascot-eyes {
    display: flex;
    gap: 12px;
  }

  &__mascot-eye {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    animation: mascotBlink 0.8s ease-in-out infinite;
  }

  &__mascot-glow {
    position: absolute;
    inset: -16px;
    border-radius: 50%;
    opacity: 0.4;
    filter: blur(20px);
    z-index: -1;
    animation: mascotPulse 0.3s ease-in-out infinite;
  }

  &__charge-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    border: 2px solid;
    opacity: 0;
    z-index: -1;

    &--1 {
      width: 80px;
      height: 80px;
      animation: chargeRing 0.4s ease-out forwards;
    }

    &--2 {
      width: 100px;
      height: 100px;
      animation: chargeRing 0.4s ease-out 0.1s forwards;
    }
  }
}

@keyframes mascotExcited {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.1) rotate(5deg);
  }
}

@keyframes mascotBlink {
  0%,
  40%,
  60%,
  100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.1);
  }
}

@keyframes mascotPulse {
  0%,
  100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.4);
  }
}

@keyframes mascotCharge {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
}

@keyframes mascotChargeGlow {
  0%,
  100% {
    opacity: 0.6;
    transform: scale(1.2);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.8);
  }
}

@keyframes chargeRing {
  0% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(0.8);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.5);
  }
}

@media (prefers-reduced-motion: reduce) {
  .theme-transition {
    display: none;
  }
}
</style>
