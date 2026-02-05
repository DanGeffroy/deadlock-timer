import { ref, computed, watch, type Ref, type ComputedRef } from 'vue'
import type { GameEventDefinition, GameEventState, EventStatus, LogEntry } from '../types'
import { useMatchTimer } from './useMatchTimer'
import { useAudio } from './useAudio'

const EVENT_DEFINITIONS: GameEventDefinition[] = [
  {
    id: 'easy-camps',
    name: 'Easy Camps',
    icon: '🟢',
    description: '4 small Denizen camps spawn in the jungle',
    firstSpawn: 2 * 60,
    type: 'one-time-spawn',
    priority: 'low',
  },
  {
    id: 'crates-statues',
    name: 'Crates & Golden Statues',
    icon: '📦',
    description: 'Breakable crates (souls) and Tier 1 Golden Statues (stat buffs)',
    firstSpawn: 2 * 60,
    type: 'one-time-spawn',
    priority: 'low',
  },
  {
    id: 'powerups',
    name: 'Powerups',
    icon: '⚡',
    description: '2 powerup locations spawn simultaneously',
    firstSpawn: 5 * 60,
    interval: 5 * 60,
    type: 'auto-recurring',
    priority: 'high',
  },
  {
    id: 'medium-camps',
    name: 'Medium Camps',
    icon: '🟡',
    description: '22 medium Denizen camps spawn',
    firstSpawn: 6 * 60,
    respawnTime: 4 * 60 + 50,
    type: 'manual-respawn',
    priority: 'medium',
  },
  {
    id: 'hard-camps',
    name: 'Hard Camps',
    icon: '🔴',
    description: '12 hard Denizen camps spawn',
    firstSpawn: 8 * 60,
    respawnTime: 5 * 60 + 35,
    type: 'manual-respawn',
    priority: 'medium',
  },
  {
    id: 'vault-camps',
    name: 'Vault Camps',
    icon: '🔒',
    description: "Sinner's Sacrifice machines — 10 locations",
    firstSpawn: 8 * 60,
    respawnTime: 5 * 60,
    type: 'manual-respawn',
    priority: 'medium',
  },
  {
    id: 'soul-urn',
    name: 'Soul Urn',
    icon: '🏺',
    description: 'Descends from the sky, grants souls to the team',
    firstSpawn: 10 * 60,
    interval: 5 * 60,
    type: 'auto-recurring',
    priority: 'high',
  },
  {
    id: 'mid-boss',
    name: 'Mid-Boss',
    icon: '💀',
    description: 'Drops Rejuvenator crystal — 4min team buff',
    firstSpawn: 10 * 60,
    respawnTimes: [7 * 60, 6 * 60, 5 * 60],
    type: 'manual-respawn',
    priority: 'critical',
  },
  {
    id: 'golden-statues-t2',
    name: 'Golden Statues Tier 2',
    icon: '🗿',
    description: 'Statues upgrade — better stat buffs',
    firstSpawn: 10 * 60,
    type: 'milestone',
    priority: 'medium',
  },
  {
    id: 'golden-statues-t3',
    name: 'Golden Statues Tier 3',
    icon: '🗿',
    description: 'Statues upgrade — best stat buffs',
    firstSpawn: 30 * 60,
    type: 'milestone',
    priority: 'medium',
  },
]

// Restore per-event sound toggles from localStorage
function loadSoundToggles(): Record<string, boolean> {
  try {
    const saved = localStorage.getItem('deadlock-timer-sound-toggles')
    return saved ? JSON.parse(saved) : {}
  } catch {
    return {}
  }
}

function saveSoundToggles(toggles: Record<string, boolean>): void {
  localStorage.setItem('deadlock-timer-sound-toggles', JSON.stringify(toggles))
}

const eventStates: Ref<GameEventState[]> = ref([])
const eventLog: Ref<LogEntry[]> = ref([])

