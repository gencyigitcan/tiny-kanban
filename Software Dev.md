# Software Development Specification & Architecture Manual
**Project:** Kanban (Enterprise Real-Time Board System)  
**Role:** Senior Full-Stack Software Engineer (Edge & Cloud Native)  
**Version:** 1.3.0  
**Date:** 2026-09-16  

---

## 1. Executive Summary & Philosophy

Kanban is an ultra-fast, zero-bloat, multi-tenant agile task and project management application. Unlike legacy monolithic issue trackers (e.g., Jira, ClickUp) that suffer from heavy bundle sizes, slow cold starts, and excessive network waterfalls, Kanban is engineered around three core engineering tenets:
1. **Edge-Native Performance:** Zero-overhead execution running identically on Node.js and Cloudflare Pages / Workers Edge compute.
2. **Deterministic Multi-Tenancy:** Complete tenant isolation across personal workspaces, enterprise teams, and public demo environments using scoped database keys and `AsyncLocalStorage`.
3. **Pure REST & In-Memory Client State:** Strict elimination of client-side database emulation (`localStorage` DB hacks). All mutations are dispatched to the server REST API, persisted atomically, confirmed with HTTP 200/201, and reflected into reactive UI state.

---

## 2. Technology Stack & Runtime Topology

| Layer | Technology | Rationale & Architectural Choice |
| :--- | :--- | :--- |
| **Language** | TypeScript 5.8 (ES2022) | Strict type safety across both frontend contracts and backend database schemas. |
| **Backend Framework** | Express 4.21 + `@cloudflare/workers-types` | Familiar, battle-tested HTTP middleware pipeline adaptable to Cloudflare Workers via `httpServerHandler`. |
| **Validation Layer** | Zod 3.24 | Runtime schema validation for request payloads, environment settings, and data boundaries. |
| **Security & Headers** | Helmet 8.0, CORS 2.8, express-rate-limit | Strict HTTP security headers, origin protection, and brute-force rate mitigation. |
| **Storage Engine** | Cloudflare D1 (SQLite) + Atomic JSON Files | Serverless distributed SQL database on Cloudflare D1 with atomic file system fallback for local development. |
| **Frontend Core** | Vanilla JavaScript (ES Modules) & Vanilla CSS3 | Sub-millisecond rendering, zero React/Vue framework overhead, fluid drag-and-drop. |
| **Bundler & Compiler** | esbuild 0.27 + tsc | Near-instantaneous builds (<150ms) packaging backend assets into `_worker.js`. |

---

## 3. Directory Structure & Key Modules

