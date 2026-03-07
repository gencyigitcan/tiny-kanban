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

## Known Limitations

This is a **single-user, local-only** application:

- No authentication or authorization — do not expose to the public internet
- No HTTPS — run behind a reverse proxy (nginx + Let's Encrypt) for production
- JSON file storage is not suitable for concurrent multi-user access
