# 🌍 PinPoint

An interactive 3D globe app for pinning travel memories and planning future adventures — built with React, TypeScript, and Three.js.

## ✨ Features

- **Dual Mode System** — Switch between **Past** (golden memories) and **Future** (violet adventures)
- **Interactive 3D Globe** — Click anywhere on the earth to drop a pin with auto reverse-geocoding
- **Trip Lifecycle** — Plan a future trip → Complete it → It becomes a permanent memory
- **Photo Memories** — Upload photos to past pins, displayed as a polaroid-style gallery
- **Checklists & Route Planning** — Prepare for future trips with task lists and waypoints
- **Persistent Data** — All pins, photos, and notes saved locally in the browser
- **Glassmorphism UI** — Frosted glass HUD panels with crystal shimmer animations

## 🛠 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** + **TypeScript** | UI framework & type safety |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Utility-first styling |
| **react-globe.gl** + **Three.js** | 3D interactive globe |
| **Framer Motion** | Smooth animations & transitions |
| **Zustand** | Lightweight state management with persistence |
| **Lucide React** | Icon library |
| **Vercel** | Deployment platform |

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/BaslielMesfin/PinPoint.git
cd PinPoint

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📦 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 📁 Project Structure

```
src/
├── components/
│   ├── Globe/          # 3D interactive globe
│   ├── Layout/         # Main app shell & HUD layout
│   ├── ModeToggle/     # Past/Future mode switcher
│   ├── Sidebar/        # Pin list sidebar
│   ├── AddPin/         # New pin creation panel
│   ├── PastMode/       # Memory panel & photo gallery
│   └── FutureMode/     # Trip planner with checklists
├── store/              # Zustand state management
├── types/              # TypeScript interfaces
├── data/               # Sample seed data
└── assets/             # Custom fonts
```

## 🌐 Deployment

Deployed on **Vercel** — auto-deploys on every push to `main`.

## 📄 License

MIT
