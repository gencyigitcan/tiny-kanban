# Quality Assurance (QA) Engineering Manual
**Project:** Kanban  
**Target Audience:** QA Engineers, Test Automation Specialists, SDETs  
**Test Frameworks:** tsx, Node.js Test Runner, esbuild, Supertest/Fetch  
**Status:** Production Grade

---

## 1. Quality Assurance Strategy & Test Pyramid

Kanban adheres to a pragmatic, edge-first testing pyramid:

```
                     ┌─────────────────┐
                     │   Manual / UI   │  (5%) Smoke & Visual UI Checks
                     ├─────────────────┤
                     │ 100-Point Sec.  │  (35%) Security & Threat Defense
                     ├─────────────────┤
                     │   Integration   │  (40%) End-to-End API & Multi-Tenant
                     ├─────────────────┤
                     │  Static & Type  │  (20%) Strict TypeScript & Zod Schemas
                     └─────────────────┘
```

### Core Testing Pillars:
1. **Zero-Contamination Isolation:** All test runs execute under `test:*` storage keys or dynamic in-memory state so production tenant data is never mutated or polluted.
2. **Schema & Contract Conformance:** Strict validation of JSON request/response contracts using Zod.
3. **Deterministic State Verification:** Assertions verify both HTTP status codes and underlying database state changes.

---

## 2. Test Suites & Execution Playbooks

### 2.1 Full E2E Integration Suite (`tests/integration.ts`)
Validates complete user lifecycles across multiple tenants and roles:
```bash
npx tsx tests/integration.ts
```
**Coverage Checklist:**
- [x] Super Admin registration & automatic authorization
- [x] Regular user registration with `status: 'pending'`
- [x] Login rejection for unapproved users (`403 Forbidden`)
- [x] Super Admin notification delivery and review
- [x] User approval lifecycle (`/api/admin/users/:id/approve`)
- [x] Approved user authenticated CRUD (Card create, move, delete)
- [x] Direct admin-level account provisioning
- [x] User rejection lifecycle (`/api/admin/users/:id/reject`)
- [x] Immutable audit trail verification (`/api/admin/logs`)
- [x] Public Demo API access with `X-Workspace: demo`
- [x] Verification of persistent personal workspace tickets

### 2.2 100-Point Security Test Suite (`tests/security_100_checks.ts`)
Runs 100 automated penetration testing vectors covering OWASP Top 10 (2025/2026), injection attacks, BOLA/IDOR, session hijacking, rate limiting, and multi-tenant isolation:
```bash
npx tsx tests/security_100_checks.ts
```

### 2.3 Type & Static Analysis
```bash
# Verify 100% strict type safety
npx tsc --noEmit
```

---

## 3. Regression Testing Matrix

| Component | Test Type | Trigger Condition | Pass Criteria |
| :--- | :--- | :--- | :--- |
| **Authentication** | Integration | Any PR modifying `src/routes/auth.ts` | 401 on bad password, 403 on pending user, 200 on approved |
| **Cards API** | Integration | Any PR modifying `src/routes/cards.ts` | 201 on create, 200 on move/update, 200 on delete, audit log fired |
| **Multi-Tenancy** | Security | Any PR modifying `src/lib/db.ts` | Cross-tenant access strictly blocked (404/403) |
| **Security Headers** | Contract | Any PR modifying `src/index.ts` | `nosniff`, strict CORS, and rate-limiting active |
| **Demo Sandbox** | Integration | Any PR modifying `src/lib/demo_data.ts` | 51 cards, 52 sprints, 10 users returned without Bearer token |

---

## 4. Continuous Quality Gate & CI/CD Integration

All pull requests and commits to `main` must pass the sequential quality gate:
```bash
# Integrated QA Gate
npm run build && npx tsx tests/integration.ts && npx tsx tests/security_100_checks.ts
```
Any exit code other than `0` blocks deployment immediately.
