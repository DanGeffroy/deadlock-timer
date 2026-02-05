import { computed } from 'vue'
import { useMatchTimer } from './useMatchTimer'

import mapStage0 from '../assets/map-stages/240px-Midtown0min.png'
import mapStage2 from '../assets/map-stages/240px-Midtown2min.png'
import mapStage5 from '../assets/map-stages/240px-Midtown5min.png'
import mapStage6 from '../assets/map-stages/240px-Midtown6min.png'
import mapStage8 from '../assets/map-stages/240px-Midtown8min.png'
import mapStage10 from '../assets/map-stages/240px-Midtown10min.png'

export interface MapStage {
  minTime: number // seconds
  label: string
  image: string
}

const MAP_STAGES: MapStage[] = [
  { minTime: 0, label: '0:00 — Match Start', image: mapStage0 },
  { minTime: 2 * 60, label: '2:00 — Easy Camps & Crates', image: mapStage2 },
  { minTime: 5 * 60, label: '5:00 — Powerups', image: mapStage5 },
  { minTime: 6 * 60, label: '6:00 — Medium Camps', image: mapStage6 },
  { minTime: 8 * 60, label: '8:00 — Hard & Vault Camps', image: mapStage8 },
  { minTime: 10 * 60, label: '10:00 — Mid-Boss & Soul Urn', image: mapStage10 },
]

export function useMapStage() {
  const { elapsed } = useMatchTimer()

  const currentStage = computed<MapStage>(() => {
    let matched = MAP_STAGES[0]!
    for (const stage of MAP_STAGES) {
      if (elapsed.value >= stage.minTime) {
        matched = stage
      }
    }
    return matched
  })

  const currentStageIndex = computed<number>(() => {
    const index = MAP_STAGES.indexOf(currentStage.value)
    return index >= 0 ? index : 0
  })

  return {
    stages: MAP_STAGES,
    currentStage,
    currentStageIndex,
  }
}