function initializeEvents(): void {
  const soundToggles = loadSoundToggles()
  eventStates.value = EVENT_DEFINITIONS.map((def) => ({
    definition: def,
    status: 'upcoming' as EventStatus,
    countdown: def.firstSpawn,
    nextSpawnTime: def.firstSpawn,
    killCount: 0,
    soundEnabled: soundToggles[def.id] !== false,
    hasPlayedWarning30: false,
    hasPlayedWarning10: false,
    hasPlayedSpawn: false,
  }))
  eventLog.value = []
}

function addLogEntry(time: number, message: string, icon: string): void {
  eventLog.value.unshift({ time, message, icon })
  // Keep last 50 entries
  if (eventLog.value.length > 50) {
    eventLog.value = eventLog.value.slice(0, 50)
  }
}

function markCleared(eventId: string): void {
  const { elapsed } = useMatchTimer()
  const state = eventStates.value.find((s) => s.definition.id === eventId)
  if (!state) return

  const def = state.definition
  if (def.type !== 'manual-respawn') return

  state.killCount++

  let respawnDuration: number
  if (def.respawnTimes) {
    const idx = Math.min(state.killCount - 1, def.respawnTimes.length - 1)
    respawnDuration = def.respawnTimes[idx]
  } else if (def.respawnTime) {
    respawnDuration = def.respawnTime
  } else {
    return
  }

  state.status = 'respawning'
  state.nextSpawnTime = elapsed.value + respawnDuration
  state.countdown = respawnDuration
  state.hasPlayedWarning30 = false
  state.hasPlayedWarning10 = false
  state.hasPlayedSpawn = false

  addLogEntry(elapsed.value, `${def.name} cleared/killed (#${state.killCount})`, def.icon)
}

function toggleEventSound(eventId: string): void {
  const state = eventStates.value.find((s) => s.definition.id === eventId)
  if (!state) return
  state.soundEnabled = !state.soundEnabled
  const toggles = loadSoundToggles()
  toggles[eventId] = state.soundEnabled
  saveSoundToggles(toggles)
}

