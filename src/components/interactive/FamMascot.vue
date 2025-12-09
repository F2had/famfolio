<script setup lang="ts">
/**
 * Fam - the friendly mascot that follows your cursor
 * Uses @vueuse/motion spring physics for smooth animations
 */
import { ref, reactive, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useSpring } from '@vueuse/motion'
import { useSettings } from '@/composables/useSettings'
import { useMascotState } from '@/composables/useMascotState'
import { useThemeTransitionState } from '@/composables/useThemeTransitionState'

const { isToyEnabled } = useSettings()
const { isMascotVisible } = useMascotState()
const { isThemeTransitionActive } = useThemeTransitionState()

// Show Fam only if config enabled AND runtime toggle is on
const shouldShow = computed(() => isToyEnabled.value && isMascotVisible.value)

// Fam's actual visibility state (for animations)
const isVisible = ref(false)
const isAnimatingOut = ref(false)

// Expression states
const isSad = ref(false)
const isGivingUp = ref(false)
const isWakingUp = ref(false)

// Position state - Fam follows cursor with lazy spring
const position = reactive({ x: 0, y: 0 })
const target = reactive({ x: 0, y: 0 })
const velocity = reactive({ x: 0, y: 0 })
const lastMouse = reactive({ x: 0, y: 0 })

// Spring config for lazy cursor following
const followConfig = {
  damping: 0.92,
  stiffness: 0.03,
}

// Animation frame for cursor following
let animationFrame: number | null = null

// @vueuse/motion spring for enter/exit/move animations
const animTarget = reactive({ x: 0, y: 0, scale: 1, opacity: 1 })
const animSpring = useSpring(animTarget, {
  stiffness: 100,
  damping: 14,
})
const anim = animSpring.values as unknown as typeof animTarget
const setAnim = animSpring.set as (v: typeof animTarget) => void

// Final computed position (base position + animation offset)
const style = computed(() => ({
  transform: `translate(${position.x + anim.x}px, ${position.y + anim.y}px) scale(${anim.scale})`,
  opacity: anim.opacity,
}))

// Update position with spring physics (cursor following)
const updatePosition = () => {
  if (isAnimatingOut.value) {
    animationFrame = requestAnimationFrame(updatePosition)
    return
  }

  const dx = target.x - position.x
  const dy = target.y - position.y

  velocity.x += dx * followConfig.stiffness
  velocity.y += dy * followConfig.stiffness
  velocity.x *= followConfig.damping
  velocity.y *= followConfig.damping

  position.x += velocity.x
  position.y += velocity.y

  animationFrame = requestAnimationFrame(updatePosition)
}

// Handle mouse movement
const handleMouseMove = (e: MouseEvent) => {
  const dx = e.clientX - lastMouse.x
  const dy = e.clientY - lastMouse.y
  const speed = Math.sqrt(dx * dx + dy * dy)

  // If cursor moves too fast, Fam "gives up"
  if (speed > 80) {
    isGivingUp.value = true
    setTimeout(() => {
      isGivingUp.value = false
    }, 1200)
  }

  lastMouse.x = e.clientX
  lastMouse.y = e.clientY

  // Only follow if not giving up or animating out
  if (!isGivingUp.value && !isAnimatingOut.value) {
    target.x = e.clientX - 24
    target.y = e.clientY - 24
  }
}

// Show Fam with entrance animation
const showFam = async (fromIntro = false) => {
  if (isVisible.value) return

  // Set initial position
  const startX = window.innerWidth / 2 - 24
  const startY = fromIntro ? window.innerHeight / 2 - 24 : window.innerHeight * 0.3

  position.x = startX
  position.y = startY
  target.x = startX
  target.y = startY
  velocity.x = 0
  velocity.y = 0

  // Start hidden above
  setAnim({ x: 0, y: -120, scale: 0.5, opacity: 0 })

  isVisible.value = true
  isSad.value = false

  await nextTick()

  // Animate in with spring bounce
  setAnim({ x: 0, y: 0, scale: 1, opacity: 1 })

  // Start following cursor after entrance
  if (!animationFrame) {
    updatePosition()
  }
}

