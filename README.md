# Focus Forge 🔥

A premium Pomodoro productivity PWA designed for software engineers, builders, and deep workers.

Built with React, TypeScript, Vite, Tailwind CSS, and Framer Motion.

---

## Features

- **Pomodoro Timer** — Focus (25m), Short Break (5m), Long Break (15m) with custom durations
- **Mission Control** — Dashboard with XP, levels, streaks, and motivational messaging
- **Focus Heatmap** — GitHub-style contribution graph for focus sessions
- **Productivity City** — SVG city that grows as you complete sessions
- **Achievements** — 8 unlockable badges with conditions
- **Task Integration** — Simple task list with focus session tracking
- **Daily Reflection** — Log what you built each day
- **Ambient Modes** — Rain, Coffee Shop, Forest, Night Coding, Library soundscapes
- **Gamification** — XP system with 6 career levels (Intern → Legend)
- **Full PWA** — Install on iPhone via Safari "Add to Home Screen", offline support
- **Dark mode** — Premium Apple/Linear-inspired dark design
- **Export/Import** — JSON backup and restore

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite 8 | Build tool |
| Tailwind CSS 4 | Styling |
| Framer Motion | Animations |
| vite-plugin-pwa | PWA + Service Worker |
| LocalStorage | Data persistence |

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173/focus-forge/

## Build

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

```bash
npm run build
```

Then push to `main` — the GitHub Actions workflow deploys automatically.

Or manually:

```bash
npx gh-pages -d dist
```

## Project Structure

```
src/
├── components/
│   ├── Timer/          # Pomodoro timer with SVG ring
│   ├── MissionControl/ # Dashboard with stats, XP, goals
│   ├── Stats/          # Session statistics cards
│   ├── Heatmap/        # GitHub-style focus heatmap
│   ├── ProductivityCity/ # SVG city builder
│   ├── Achievements/   # Badge system
│   ├── Tasks/          # Task list
│   ├── Reflections/    # Daily notes
│   ├── Ambient/        # Soundscapes
│   ├── Settings/       # App settings, export/import
│   └── Layout/         # (reserved)
├── hooks/              # useTimer, useStats, useAchievements
├── store/              # LocalStorage persistence
├── types/              # TypeScript interfaces
└── utils/              # Constants, helpers
```

## iPhone PWA Setup

1. Open Safari
2. Navigate to your deployed URL
3. Tap the Share button
4. Tap "Add to Home Screen"
5. Name it "Focus Forge"
6. Tap "Add"

The app will open in standalone mode with proper safe areas and offline support.

## License

MIT
