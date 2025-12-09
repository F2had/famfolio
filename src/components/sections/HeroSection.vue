<script lang="ts">
// Module-level flag - persists across component re-renders and locale changes
let hasPlayedIntro = false
</script>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useConfig } from '@/composables/useConfig'
import { useSettings } from '@/composables/useSettings'
import { useLocalizedValue } from '@/composables/useLocalizedValue'
import { useLocale } from '@/composables/useLocale'

import BaseButton from '@/components/common/BaseButton.vue'
import ScrollIndicator from '@/components/layout/ScrollIndicator.vue'
import FamMascot from '@/components/interactive/FamMascot.vue'

const { t } = useI18n()
const { personal } = useConfig()
const { areAnimationsEnabled, isToyEnabled, isContactEnabled, isAvatarEnabled } = useSettings()
const { localizedRef } = useLocalizedValue()
const { isRTL } = useLocale()

const name = localizedRef(personal.name)
const lastName = localizedRef(personal.lastName)
const title = localizedRef(personal.title)
const tagline = localizedRef(personal.tagline)

// Template ref for Fam mascot
const famRef = ref<InstanceType<typeof FamMascot> | null>(null)

// Intro animation (falling cursor with explosion)
const showIntro = ref(true)
const cursorFalling = ref(true)
const cursorExploded = ref(false)
const showParticles = ref(false)

// Animation phases
const showGreeting = ref(false)
const showName = ref(false)
const showTitle = ref(false)
const showTagline = ref(false)
const showButtons = ref(false)
const isAnimated = ref(false)

// Generate explosion particles with pre-calculated positions
const particles = Array.from({ length: 12 }, (_, i) => {
  const angle = (i * 30 + Math.random() * 15) * (Math.PI / 180)
  const distance = 60 + Math.random() * 40
  return {
    id: i,
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    size: 4 + Math.random() * 6,
    delay: Math.random() * 100,
  }
})

// Typewriter effect for tagline
const typewriterIndex = ref(0)
const displayedTagline = computed(() => tagline.value.slice(0, typewriterIndex.value))

// Split name into letters (LTR only - Arabic must stay connected)
const nameLetters = computed(() => (isRTL.value ? [] : name.value.split('')))
const lastNameLetters = computed(() => (isRTL.value ? [] : lastName.value.split('')))

// Generate random initial positions for letters
const getRandomOffset = () => ({
  x: (Math.random() - 0.5) * 100,
  y: (Math.random() - 0.5) * 80 + 40,
  rotate: (Math.random() - 0.5) * 30,
})

// Generate random dance properties for each letter (non-repeating pattern)
const getRandomDanceProps = () => ({
  height: 6 + Math.random() * 8, // 6-14px bounce height
  duration: 1.2 + Math.random() * 0.6, // 1.2-1.8s duration (slower, more relaxed)
  delay: Math.random() * 0.4, // 0-0.4s additional random delay
})

// Store random offsets for each letter
const nameOffsets = computed(() => nameLetters.value.map(() => getRandomOffset()))
const lastNameOffsets = computed(() => lastNameLetters.value.map(() => getRandomOffset()))

// Store random dance properties (make each letter feel unique)
const nameDanceProps = computed(() => nameLetters.value.map(() => getRandomDanceProps()))
const lastNameDanceProps = computed(() => lastNameLetters.value.map(() => getRandomDanceProps()))

// Scroll parallax for shapes
const scrollY = ref(0)
const handleScroll = () => {
  scrollY.value = window.scrollY
}

// Dance animation on hover (all letters in section dance together)
const isFirstNameDancing = ref(false)
const isLastNameDancing = ref(false)

const startDancing = (isLastName = false) => {
  if (!areAnimationsEnabled.value) return // Don't dance if animations disabled
  if (isLastName) {
    isLastNameDancing.value = true
  } else {
    isFirstNameDancing.value = true
  }
}

const stopDancing = (isLastName = false) => {
  if (isLastName) {
    isLastNameDancing.value = false
  } else {
    isFirstNameDancing.value = false
  }
}

