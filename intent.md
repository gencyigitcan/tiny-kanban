# Architectural Intent & Visionary Principles (ADRs)
**Project:** Tiny Kanban  
**Status:** Living Engineering Manifesto & Architecture Decision Record (ADR)  
**Target Audience:** Chief Technology Officers, Principal Architects, AI Engineers

---

## 1. Core Intent & Engineering Philosophy

Tiny Kanban was conceived to counter the systemic degradation of modern developer productivity tools. Over the last decade, enterprise task management software has grown exponentially complex, sluggish, and fragile. A tool designed to organize work should never take longer to load than the task itself takes to comprehend.

The fundamental intent of Tiny Kanban is:
> **"Deliver maximum cognitive clarity and instantaneous response times through radical architectural simplicity, edge-native compute, and uncompromising data integrity."**

---

## 2. Architecture Decision Records (ADRs)

### ADR-001: Edge-Native Serverless Computing vs. Heavy Containerized Kubernetes
- **Context:** Standard enterprise applications deploy Node.js containers onto AWS ECS or Kubernetes clusters, incurring constant infrastructure costs, complex ingress setups, and cold-start latencies.
- **Decision:** Deploy the backend application natively to **Cloudflare Pages / Workers**.
- **Consequences:** 
  - Sub-15ms worldwide request routing via Cloudflare's Anycast network.
  - Zero server management, patching, or scaling concerns.
  - Sub-100KB compiled worker bundle.

---

### ADR-002: Cloudflare D1 SQL Document Store vs. Traditional Relational ORM
- **Context:** Rigid relational database schemas with complex ORM migrations (e.g. Prisma, TypeORM) add friction during iterative feature additions and multi-tenant schema partitioning.
- **Decision:** Utilize **Cloudflare D1 SQLite** with an atomic JSON document store pattern (`json_store`), combined with `AsyncLocalStorage` request-scoped preloading.
- **Consequences:**
  - Complete ACID transaction compliance backed by SQLite at the edge.
  - Instantaneous workspace isolation (`db`, `demo`, `tenant:<id>`) without complex database sharding.
  - Zero database migration downtime: document schemas evolve gracefully through TypeScript type definitions.

---

### ADR-003: Vanilla Frontend Engineering vs. Heavy Client Frameworks
- **Context:** React, Next.js, and Angular introduce megabytes of JavaScript dependencies, hydration lag, and complex virtual DOM reconciliation lifecycles for simple Kanban interactions.
- **Decision:** Build the user interface with **Modern Vanilla JavaScript (ES2022)** and **Vanilla CSS3 Design Tokens**.
- **Consequences:**
  - Total initial HTML/JS/CSS payload size under 150KB (uncompressed).
  - First Contentful Paint (FCP) under 100ms.
  - Fluid drag-and-drop animations without state-thrashing or micro-stutters.
  - Infinite maintainability: zero framework version obsolescence or breaking npm upgrades.

---

### ADR-004: Strict Elimination of Client-Side LocalStorage Database Emulation
- **Context:** Earlier Proof-of-Concept (POC) iterations allowed the browser to fall back to `localStorage` when network errors occurred, leading to split-brain states where local test tickets appeared on public demo boards.
- **Decision:** Eliminate all client-side database emulation. The browser `localStorage` is restricted exclusively to security tokens and local UI preferences.
- **Consequences:**
  - Every card creation, move, or deletion is dispatched directly to the server REST API.
  - UI updates are guaranteed to be confirmed by the live Cloudflare D1 database.
  - Absolute single source of truth across all clients and sessions.

---

### ADR-005: Super Admin Approval Gate for User Onboarding
- **Context:** Publicly accessible SaaS applications frequently suffer from automated registration spam, bot registrations, and unauthorized multi-tenant workspace clutter.
- **Decision:** Implement a default `pending` status for all new user registrations, gated by a Super Admin approval mechanism with real-time notification alerts.
- **Consequences:**
  - Zero unauthorized data access or spam tenants.
  - Explicit administrative control over user lifecycle.
  - Full auditability of who was admitted to the system and by whom.

---

## 3. Product Evolution Roadmap (Handover Targets)

```
[ Current v1.3.0 ]
  ✓ Serverless D1 SQL Persistence
  ✓ Multi-Tenant Isolation
  ✓ Super Admin Approval Gate
  ✓ Full Agile Metrics (Gantt, Backlog, Reports)
         │
         ▼
[ Phase 2: Live Collaboration & WebSockets ]
  • Cloudflare Durable Objects / Server-Sent Events (SSE)
  • Real-time cursor tracking and instant board updates across teammates
         │
         ▼
[ Phase 3: AI-Augmented Agile Workflow ]
  • LLM Copilot analyzing task description and suggesting Story Points
  • Predictive delivery risk analysis based on historical team velocity
         │
         ▼
[ Phase 4: Ecosystem Integration ]
  • Two-way GitHub Issues & PR sync webhooks
  • Jira issue import/export toolchain
```
