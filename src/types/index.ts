export type EventType = 'auto-recurring' | 'one-time-spawn' | 'milestone' | 'manual-respawn'
export type EventPriority = 'low' | 'medium' | 'high' | 'critical'
export type EventStatus = 'upcoming' | 'active' | 'respawning' | 'completed' | 'available'

export interface GameEventDefinition {
  id: string
  name: string
  icon: string
  iconImage?: string
  description: string
  firstSpawn: number // seconds
  interval?: number // seconds, for auto-recurring
  respawnTime?: number // seconds, for manual-respawn (fixed)
  respawnTimes?: number[] // seconds, for manual-respawn (decreasing)
  type: EventType
  priority: EventPriority
}

export interface GameEventState {
  definition: GameEventDefinition
  status: EventStatus
  countdown: number // seconds remaining until next occurrence
  nextSpawnTime: number // absolute match time (seconds) of next occurrence
  killCount: number // for manual-respawn events with decreasing timers
  soundEnabled: boolean
  hasPlayedWarning30: boolean
  hasPlayedWarning10: boolean
  hasPlayedSpawn: boolean
}

export interface TimerState {
  elapsed: number // seconds elapsed
  isRunning: boolean
  isPaused: boolean
}

export interface AudioConfig {
  globalMuted: boolean
}

export interface LogEntry {
  time: number // match time in seconds
  message: string
  icon: string
}