// Animation sequence
onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })

  // If animations are disabled OR intro has already played, show everything immediately
  if (!areAnimationsEnabled.value || hasPlayedIntro) {
    showIntro.value = false
    showGreeting.value = true
    showName.value = true
    showTitle.value = true
    showTagline.value = true
    typewriterIndex.value = tagline.value.length // Show full tagline
    showButtons.value = true
    isAnimated.value = true
    return
  }

  // Mark intro as played
  hasPlayedIntro = true

  // Intro: Cursor falls (800ms fall duration)
  setTimeout(() => {
    cursorFalling.value = false
    cursorExploded.value = true
    showParticles.value = true
  }, 800)

  // Intro: Hide particles after explosion
  setTimeout(() => {
    showParticles.value = false
  }, 1400)

  // Intro: Trigger Fam wake up animation after explosion
  setTimeout(() => {
    if (isToyEnabled.value && famRef.value) {
      famRef.value.wakeUp()
    }
  }, 900)

  // Intro: Fade out intro overlay
  setTimeout(() => {
    showIntro.value = false
  }, 1200)

  // Phase 1: Greeting (after intro)
  setTimeout(() => {
    showGreeting.value = true
  }, 1000)

  // Base delay after intro
  const introDelay = 1000

  // Phase 2: Name letters
  setTimeout(() => {
    showName.value = true
    isAnimated.value = true
  }, introDelay + 300)

  // Phase 3: Title
  const nameAnimationDuration = isRTL.value
    ? 800
    : (nameLetters.value.length + lastNameLetters.value.length) * 80 + 400
  setTimeout(
    () => {
      showTitle.value = true
    },
    introDelay + 300 + nameAnimationDuration,
  )

  // Phase 4: Typewriter tagline
  setTimeout(
    () => {
      showTagline.value = true
      // Start typewriter
      const typeInterval = setInterval(() => {
        if (typewriterIndex.value < tagline.value.length) {
          typewriterIndex.value++
        } else {
          clearInterval(typeInterval)
        }
      }, 30)
    },
    introDelay + 300 + nameAnimationDuration + 300,
  )

  // Phase 5: Buttons
  setTimeout(
    () => {
      showButtons.value = true
    },
    introDelay + 300 + nameAnimationDuration + 300 + tagline.value.length * 30 + 200,
  )
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Reset typewriter when locale changes
watch(
  () => tagline.value,
  () => {
    typewriterIndex.value = 0
    if (showTagline.value) {
      const typeInterval = setInterval(() => {
        if (typewriterIndex.value < tagline.value.length) {
          typewriterIndex.value++
        } else {
          clearInterval(typeInterval)
        }
      }, 30)
    }
  },
)

const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// Parallax transforms for shapes
const shape1Transform = computed(
  () =>
    `translate(${scrollY.value * 0.1}px, ${scrollY.value * 0.15}px) rotate(${scrollY.value * 0.02}deg) scale(${1 + scrollY.value * 0.0002})`,
)
const shape2Transform = computed(
  () =>
    `translate(${-scrollY.value * 0.08}px, ${scrollY.value * 0.12}px) rotate(${-scrollY.value * 0.015}deg) scale(${1 - scrollY.value * 0.0001})`,
)
const shape3Transform = computed(
  () =>
    `translate(${scrollY.value * 0.05}px, ${scrollY.value * 0.1}px) rotate(${scrollY.value * 0.025}deg)`,
)
const shape4Transform = computed(
  () =>
    `translate(${-scrollY.value * 0.06}px, ${scrollY.value * 0.08}px) rotate(${-scrollY.value * 0.01}deg) scale(${1 + scrollY.value * 0.00015})`,
)
</script>

