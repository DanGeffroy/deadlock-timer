import { ref, readonly, type Ref } from 'vue'

const elapsed: Ref<number> = ref(0)
const isRunning: Ref<boolean> = ref(false)
const isPaused: Ref<boolean> = ref(false)

let startTimestamp: number = 0
let pausedElapsed: number = 0
let animationFrameId: number = 0

function tick(): void {
  if (!isRunning.value || isPaused.value) return
  const now = performance.now()
  elapsed.value = pausedElapsed + (now - startTimestamp) / 1000
  animationFrameId = requestAnimationFrame(tick)
}

function start(): void {
  if (isRunning.value && !isPaused.value) return

  if (isPaused.value) {
    // Resume
    isPaused.value = false
    startTimestamp = performance.now()
    animationFrameId = requestAnimationFrame(tick)
    return
  }

  // Fresh start
  elapsed.value = 0
  pausedElapsed = 0
  isRunning.value = true
  isPaused.value = false
  startTimestamp = performance.now()
  animationFrameId = requestAnimationFrame(tick)
}

function pause(): void {
  if (!isRunning.value || isPaused.value) return
  isPaused.value = true
  pausedElapsed = elapsed.value
  cancelAnimationFrame(animationFrameId)
}

function resume(): void {
  if (!isRunning.value || !isPaused.value) return
  isPaused.value = false
  startTimestamp = performance.now()
  animationFrameId = requestAnimationFrame(tick)
}

function setTime(seconds: number): void {
  const clamped = Math.max(0, seconds)
  elapsed.value = clamped
  pausedElapsed = clamped
  if (isRunning.value && !isPaused.value) {
    startTimestamp = performance.now()
  }
}

function reset(): void {
  cancelAnimationFrame(animationFrameId)
  elapsed.value = 0
  pausedElapsed = 0
  isRunning.value = false
  isPaused.value = false
}

export function useMatchTimer() {
  return {
    elapsed: readonly(elapsed) as Readonly<Ref<number>>,
    isRunning: readonly(isRunning) as Readonly<Ref<boolean>>,
    isPaused: readonly(isPaused) as Readonly<Ref<boolean>>,
    start,
    pause,
    resume,
    reset,
    setTime,
  }
}
