<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useSettings } from '@/composables/useSettings'
import { useConfig } from '@/composables/useConfig'

const {
  isLocaleTransitionEnabled,
  localeDirectionChangeTransition,
  localeSameDirectionTransition,
} = useSettings()
const { site } = useConfig()

const isTransitioning = ref(false)
const transitionType = ref<'pageFlip' | 'cardFlip' | 'ripple' | 'fade'>('fade')
const flipDirection = ref<'ltr-to-rtl' | 'rtl-to-ltr'>('ltr-to-rtl')
const rippleProgress = ref(0)
const ripplePosition = ref({ x: 0, y: 0 })
const animationPhase = ref<'overlay-in' | 'main' | 'overlay-out'>('overlay-in')
const overlayOpacity = ref(0)
const mainProgress = ref(0)

// Computed styles for overlay
const overlayStyle = computed(() => ({
  opacity: overlayOpacity.value,
  backdropFilter: `blur(${overlayOpacity.value * 12}px)`,
}))

// Determine if locale change involves direction change
const getLocaleDirection = (localeCode: string): 'rtl' | 'ltr' => {
  const localeConfig = site?.supportedLocales?.find((l) => l.code === localeCode)
  return localeConfig?.dir === 'rtl' ? 'rtl' : 'ltr'
}

// Trigger transition
const triggerTransition = async (
  fromLocale: string,
  toLocale: string,
  buttonX: number,
  buttonY: number,
) => {
  if (!isLocaleTransitionEnabled.value || isTransitioning.value) return

  const fromDir = getLocaleDirection(fromLocale)
  const toDir = getLocaleDirection(toLocale)
  const isDirectionChange = fromDir !== toDir

  ripplePosition.value = { x: buttonX, y: buttonY }

  // Determine which transition to use
  if (isDirectionChange) {
    transitionType.value = localeDirectionChangeTransition.value as 'pageFlip' | 'cardFlip'
    flipDirection.value = fromDir === 'ltr' ? 'ltr-to-rtl' : 'rtl-to-ltr'
  } else {
    transitionType.value = localeSameDirectionTransition.value as 'ripple' | 'fade'
  }

  isTransitioning.value = true
  rippleProgress.value = 0
  mainProgress.value = 0
  overlayOpacity.value = 0
  animationPhase.value = 'overlay-in'

  await nextTick()

  // Run the appropriate transition
  if (transitionType.value === 'ripple') {
    animateRipple()
  } else if (transitionType.value === 'fade') {
    animateFade()
  } else {
    // pageFlip and cardFlip - overlay first, then flip
    animateWithOverlay()
  }
}

// Animate overlay in -> main effect -> overlay out
const animateWithOverlay = () => {
  // Phase 1: Overlay fades in (150ms)
  const overlayInDuration = 150
  const startTime = performance.now()

  const animateOverlayIn = (currentTime: number) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / overlayInDuration, 1)
    overlayOpacity.value = progress * 0.85

    if (progress < 1) {
      requestAnimationFrame(animateOverlayIn)
    } else {
      animationPhase.value = 'main'
      animateMainEffect()
    }
  }

  requestAnimationFrame(animateOverlayIn)
}

const animateMainEffect = () => {
  // Phase 2: Main flip/slide effect (500ms)
  const mainDuration = 500
  const startTime = performance.now()

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / mainDuration, 1)
    // Ease in-out quart for smooth motion
    const eased =
      progress < 0.5
        ? 8 * progress * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 4) / 2
    mainProgress.value = eased

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      animationPhase.value = 'overlay-out'
      animateOverlayOut()
    }
  }

  requestAnimationFrame(animate)
}

const animateOverlayOut = () => {
  // Phase 3: Overlay fades out (200ms)
  const overlayOutDuration = 200
  const startTime = performance.now()
  const startOpacity = overlayOpacity.value

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / overlayOutDuration, 1)
    // Ease out
    const eased = 1 - Math.pow(1 - progress, 2)
    overlayOpacity.value = startOpacity * (1 - eased)

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      isTransitioning.value = false
      mainProgress.value = 0
      overlayOpacity.value = 0
    }
  }

  requestAnimationFrame(animate)
}

const animateRipple = () => {
  const duration = 400
  const startTime = performance.now()
  const maxSize = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2) * 2

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    // Ease out quart for snappy expansion
    const eased = 1 - Math.pow(1 - progress, 4)
    rippleProgress.value = eased * maxSize

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      setTimeout(() => {
        isTransitioning.value = false
        rippleProgress.value = 0
      }, 50)
    }
  }

  requestAnimationFrame(animate)
}

const animateFade = () => {
  // Simple overlay pulse for fade
  const duration = 300
  const startTime = performance.now()

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    // Bell curve for fade in/out
    overlayOpacity.value = Math.sin(progress * Math.PI) * 0.6

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      isTransitioning.value = false
      overlayOpacity.value = 0
    }
  }

  requestAnimationFrame(animate)
}

defineExpose({ triggerTransition })
</script>

