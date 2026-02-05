<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useGameEvents } from '../composables/useGameEvents'
import { useMatchTimer } from '../composables/useMatchTimer'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { eventLog, initializeEventsAtTime } = useGameEvents()
const { elapsed, isRunning, setTime, start, pause } = useMatchTimer()

// Timer setter state
const setMinutes = ref(0)
const setSeconds = ref(0)

// Sync inputs with current elapsed when panel opens
watch(() => props.visible, (vis) => {
  if (vis) {
    const total = Math.floor(elapsed.value)
    setMinutes.value = Math.floor(total / 60)
    setSeconds.value = total % 60
  }
})

function applyTime(): void {
  const targetSeconds = setMinutes.value * 60 + setSeconds.value
  const wasRunning = isRunning.value

  // If not running, start paused so setTime works on a running timer
  if (!wasRunning) {
    start()
    pause()
  }

  setTime(targetSeconds)
  initializeEventsAtTime(targetSeconds)

  // If it wasn't running before, keep it paused
  if (!wasRunning) {
    // Already paused from above
  }
}

function clampMinutes(e: Event): void {
  const input = e.target as HTMLInputElement
  let val = parseInt(input.value) || 0
  if (val < 0) val = 0
  if (val > 99) val = 99
  setMinutes.value = val
}

function clampSeconds(e: Event): void {
  const input = e.target as HTMLInputElement
  let val = parseInt(input.value) || 0
  if (val < 0) val = 0
  if (val > 59) val = 59
  setSeconds.value = val
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const displayLog = computed(() => eventLog.value.slice(0, 30))
</script>

<template>
  <!-- Overlay -->
  <Transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-0 bg-black/60 z-40"
      @click="emit('close')"
    />
  </Transition>

  <!-- Panel -->
  <Transition name="slide">
    <aside
      v-if="visible"
      class="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-bg-surface border-l border-accent-amber/30 z-50 overflow-y-auto"
    >
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="font-heading text-lg font-semibold text-accent-gold tracking-wide uppercase">
            Settings & Log
          </h2>
          <button
            @click="emit('close')"
            class="px-3 py-1.5 rounded-lg bg-bg-primary hover:bg-bg-surface-hover text-text-secondary text-sm transition-colors"
          >
            ✕ Close
          </button>
        </div>

        <!-- Set Timer -->
        <div class="mb-6">
          <h3 class="font-heading text-sm font-semibold text-text-primary mb-3 uppercase tracking-wider">
            Set Timer
          </h3>
          <div class="flex items-end gap-2">
            <div class="flex-1">
              <label class="block text-xs text-text-secondary mb-1">Minutes</label>
              <input
                type="number"
                :value="setMinutes"
                @input="clampMinutes"
                min="0"
                max="99"
                class="w-full px-3 py-2 rounded-lg bg-bg-primary border border-accent-amber/20 text-text-primary text-sm tabular-nums focus:outline-none focus:border-accent-amber/60 transition-colors"
              />
            </div>
            <span class="text-text-secondary text-lg font-bold pb-2">:</span>
            <div class="flex-1">
              <label class="block text-xs text-text-secondary mb-1">Seconds</label>
              <input
                type="number"
                :value="setSeconds"
                @input="clampSeconds"
                min="0"
                max="59"
                class="w-full px-3 py-2 rounded-lg bg-bg-primary border border-accent-amber/20 text-text-primary text-sm tabular-nums focus:outline-none focus:border-accent-amber/60 transition-colors"
              />
            </div>
            <button
              @click="applyTime"
              class="px-4 py-2 rounded-lg gradient-accent text-bg-primary font-semibold text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Set
            </button>
          </div>
          <p class="text-text-secondary text-xs mt-2 italic">
            Sets the match timer and updates all events accordingly.
          </p>
        </div>

        <!-- Keyboard Shortcuts -->
        <div class="mb-6">
          <h3 class="font-heading text-sm font-semibold text-text-primary mb-3 uppercase tracking-wider">
            Keyboard Shortcuts
          </h3>
          <div class="space-y-2 text-sm text-text-secondary">
            <div class="flex justify-between">
              <span>Start / Pause</span>
              <kbd class="px-2 py-0.5 rounded bg-bg-primary text-text-secondary text-xs border border-accent-amber/20">Space</kbd>
            </div>
            <div class="flex justify-between">
              <span>Reset</span>
              <kbd class="px-2 py-0.5 rounded bg-bg-primary text-text-secondary text-xs border border-accent-amber/20">R</kbd>
            </div>
            <div class="flex justify-between">
              <span>Mute / Unmute</span>
              <kbd class="px-2 py-0.5 rounded bg-bg-primary text-text-secondary text-xs border border-accent-amber/20">M</kbd>
            </div>
          </div>
        </div>

        <!-- Event Log -->
        <div>
          <h3 class="font-heading text-sm font-semibold text-text-primary mb-3 uppercase tracking-wider">
            Event Log
          </h3>
          <div
            v-if="displayLog.length === 0"
            class="text-text-secondary text-sm italic"
          >
            No events yet. Start the timer to begin tracking.
          </div>
          <div v-else class="space-y-1.5 max-h-96 overflow-y-auto">
            <div
              v-for="(entry, i) in displayLog"
              :key="i"
              class="flex items-center gap-2 text-sm px-2 py-1.5 rounded bg-bg-primary/50"
            >
              <span class="text-base flex-shrink-0">{{ entry.icon }}</span>
              <span class="text-accent-gold tabular-nums text-xs flex-shrink-0">
                {{ formatTime(entry.time) }}
              </span>
              <span class="text-text-secondary truncate">{{ entry.message }}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
