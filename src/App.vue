<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import AppHeader from './components/AppHeader.vue'
import MatchTimer from './components/MatchTimer.vue'
import MiniMap from './components/MiniMap.vue'
import MapLegend from './components/MapLegend.vue'
import EventList from './components/EventList.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import { useMatchTimer } from './composables/useMatchTimer'
import { useGameEvents } from './composables/useGameEvents'
import { useAudio } from './composables/useAudio'

const settingsVisible = ref(false)

const { isRunning, isPaused, start, pause, resume, reset } = useMatchTimer()
const { initializeEvents } = useGameEvents()
const { toggleMute } = useAudio()

function handleKeydown(e: KeyboardEvent): void {
  // Ignore if user is typing in an input
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

  switch (e.code) {
    case 'Space':
      e.preventDefault()
      if (!isRunning.value) {
        initializeEvents()
        start()
      } else if (isPaused.value) {
        resume()
      } else {
        pause()
      }
      break
    case 'KeyR':
      if (!e.ctrlKey && !e.metaKey) {
        reset()
        initializeEvents()
      }
      break
    case 'KeyM':
      toggleMute()
      break
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  initializeEvents()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="min-h-screen text-text-primary font-sans">
    <div class="max-w-7xl mx-auto">
      <AppHeader @toggle-settings="settingsVisible = !settingsVisible" />

      <!-- Desktop: 2-column grid. Mobile: stacked -->
      <div class="px-4 sm:px-6">
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-x-6 gap-y-4 pb-4">
          <!-- Row 1 left: Timer -->
          <div class="flex items-center justify-center">
            <MatchTimer />
          </div>
          <!-- Row 1+2 right: Minimap (spans 2 rows on desktop) -->
          <div class="lg:row-span-2">
            <MiniMap />
          </div>
          <!-- Row 2 left: Map Legend -->
          <MapLegend />
        </div>
      </div>

      <div class="border-t border-accent-amber/10 mx-4 sm:mx-6" />
      <EventList />
    </div>
    <SettingsPanel
      :visible="settingsVisible"
      @close="settingsVisible = false"
    />

    <footer class="text-center text-text-secondary text-xs py-4 mt-8 border-t border-accent-amber/10 mx-4 sm:mx-6 flex items-center justify-center gap-1.5">
      <span>Made with ❤️ by Dan '<span class="text-accent-gold">adNNNNj</span>' GEFFROY</span>
      <a href="https://github.com/DanGeffroy" target="_blank" rel="noopener noreferrer" class="inline-flex text-text-secondary hover:text-accent-gold transition-colors">
        <img src="./assets/github-logo.svg" alt="GitHub" class="w-4 h-4 invert opacity-60 hover:opacity-100 transition-opacity" />
      </a>
    </footer>
  </div>
</template>