<template>
  <Teleport to="body">
    <!-- Page Flip Transition (RTL↔LTR) -->
    <div
      v-if="isTransitioning && transitionType === 'pageFlip'"
      class="locale-transition locale-transition--page-flip"
      :class="[`locale-transition--${flipDirection}`]"
    >
      <!-- Frosted overlay -->
      <div class="locale-transition__overlay" :style="overlayStyle" />

      <!-- Sliding panel with page turn effect -->
      <div
        v-if="animationPhase === 'main' || animationPhase === 'overlay-out'"
        class="locale-transition__panel"
        :style="{
          transform:
            flipDirection === 'ltr-to-rtl'
              ? `translateX(${-100 * mainProgress}%)`
              : `translateX(${100 * mainProgress}%)`,
        }"
      >
        <!-- Inner page with 3D rotation -->
        <div
          class="locale-transition__page"
          :style="{
            transform:
              flipDirection === 'ltr-to-rtl'
                ? `perspective(1500px) rotateY(${-45 * mainProgress}deg)`
                : `perspective(1500px) rotateY(${45 * mainProgress}deg)`,
          }"
        />
      </div>

      <!-- Direction indicator line -->
      <div
        v-if="animationPhase === 'main'"
        class="locale-transition__indicator"
        :style="{
          left:
            flipDirection === 'ltr-to-rtl'
              ? `${100 - mainProgress * 100}%`
              : `${mainProgress * 100}%`,
          opacity: Math.sin(mainProgress * Math.PI),
        }"
      />
    </div>

    <!-- Card Flip Transition (RTL↔LTR) -->
    <div
      v-if="isTransitioning && transitionType === 'cardFlip'"
      class="locale-transition locale-transition--card-flip"
      :class="[`locale-transition--${flipDirection}`]"
    >
      <!-- Frosted overlay -->
      <div class="locale-transition__overlay" :style="overlayStyle" />

      <!-- 3D flipping card -->
      <div
        v-if="animationPhase === 'main' || animationPhase === 'overlay-out'"
        class="locale-transition__card-container"
      >
        <div
          class="locale-transition__card"
          :style="{
            transform:
              flipDirection === 'ltr-to-rtl'
                ? `perspective(1200px) rotateY(${-180 * mainProgress}deg) scale(${1 - Math.sin(mainProgress * Math.PI) * 0.05})`
                : `perspective(1200px) rotateY(${180 * mainProgress}deg) scale(${1 - Math.sin(mainProgress * Math.PI) * 0.05})`,
          }"
        />
      </div>
    </div>

    <!-- Ripple Transition (Same Direction) -->
    <div
      v-if="isTransitioning && transitionType === 'ripple'"
      class="locale-transition locale-transition--ripple"
    >
      <div
        class="locale-transition__ripple-circle"
        :style="{
          left: `${ripplePosition.x}px`,
          top: `${ripplePosition.y}px`,
          width: `${rippleProgress}px`,
          height: `${rippleProgress}px`,
        }"
      />
    </div>

    <!-- Fade Transition (Same Direction) -->
    <div
      v-if="isTransitioning && transitionType === 'fade'"
      class="locale-transition locale-transition--fade"
    >
      <div class="locale-transition__overlay" :style="overlayStyle" />
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.locale-transition {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 10000; // Above content

  // ============================================
  // SHARED - Frosted overlay
  // ============================================
  &__overlay {
    position: absolute;
    inset: 0;
    background: var(--bg-primary);
    will-change: opacity, backdrop-filter;
  }

  // ============================================
  // PAGE FLIP - Sliding page with 3D rotation
  // ============================================
  &--page-flip {
    overflow: hidden;
  }

  &__panel {
    position: absolute;
    inset: 0;
    will-change: transform;
  }

  &__page {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
    transform-origin: right center;
    box-shadow: -30px 0 80px rgba(0, 0, 0, 0.2);
  }

  &--rtl-to-ltr &__page {
    transform-origin: left center;
    box-shadow: 30px 0 80px rgba(0, 0, 0, 0.2);
  }

  &__indicator {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      var(--accent) 20%,
      var(--accent) 80%,
      transparent 100%
    );
    box-shadow: 0 0 20px var(--accent);
  }

  // ============================================
  // CARD FLIP - 3D card rotation
  // ============================================
  &--card-flip {
    perspective: 1200px;
  }

  &__card-container {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transform-style: preserve-3d;
  }

  &__card {
    position: absolute;
    inset: 5%;
    background: linear-gradient(
      135deg,
      var(--bg-primary) 0%,
      var(--accent-subtle) 50%,
      var(--bg-primary) 100%
    );
    border-radius: var(--radius-lg);
    box-shadow:
      0 25px 100px rgba(0, 0, 0, 0.3),
      0 0 0 1px var(--border);
    transform-style: preserve-3d;
    backface-visibility: hidden;

    // Back face hint
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
      border-radius: inherit;
      transform: rotateY(180deg);
      backface-visibility: hidden;
    }
  }

  // ============================================
  // RIPPLE - Expanding circle
  // ============================================
  &--ripple {
    overflow: hidden;
  }

  &__ripple-circle {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      var(--accent-subtle) 0%,
      color-mix(in srgb, var(--accent-subtle) 50%, transparent) 40%,
      transparent 70%
    );
    transform: translate(-50%, -50%);
    opacity: 0.8;
  }
}

@media (prefers-reduced-motion: reduce) {
  .locale-transition {
    display: none;
  }
}
</style>
