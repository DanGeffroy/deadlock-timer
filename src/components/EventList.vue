<script setup lang="ts">
import { ref } from 'vue'
import { useGameEvents } from '../composables/useGameEvents'
import EventCard from './EventCard.vue'

const { events, markCleared, toggleEventSound } = useGameEvents()
const compactMode = ref(false)
</script>

<template>
  <section class="px-4 sm:px-6 pb-6">
    <!-- Section header -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="font-heading text-lg font-semibold text-accent-gold tracking-wide uppercase">
        Events
      </h2>
      <button
        @click="compactMode = !compactMode"
        class="px-3 py-1 rounded-lg bg-bg-surface hover:bg-bg-surface-hover text-text-secondary text-xs transition-colors border border-accent-amber/20"
      >
        {{ compactMode ? '🔳 Full' : '📋 Compact' }}
      </button>
    </div>

    <!-- Event cards -->
    <div
      :class="compactMode ? 'flex flex-col gap-1' : 'grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4'"
    >
      <EventCard
        v-for="event in events"
        :key="event.definition.id"
        :event="event"
        :compact="compactMode"
        @mark-cleared="markCleared"
        @toggle-sound="toggleEventSound"
      />
    </div>
  </section>
</template>