// Hide Fam with exit animation
const hideFam = async () => {
  if (!isVisible.value || isAnimatingOut.value) return

  isAnimatingOut.value = true

  // Calculate center position
  const centerX = window.innerWidth / 2 - 24
  const centerY = window.innerHeight / 3

  // Calculate offset from current position to center
  const offsetX = centerX - position.x
  const offsetY = centerY - position.y

  // Stop following cursor
  velocity.x = 0
  velocity.y = 0
  target.x = position.x
  target.y = position.y

  // Animate to center first (no sad face yet)
  setAnim({ x: offsetX, y: offsetY, scale: 1, opacity: 1 })

  // Wait for spring animation to reach center
  await new Promise(resolve => setTimeout(resolve, 400))

  // Now show sad face after reaching center
  isSad.value = true

  // Let user see the sad expression
  await new Promise(resolve => setTimeout(resolve, 600))

  // Fade out slowly
  setAnim({ x: offsetX, y: offsetY, scale: 0.7, opacity: 0 })

  // Wait for fade
  await new Promise(resolve => setTimeout(resolve, 500))

  // Reset state
  isVisible.value = false
  isAnimatingOut.value = false
  isSad.value = false
  setAnim({ x: 0, y: 0, scale: 1, opacity: 1 })
}

// Wake up animation (for intro)
const wakeUp = async () => {
  isWakingUp.value = true
  await new Promise(resolve => setTimeout(resolve, 1200))
  isWakingUp.value = false
}

// Watch for toggle changes
watch(shouldShow, async (show) => {
  if (show && !isVisible.value) {
    await showFam()
  } else if (!show && isVisible.value) {
    await hideFam()
  }
})

// Expose methods for parent (intro sequence)
defineExpose({
  showFam,
  hideFam,
  wakeUp,
  isVisible,
})

onMounted(() => {
  // Skip on touch devices
  if ('ontouchstart' in window) return
  if (!isToyEnabled.value) return

  window.addEventListener('mousemove', handleMouseMove, { passive: true })

  // Show if should be visible
  if (shouldShow.value) {
    showFam()
  }
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>

<template>
  <div
    v-if="isVisible && !isThemeTransitionActive"
    class="fam"
    :class="{
      'fam--giving-up': isGivingUp,
      'fam--waking-up': isWakingUp,
      'fam--sad': isSad,
    }"
    :style="style"
  >
    <div class="fam__body">
      <!-- Angry eyebrows when giving up -->
      <div v-if="isGivingUp" class="fam__eyebrows">
        <div class="fam__eyebrow fam__eyebrow--left" />
        <div class="fam__eyebrow fam__eyebrow--right" />
      </div>
      <!-- Sad eyebrows when being hidden -->
      <div v-if="isSad" class="fam__eyebrows fam__eyebrows--sad">
        <div class="fam__eyebrow fam__eyebrow--sad-left" />
        <div class="fam__eyebrow fam__eyebrow--sad-right" />
      </div>
      <div class="fam__eyes">
        <div class="fam__eye" :class="{ 'fam__eye--sad': isSad }" />
        <div class="fam__eye" :class="{ 'fam__eye--sad': isSad }" />
      </div>
    </div>
    <div class="fam__glow" />
    <!-- Giving up indicator -->
    <div v-if="isGivingUp" class="fam__exhausted">!</div>
  </div>
</template>

<style scoped lang="scss">
.fam {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
  pointer-events: none;
  will-change: transform, opacity;

  // Hide on mobile/touch devices
  @media (max-width: 1024px), (hover: none) {
    display: none;
  }

  &--giving-up {
    .fam__body {
      animation: famShake 0.6s ease-in-out;
    }

    .fam__eye {
      animation: none;
      transform: scaleY(0.3);
    }
  }

  &--waking-up {
    .fam__body {
      animation: famWakeUp 0.4s ease-out;
    }

    .fam__eye {
      animation: famWakeUpBlink 1.2s ease-in-out;
    }

    .fam__glow {
      animation: famWakeUpGlow 0.6s ease-out;
    }
  }

  &--sad {
    .fam__body {
      animation: famSadShake 0.4s ease-in-out;
    }
  }

  &__body {
    position: relative;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--accent-subtle);
    border: 2px solid var(--accent);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: famWobble 4s ease-in-out infinite;
    backdrop-filter: blur(4px);
    transition: transform 0.2s ease;
  }

  &__eyebrows {
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    animation: eyebrowsAppear 0.2s ease-out;

    &--sad {
      top: 10px;
    }
  }

  &__eyebrow {
    width: 8px;
    height: 3px;
    background: var(--accent);
    border-radius: 2px;

    &--left {
      transform: rotate(25deg);
      transform-origin: right center;
    }

    &--right {
      transform: rotate(-25deg);
      transform-origin: left center;
    }

    &--sad-left {
      transform: rotate(-15deg);
      transform-origin: right center;
    }

    &--sad-right {
      transform: rotate(15deg);
      transform-origin: left center;
    }
  }

  &__eyes {
    display: flex;
    gap: 8px;
  }

  &__eye {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
    animation: famBlink 4s ease-in-out infinite;
    transition: transform 0.2s ease;

    &:last-child {
      animation-delay: 0.1s;
    }

    &--sad {
      border-radius: 50% 50% 50% 50% / 70% 70% 30% 30%;
      transform: scaleY(0.7);
      animation: none !important;
    }
  }

  &__glow {
    position: absolute;
    inset: -8px;
    border-radius: 50%;
    background: var(--accent);
    opacity: 0.15;
    filter: blur(12px);
    z-index: -1;
    animation: famPulse 3s ease-in-out infinite;
  }

  &__exhausted {
    position: absolute;
    top: -24px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 14px;
    font-weight: 600;
    color: var(--accent);
    white-space: nowrap;
    animation: exhaustedAppear 0.3s ease-out;
    letter-spacing: 2px;
  }
}