<template>
  <section id="hero" class="hero">
    <!-- Intro Animation: Falling Cursor with Explosion (only when animations enabled) -->
    <div v-if="showIntro && areAnimationsEnabled" class="hero__intro" aria-hidden="true">
      <div
        class="hero__cursor-rocket"
        :class="{
          'hero__cursor-rocket--falling': cursorFalling,
          'hero__cursor-rocket--exploded': cursorExploded,
        }"
      >
        <!-- Cursor Icon -->
        <svg viewBox="0 0 24 24" fill="currentColor" class="hero__cursor-icon">
          <path d="M4 4l16 8-8 2-2 8z" />
        </svg>
        <!-- Trail effect -->
        <div class="hero__cursor-trail"></div>
      </div>

      <!-- Explosion particles -->
      <div v-if="showParticles" class="hero__particles">
        <div
          v-for="particle in particles"
          :key="particle.id"
          class="hero__particle"
          :style="{
            '--end-x': `${particle.x}px`,
            '--end-y': `${particle.y}px`,
            '--size': `${particle.size}px`,
            '--delay': `${particle.delay}ms`,
          }"
        />
      </div>

      <!-- Shockwave ring -->
      <div v-if="cursorExploded" class="hero__shockwave" />
    </div>

    <!-- Fam - the friendly mascot (separate component) -->
    <FamMascot ref="famRef" />

    <!-- Morphing geometric shapes background with parallax (only when animations enabled) -->
    <div v-if="areAnimationsEnabled" class="hero__shapes" aria-hidden="true">
      <div class="hero__shape hero__shape--1" :style="{ transform: shape1Transform }" />
      <div class="hero__shape hero__shape--2" :style="{ transform: shape2Transform }" />
      <div class="hero__shape hero__shape--3" :style="{ transform: shape3Transform }" />
      <div class="hero__shape hero__shape--4" :style="{ transform: shape4Transform }" />
    </div>

    <div class="hero__container">
      <!-- Avatar -->
      <div
        v-if="isAvatarEnabled"
        class="hero__avatar"
        :class="{ 'hero__avatar--visible': isAnimated }"
      >
        <img :src="personal.avatar.src" :alt="name" class="hero__avatar-img" />
      </div>

      <!-- Content -->
      <div class="hero__content">
        <!-- Greeting -->
        <p class="hero__greeting" :class="{ 'hero__greeting--visible': showGreeting }">
          {{ t('hero.greeting') }}
        </p>

        <!-- Kinetic Typography Name -->
        <h1 class="hero__name">
          <!-- LTR: Letter-by-letter animation from random angles -->
          <template v-if="!isRTL">
            <span
              class="hero__name-first"
              @mouseenter="startDancing(false)"
              @mouseleave="stopDancing(false)"
            >
              <span
                v-for="(letter, index) in nameLetters"
                :key="`first-${index}`"
                class="hero__letter"
                :class="{
                  'hero__letter--visible': showName,
                  'hero__letter--dancing': isFirstNameDancing,
                }"
                :style="{
                  '--initial-x': `${nameOffsets[index]?.x || 0}px`,
                  '--initial-y': `${nameOffsets[index]?.y || 0}px`,
                  '--initial-rotate': `${nameOffsets[index]?.rotate || 0}deg`,
                  '--delay': `${index * 80}ms`,
                  '--dance-height': `${nameDanceProps[index]?.height || 10}px`,
                  '--dance-duration': `${nameDanceProps[index]?.duration || 0.8}s`,
                  '--dance-delay': `${index * 0.1 + (nameDanceProps[index]?.delay || 0)}s`,
                  '--settle-delay': `${index * 40}ms`,
                }"
                >{{ letter === ' ' ? '\u00A0' : letter }}</span
              >
            </span>
            <span
              class="hero__name-last"
              @mouseenter="startDancing(true)"
              @mouseleave="stopDancing(true)"
            >
              <span
                v-for="(letter, index) in lastNameLetters"
                :key="`last-${index}`"
                class="hero__letter hero__letter--accent"
                :class="{
                  'hero__letter--visible': showName,
                  'hero__letter--dancing': isLastNameDancing,
                }"
                :style="{
                  '--initial-x': `${lastNameOffsets[index]?.x || 0}px`,
                  '--initial-y': `${lastNameOffsets[index]?.y || 0}px`,
                  '--initial-rotate': `${lastNameOffsets[index]?.rotate || 0}deg`,
                  '--delay': `${(nameLetters.length + index) * 80 + 100}ms`,
                  '--dance-height': `${lastNameDanceProps[index]?.height || 10}px`,
                  '--dance-duration': `${lastNameDanceProps[index]?.duration || 0.8}s`,
                  '--dance-delay': `${index * 0.1 + (lastNameDanceProps[index]?.delay || 0)}s`,
                  '--settle-delay': `${index * 40}ms`,
                }"
                >{{ letter === ' ' ? '\u00A0' : letter }}</span
              >
            </span>
          </template>

          <!-- RTL: Word animation (Arabic letters must stay connected) -->
          <!-- Alternative: shimmer + glow + bounce effects on whole words -->
          <template v-else>
            <span
              class="hero__name-first hero__word"
              :class="{
                'hero__word--visible': showName,
                'hero__word--dancing': isFirstNameDancing,
              }"
              :style="{ '--delay': '0ms' }"
              @mouseenter="startDancing(false)"
              @mouseleave="stopDancing(false)"
              >{{ name }}</span
            >
            <span
              class="hero__name-last hero__word hero__word--accent"
              :class="{
                'hero__word--visible': showName,
                'hero__word--dancing': isLastNameDancing,
              }"
              :style="{ '--delay': '200ms' }"
              @mouseenter="startDancing(true)"
              @mouseleave="stopDancing(true)"
              >{{ lastName }}</span
            >
          </template>
        </h1>

        <!-- Title -->
        <p class="hero__title" :class="{ 'hero__title--visible': showTitle }">
          {{ title }}
        </p>

        <!-- Typewriter Tagline -->
        <p class="hero__tagline" :class="{ 'hero__tagline--visible': showTagline }">
          {{ displayedTagline
          }}<span
            class="hero__cursor"
            :class="{ 'hero__cursor--hidden': typewriterIndex >= tagline.length }"
            >|</span
          >
        </p>

        <!-- CTAs -->
        <div class="hero__actions" :class="{ 'hero__actions--visible': showButtons }">
          <BaseButton variant="primary" @click="scrollToSection('projects')">
            {{ t('hero.viewWork') }}
          </BaseButton>
          <BaseButton v-if="isContactEnabled" variant="outline" @click="scrollToSection('contact')">
            {{ t('hero.contactMe') }}
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Scroll Indicator (positioned relative to hero section) -->
    <ScrollIndicator class="hero__scroll" :class="{ 'hero__scroll--visible': showButtons }" />
  </section>
