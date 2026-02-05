import { ref, readonly, type Ref } from 'vue'

const globalMuted: Ref<boolean> = ref(false)

// Restore mute state from localStorage
const savedMuted = localStorage.getItem('deadlock-timer-muted')
if (savedMuted !== null) {
  globalMuted.value = savedMuted === 'true'
}

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

function toggleMute(): void {
  globalMuted.value = !globalMuted.value
  localStorage.setItem('deadlock-timer-muted', String(globalMuted.value))
}

function setMuted(muted: boolean): void {
  globalMuted.value = muted
  localStorage.setItem('deadlock-timer-muted', String(globalMuted.value))
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.3
): void {
  if (globalMuted.value) return
  try {
    const ctx = getAudioContext()
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()
    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)
    oscillator.connect(gain)
    gain.connect(ctx.destination)
    oscillator.start()
    oscillator.stop(ctx.currentTime + duration)
  } catch {
    // Audio context not available
  }
}

function playNormalSpawn(): void {
  if (globalMuted.value) return
  playTone(600, 0.15, 'sine', 0.3)
  setTimeout(() => playTone(900, 0.15, 'sine', 0.3), 100)
}

function playMajorEvent(): void {
  if (globalMuted.value) return
  playTone(600, 0.2, 'sine', 0.35)
  setTimeout(() => playTone(900, 0.2, 'sine', 0.35), 150)
}

function playCriticalEvent(): void {
  if (globalMuted.value) return
  playTone(200, 0.4, 'sawtooth', 0.2)
  setTimeout(() => playTone(800, 0.25, 'sine', 0.35), 200)
}

function playWarning10(): void {
  if (globalMuted.value) return
  playTone(1000, 0.05, 'sine', 0.15)
}

function playWarning30(): void {
  if (globalMuted.value) return
  playTone(800, 0.03, 'sine', 0.1)
}

export function useAudio() {
  return {
    globalMuted: readonly(globalMuted) as Readonly<Ref<boolean>>,
    toggleMute,
    setMuted,
    playNormalSpawn,
    playMajorEvent,
    playCriticalEvent,
    playWarning10,
    playWarning30,
  }
}
