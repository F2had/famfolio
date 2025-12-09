<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSpring } from '@vueuse/motion'
import { useSettings } from '@/composables/useSettings'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()
const { t } = useI18n()
const { isToyEnabled, areAnimationsEnabled } = useSettings()

// Mascot state
const isBlinking = ref(false)
const isDizzy = ref(false)
const isStartled = ref(false)
const currentSymbol = ref('?')
const mouseNear = ref(false)

// Spring-based motion for smooth, bouncy animations
const fleeTarget = reactive({ x: 0, y: 0 })
const scaleTarget = reactive({ x: 1, y: 1 })
const rotationTarget = reactive({ angle: 0 })

// Spring physics for flee position (fast escape, bouncy return)
const fleeSpring = useSpring(fleeTarget, {
  stiffness: 400,
  damping: 20,
})
const fleeValues = fleeSpring.values as unknown as { x: number; y: number }
const setFlee = fleeSpring.set as (values: { x: number; y: number }) => void

// Spring physics for scale (squash & stretch)
const scaleSpring = useSpring(scaleTarget, {
  stiffness: 300,
  damping: 20,
})
const scaleValues = scaleSpring.values as unknown as { x: number; y: number }
const setScale = scaleSpring.set as (values: { x: number; y: number }) => void

// Spring physics for rotation (spin on click)
const rotationSpring = useSpring(rotationTarget, {
  stiffness: 200,
  damping: 25,
})
const rotationValues = rotationSpring.values as unknown as { angle: number }
const setRotation = rotationSpring.set as (values: { angle: number }) => void

// Base wander position (sine waves)
const wanderBase = reactive({ x: 0, y: 0, rotation: -8 })

// Floating symbols with spring-like motion
const symbols = ref([
  { id: 1, char: '?', x: 0, y: 0, scale: 1, opacity: 0.6 },
  { id: 2, char: '!', x: 0, y: 0, scale: 0.7, opacity: 0.4 },
  { id: 3, char: '...', x: 0, y: 0, scale: 0.8, opacity: 0.5 },
])

// Refs
const mascotRef = ref<HTMLElement | null>(null)

let blinkInterval: number
let symbolInterval: number
let dizzyInterval: number
let animationFrame: number
let startTime = 0

// Random blinking
const startBlinking = () => {
  blinkInterval = window.setInterval(() => {
    if (!isDizzy.value && Math.random() > 0.6) {
      isBlinking.value = true
      setTimeout(() => {
        isBlinking.value = false
      }, 150)
    }
  }, 2000)
}

// Occasional dizzy state
const startDizzyCheck = () => {
  dizzyInterval = window.setInterval(() => {
    if (Math.random() > 0.85) {
      isDizzy.value = true
      setTimeout(() => {
        isDizzy.value = false
      }, 2000)
    }
  }, 8000)
}

// Cycle through symbols
const startSymbolCycle = () => {
  const chars = ['?', '!', '...', '??', '?!']
  let index = 0
  symbolInterval = window.setInterval(() => {
    index = (index + 1) % chars.length
    currentSymbol.value = chars[index]!
  }, 3000)
}

// Handle mouse movement - run away with spring physics!
const handleMouseMove = (e: MouseEvent) => {
  // Calculate actual mascot position:
  // Container is at viewport center (50%, 50%) + wander offset + flee offset
  const mascotCenterX = window.innerWidth / 2 + wanderBase.x + fleeValues.x
  const mascotCenterY = window.innerHeight / 2 + wanderBase.y + fleeValues.y

  const dx = e.clientX - mascotCenterX
  const dy = e.clientY - mascotCenterY
  const distance = Math.sqrt(dx * dx + dy * dy)

  // If mouse is within 250px, flee fast!
  if (distance < 250 && distance > 0) {
    mouseNear.value = true
    const fleeStrength = Math.max(0, (250 - distance) / 250) * 180

    // Set spring targets - it will animate smoothly
    setFlee({
      x: (-dx / distance) * fleeStrength,
      y: (-dy / distance) * fleeStrength,
    })

    // Squash in direction of movement, stretch perpendicular
    const stretchAmount = Math.min(fleeStrength / 80, 0.4)
    setScale({
      x: 1 + stretchAmount * 0.4,
      y: 1 - stretchAmount * 0.25,
    })
  } else {
    mouseNear.value = false
    // Spring back to center
    setFlee({ x: 0, y: 0 })
    setScale({ x: 1, y: 1 })
  }
}

