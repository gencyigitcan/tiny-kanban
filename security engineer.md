# Security Engineering & Threat Modeling Specification
**Project:** Tiny Kanban  
**Target Audience:** Security Engineers, Penetration Testers, Compliance Officers, DevSecOps  
**Compliance Standards:** OWASP ASVS Level 2, SOC 2 Type II Alignment  
**Status:** Production Grade

---

## 1. Security Architecture & Threat Model (STRIDE)

Tiny Kanban is architected with defense-in-depth principles across the edge, application, and database layers:

```
                  [ HTTPS TLS 1.3 Strict Edge Termination ]
                                     │
                 [ Helmet Security Headers & CORS Policy ]
                                     │
                 [ Express Rate Limiter (200 req/min/IP) ]
                                     │
                 [ Zod Runtime Schema Validation Layer ]
                                     │
                 [ Multi-Tenant Cryptographic Bearer Auth ]
                                     │
                 [ AsyncLocalStorage Scope Isolation ]
                                     │
                 [ Cloudflare D1 Parameterized SQL Queries ]
```

### STRIDE Threat Matrix & Countermeasures

| Threat Category | Potential Attack Vector | Architectural Mitigation in Tiny Kanban |
| :--- | :--- | :--- |
| **Spoofing** | Forged user identity or hijacked session tokens | Cryptographic tokens generated via `crypto.randomBytes(24)`, scoped to specific tenant IDs, expiring after 7 days. |
| **Tampering** | Parameter manipulation or payload tampering | Strict Zod validation schemas (`src/lib/schemas.ts`) stripping unknown properties and rejecting invalid formats. |
| **Repudiation** | Denying an administrative or destructive action | Centralized immutable Activity Logging (`logActivity`) capturing user ID, IP/scope, action type, and epoch timestamp. |
| **Information Disclosure** | Cross-tenant data leakage or exposed password hashes | Hard database keyspace separation (`db`, `demo`, `tenant:<id>`), PBKDF2 SHA-512 password hashing with per-user random salts. |
| **Denial of Service** | Volumetric API spamming or brute force login attempts | Edge-level rate limiting (`express-rate-limit`), Cloudflare Anycast DDoS mitigation, and request payload limits (`128kb`). |
| **Elevation of Privilege** | User escalating role to Super Admin | Role checks executed server-side via `requireAuth`; `superadmin` role strictly reserved for verified owner accounts. |

---

## 2. Authentication & Cryptography Specification

### 2.1 Password Storage
Passwords are never stored in plaintext or weak cryptographic hashes (MD5, SHA-1). The application enforces salted PBKDF2:
- **Algorithm:** PBKDF2 (`sha512`)
- **Salt:** 16-byte random cryptographically secure hex string (`crypto.randomBytes(16)`)
- **Iterations:** 1,000 rounds
- **Derived Key Length:** 64 bytes
- **Format:** `<salt>:<derivedHash>`

```typescript
export function hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
}
```

### 2.2 Session Tokens
Session tokens are generated using entropy-rich random bytes:
```typescript
const randomBytes = crypto.randomBytes(24).toString('hex');
const token = `${tenantId}:${randomBytes}`;
```
Tokens are scoped directly to the tenant ID they authorize. A token generated for `tenant_A` cannot be used to query or mutate records in `tenant_B`.

---

## 3. Multi-Tenant Isolation & Zero Cross-Contamination

### 3.1 Scoped Keyspace
In the underlying Cloudflare D1 SQL store, all operations are isolated by deterministic keys:
- `db`: Personal workspace for Super Admin.
- `demo`: Isolated demo sandbox.
- `tenant:<tenantId>`: Organization-specific database partition.

### 3.2 Parameterized SQL Execution
Direct string concatenation in SQL queries is strictly prohibited. All queries to Cloudflare D1 use parameterized binding:
```typescript
await dbBinding.prepare(
    "SELECT value FROM json_store WHERE key = ?"
).bind(key).first();
```
This guarantees mathematical immunity against SQL Injection attacks.

---

## 4. Input Validation & XSS Prevention

### 4.1 Strict Zod Request Validation
All mutating HTTP endpoints enforce runtime validation schemas:
- `createCardSchema`: Rejects malicious status strings, limits title length, validates due date format.
- `registerSchema`: Rejects usernames under 3 characters, enforces password complexity.
- `loginSchema`: Sanitizes input before querying the database.

### 4.2 HTML Entity Escaping in UI
All user-generated text rendered in the browser DOM is filtered through an HTML escaping sanitizer:
```javascript
function escHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
```
Direct `innerHTML` assignment of raw user strings is forbidden throughout the client codebase.

---

## 5. Audit Logging & Security Event Tracing

The platform features an automated audit trail (`logActivity`) recording critical security and administrative events:

| Event Identifier | Severity | Triggering Action |
| :--- | :---: | :--- |
| `REGISTER_REQUEST` | Medium | New user submits registration form; pending approval. |
| `USER_APPROVED` | High | Super Admin approves pending account. |
| `USER_REJECTED` | High | Super Admin rejects registration. |
| `LOGIN` | Low | Successful user authentication. |
| `LOGOUT` | Low | User logs out of active session. |
| `CARD_CREATE` | Low | Task card created in workspace. |
| `CARD_MOVE` | Low | Task card moved between workflow columns. |
| `CARD_DELETE` | Medium | Task card permanently removed. |
| `USER_DELETED` | Critical | User account removed by Super Admin. |

Audit records are stored in the primary workspace database and can be inspected in real-time via `GET /api/admin/logs`.
