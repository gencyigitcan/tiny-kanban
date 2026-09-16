# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.2.x   | ✅ Yes     |
| < 1.2   | ❌ No      |

## Reporting a Vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Instead, report via email to the repository owner or open a [GitHub Security Advisory](https://github.com/gencyigitcan/tiny-kanban/security/advisories/new).

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact assessment
- Suggested fix (optional)

You should receive a response within **48 hours**.

## Security Design

| Layer | Control |
|-------|---------|
| HTTP headers | `helmet` — removes `X-Powered-By`, sets `X-Content-Type-Options`, `X-Frame-Options`, etc. |
| CORS | Restricted to `CORS_ORIGIN` env var (default: localhost only) |
| Rate limiting | 200 req/min per IP on all `/api/*` routes via `express-rate-limit` |
| Input validation | Zod schemas on every POST/PUT — enum values, max lengths, type checking |
| Body size | `express.json({ limit: '128kb' })` |
| Persistence | `write-file-atomic` prevents partial JSON writes on process crash |
| Secrets | `data/db.json` excluded from git via `.gitignore` |

## Security Controls & Compliance (v1.3.0 Enterprise)

| Layer | Control & Implementation |
|-------|--------------------------|
| **Authentication** | Salted PBKDF2-SHA-512 (1000 iterations, 64-byte key) with constant-time verification (`timingSafeEqual`) |
| **Session Security** | 256-bit cryptographically secure session tokens, prefixed tenant keys, rolling TTL expiration |
| **Authorization (RBAC)** | Role tiers (`superadmin`, `admin`, `user`), Super Admin approval gate on registration, tenant-scoped access control |
| **Multi-Tenant Isolation** | Strict logical database partitioning, workspace authorization enforcement, tenant spoofing prevention |
| **HTTP Hardening** | `helmet` (removes `X-Powered-By`, sets `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`) |
| **CORS Policy** | Whitelist-based origin validation, controlled HTTP methods (GET, POST, PUT, DELETE) |
| **Rate Limiting** | 200 requests/minute per IP on `/api/*` endpoints via sliding window counter |
| **Input Validation** | Strict Zod schema boundaries on all endpoints, payload length limits, enum enforcement, sanitization |
| **Payload Size Limits** | Hard 128KB JSON body limit (`express.json({ limit: '128kb' })`) preventing resource exhaustion |
| **Data Integrity** | Cloudflare D1 distributed SQLite storage, atomic write operations, monotonic task key counters |
| **Audit & Forensics** | Non-repudiation event ledger (`CARD_CREATE`, `CARD_MOVE`, `USER_APPROVED`, `LOGIN`, `LOGOUT`, etc.) |

## Security Testing & Verification

The system undergoes rigorous automated security regression testing against **2026 Cybersecurity Trends & OWASP Top 10**, covering 100 granular test steps across 10 security domains (`tests/security_100_checks.ts`):
1. Authentication & Password Rigor
2. Session Token & Header Cryptography
3. Role-Based Access Control (RBAC) & Privilege Escalation
4. User Lifecycle & Approval Gate Enforcement
5. Multi-Tenant Data Isolation & BOLA/IDOR Defense
6. Injection Mitigations (SQLi, NoSQLi, Null Byte, Traversal)
7. Cross-Site Scripting (XSS) & Input Sanitization
8. Schema Boundaries & Mass Assignment Prevention
9. DoS, Rate Limiting & Resource Exhaustion
10. Security Headers, Transport & Audit Trail Integrity
