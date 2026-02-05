<script setup lang="ts">
import { useAudio } from '../composables/useAudio'

const emit = defineEmits<{
  (e: 'toggle-settings'): void
}>()

const { globalMuted, toggleMute } = useAudio()
</script>

<template>
  <header class="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-accent-amber/30">
    <div class="flex items-center gap-3">
      <img src="../assets/deadlock_logo_dark.svg" alt="Deadlock" class="h-7 sm:h-9 w-auto" />
      <h1 class="font-heading text-xl sm:text-2xl tracking-wider gradient-accent-text">
        TIMER
      </h1>
    </div>
    <div class="flex items-center gap-2 sm:gap-3">
      <button
        @click="toggleMute"
        class="px-3 py-1.5 rounded-lg bg-bg-surface hover:bg-bg-surface-hover text-text-secondary hover:text-text-primary transition-all duration-200 text-sm flex items-center gap-1.5"
        :title="globalMuted ? 'Unmute sounds' : 'Mute sounds'"
      >
        <span class="text-base">{{ globalMuted ? '🔇' : '🔊' }}</span>
        <span class="hidden sm:inline">{{ globalMuted ? 'Muted' : 'Sound' }}</span>
      </button>
      <button
        @click="emit('toggle-settings')"
        class="px-3 py-1.5 rounded-lg bg-bg-surface hover:bg-bg-surface-hover text-text-secondary hover:text-text-primary transition-all duration-200 text-sm flex items-center gap-1.5"
        title="Settings"
      >
        <span class="text-base">⚙</span>
        <span class="hidden sm:inline">Settings</span>
      </button>
    </div>
  </header>
</template>