// Animations
@keyframes famWobble {
  0%, 100% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(5deg) scale(1.05); }
  50% { transform: rotate(0deg) scale(0.95); }
  75% { transform: rotate(-5deg) scale(1.05); }
}

@keyframes famBlink {
  0%, 45%, 55%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(0.1); }
}

@keyframes famPulse {
  0%, 100% { opacity: 0.15; transform: scale(1); }
  50% { opacity: 0.25; transform: scale(1.2); }
}

@keyframes famShake {
  0%, 100% { transform: translateX(0) rotate(0deg); }
  20% { transform: translateX(-3px) rotate(-5deg); }
  40% { transform: translateX(3px) rotate(5deg); }
  60% { transform: translateX(-2px) rotate(-3deg); }
  80% { transform: translateX(2px) rotate(3deg); }
}

@keyframes famSadShake {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}

@keyframes famWakeUp {
  0% { transform: scale(0) rotate(-180deg); opacity: 0; }
  60% { transform: scale(1.2) rotate(10deg); opacity: 1; }
  80% { transform: scale(0.9) rotate(-5deg); }
  100% { transform: scale(1) rotate(0deg); }
}

@keyframes famWakeUpBlink {
  0% { transform: scaleY(0.1); }
  15% { transform: scaleY(1); }
  25% { transform: scaleY(1); }
  30% { transform: scaleY(0.1); }
  40% { transform: scaleY(1); }
  55% { transform: scaleY(1); }
  60% { transform: scaleY(0.1); }
  70% { transform: scaleY(1); }
  100% { transform: scaleY(1); }
}

@keyframes famWakeUpGlow {
  0% { opacity: 0; transform: scale(0.5); }
  30% { opacity: 0.5; transform: scale(2); }
  100% { opacity: 0.15; transform: scale(1); }
}

@keyframes eyebrowsAppear {
  0% { opacity: 0; transform: translateX(-50%) translateY(5px); }
  100% { opacity: 1; transform: translateX(-50%) translateY(0); }
}

@keyframes exhaustedAppear {
  0% { opacity: 0; transform: translateX(-50%) translateY(5px); }
  100% { opacity: 1; transform: translateX(-50%) translateY(0); }
}

// Reduced motion
@media (prefers-reduced-motion: reduce) {
  .fam {
    display: none;
  }
}
</style>
