# Deadlock Match Timer

A real-time match timer for **Deadlock** (Valve's hero shooter) that helps players track key map events during a match. Built as a single-page app with a dark, noir-gothic aesthetic inspired by the game's visual identity.

## Features

- **Match Timer** — Start/pause/reset stopwatch that drives all event countdowns
- **Event Timeline** — Tracks spawns for camps, crates, powerups, soul urns, mid-boss, golden statues, and more
- **Countdown & Alerts** — Each event card shows a live countdown with visual urgency (amber at ≤30s, red at ≤10s)
- **Audio Notifications** — Optional sound alerts when events are about to spawn
- **Manual Respawn Tracking** — Mark camp clears or boss kills to start respawn timers
- **Settings Panel** — Toggle audio per-event and globally mute

## Tech Stack

- Vue 3 (Composition API, `<script setup>`, TypeScript)
- Tailwind CSS
- Vite
- Web Audio API for sound alerts
- Fully client-side — no backend required

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+

### Install & Run

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview
```
