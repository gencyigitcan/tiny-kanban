# DevOps & Infrastructure Engineering Manual
**Project:** Kanban  
**Target Audience:** DevOps Engineers, Cloud Architects, Site Reliability Engineers (SRE)  
**Infrastructure Provider:** Cloudflare (Pages, Workers, D1 Serverless SQL, Edge CDN)  
**Production Domain:** https://kanban.gencyigitcan.com  
**Status:** Production Grade

---

## 1. Infrastructure Topology & Architecture

Kanban runs on a fully serverless, distributed edge computing topology with zero virtual machine management, zero Docker overhead, and automatic global multi-region scalability:

```
                  [ Global Anycast CDN / DNS: kanban.gencyigitcan.com ]
                                        │
                      ┌─────────────────┴─────────────────┐
                      ▼                                   ▼
             Static Assets CDN                   API & Dynamic Router
             (/css, /js, *.html)             (Cloudflare Worker: /api/*)
                      │                                   │
                      │                           [ Express Handler ]
                      │                         [ AsyncLocalStorage ]
                      │                                   │
                      └─────────────────┬─────────────────┘
                                        ▼
                           [ Cloudflare D1 SQL Database ]
                              (Binding: DB / json_store)
```

### Components Breakdown
1. **Cloudflare Pages:** Serves static single-page assets (`public/`) with instantaneous global edge caching, HTTP/2 + HTTP/3 support, and automated TLS certificates.
2. **Cloudflare Workers (`_worker.js`):** Intercepts API requests under `/api/*`, instantiates the Express application runtime, handles tenant routing, and verifies tokens.
3. **Cloudflare D1 Database (`kanban-db`):** Serverless SQLite database at the edge offering sub-10ms query execution and instant global read replication.

---

## 2. Configuration & Manifest Specification

The deployment is declared via [`wrangler.toml`](file:///Users/yigitcangenc/Github/Antigravity/kanban/wrangler.toml):

```toml
name = "kanban"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = "./public"

# Database binding linking Worker code to Cloudflare D1
[[d1_databases]]
binding = "DB"
database_name = "kanban-db"
database_id = "d1-kanban-prod-001"

[env.production]
vars = { APP_ENV = "production" }

[env.test]
vars = { APP_ENV = "test" }

[env.preview]
vars = { APP_ENV = "preview" }
```

### Critical Flags:
- `nodejs_compat`: Required for Node.js built-ins (`crypto`, `node:async_hooks`, `buffer`, `path`).
- `pages_build_output_dir = "./public"`: Static assets root deployed to Cloudflare Pages CDN.
- `_worker.js`: Output of `node build.js`, loaded automatically as the Advanced Mode Pages Worker.

---

## 3. Database Schema, Keyspace & Provisioning

The database utilizes Cloudflare D1. The initial schema is defined in [`schema.sql`](file:///Users/yigitcangenc/Github/Antigravity/kanban/schema.sql):

```sql
CREATE TABLE IF NOT EXISTS json_store (
    key TEXT PRIMARY KEY,
    value TEXT
);
```

### Provisioning via Wrangler CLI:
```bash
# 1. Create D1 Database instance
npx wrangler d1 create kanban-db

# 2. Execute initial schema in production
npx wrangler d1 execute kanban-db --file=./schema.sql --remote

# 3. Inspect table contents
npx wrangler d1 execute kanban-db --command="SELECT key FROM json_store;" --remote
```

### D1 Storage Keys Hierarchy:
- `db`: Master production database for personal workspace (contains Yiğitcan Genç's personal tickets).
- `demo`: Master demo database (contains 10-person Nova Team and 52 sprints).
- `tenants_index`: Master tenant directory mapping users to team workspaces.
- `tenant:<tenantId>`: Individual enterprise workspace database.
- `test:*`: Isolated keyspace prefix for automated staging/test environments.

---

## 4. Multi-Environment Isolation & Routing Strategy

To prevent cross-contamination between test runs and live user workspaces, the application enforces three-tier runtime isolation:

| Environment | Hostname / Header Pattern | Storage Keyspace | D1 Binding |
| :--- | :--- | :--- | :--- |
| **Production** | `kanban.gencyigitcan.com` | `db`, `demo`, `tenant:*` | Production D1 (`DB`) |
| **Staging / Preview** | `*test*.pages.dev`, `X-Environment: test` | `test:db`, `test:demo`, `test:tenant:*` | Scoped test keys |
| **Local Development** | `localhost:3000` | Local disk (`data/db.json`, `data/demo_db.json`) | Filesystem atomic writes |

Tenant resolution order:
1. `X-Workspace` or `X-Tenant-Id` request header (explicit workspace selection).
2. Bearer token prefix (e.g. `team_abc123:...` or `personal:...`).
3. Query parameter `?workspace=demo`.
4. Default fallback: `personal`.

---

## 5. Build Pipeline & Deployment Workflow

The application build pipeline compiles TypeScript code and bundles the worker in under 2 seconds:

```
[ Developer / CI Push ]
         │
         ▼
[ Type Check: tsc --noEmit ]
         │
         ▼
[ esbuild: build.js ] ──► Compiles src/index.ts -> public/_worker.js
         │
         ▼
[ Cloudflare Pages Deployment ] ──► Deploys static HTML/JS/CSS + _worker.js
```

### Manual Production Deployment:
```bash
# Compile and package production bundle
npm run build

# Deploy directly via Wrangler
npx wrangler pages deploy public --project-name=kanban
```

---

## 6. Observability, Logging & Health Checks

### 6.1 Real-Time Worker Tail Logs
```bash
npx wrangler pages deployment tail --project-name=kanban
```

### 6.2 Health Check & Heartbeat Endpoint
Verify live server responsiveness and D1 connectivity via cURL:
```bash
# 1. Public Demo Health Check (returns 51 cards)
curl -s https://kanban.gencyigitcan.com/api/cards -H "X-Workspace: demo" | jq '. | length'

# 2. Sprints Health Check (returns 52 sprints)
curl -s https://kanban.gencyigitcan.com/api/sprints -H "X-Workspace: demo" | jq '. | length'

# 3. User Directory Health Check (returns 10 Nova team members)
curl -s https://kanban.gencyigitcan.com/api/users -H "X-Workspace: demo" | jq 'map(.name)'
```

---

## 7. Backup, Disaster Recovery & Rollback

### 7.1 D1 Snapshot & Export:
```bash
# Export complete database dump to SQL file
npx wrangler d1 export kanban-db --output=./backup_$(date +%Y%m%d_%H%M%S).sql --remote
```

### 7.2 Database Restore:
```bash
npx wrangler d1 execute kanban-db --file=./backup_20260916.sql --remote
```

### 7.3 Instant Zero-Downtime Rollback:
If an issue occurs in a newly deployed commit, roll back instantly through Cloudflare Pages dashboard or via CLI:
```bash
# List previous deployments
npx wrangler pages deployment list --project-name=kanban

# Rollback to specific deployment ID
npx wrangler pages deployment rollback <DEPLOYMENT_ID> --project-name=kanban
```