function updateEvents(elapsedSeconds: number): void {
  const audio = useAudio()

  for (const state of eventStates.value) {
    const def = state.definition

    if (def.type === 'milestone') {
      if (state.status === 'completed') continue
      const remaining = def.firstSpawn - elapsedSeconds
      state.countdown = Math.max(0, remaining)

      if (remaining <= 0) {
        if (!state.hasPlayedSpawn) {
          state.status = 'active'
          state.hasPlayedSpawn = true
          if (state.soundEnabled) audio.playMajorEvent()
          addLogEntry(elapsedSeconds, `${def.name} reached!`, def.icon)
          // Mark completed after brief active state
          setTimeout(() => {
            state.status = 'completed'
          }, 3000)
        }
      } else {
        state.status = 'upcoming'
        handleWarnings(state, remaining, audio)
      }
      continue
    }

    if (def.type === 'one-time-spawn') {
      if (state.status === 'completed') continue
      const remaining = def.firstSpawn - elapsedSeconds
      state.countdown = Math.max(0, remaining)

      if (remaining <= 0) {
        if (!state.hasPlayedSpawn) {
          state.status = 'active'
          state.hasPlayedSpawn = true
          if (state.soundEnabled) audio.playNormalSpawn()
          addLogEntry(elapsedSeconds, `${def.name} spawned!`, def.icon)
          setTimeout(() => {
            state.status = 'completed'
          }, 3000)
        }
      } else {
        state.status = 'upcoming'
        handleWarnings(state, remaining, audio)
      }
      continue
    }

    if (def.type === 'auto-recurring') {
      const interval = def.interval!
      const firstSpawn = def.firstSpawn

      if (elapsedSeconds < firstSpawn) {
        // Before first spawn
        state.status = 'upcoming'
        state.countdown = Math.max(0, firstSpawn - elapsedSeconds)
        state.nextSpawnTime = firstSpawn
        handleWarnings(state, state.countdown, audio)
      } else {
        // Calculate next occurrence
        const timeSinceFirst = elapsedSeconds - firstSpawn
        const cyclesPassed = Math.floor(timeSinceFirst / interval)
        const nextOccurrence = firstSpawn + (cyclesPassed + 1) * interval
        const remaining = nextOccurrence - elapsedSeconds

        // Check if we just passed a spawn point (within 0.5s)
        const timeSinceLastSpawn = timeSinceFirst - cyclesPassed * interval
        if (timeSinceLastSpawn < 0.5 && !state.hasPlayedSpawn) {
          state.status = 'active'
          state.hasPlayedSpawn = true
          if (state.soundEnabled) {
            if (def.priority === 'high' || def.priority === 'critical') {
              audio.playCriticalEvent()
            } else {
              audio.playMajorEvent()
            }
          }
          addLogEntry(elapsedSeconds, `${def.name} spawned!`, def.icon)
          setTimeout(() => {
            state.status = 'respawning'
          }, 2000)
        } else if (timeSinceLastSpawn >= 0.5) {
          state.status = 'respawning'
          state.hasPlayedSpawn = false
        }

        state.countdown = Math.max(0, remaining)
        state.nextSpawnTime = nextOccurrence

        // Reset warning flags when countdown resets
        if (remaining > 30) {
          state.hasPlayedWarning30 = false
          state.hasPlayedWarning10 = false
        }
        handleWarnings(state, remaining, audio)
      }
      continue
    }

    if (def.type === 'manual-respawn') {
      if (state.status === 'upcoming') {
        // Before first spawn
        const remaining = def.firstSpawn - elapsedSeconds
        state.countdown = Math.max(0, remaining)

        if (remaining <= 0) {
          if (!state.hasPlayedSpawn) {
            state.hasPlayedSpawn = true
            if (state.soundEnabled) {
              if (def.priority === 'critical') {
                audio.playCriticalEvent()
              } else {
                audio.playMajorEvent()
              }
            }
            addLogEntry(elapsedSeconds, `${def.name} spawned!`, def.icon)
          }
          state.status = 'available'
          state.countdown = 0
        } else {
          handleWarnings(state, remaining, audio)
        }
      } else if (state.status === 'respawning') {
        const remaining = state.nextSpawnTime - elapsedSeconds
        state.countdown = Math.max(0, remaining)

        if (remaining <= 0) {
          if (!state.hasPlayedSpawn) {
            state.hasPlayedSpawn = true
            if (state.soundEnabled) {
              if (def.priority === 'critical') {
                audio.playCriticalEvent()
              } else {
                audio.playMajorEvent()
              }
            }
            addLogEntry(elapsedSeconds, `${def.name} respawned!`, def.icon)
          }
          state.status = 'available'
          state.countdown = 0
        } else {
          handleWarnings(state, remaining, audio)
        }
      }
      // 'available' status: no countdown, waiting for player to clear
      continue
    }
  }
}

function handleWarnings(
  state: GameEventState,
  remaining: number,
  audio: ReturnType<typeof useAudio>
): void {
  if (!state.soundEnabled) return
  if (remaining <= 10 && remaining > 9 && !state.hasPlayedWarning10) {
    state.hasPlayedWarning10 = true
    audio.playWarning10()
  }
  if (remaining <= 30 && remaining > 29 && !state.hasPlayedWarning30) {
    state.hasPlayedWarning30 = true
    audio.playWarning30()
  }
}

const sortedEvents: ComputedRef<GameEventState[]> = computed(() => {
  return [...eventStates.value].sort((a, b) => {
    // Completed events go to the end
    if (a.status === 'completed' && b.status !== 'completed') return 1
    if (b.status === 'completed' && a.status !== 'completed') return -1

    // Active events first
    if (a.status === 'active' && b.status !== 'active') return -1
    if (b.status === 'active' && a.status !== 'active') return 1

    // Then sort by countdown
    return a.countdown - b.countdown
  })
})

export function useGameEvents() {
  const { elapsed, isRunning } = useMatchTimer()

  // Watch elapsed time and update events
  watch(
    elapsed,
    (newElapsed) => {
      if (isRunning.value) {
        updateEvents(newElapsed)
      }
    },
    { flush: 'sync' }
  )

  return {
    events: sortedEvents,
    eventLog,
    initializeEvents,
    markCleared,
    toggleEventSound,
  }
}
