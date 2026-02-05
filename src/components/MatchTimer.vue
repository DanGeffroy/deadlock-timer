<script setup lang="ts">
import { computed } from 'vue'
import { useMatchTimer } from '../composables/useMatchTimer'
import { useGameEvents } from '../composables/useGameEvents'

const { elapsed, isRunning, isPaused, start, pause, resume, reset } = useMatchTimer()
const { initializeEvents } = useGameEvents()

const displayTime = computed(() => {
  const totalSeconds = Math.floor(elapsed.value)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`
})

function handleStart(): void {
  initializeEvents()
  start()
}

function handleReset(): void {
  reset()
  initializeEvents()
}
</script>

<template>
  <section class="flex flex-col items-center py-6 sm:py-10">
    <!-- Timer Display -->
    <div class="relative mb-6 sm:mb-8">
      <div
        class="font-heading text-6xl sm:text-7xl md:text-8xl font-bold tracking-widest text-text-primary tabular-nums"
        :class="{
          'opacity-50': !isRunning,
          'animate-pulse': isPaused,
        }"
      >
        {{ displayTime }}
      </div>
      <div
        v-if="isRunning && !isPaused"
        class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-0.5 gradient-accent rounded-full"
      />
    </div>

    <!-- Controls -->
    <div class="flex items-center gap-3">
      <!-- Start / Resume -->
      <button
        v-if="!isRunning"
        @click="handleStart"
        class="px-6 py-2.5 rounded-lg gradient-accent text-bg-primary font-semibold text-sm sm:text-base hover:opacity-90 transition-opacity duration-200 flex items-center gap-2"
      >
        <span>▶</span> Start
      </button>

      <button
        v-if="isRunning && isPaused"
        @click="resume"
        class="px-6 py-2.5 rounded-lg gradient-accent text-bg-primary font-semibold text-sm sm:text-base hover:opacity-90 transition-opacity duration-200 flex items-center gap-2"
      >
        <span>▶</span> Resume
      </button>

      <!-- Pause -->
      <button
        v-if="isRunning && !isPaused"
        @click="pause"
        class="px-6 py-2.5 rounded-lg bg-bg-surface border border-accent-amber/40 text-text-primary font-semibold text-sm sm:text-base hover:bg-bg-surface-hover transition-all duration-200 flex items-center gap-2"
      >
        <span>⏸</span> Pause
      </button>

      <!-- Reset -->
      <button
        v-if="isRunning"
        @click="handleReset"
        class="px-6 py-2.5 rounded-lg bg-bg-surface border border-danger/40 text-danger font-semibold text-sm sm:text-base hover:bg-danger/10 transition-all duration-200 flex items-center gap-2"
      >
        <span>↻</span> Reset
      </button>
    </div>

    <!-- Keyboard hints -->
    <p class="mt-4 text-text-secondary text-xs tracking-wide">
      <span class="hidden sm:inline">
        <kbd class="px-1.5 py-0.5 rounded bg-bg-surface text-text-secondary text-xs border border-accent-amber/20">Space</kbd> Start/Pause
        <span class="mx-2 text-accent-amber/40">·</span>
        <kbd class="px-1.5 py-0.5 rounded bg-bg-surface text-text-secondary text-xs border border-accent-amber/20">R</kbd> Reset
        <span class="mx-2 text-accent-amber/40">·</span>
        <kbd class="px-1.5 py-0.5 rounded bg-bg-surface text-text-secondary text-xs border border-accent-amber/20">M</kbd> Mute
      </span>
    </p>
  </section>
</template>