</template>

<style scoped lang="scss">
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative; // For scroll indicator positioning
  padding-block: var(--space-4xl);
  padding-bottom: calc(var(--space-4xl) + 60px); // Extra space for scroll indicator
  overflow: hidden;

  // Intro animation overlay
  &__intro {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-primary);
    pointer-events: none;
    animation: introFadeOut 0.4s ease-out 1.1s forwards;
  }

  &__cursor-rocket {
    position: relative;
    color: var(--accent);
    filter: drop-shadow(0 0 10px var(--accent));

    &--falling {
      animation: cursorFall 0.8s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards;
    }

    &--exploded {
      opacity: 0;
      transform: scale(0);
    }
  }

  &__cursor-icon {
    width: 48px;
    height: 48px;
    transform: rotate(-45deg);
  }

  &__cursor-trail {
    position: absolute;
    top: -80px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 80px;
    background: linear-gradient(to bottom, transparent, var(--accent));
    border-radius: 2px;
    opacity: 0.6;
  }

  &__particles {
    position: absolute;
    top: 50%;
    left: 50%;
  }

  &__particle {
    position: absolute;
    width: var(--size);
    height: var(--size);
    background: var(--accent);
    border-radius: 50%;
    animation: particleExplode 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    animation-delay: var(--delay);
    box-shadow: 0 0 6px var(--accent);
  }

  &__shockwave {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    border: 2px solid var(--accent);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: shockwave 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }

  // Morphing geometric shapes with parallax
  &__shapes {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }

  &__shape {
    position: absolute;
    opacity: 0.12;
    filter: blur(80px);
    background: var(--accent);
    will-change: transform, border-radius;

    // Shape 1: Circle ↔ Rounded Square (top right)
    &--1 {
      width: 450px;
      height: 450px;
      top: -120px;
      right: -120px;
      animation: morph1 20s ease-in-out infinite;
    }

    // Shape 2: Organic blob (bottom left)
    &--2 {
      width: 350px;
      height: 350px;
      bottom: -80px;
      left: -80px;
      animation: morph2 25s ease-in-out infinite;
    }

    // Shape 3: Triangle ↔ Hexagon (middle left)
    &--3 {
      width: 250px;
      height: 250px;
      top: 35%;
      left: 5%;
      animation: morph3 22s ease-in-out infinite;
    }

    // Shape 4: Floating blob (bottom right)
    &--4 {
      width: 300px;
      height: 300px;
      bottom: 15%;
      right: 8%;
      animation: morph4 18s ease-in-out infinite;
    }
  }

  &__container {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: var(--container-max);
    padding-inline: var(--container-padding);
  }

  &__avatar {
    margin-bottom: var(--space-xl);
    opacity: 0;
    transform: scale(0.8);
    transition:
      opacity 0.6s ease-out,
      transform 0.6s ease-out;

    &--visible {
      opacity: 1;
      transform: scale(1);
    }
  }

  &__avatar-img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid var(--accent);
    box-shadow: 0 0 0 4px var(--accent-subtle);

    @media (min-width: 768px) {
      width: 150px;
      height: 150px;
    }
  }

  &__greeting {
    font-family: var(--font-display);
    font-size: var(--text-lg);
    color: var(--accent);
    margin-bottom: var(--space-sm);
    opacity: 0;
    transform: translateY(20px);
    transition:
      opacity 0.6s ease-out,
      transform 0.6s ease-out;

    &--visible {
      opacity: 1;
      transform: translateY(0);
    }

    @media (min-width: 768px) {
      font-size: var(--text-xl);
    }
  }

  &__name {
    font-size: var(--text-5xl);
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: var(--space-md);

    @media (min-width: 768px) {
      font-size: var(--text-6xl);
    }

    @media (min-width: 1024px) {
      font-size: var(--text-7xl);
    }
  }

  &__name-first,
  &__name-last {
    display: block;
  }

  &__name-last {
    color: var(--accent);
  }

  // Individual letter animation (LTR)
  &__letter {
    display: inline-block;
    opacity: 0;
    transform: translate(var(--initial-x, 0), var(--initial-y, 50px))
      rotate(var(--initial-rotate, 0deg));
    transition:
      opacity 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
      transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    transition-delay: var(--delay, 0ms);
    cursor: default;

    &--visible {
      opacity: 1;
      transform: translate(0, 0) rotate(0deg);
      // When settling back, use settle-delay
      transition-delay: var(--settle-delay, 0ms);
    }

    &--dancing {
      animation: letterDance var(--dance-duration, 0.8s) ease-in-out infinite;
      animation-delay: var(--dance-delay, 0s);
    }

    &--accent {
      color: var(--accent);
    }
  }

  // Word animation (RTL) - shimmer, glow, bounce for Arabic
  &__word {
    display: block;
    opacity: 0;
    transform: translateY(30px);
    transition:
      opacity 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
      transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
      text-shadow 0.3s ease;
    transition-delay: var(--delay, 0ms);
    cursor: default;
    position: relative;

    // Shimmer overlay
    &::before {
      content: '';
      position: absolute;
      inset: -4px -8px;
      background: linear-gradient(
        90deg,
        transparent 0%,
        var(--accent-subtle) 50%,
        transparent 100%
      );
      opacity: 0;
      transform: translateX(-100%);
      border-radius: var(--radius-md);
      pointer-events: none;
      z-index: -1;
    }

    &--visible {
      opacity: 1;
      transform: translateY(0);
    }

    &--accent {
      color: var(--accent);
    }

    // Dancing state for RTL - shimmer + glow + bounce
    &--dancing {
      animation: wordBounce 1.2s ease-in-out infinite;
      text-shadow:
        0 0 20px var(--accent-subtle),
        0 0 40px var(--accent-subtle);

      &::before {
        opacity: 0.6;
        animation: wordShimmer 1.5s ease-in-out infinite;
      }
    }
  }

  &__title {
    font-family: var(--font-display);
    font-size: var(--text-xl);
    font-weight: 500;
    color: var(--text-secondary);
    margin-bottom: var(--space-sm);
    opacity: 0;
    transform: translateY(20px);
    transition:
      opacity 0.5s ease-out,
      transform 0.5s ease-out;

    &--visible {
      opacity: 1;
      transform: translateY(0);
    }

    @media (min-width: 768px) {
      font-size: var(--text-2xl);
    }
  }

  &__tagline {
    font-size: var(--text-lg);
    color: var(--text-secondary);
    max-width: 500px;
    margin-inline: auto;
    margin-bottom: var(--space-xl);
    min-height: 1.5em;
    opacity: 0;
    transition: opacity 0.3s ease-out;

    &--visible {
      opacity: 1;
    }

    @media (min-width: 768px) {
      font-size: var(--text-xl);
    }
  }

  &__cursor {
    display: inline-block;
    animation: blink 1s step-end infinite;
    margin-inline-start: 2px;
    color: var(--accent);

    &--hidden {
      opacity: 0;
    }
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--space-md);
    opacity: 0;
    transform: translateY(20px);
    transition:
      opacity 0.5s ease-out,
      transform 0.5s ease-out;

    &--visible {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &__scroll {
    position: absolute;
    bottom: var(--space-xl);
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    transition: opacity 0.6s ease-out;

    &--visible {
      opacity: 1;
    }
  }
}

