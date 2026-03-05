# MeraiLABS — Command Center (merai-hq)

## What This Is
Central task board and project management for MeraiLABS — an AI-first education platform for the Russian-speaking market.

## How It Works
- `board.json` — single source of truth for all tasks. Both Ashura Goldman (OpenClaw agent) and Claude Code update this file.
- `index.html` — renders board.json as a visual kanban board. Hosted on GitHub Pages.
- Tasks link to their respective GitHub repos when applicable.

## Updating the Board
Edit `board.json` directly. Structure:
- `tasks[]` — array of task objects
- Each task: `id`, `title`, `description`, `status` (backlog|in-progress|review|done), `assignee` (gold|ashura|claude), `priority` (high|medium|low), `workstream`, `githubUrl`, `createdAt`, `updatedAt`
- `workstreams` — defined workstream categories with labels and colors
- `meta.lastUpdated` — update this timestamp when modifying
- `meta.updatedBy` — set to whoever made the change

## Workstreams
- research, curriculum, avatars, platform, social, marketing, operations

## Related Repos
Will be created as sub-projects launch. Each gets its own CLAUDE.md.

## Key People
- **Mr. Gold** — founder, strategist, curriculum designer
- **Ashura Goldman** — AI agent (OpenClaw on Mac Mini), research, coding, execution
- **Claude Code** — AI coding agent on Gold's other computer