```
kanban/
├── src/                          # Backend Source Code (TypeScript)
│   ├── index.ts                  # Server entry point, Cloudflare Worker fetch handler, D1 batch preloader
│   ├── types/                    # Central domain type definitions
│   │   └── index.ts              # DbSchema, Card, Epic, Sprint, User, Workspace, ActivityLog
│   ├── lib/                      # Core business services & utilities
│   │   ├── db.ts                 # Atomic DB service, D1 persistence, AsyncLocalStorage context, tenant resolution
│   │   ├── demo_data.ts          # 2026-2027 calendar year dataset (10-person Nova team, 52 sprints, 51 cards)
│   │   └── schemas.ts            # Zod validation schemas (cards, auth, admin, sprints, epics)
│   ├── middleware/               # Express request pipeline middleware
│   │   ├── auth.ts               # Multi-tenant Bearer session verification & public demo access bypass
│   │   ├── validate.ts           # Zod schema validation middleware
│   │   └── error.ts              # Global error handler and standardized AppError classes
│   └── routes/                   # REST API route handlers
│       ├── auth.ts               # Registration, login, workspace switching, Super Admin approvals
│       ├── cards.ts              # Card CRUD, reordering, status moves, assignee notifications, audit logging
│       ├── epics.ts              # Epic CRUD and color assignments
│       ├── sprints.ts            # Sprint lifecycle (creation, activation, date ranges)
│       ├── labels.ts             # Custom taxonomy and badge colors
│       ├── admin.ts              # User management, pending approvals, workspace administration, audit logs
│       └── notifications.ts      # Real-time inbox notifications and read-state management
├── public/                       # Frontend Static Web Assets
│   ├── index.html                # Product landing page and navigation hub
│   ├── board.html                # Main authenticated Kanban workspace (Board, List, Backlog, Gantt, Reports)
│   ├── demo.html                 # Public read/write demo sandbox (Nova Team 2026-2027)
│   ├── register.html             # User registration and approval request portal
│   ├── css/                      # Design system and stylesheets
│   │   ├── style.css             # Main application layout, components, modals, and typography
│   │   ├── landing.css           # Landing page hero, feature grids, and animations
│   │   └── register.css          # Registration portal styling
│   └── js/                       # Client-side JavaScript modules
│       ├── api.js                # Pure REST client communicating directly with /api/*
│       ├── board.js              # Rendering engine: Kanban columns, Gantt timeline, velocity charts
│       └── app.js                # State controller: event handlers, drag-and-drop, background live sync
├── data/                         # Local Persistent Storage (Node.js runtime only)
│   ├── db.json                   # Production personal workspace database
│   ├── demo_db.json              # Standalone demo workspace database
│   └── tenants_index.json        # Workspace directory and user-to-tenant routing table
├── tests/                        # Automated Test Suites
│   └── integration.ts            # End-to-end integration tests (auth, approval, cards, logs, demo)
├── build.js                      # Custom esbuild bundler script
├── wrangler.toml                 # Cloudflare Pages / Workers deployment configuration
└── schema.sql                    # Cloudflare D1 SQLite table initialization schema
```

---

## 4. Domain Data Model & Type System