// Intro animations
@keyframes cursorFall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  70% {
    transform: translateY(0) rotate(10deg);
    opacity: 1;
  }
  85% {
    transform: translateY(-20px) rotate(-5deg);
  }
  100% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
}

@keyframes particleExplode {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(var(--end-x), var(--end-y)) scale(0);
    opacity: 0;
  }
}

@keyframes shockwave {
  0% {
    width: 20px;
    height: 20px;
    opacity: 1;
  }
  100% {
    width: 200px;
    height: 200px;
    opacity: 0;
    border-width: 1px;
  }
}

@keyframes introFadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    visibility: hidden;
  }
}

// Letter dance animation - smooth bouncing while hovered (height varies per letter)
@keyframes letterDance {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(calc(var(--dance-height, 10px) * -0.5)) rotate(2deg);
  }
  50% {
    transform: translateY(calc(var(--dance-height, 10px) * -1)) rotate(0deg);
  }
  75% {
    transform: translateY(calc(var(--dance-height, 10px) * -0.5)) rotate(-2deg);
  }
}

// RTL Word animations - whole word bounce with slight scale
@keyframes wordBounce {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  25% {
    transform: translateY(-6px) scale(1.02);
  }
  50% {
    transform: translateY(-10px) scale(1.03);
  }
  75% {
    transform: translateY(-6px) scale(1.02);
  }
}

