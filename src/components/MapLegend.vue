<script setup lang="ts">
import iconMidBoss from '../assets/map-icons/64px-MidBossIcon.png'
import iconPowerupGun from '../assets/map-icons/64px-Powerup_gun.png'
import iconPowerupMove from '../assets/map-icons/64px-Powerup_movement.png'
import iconPowerupSpirit from '../assets/map-icons/64px-Powerup_spirit.png'
import iconPowerupSurvival from '../assets/map-icons/64px-Powerup_survival.png'
import iconSoulUrn from '../assets/map-icons/64px-Soul_Urn.png'
import iconTeleporter from '../assets/map-icons/64px-Teleporter.png'
import iconEasyCamp from '../assets/map-icons/MapEasyCampIcon.png'
import iconMediumCamp from '../assets/map-icons/MapMediumCampIcon.png'
import iconHardCamp from '../assets/map-icons/MapHardCampIcon.png'
import iconSacrifice from '../assets/map-icons/MapSacrificeMachineIcon.png'
import iconMidStairs from '../assets/map-icons/MidStairs.png'
import iconShop from '../assets/map-icons/MinimapShopIcon.png'
import iconStairs from '../assets/map-icons/Stairs.png'

interface LegendItem {
  icon: string
  label: string
}

const legendItems: LegendItem[] = [
  { icon: iconEasyCamp, label: 'Easy Camp' },
  { icon: iconMediumCamp, label: 'Medium Camp' },
  { icon: iconHardCamp, label: 'Hard Camp' },
  { icon: iconSacrifice, label: 'Sacrifice Machine' },
  { icon: iconMidBoss, label: 'Mid-Boss' },
  { icon: iconSoulUrn, label: 'Soul Urn' },
  { icon: iconPowerupGun, label: 'Powerup: Weapon' },
  { icon: iconPowerupSpirit, label: 'Powerup: Spirit' },
  { icon: iconPowerupMove, label: 'Powerup: Movement' },
  { icon: iconPowerupSurvival, label: 'Powerup: Survival' },
  { icon: iconShop, label: 'Shop' },
  { icon: iconTeleporter, label: 'Teleporter' },
  { icon: iconStairs, label: 'Stairs' },
  { icon: iconMidStairs, label: 'Mid Stairs' },
]
</script>

<template>
  <div>
    <h2 class="font-heading text-lg font-semibold text-accent-gold tracking-wide uppercase mb-3">
      Map Legend
    </h2>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-1">
        <div
          v-for="item in legendItems"
          :key="item.label"
          class="flex items-center gap-2 px-1.5 py-1 rounded-md hover:bg-bg-surface-hover transition-colors"
        >
          <img
            :src="item.icon"
            :alt="item.label"
            class="w-5 h-5 flex-shrink-0 object-contain"
            draggable="false"
          />
          <span class="text-text-primary text-xs leading-tight">{{ item.label }}</span>
        </div>
    </div>
  </div>
</template>
