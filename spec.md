# Deadlock Match Timer — SPA Specification & Prompt

## Overview

Build a **single-page application (SPA)** using **Vue 3** (Composition API, `<script setup>`) and **Tailwind CSS** that serves as a real-time match timer for **Deadlock** (Valve's online hero shooter). The app helps players track when key map events occur during a match, with countdown timers and **audio alerts** for each event.

---

## Tech Stack

- **Vue 3** (Composition API with `<script setup lang="ts">`)
- **TypeScript** — strict mode, all components and composables in `.ts` / `.vue` with `lang="ts"`
- **Tailwind CSS v3+** for styling
- **Vite** as the build tool
- **Web Audio API** (or simple `<audio>` elements) for sound alerts
- No backend required — fully client-side

---

## Design & Visual Identity

Take heavy inspiration from the **Deadlock official website** ([playdeadlock.com/oldgods](https://www.playdeadlock.com/oldgods)):

### Color Palette

| Token              | Value                 | Usage                              |
| ------------------ | --------------------- | ---------------------------------- |
| `bg-primary`       | `#0C0C0E`             | Page / app background (near-black) |
| `bg-surface`       | `#1A1A1F`             | Card / panel backgrounds           |
| `bg-surface-hover` | `#25252B`             | Hover states on cards              |
| `accent-gold`      | `#E8BE86`             | Primary accent, active highlights  |
| `accent-amber`     | `#987556`             | Secondary accent, gradient starts  |
| `text-primary`     | `#FFF5E8`             | Main text (warm cream)             |
| `text-secondary`   | `#A09080`             | Muted / secondary text             |
| `danger`           | `#E84040`             | Urgent / imminent alerts           |
| `warning`          | `#E8A020`             | Upcoming soon warnings             |
| `success`          | `#40C080`             | Active / completed states          |

### Typography

- **Headings**: Use a serif or decorative font that evokes the 1920s gothic noir aesthetic — e.g. `'Cinzel'`, `'Playfair Display'`, or similar Google Font. Fallback to `Georgia, serif`.
- **Body / UI text**: `'Inter'`, `'Open Sans'`, or a clean sans-serif. Fallback to `sans-serif`.
- Keep text sharp and legible on dark backgrounds.

### Visual Style

- **Dark, moody atmosphere** — noir-gothic New York City vibe
- Subtle gold/amber **gradient accents** (linear-gradient from `#987556` to `#E8BE86`) on borders, headers, and active elements
- **Glowing amber borders** or `box-shadow: 0 0 12px rgba(232,190,134,0.3)` on cards for a mystical feel
- Minimal use of color — let the gold accents pop against the dark background
- Subtle background texture or noise overlay for depth (optional)
- Clean card-based layout with slight rounded corners (`rounded-lg`)

---

## Core Features

### 1. Match Timer (Central Clock)

- A large, prominent **stopwatch-style timer** displayed at the top center of the app showing elapsed match time in `MM:SS` format.
- **Controls**:
  - **Start** — begins the timer from `0:00`
  - **Pause** — pauses the timer
  - **Resume** — resumes from the paused time
  - **Reset** — stops and resets everything back to `0:00`
- The timer drives all event countdowns below.
- Should use `setInterval` or `requestAnimationFrame` with drift correction for accuracy.

### 2. Event Timeline

Display a **vertical list of event cards**, each representing a timed game event. Events are sorted by their next occurrence time. Each card shows:

- **Event name** and icon/emoji
- **Spawn time** — when it first appears
- **Status indicator**:
  - ⏳ "Upcoming" — event hasn't triggered yet (show countdown to first spawn)
  - 🟢 "Active" — event time has been reached (briefly highlight / animate)
  - 🔄 "Respawning" — for recurring events, show countdown to next occurrence
- **Countdown** — time remaining until the next occurrence of that event
- **Visual urgency** — as countdown approaches 0, the card should transition:
  - `> 30s` remaining: normal state
  - `≤ 30s` remaining: warning (amber glow / pulsing border)
  - `≤ 10s` remaining: urgent (red glow / stronger pulse)

### 3. Game Events Data

Based on the Deadlock wiki map timings, implement the following events:

| Event                     | First Spawn | Recurrence / Respawn                                  | Description                                                                 |
| ------------------------- | ----------- | ----------------------------------------------------- | --------------------------------------------------------------------------- |
| **Easy Camps**            | 2:00        | ~1m 25s after cleared (not auto-tracked)              | 4 small Denizen camps appear in the jungle                                  |
| **Crates & Golden Statues** | 2:00      | 3m after broken                                       | Breakable crates (drop souls) and Tier 1 Golden Statues (drop stat buffs)   |
| **Powerups**              | 5:00        | Every 5:00 (at 5:00, 10:00, 15:00, 20:00...)         | 2 powerup locations spawn simultaneously                                    |
| **Medium Camps**          | 6:00        | ~4m 50s after cleared (not auto-tracked)              | 22 medium Denizen camps spawn                                               |
| **Hard Camps**            | 8:00        | ~5m 35s after cleared (not auto-tracked)              | 12 hard Denizen camps spawn                                                 |
| **Vault Camps**           | 8:00        | 5m after defeated                                     | Sinner's Sacrifice machines in 10 locations                                 |
| **Soul Urn**              | 10:00       | Every 5:00 after 10:00 (at 10:00, 15:00, 20:00...)   | Descends from the sky (12.5s descent), rotates sides each time              |
| **Mid-Boss**              | 10:00       | 7m / 6m / 5m after each kill (decreasing)             | Drops Rejuvenator crystal — huge team buff for 4 minutes                    |
| **Golden Statues Tier 2** | 10:00       | —                                                     | Existing Golden Statues upgrade to Tier 2 (better stat buffs)               |
| **Golden Statues Tier 3** | 30:00       | —                                                     | Existing Golden Statues upgrade to Tier 3 (best stat buffs)                 |

#### Auto-recurring vs. manual-trigger events

- **Auto-recurring events** (Powerups, Soul Urn): the timer automatically resets the countdown every interval (every 5 min).
- **One-time milestone events** (Golden Statues Tier 2 at 10:00, Tier 3 at 30:00): show them once, mark as complete when reached.
- **Clearance-based events** (Easy/Medium/Hard/Vault Camps, Mid-Boss): after their initial spawn time, show a **manual "Cleared/Killed" button** that the player can click to start the respawn countdown.

### 4. Sound Alerts

- Play a **short, distinct sound** when each event triggers (countdown reaches 0).
- Optionally play a **warning sound** at 10 seconds or 30 seconds before an event.
- Use synthesized tones via the **Web Audio API** (no external audio files needed):
  - A short rising chime for normal events
  - A deeper/louder tone for major events (Mid-Boss, Soul Urn)
  - A subtle tick for warnings
- Include a **global mute/unmute toggle** button in the header.
- Optionally allow per-event sound toggling.

### 5. Responsive & Usable During Gameplay

- The app should work well on a **secondary monitor** or a **phone/tablet propped up** next to the game.
- Mobile-responsive layout (single-column on small screens, two-column on larger screens).
- Large enough text and buttons to glance at quickly.
- Consider an optional **compact mode** that reduces the event cards to a minimal one-line display.

---

## UI Layout

```
┌─────────────────────────────────────────────────────────────┐
│  DEADLOCK TIMER                           🔊 Mute   ⚙ Settings │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                        12 : 34                              │
│                   [ ▶ Start ] [ ⏸ Pause ] [ ↻ Reset ]      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────┐  ┌──────────────────────┐         │
│  │ ⚡ POWERUPS           │  │ 💀 MID-BOSS           │        │
│  │ Next in: 02:26       │  │ Spawns in: --:--      │        │
│  │ Status: Recurring    │  │ [Mark Killed]         │        │
│  │ 🔔 ON                │  │ 🔔 ON                 │        │
│  └──────────────────────┘  └──────────────────────┘         │
│                                                             │
│  ┌──────────────────────┐  ┌──────────────────────┐         │
│  │ 🏺 SOUL URN           │  │ ⚔ HARD CAMPS          │       │
│  │ Next in: 02:26       │  │ Available now          │       │
│  │ Status: Recurring    │  │ [Mark Cleared]         │       │
│  │ 🔔 ON                │  │ 🔔 ON                  │       │
│  └──────────────────────┘  └──────────────────────┘         │
│                                                             │
│  ... more event cards ...                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Structure

```
App.vue                        — (lang="ts")
├── AppHeader.vue              — Logo, mute toggle, settings (lang="ts")
├── MatchTimer.vue             — Central clock display + controls (lang="ts")
├── EventList.vue              — Container for event cards (lang="ts")
│   └── EventCard.vue          — Individual event card, reusable (lang="ts")
├── SettingsPanel.vue          — Optional settings drawer/modal (lang="ts")
├── types/
│   └── index.ts               — Shared interfaces & type definitions (GameEvent, EventType, etc.)
└── composables/
    ├── useMatchTimer.ts       — Timer logic (start, pause, reset, elapsed time)
    ├── useGameEvents.ts       — Event definitions, countdown calculations, recurrence logic
    └── useAudio.ts            — Web Audio API sound generation & mute state
```

---

## Game Events Detail (for implementation reference)

### Recurring Fixed-Interval Events

These recur at fixed clock times regardless of player action:

```ts
const POWERUPS = {
  name: 'Powerups',
  icon: '⚡',
  description: '2 powerup locations spawn simultaneously',
  firstSpawn: 5 * 60,        // 5:00
  interval: 5 * 60,          // every 5:00
  type: 'auto-recurring',
  priority: 'high',
}

const SOUL_URN = {
  name: 'Soul Urn',
  icon: '🏺',
  description: 'Descends from the sky, grants souls to the team',
  firstSpawn: 10 * 60,       // 10:00
  interval: 5 * 60,          // every 5:00 after first spawn
  type: 'auto-recurring',
  priority: 'high',
}
```

### One-Time Milestone Events

These happen once at a specific time:

```ts
const EASY_CAMPS = {
  name: 'Easy Camps',
  icon: '🟢',
  description: '4 small Denizen camps spawn in the jungle',
  firstSpawn: 2 * 60,        // 2:00
  type: 'one-time-spawn',    // just alerts when they first appear
  priority: 'low',
}

const GOLDEN_STATUES_T2 = {
  name: 'Golden Statues Tier 2',
  icon: '🗿',
  description: 'Statues upgrade — better stat buffs',
  firstSpawn: 10 * 60,       // 10:00
  type: 'milestone',
  priority: 'medium',
}

const GOLDEN_STATUES_T3 = {
  name: 'Golden Statues Tier 3',
  icon: '🗿',
  description: 'Statues upgrade — best stat buffs',
  firstSpawn: 30 * 60,       // 30:00
  type: 'milestone',
  priority: 'medium',
}
```

### Player-Triggered Respawn Events

These have a first spawn time, then respawn on a cooldown **after the player clicks "Cleared/Killed"**:

```ts
const MID_BOSS = {
  name: 'Mid-Boss',
  icon: '💀',
  description: 'Drops Rejuvenator crystal — 4min team buff',
  firstSpawn: 10 * 60,       // 10:00
  respawnTimes: [7 * 60, 6 * 60, 5 * 60],  // decreases each kill
  type: 'manual-respawn',
  priority: 'critical',
}

const VAULT_CAMPS = {
  name: 'Vault Camps',
  icon: '🔒',
  description: "Sinner's Sacrifice machines — 10 locations",
  firstSpawn: 8 * 60,        // 8:00
  respawnTime: 5 * 60,       // 5:00 after defeated
  type: 'manual-respawn',
  priority: 'medium',
}
```

---

## Sound Design

Use the Web Audio API to generate tones programmatically. No external audio files required.

```ts
// Example: generate a short chime
function playChime(frequency: number = 800, duration: number = 0.15, type: OscillatorType = 'sine'): void {
  const ctx = new (window.AudioContext || window.webkitAudioContext)()
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)
  gain.gain.setValueAtTime(0.3, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)
  oscillator.connect(gain)
  gain.connect(ctx.destination)
  oscillator.start()
  oscillator.stop(ctx.currentTime + duration)
}
```

### Sound mapping

| Event Type        | Sound                                              |
| ----------------- | -------------------------------------------------- |
| Normal spawn      | Single rising chime (600 → 900 Hz, 0.15s)         |
| Major event       | Double chime (600 Hz + 900 Hz, 0.3s total)         |
| Critical (Mid-Boss, Soul Urn) | Low rumble + chime (200 Hz saw + 800 Hz sine) |
| Warning (10s)     | Soft tick (1000 Hz, 0.05s)                         |
| Warning (30s)     | Very soft tick (800 Hz, 0.03s)                     |

---

## Additional Features (Nice to Have)

- **Keyboard shortcuts**: `Space` = Start/Pause, `R` = Reset, `M` = Mute
- **LocalStorage persistence**: remember mute state and any per-event toggles across sessions
- **Dark/light mode**: default to dark (matching Deadlock), but allow toggle
- **"What happened" log**: a small scrollable log at the bottom showing recent events with timestamps
- **Notification API**: optionally send browser notifications for events if the tab is in the background

---

## Development Notes

- Initialize in the **current directory** (no subfolder): `npm create vite@latest . -- --template vue-ts`
- Install Tailwind: `npm install -D tailwindcss @tailwindcss/vite` and configure
- Use Google Fonts CDN for the decorative heading font
- No router needed — single page
- No state management library needed — Vue's `reactive`/`ref` is sufficient
- All `.vue` files must use `<script setup lang="ts">`
- Define explicit TypeScript interfaces/types for game events, timer state, and audio config in `src/types/`
- Prefer `Ref<T>`, `ComputedRef<T>`, and typed `defineProps` / `defineEmits` throughout
- Enable `"strict": true` in `tsconfig.json`
- Keep components small and composables testable
- Use `computed` properties for derived countdown values to keep the template clean

---

## Summary

The app is a focused, beautiful, dark-themed match companion tool for Deadlock players. It tells them **when things happen** — camps, bosses, powerups, soul urns — with audio cues so they can keep their eyes on the game. The aesthetic should feel like it belongs in the Deadlock universe: dark, golden, gothic, and stylish.