All core domain models are defined in [`src/types/index.ts`](file:///Users/yigitcangenc/Github/Antigravity/kanban/src/types/index.ts):

### Card Model (`Card`)
```typescript
export interface Card {
    id: string;                    // Unique identifier (e.g. 'card-user-avukat')
    key: string;                   // Human-readable task key (e.g. 'TK-11')
    title: string;                 // Task headline
    desc?: string;                 // Detailed description (Markdown supported)
    assignee: string;              // Assigned user full name
    priority: 'low' | 'medium' | 'high';
    col: 'todo' | 'doing' | 'done'; // Workflow status column
    startDate?: string | null;     // ISO Date (YYYY-MM-DD)
    dueDate?: string | null;       // ISO Date (YYYY-MM-DD)
    labels: string[];              // Array of label IDs
    storyPoints?: number | null;   // Agile story points (Fibonacci)
    estimatedEffort?: number | null; // Estimated hours
    spentEffort?: number | null;     // Logged hours
    subtasks: Subtask[];           // Checklist items with completion state
    comments: Comment[];           // Discussion thread with timestamp and author
    epicId?: string | null;        // Associated Epic ID
    sprintId?: string | null;      // Associated Sprint ID
    createdAt: number;             // Epoch milliseconds
}
```

### User Model (`User`)
```typescript
export interface User {
    id: string;                    // e.g. 'usr-superadmin'
    username: string;              // Normalized lowercase username or email
    email?: string;                // Primary communication email
    name: string;                  // Display name
    passwordHash: string;          // Salted PBKDF2 SHA-512 hash (`salt:hash`)
    avatarColor: string;           // Hex color code for avatar circle
    role: 'superadmin' | 'admin' | 'user';
    status?: 'pending' | 'approved' | 'rejected'; // Approval gate state
    tenantId: string;              // Primary home workspace
    workspaces: string[];          // List of accessible tenant IDs
    company?: string;              // Organization name (creates team workspace)
    createdAt: number;
    lastLoginAt?: number;
    expiresAt?: number;            // Optional trial/demo expiration
}
```

---

## 5. Storage Architecture & Multi-Tenancy Engine

### 5.1 Cloudflare D1 Distributed Storage
In production on Cloudflare Pages, data is stored in Cloudflare D1 using an optimized key-value document table:
```sql
CREATE TABLE IF NOT EXISTS json_store (
    key TEXT PRIMARY KEY,
    value TEXT
);
```
Key naming conventions:
- `db`: Production personal workspace (`tenantId = 'personal'`)
- `demo`: Nova Team demo workspace (`tenantId = 'demo'`)
- `tenants_index`: Workspace registry and user-to-tenant mapping
- `tenant:<tenantId>`: Individual enterprise organization workspace
- `test:*`: Prefix used strictly in test/staging environments for zero-contamination isolation.

### 5.2 AsyncLocalStorage Context Isolation
Every incoming HTTP request on Cloudflare Workers runs inside an isolated async execution context:
```typescript
export const dbContext = new AsyncLocalStorage<RequestContext>();
```
The request handler (`src/index.ts`) preloads relevant tenant records from D1 in a single batch query, populates `RequestContext.tenants`, executes Express routes, and flushes any mutated records (`dirty === true`) back to D1 before the response stream closes.

---

## 6. REST API Contracts & Endpoint Matrix

### 6.1 Authentication (`/api/auth`)
- `POST /api/auth/register`: Register new user. The first user to register on an uninitialized instance automatically becomes `role: 'superadmin'` with `status: 'approved'`. Subsequent registrations default to standard `user` with `status: 'pending'` awaiting admin approval.
- `POST /api/auth/login`: Authenticate with username and password. Rejects pending users (`403`) and expired users (`401`).
- `GET /api/auth/me`: Returns active session profile, permissions, and accessible workspaces.
- `POST /api/auth/switch-workspace`: Issues a new token scoped to the selected tenant ID.
- `POST /api/auth/logout`: Invalidates session and records audit log.

### 6.2 Cards & Workflow (`/api/cards`)
- `GET /api/cards`: Retrieve all cards in active workspace.
- `POST /api/cards`: Create card with auto-incrementing key (`TK-n`), subtasks, and notify assignee.
- `PUT /api/cards/:id`: Update card properties, column status, story points, or log effort.
- `DELETE /api/cards/:id`: Remove card and record `CARD_DELETE` in audit log.

### 6.3 Administration & Approvals (`/api/admin`)
- `GET /api/admin/pending-users`: Lists users awaiting Super Admin review.
- `POST /api/admin/users/:id/approve`: Approve pending registration (`status = 'approved'`).
- `POST /api/admin/users/:id/reject`: Deny registration (`status = 'rejected'`).
- `GET /api/admin/users/detailed`: Comprehensive user audit table (roles, workspaces, last login).
- `GET /api/admin/logs`: Filterable activity log stream (logins, updates, approvals).

---

## 7. Frontend REST Client & UI Architecture

### 7.1 Pure REST Client (`public/js/api.js`)
The client uses native `fetch()` without external dependencies. Every mutation is asynchronous and verified:
```javascript
const res = await API.updateCard(cardId, { col: 'done' });
```
If a request fails (e.g. network disconnect, 403 Forbidden, 401 Unauthorized), an error is thrown, caught by the UI handler, and displayed via `showToast(err.message, 'error')`.

### 7.2 In-Memory State & Background Sync (`public/js/app.js`)
The application maintains client-side in-memory arrays (`cards`, `epics`, `sprints`, `users`, `labels`, `notifications`). A 5-second background polling cycle (`setupBackgroundSync`) checks for remote changes without disturbing active form inputs or drag operations, synchronizing multi-user edits in near real-time.

---

## 8. Build, Compilation & Verification Commands

```bash
# 1. Type Check (Strict TypeScript validation)
npx tsc --noEmit

# 2. Production Bundle (esbuild compiler)
node build.js

# 3. Full Integrated Build Command
npm run build

# 4. Automated Integration Test Suite
npx tsx tests/integration.ts
```
All integration tests must pass with 100% success before any branch merge or production deployment.
