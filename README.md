# MeraiLABS Task Board

Production kanban board for MeraiLABS team. Built with Next.js 15, Tailwind CSS v4, and dnd-kit.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8)

## Features

- **Kanban board** — 4 columns: Backlog, In Progress, Review, Done
- **Drag & drop** — Move tasks between columns with smooth animations
- **Task CRUD** — Create, edit, delete tasks with full detail modals
- **Filtering** — Filter by workstream, assignee, priority + full-text search
- **GitHub persistence** — Board data stored as `board.json` in your GitHub repo
- **Password auth** — Simple password protection
- **Dark theme** — Designed for long viewing sessions
- **Responsive** — Works on desktop and mobile

## Setup

### 1. Clone & install

```bash
git clone <repo-url>
cd merai-board
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

| Variable | Description |
|---|---|
| `GITHUB_TOKEN` | GitHub personal access token with `repo` scope |
| `GITHUB_REPO` | Repository in `owner/repo` format (default: `GoldAshuraGIT/merai-hq`) |
| `BOARD_PASSWORD` | Password to access the board |

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Deploy to Vercel

```bash
npx vercel
```

Set the three environment variables in your Vercel project settings.

## Board Data Format

The board persists as `board.json` in the root of your GitHub repo:

```json
{
  "meta": {
    "project": "MeraiLABS",
    "lastUpdated": "2026-03-05T12:00:00.000Z",
    "updatedBy": "gold"
  },
  "workstreams": {
    "research": { "label": "Research", "color": "#8B5CF6" },
    "curriculum": { "label": "Curriculum", "color": "#3B82F6" }
  },
  "tasks": [
    {
      "id": "uuid",
      "title": "Task title",
      "description": "Details",
      "status": "backlog",
      "assignee": "gold",
      "priority": "high",
      "workstream": "research",
      "githubUrl": "",
      "createdAt": "ISO date",
      "updatedAt": "ISO date"
    }
  ]
}
```

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Drag & Drop:** @dnd-kit/core + @dnd-kit/sortable
- **Deployment:** Vercel

## License

Private — MeraiLABS internal tool.