// RTL Shimmer sweep across word
@keyframes wordShimmer {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(100%);
  }
}

// Cursor blink
@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

// Shape morphing animations
@keyframes morph1 {
  0%,
  100% {
    border-radius: 50%;
  }
  25% {
    border-radius: 40% 60% 60% 40% / 60% 40% 60% 40%;
  }
  50% {
    border-radius: 30% 30% 30% 30%;
  }
  75% {
    border-radius: 60% 40% 40% 60% / 40% 60% 40% 60%;
  }
}

@keyframes morph2 {
  0%,
  100% {
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  }
  33% {
    border-radius: 40% 60% 70% 30% / 40% 70% 30% 60%;
  }
  66% {
    border-radius: 30% 60% 50% 50% / 50% 40% 60% 50%;
  }
}

@keyframes morph3 {
  0%,
  100% {
    border-radius: 50% 50% 50% 50%;
  }
  25% {
    border-radius: 50% 50% 20% 80% / 25% 80% 20% 75%;
  }
  50% {
    border-radius: 40% 40% 40% 40%;
  }
  75% {
    border-radius: 80% 20% 50% 50% / 75% 25% 80% 20%;
  }
}

@keyframes morph4 {
  0%,
  100% {
    border-radius: 40% 60% 60% 40% / 70% 30% 70% 30%;
  }
  50% {
    border-radius: 60% 40% 40% 60% / 30% 70% 30% 70%;
  }
}

// Reduced motion
@media (prefers-reduced-motion: reduce) {
  .hero {
    &__shapes {
      display: none;
    }

    &__intro {
      display: none;
    }

    &__letter,
    &__word,
    &__greeting,
    &__title,
    &__tagline,
    &__actions {
      opacity: 1;
      transform: none;
      transition: none;
      animation: none;
    }

    &__letter--visible,
    &__word--visible,
    &__greeting--visible,
    &__title--visible,
    &__tagline--visible,
    &__actions--visible {
      opacity: 1;
      transform: none;
    }

    &__letter--dancing,
    &__word--dancing {
      animation: none;
      text-shadow: none;

      &::before {
        display: none;
      }
    }
  }
}
</style>
