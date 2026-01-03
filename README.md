# Life Goals Planning App

A premium, interactive life goals planning application with a high-performance Gantt chart timeline view. Organize your long-term vision, track progress, and manage hierarchical goal relationships with ease.

## ✨ Features

- **Interactive Gantt Chart**: Dynamic timeline view with zoom levels (Month, Quarter, Year).
- **Smart Dashboard**: High-level stats overview, quick-start templates, and advanced progress trackers.
- **Hierarchical Goals**: Create parent-child relationships between goals and sub-goals.
- **Goal Completion**: Mark goals as finished with a celebratory confetti explosion.
- **Dependency Tracking**: Visual SVG dependency lines connecting related goals.
- **Drag-to-Reschedule**: Intuitively adjust goal dates by dragging bars on the timeline.
- **Premium UI**: Clean, motivating dark-themed design with glassmorphism and emojis.

## 🚀 Deployment

Ready to go live? Check out the [Deployment Guide](DEPLOYMENT.md) for instructions on launching your app on Vercel, Netlify, or your own server.

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 20.19+ or 22.12+ recommended.
- **npm**: (Included with Node.js)

### Installation

1. Clone the repository or download the source code.
2. Navigate to the project directory:
   ```bash
   cd "Life Goals"
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

### Running Locally

To start the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:5173/` (or the next available port).

To build the project for production:
```bash
npm run build
```

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Date Utilities**: [date-fns](https://date-fns.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Vanilla CSS (CSS Variables + Glassmorphism)
