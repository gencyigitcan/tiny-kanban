# Kanban — Enterprise Agile Work Management System

Multi-tenant, edge-native, real-time Jira-alternative project management platform running on Cloudflare Pages, Workers, and D1 Serverless SQL.

[![Version](https://img.shields.io/badge/version-1.3.0-6366f1?style=flat-square)](https://github.com/gencyigitcan/tiny-kanban/releases)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Cloudflare D1](https://img.shields.io/badge/Cloudflare-D1%20SQL-f38020?style=flat-square&logo=cloudflare)](https://developers.cloudflare.com/d1/)
[![License](https://img.shields.io/badge/license-MIT-22c55e?style=flat-square)](LICENSE)

## 📚 AI & Enterprise Engineering Handover Suite

For deep technical specifications, architecture blueprints, and operations manuals, consult the role-based handover documentation:

| Role / Specification | Document | Scope & Focus |
| :--- | :--- | :--- |
| **Solutions & Cloud Architect** | [`architect.md`](./architect.md) | Edge compute topology, data plane vs control plane, failover runbooks |
| **Software Engineer** | [`Software Dev.md`](./Software%20Dev.md) | Full technical architecture, types, REST contracts, and frontend state engine |
| **DevOps & Cloud Architect** | [`devops engineer.md`](./devops%20engineer.md) | Cloudflare Pages, Workers, D1 SQL, multi-env isolation, and CI/CD pipelines |
| **Database Engineer** | [`database engineer.md`](./database%20engineer.md) | D1 SQLite distributed document store, indexing, batch preloading, backups |
| **Security Engineer** | [`security engineer.md`](./security%20engineer.md) & [`SECURITY.md`](./SECURITY.md) | STRIDE threat model, PBKDF2 cryptography, RBAC, and 100-step security audit |
| **QA & Test Automation** | [`qa engineer.md`](./qa%20engineer.md) | Test pyramid, E2E regression, CI/CD gates, automated verification matrices |
| **Product Manager / BA** | [`business analyst.md`](./business%20analyst.md) | PRD, user personas, approval gates, agile metrics, and acceptance criteria |
| **Chief Technology Officer** | [`intent.md`](./intent.md) | High-level philosophy, Architecture Decision Records (ADRs 001-005) |
| **Strategic Product Roadmap** | [`ROADMAP.md`](./ROADMAP.md) | Full project review, technical scorecard, and 2026-2027 phased roadmap |

---

## Features

| Feature | Description |
|---------|-------------|
| 📋 **Board** | Kanban columns: Yapılacak → Yapılıyor → Tamamlandı |
| ☰ **List** | Tabular view of all tasks |
| 📦 **Backlog** | Sprint-grouped backlog management |
| 📊 **Dashboard** | Stats, priority chart, overdue tracker |
| 📅 **Gantt** | Timeline view based on start/due dates |
| 🏷 **Epics** | Color-coded epic grouping |
| ⚡ **Sprints** | Date-ranged sprints with single-active invariant |
| 🔖 **Labels** | Multi-label tagging |
| ⬜ **Subtasks** | Checkable sub-items with progress bar |
| 💬 **Comments** | Timestamped card comments |
| 🎯 **Story Points** | SP estimation badges |

## Tech Stack

**Backend**
- [Node.js](https://nodejs.org/) + [Express 4](https://expressjs.com/)
- [TypeScript 5](https://www.typescriptlang.org/) via [tsx](https://github.com/privatenumber/tsx)
- [Zod](https://zod.dev/) for input validation
- [helmet](https://helmetjs.github.io/) · [cors](https://github.com/expressjs/cors) · [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit) · [morgan](https://github.com/expressjs/morgan)
- [write-file-atomic](https://github.com/npm/write-file-atomic) for crash-safe persistence

**Frontend**
- Vanilla JS ES modules
- CSS custom properties (design tokens)
- No build step, no framework

## Project Structure

```
kanban/
├── src/
│   ├── index.ts              # Entry point — Express app + middleware
│   ├── types/index.ts        # Domain types (Card, Epic, Sprint, …)
│   ├── lib/
│   │   ├── db.ts             # Atomic JSON read/write service
│   │   └── schemas.ts        # Zod validation schemas
│   ├── middleware/
│   │   ├── validate.ts       # Zod middleware factory
│   │   └── error.ts          # Global error handler + AppError
│   └── routes/
│       ├── cards.ts
│       ├── epics.ts
│       └── sprints.ts
├── public/
│   ├── board.html            # Personal board
│   ├── demo.html             # Read-only demo (Turkish)
│   ├── css/style.css
│   └── js/
│       ├── api.js            # REST client
│       └── board.js          # UI rendering + drag-drop
├── data/
│   └── db.json               # Persistent data (gitignored)
├── tsconfig.json
└── package.json
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server (auto-reload)
pnpm dev

# Start production server
pnpm start
```

Open **http://localhost:3000**

## API Reference

All endpoints are prefixed with `/api/`.  
Rate limit: **200 requests / minute**.

### Cards `/api/cards`

| Method | Path | Description |
|--------|------|-------------|
| `GET`    | `/api/cards`     | List all cards |
| `POST`   | `/api/cards`     | Create a card |
| `PUT`    | `/api/cards/:id` | Update a card |
| `DELETE` | `/api/cards/:id` | Delete a card |

**Card schema:**
```json
{
  "title": "string (required, max 200)",
  "desc": "string (max 2000)",
  "assignee": "string (max 100)",
  "priority": "high | medium | low",
  "col": "todo | doing | done",
  "startDate": "YYYY-MM-DD | null",
  "dueDate": "YYYY-MM-DD | null",
  "labels": ["bug", "feature", "task", "design", "devops", "test", "docs", "urgent"],
  "storyPoints": "integer 0–9999 | null",
  "subtasks": [{ "id": "string", "text": "string", "done": boolean }],
  "epicId": "string | null",
  "sprintId": "string | null"
}
```

### Epics `/api/epics`

| Method | Path | Description |
|--------|------|-------------|
| `GET`    | `/api/epics`     | List all epics |
| `POST`   | `/api/epics`     | Create an epic (`name`, `color`) |
| `PUT`    | `/api/epics/:id` | Update an epic |
| `DELETE` | `/api/epics/:id` | Delete + unlink from cards |

### Sprints `/api/sprints`

| Method | Path | Description |
|--------|------|-------------|
| `GET`    | `/api/sprints`     | List all sprints |
| `POST`   | `/api/sprints`     | Create a sprint (`name`, `startDate`, `endDate`) |
| `PUT`    | `/api/sprints/:id` | Update — setting `active: true` deactivates all others |
| `DELETE` | `/api/sprints/:id` | Delete + unlink from cards |

## Security

See [SECURITY.md](SECURITY.md) for vulnerability reporting.

- HTTP headers hardened by `helmet`
- CORS restricted to localhost by default
- API rate-limited (200 req/min)
- Input validated and sanitized by Zod
- Requests bodies capped at 128 KB
- `data/db.json` excluded from version control

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed CORS origin |
| `NODE_ENV` | — | `production` → combined logging |

## License

MIT © [Yiğitcan Genç](https://github.com/gencyigitcan)