// Click to startle - spring-powered spin!
const handleClick = () => {
  isStartled.value = true
  setRotation({ angle: rotationValues.angle + 720 }) // Two full spins

  // Bounce effect
  setScale({ x: 0.7, y: 1.3 })
  setTimeout(() => {
    setScale({ x: 1.2, y: 0.8 })
    setTimeout(() => {
      setScale({ x: 1, y: 1 })
      isStartled.value = false
    }, 150)
  }, 100)
}

// Viewport-based wandering ranges
const viewportWidth = ref(0)
const viewportHeight = ref(0)

const updateViewport = () => {
  viewportWidth.value = window.innerWidth
  viewportHeight.value = window.innerHeight
}

// Main animation loop for base wandering - roams the whole page!
const startWandering = () => {
  startTime = performance.now()
  updateViewport()
  window.addEventListener('resize', updateViewport)

  const animate = () => {
    const elapsed = (performance.now() - startTime) / 1000

    // Wander range: 80% of viewport with padding
    const rangeX = viewportWidth.value * 0.35
    const rangeY = viewportHeight.value * 0.3

    // Base wandering motion (layered sine waves) - full page roaming
    wanderBase.x =
      Math.sin(elapsed * 0.15) * rangeX +
      Math.sin(elapsed * 0.4 + 1) * rangeX * 0.3 +
      Math.sin(elapsed * 0.08 + 2) * rangeX * 0.2

    wanderBase.y =
      Math.sin(elapsed * 0.12 + 0.5) * rangeY +
      Math.sin(elapsed * 0.35 + 1.5) * rangeY * 0.3 +
      Math.sin(elapsed * 0.07 + 3) * rangeY * 0.2

    // Base rotation wobble
    wanderBase.rotation = -8 + Math.sin(elapsed * 0.5) * 12 + Math.sin(elapsed * 0.23 + 1) * 6

    // Animate floating symbols - larger range too
    symbols.value.forEach((sym, i) => {
      const offset = i * 2.1
      sym.x = Math.sin(elapsed * 0.6 + offset) * 60
      sym.y = Math.cos(elapsed * 0.5 + offset) * 45 - 60
      sym.scale = 0.6 + Math.sin(elapsed * 1.2 + offset) * 0.25
      sym.opacity = 0.35 + Math.sin(elapsed * 0.9 + offset) * 0.25
    })

    animationFrame = requestAnimationFrame(animate)
  }

  animate()
}

// Combined transform: base wander + spring flee + spring scale + spring rotation
const blobStyle = computed(() => {
  const totalX = wanderBase.x + fleeValues.x
  const totalY = wanderBase.y + fleeValues.y
  const totalRotation = isStartled.value ? rotationValues.angle : wanderBase.rotation

  return {
    transform: `translate(${totalX}px, ${totalY}px) rotate(${totalRotation}deg) scaleX(${scaleValues.x}) scaleY(${scaleValues.y})`,
  }
})

const goHome = () => {
  router.push('/')
}

onMounted(() => {
  if (isToyEnabled.value) {
    startBlinking()
    startWandering()
    startSymbolCycle()
    startDizzyCheck()
    window.addEventListener('mousemove', handleMouseMove)
  }
})

onUnmounted(() => {
  clearInterval(blinkInterval)
  clearInterval(symbolInterval)
  clearInterval(dizzyInterval)
  cancelAnimationFrame(animationFrame)
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('resize', updateViewport)
})
</script>

