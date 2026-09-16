# Database Engineering & Data Governance Manual
**Project:** Tiny Kanban  
**Target Audience:** Database Administrators (DBA), Data Engineers, Backend Architects  
**Primary Database Engine:** Cloudflare D1 (Distributed SQLite at the Edge)  
**Local Persistence:** Atomic JSON Engine (`write-file-atomic`)  
**Status:** Production Grade

---

## 1. Database Topology & Storage Engine

Tiny Kanban utilizes a distributed serverless SQLite storage engine provided by **Cloudflare D1**.

```
                   ┌────────────────────────────────────────┐
                   │    Cloudflare Edge Workers Runtime     │
                   └───────────────────┬────────────────────┘
                                       │
                        (D1 Binding: env.DB / SQLite)
                                       │
                                       ▼
                   ┌────────────────────────────────────────┐
                   │     Table: json_store (Single Table)   │
                   │  ┌──────────────────┬───────────────┐  │
                   │  │ key (TEXT PK)    │ value (TEXT)  │  │
                   │  ├──────────────────┼───────────────┤  │
                   │  │ 'db'             │ JSON Document │  │
                   │  │ 'demo'           │ JSON Document │  │
                   │  │ 'tenants_index'  │ JSON Document │  │
                   │  │ 'tenant:...'     │ JSON Document │  │
                   │  └──────────────────┴───────────────┘  │
                   └────────────────────────────────────────┘
```

### Key Architectural Advantages:
1. **Zero Database Cold Start:** Edge-replicated SQLite instances start instantly with negligible memory footprint.
2. **ACID Transaction Guarantees:** Atomic commits and serializable writes guarantee data safety.
3. **No Migration Lock-In:** Data is stored as structured JSON documents conforming to strict TypeScript schemas (`DbSchema`), allowing rapid schema evolution without blocking DDL table locks.

---

## 2. Table Definition & Storage Keyspace

The foundational table schema is defined in [`schema.sql`](file:///Users/yigitcangenc/Github/Antigravity/kanban/schema.sql):

```sql
CREATE TABLE IF NOT EXISTS json_store (
    key TEXT PRIMARY KEY,
    value TEXT
);
```

### Deterministic Keyspace Hierarchy:

| Storage Key | Data Scope | Document Schema | Access Pattern |
| :--- | :--- | :--- | :--- |
| `db` | Production Personal Workspace | `DbSchema` (Cards, Sprints, Users, Logs) | Read on login, written on card/user changes |
| `demo` | Nova Team Public Demo | `DbSchema` (51 Cards, 52 Sprints, 10 Users) | Read publicly with `X-Workspace: demo` |
| `tenants_index` | Tenant & Workspace Index | `TenantIndex` (Directory of all workspaces) | Read on auth routing, written on new workspace |
| `tenant:<id>` | Organization Team Workspace | `DbSchema` (Isolated team cards & sprints) | Read/Write scoped to team members |
| `test:*` | Automated Staging / Tests | Scoped Test `DbSchema` | Automated test suite isolation |

---

## 3. Query Optimization & Preload Strategy

To minimize D1 network roundtrips during HTTP request processing, `src/index.ts` executes a **single batch preload query** on worker initialization:

```typescript
// Single batch query fetching all active tenant states
const rows = await env.DB.prepare("SELECT key, value FROM json_store").all();
```

### Execution Lifecycle:
1. **Preload:** The batch query loads all relevant tenant documents into an in-memory `RequestContext.tenants` map.
2. **Execute:** Express routes read and mutate in-memory state with sub-millisecond execution time (`readDb(req)`).
3. **Dirty-Check & Flush:** At the end of the request lifecycle, only mutated tenants (`item.dirty === true`) are written back to D1 in an upsert transaction:
   ```sql
   INSERT INTO json_store (key, value) VALUES (?, ?)
   ON CONFLICT(key) DO UPDATE SET value = excluded.value;
   ```

---

## 4. Concurrency, Race Conditions & Data Integrity

### 4.1 Request-Scoped Execution (`AsyncLocalStorage`)
All concurrent requests run inside independent `RequestContext` scopes. Two simultaneous requests to different tenants never interfere with each other's memory or database locks.

### 4.2 Optimistic Concurrency & Idempotency
- **Task Counter:** Each card creation atomically increments `db.taskCounter` ensuring monotonically increasing task keys (`TK-1`, `TK-2`, ...).
- **Audit Log Capping:** `db.logs` is maintained as a rolling ring buffer capped at 1,000 entries to prevent database document bloat while maintaining compliance history.

---

## 5. Backup, Maintenance & Disaster Recovery Playbook

### 5.1 Automated Database Dump:
```bash
npx wrangler d1 export kanban-db --output=./backups/kanban_backup_$(date +%Y%m%d).sql --remote
```

### 5.2 Verification of Backup Integrity:
```bash
sqlite3 ./backups/kanban_backup_20260916.sql "SELECT key, length(value) FROM json_store;"
```

### 5.3 Point-In-Time Restoration:
```bash
npx wrangler d1 execute kanban-db --file=./backups/kanban_backup_20260916.sql --remote
```
