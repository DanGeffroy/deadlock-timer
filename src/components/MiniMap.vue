<script setup lang="ts">
import { computed } from 'vue'
import { useMapStage } from '../composables/useMapStage'

const { stages, currentStage, currentStageIndex } = useMapStage()

const progressPercent = computed(() => {
  return ((currentStageIndex.value) / (stages.length - 1)) * 100
})
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Preload all map stage images -->
    <div class="hidden">
      <img v-for="stage in stages" :key="stage.minTime" :src="stage.image" alt="" />
    </div>

    <h2 class="font-heading text-lg font-semibold text-accent-gold tracking-wide uppercase mb-3">
      Minimap
    </h2>

    <div
      class="transition-all duration-300 flex-1 flex flex-col"
    >
      <!-- Map image with transition (no border/shadow for transparent bg) -->
      <div class="relative flex justify-center mb-3">
        <Transition name="map-fade" mode="out-in">
          <img
            :key="currentStage.image"
            :src="currentStage.image"
            :alt="currentStage.label"
            class="block w-full h-auto"
            draggable="false"
          />
        </Transition>
      </div>

      <!-- Stage label -->
      <div class="text-center mb-4">
        <span class="text-sm font-semibold text-accent-gold tracking-wide">
          {{ currentStage.label }}
        </span>
      </div>

      <!-- Stage progress bar -->
      <div class="flex items-center gap-2">
        <div class="flex-1 h-1.5 bg-bg-primary rounded-full overflow-hidden">
          <div
            class="h-full gradient-accent rounded-full transition-all duration-700 ease-out"
            :style="{ width: `${progressPercent}%` }"
          />
        </div>
        <span class="text-xs text-text-secondary tabular-nums whitespace-nowrap">
          {{ currentStageIndex + 1 }}/{{ stages.length }}
        </span>
      </div>

      <!-- Stage indicators -->
      <div class="flex justify-between mt-3">
        <button
          v-for="(stage, i) in stages"
          :key="stage.minTime"
          class="flex flex-col items-center gap-1 group"
          :title="stage.label"
        >
          <div
            class="w-2.5 h-2.5 rounded-full border transition-all duration-300"
            :class="
              i <= currentStageIndex
                ? 'bg-accent-gold border-accent-gold shadow-[0_0_6px_rgba(232,190,134,0.5)]'
                : 'bg-bg-primary border-accent-amber/30'
            "
          />
          <span
            class="text-[10px] hidden sm:block transition-colors"
            :class="i <= currentStageIndex ? 'text-accent-gold' : 'text-text-secondary/60'"
          >
            {{ Math.floor(stage.minTime / 60) }}m
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.map-fade-enter-active,
.map-fade-leave-active {
  transition: opacity 0.4s ease;
}
.map-fade-enter-from,
.map-fade-leave-to {
  opacity: 0;
}
</style>