<template>
  <div class="not-found">
    <!-- Confused Mascot - fixed position, roams the whole page -->
    <div v-if="isToyEnabled" ref="mascotRef" class="not-found__mascot" @click="handleClick">
      <!-- Floating confusion symbols -->
      <div
        v-for="sym in symbols"
        :key="sym.id"
        class="not-found__symbol"
        :style="{
          transform: `translate(${sym.x}px, ${sym.y}px) scale(${sym.scale})`,
          opacity: sym.opacity,
        }"
      >
        {{ sym.char }}
      </div>

      <div class="not-found__blob" :style="blobStyle">
        <!-- Eyes - normal or dizzy spirals -->
        <div class="not-found__eyes">
          <template v-if="isDizzy">
            <!-- Dizzy spiral eyes -->
            <div class="not-found__eye not-found__eye--dizzy">
              <div class="not-found__spiral">@</div>
            </div>
            <div class="not-found__eye not-found__eye--dizzy">
              <div class="not-found__spiral">@</div>
            </div>
          </template>
          <template v-else>
            <!-- Normal eyes -->
            <div class="not-found__eye" :class="{ 'not-found__eye--blink': isBlinking }">
              <div class="not-found__pupil" :class="{ 'not-found__pupil--scared': mouseNear }" />
            </div>
            <div class="not-found__eye" :class="{ 'not-found__eye--blink': isBlinking }">
              <div class="not-found__pupil" :class="{ 'not-found__pupil--scared': mouseNear }" />
            </div>
          </template>
        </div>
        <!-- Current symbol -->
        <div class="not-found__question">{{ currentSymbol }}</div>
      </div>
    </div>

    <div class="not-found__content">
      <!-- 404 Text -->
      <h1 class="not-found__title" :class="{ 'not-found__title--animated': areAnimationsEnabled }">
        {{ t('404.title') }}
      </h1>

      <h2 class="not-found__heading">{{ t('404.heading') }}</h2>

      <p class="not-found__description">{{ t('404.description') }}</p>

      <BaseButton variant="primary" size="lg" @click="goHome">
        {{ t('404.backHome') }}
      </BaseButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--container-padding);
  background-color: var(--bg-primary);

  &__content {
    text-align: center;
    max-width: 500px;
  }

  &__mascot {
    position: fixed;
    top: 50%;
    left: 50%;
    cursor: pointer;
    user-select: none;
    z-index: 10;
    pointer-events: auto;
  }

  &__symbol {
    position: absolute;
    font-size: 24px;
    font-weight: bold;
    color: var(--accent);
    pointer-events: none;
    z-index: 1;
  }

  &__blob {
    position: relative;
    width: 100px;
    height: 100px;
    background: var(--accent);
    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
    transform-origin: center center;
    will-change: transform;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  }

  &__eyes {
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 14px;
  }

  &__eye {
    width: 20px;
    height: 22px;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: transform 0.1s ease;

    &--blink {
      transform: scaleY(0.1);
    }

    &--dizzy {
      background: white;
    }
  }

  &__pupil {
    width: 10px;
    height: 10px;
    background: #1a1a1a;
    border-radius: 50%;
    transition: all 0.15s ease;

    &--scared {
      width: 12px;
      height: 12px;
      background: #1a1a1a;
    }
  }

  &__spiral {
    font-size: 14px;
    color: #1a1a1a;
    animation: spin 0.5s linear infinite;
    line-height: 1;
  }

  &__question {
    position: absolute;
    top: -25px;
    right: -10px;
    font-size: 24px;
    font-weight: bold;
    color: var(--accent);
    animation: bounce 1s ease-in-out infinite;
    white-space: nowrap;
  }

  &__title {
    font-family: var(--font-display);
    font-size: clamp(6rem, 20vw, 12rem);
    font-weight: 700;
    color: var(--accent);
    line-height: 1;
    margin-bottom: var(--space-md);
    opacity: 0.15;

    &--animated {
      animation: float 4s ease-in-out infinite;
    }
  }

  &__heading {
    font-family: var(--font-display);
    font-size: var(--text-2xl);
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--space-sm);
  }

  &__description {
    font-size: var(--text-base);
    color: var(--text-secondary);
    margin-bottom: var(--space-xl);
    line-height: var(--leading-relaxed);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .not-found {
    &__blob,
    &__title--animated,
    &__question,
    &__spiral {
      animation: none;
    }
  }
}
</style>
