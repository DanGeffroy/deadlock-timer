<script setup lang="ts">
import { computed } from 'vue'
import { useGameEvents } from '../composables/useGameEvents'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { eventLog } = useGameEvents()

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
