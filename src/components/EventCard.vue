<script setup lang="ts">
import { computed } from 'vue'
import type { GameEventState } from '../types'
import bgTexture from '../assets/bg_texture.jpg'

const props = defineProps<{
  event: GameEventState
  compact: boolean
}>()

const emit = defineEmits<{
  (e: 'mark-cleared', id: string): void
  (e: 'toggle-sound', id: string): void
}>()

const countdownDisplay = computed(() => {
  const seconds = Math.max(0, Math.floor(props.event.countdown))
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

const statusLabel = computed(() => {
  switch (props.event.status) {
    case 'upcoming':
      return '⏳ Upcoming'
    case 'active':
      return '🟢 Active'
    case 'respawning':
      return '🔄 Respawning'
    case 'completed':
      return '✅ Completed'
    case 'available':
      return '⚔ Available'
    default:
      return ''
  }
})

const urgencyClass = computed(() => {
  if (props.event.status === 'completed') return ''
  if (props.event.status === 'available') return 'glow-gold'
  if (props.event.status === 'active') return 'glow-gold'

  const cd = props.event.countdown
  if (cd <= 10 && cd > 0) return 'animate-pulse-danger border-danger/60'
  if (cd <= 30 && cd > 0) return 'animate-pulse-warning border-warning/60'
  return ''
})

const borderClass = computed(() => {
  if (props.event.status === 'completed') return 'border-text-secondary/20 opacity-50'
  if (props.event.status === 'active') return 'border-accent-gold/60'
  if (props.event.status === 'available') return 'border-success/50'
  return 'border-accent-amber/20'
})

const randomOffset = {
  x: Math.floor(Math.random() * 1000),
  y: Math.floor(Math.random() * 1000),
}

const cardBgStyle = computed(() => ({
  backgroundImage: `url(${bgTexture})`,
  backgroundRepeat: 'repeat',
  backgroundSize: '400px',
  backgroundPosition: `${randomOffset.x}px ${randomOffset.y}px`,
}))

const showClearButton = computed(() => {
  return (
    props.event.definition.type === 'manual-respawn' && props.event.status === 'available'
  )
})

const countdownLabel = computed(() => {
  if (props.event.status === 'completed') return 'Done'
  if (props.event.status === 'available') return 'Available now'
  if (props.event.status === 'active') return 'Just spawned!'
  if (props.event.status === 'upcoming') return `Spawns in: ${countdownDisplay.value}`
  return `Next in: ${countdownDisplay.value}`
})

const priorityIndicator = computed(() => {
  switch (props.event.definition.priority) {
    case 'critical':
      return 'bg-danger/20 text-danger'
    case 'high':
      return 'bg-accent-gold/20 text-accent-gold'
    case 'medium':
      return 'bg-accent-amber/20 text-accent-amber'
    default:
      return 'bg-text-secondary/20 text-text-secondary'
  }
})
</script>

<template>
  <!-- Compact mode -->
  <div
    v-if="compact"
    class="flex items-center gap-3 px-3 py-2 rounded-lg bg-bg-surface border transition-all duration-300"
    :class="[borderClass, urgencyClass]"
    :style="cardBgStyle"
  >
    <span class="text-lg flex-shrink-0">{{ event.definition.icon }}</span>
    <span class="font-semibold text-sm flex-shrink-0 min-w-[120px]">{{ event.definition.name }}</span>
    <span class="text-xs px-2 py-0.5 rounded-full" :class="priorityIndicator">
      {{ event.definition.priority }}
    </span>
    <span class="text-text-secondary text-sm flex-1 text-right tabular-nums">
      {{ countdownLabel }}
    </span>
    <button
      v-if="showClearButton"
      @click="emit('mark-cleared', event.definition.id)"
      class="px-2 py-0.5 rounded text-xs bg-success/20 text-success hover:bg-success/30 transition-colors flex-shrink-0"
    >
      Cleared
    </button>
    <button
      @click="emit('toggle-sound', event.definition.id)"
      class="text-sm flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
      :title="event.soundEnabled ? 'Mute this event' : 'Unmute this event'"
    >
      {{ event.soundEnabled ? '🔔' : '🔕' }}
    </button>
  </div>

  <!-- Full card mode -->
  <div
    v-else
    class="rounded-lg bg-bg-surface border p-4 transition-all duration-300 hover:bg-bg-surface-hover"
    :class="[borderClass, urgencyClass]"
    :style="cardBgStyle"
  >
    <!-- Header row -->
    <div class="flex items-start justify-between mb-2">
      <div class="flex items-center gap-2">
        <span class="text-2xl">{{ event.definition.icon }}</span>
        <div>
          <h3 class="font-heading font-semibold text-sm sm:text-base text-text-primary tracking-wide uppercase">
            {{ event.definition.name }}
          </h3>
          <p class="text-text-secondary text-xs mt-0.5 hidden sm:block">{{ event.definition.description }}</p>
        </div>
      </div>
      <span class="text-xs px-2 py-0.5 rounded-full flex-shrink-0" :class="priorityIndicator">
        {{ event.definition.priority }}
      </span>
    </div>

    <!-- Countdown -->
    <div class="mt-3">
      <div class="flex items-center justify-between">
        <span class="text-text-secondary text-xs uppercase tracking-wider">{{ statusLabel }}</span>
        <span
          class="font-heading text-xl sm:text-2xl font-bold tabular-nums"
          :class="{
            'text-danger': event.countdown <= 10 && event.countdown > 0,
            'text-warning': event.countdown <= 30 && event.countdown > 10,
            'text-success': event.status === 'active' || event.status === 'available',
            'text-text-primary': event.countdown > 30,
            'text-text-secondary': event.status === 'completed',
          }"
        >
          {{ countdownLabel }}
        </span>
      </div>

      <!-- Progress bar for countdown -->
      <div
        v-if="event.status !== 'completed' && event.status !== 'available' && event.countdown > 0"
        class="mt-2 h-1 rounded-full bg-bg-primary overflow-hidden"
      >
        <div
          class="h-full rounded-full transition-all duration-1000 ease-linear"
          :class="{
            'bg-danger': event.countdown <= 10,
            'bg-warning': event.countdown <= 30 && event.countdown > 10,
            'gradient-accent': event.countdown > 30,
          }"
          :style="{
            width: `${Math.max(0, Math.min(100, (1 - event.countdown / (event.definition.interval || event.definition.respawnTime || event.definition.firstSpawn)) * 100))}%`,
          }"
        />
      </div>
    </div>

    <!-- Actions -->
    <div class="mt-3 flex items-center justify-between">
      <button
        v-if="showClearButton"
        @click="emit('mark-cleared', event.definition.id)"
        class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-success/20 text-success hover:bg-success/30 transition-colors border border-success/30"
      >
        Mark Cleared / Killed
      </button>
      <div v-else />

      <button
        @click="emit('toggle-sound', event.definition.id)"
        class="text-base opacity-60 hover:opacity-100 transition-opacity"
        :title="event.soundEnabled ? 'Mute this event' : 'Unmute this event'"
      >
        {{ event.soundEnabled ? '🔔' : '🔕' }}
      </button>
    </div>
  </div>
</template>
