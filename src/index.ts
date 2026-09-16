// ============================================================
//  Kanban — Server Entry Point
//  Stack: Express 4 · TypeScript · Zod · helmet · morgan
// ============================================================
import express from 'express';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import {
    initDb,
    readDb,
    dbContext,
    getEnvironment,
    resolveStorageKey,
    loadTenantDbFromD1,
    saveTenantDbToD1,
    getTenantIndex,
    saveTenantIndex,
    ensurePersonalDbIntegrity,
    RequestContext
} from './lib/db.js';
import { createDefaultDemoDb } from './lib/demo_data.js';
import { cardRouter } from './routes/cards.js';
import { epicRouter } from './routes/epics.js';
import { sprintRouter } from './routes/sprints.js';
import { authRouter } from './routes/auth.js';
import { adminRouter } from './routes/admin.js';
import { labelsRouter } from './routes/labels.js';
import { notificationsRouter } from './routes/notifications.js';
import { requireAuth } from './middleware/auth.js';
import { errorHandler } from './middleware/error.js';

// ── Init & Environment Check ──────────────────────────────
const isNode = typeof process !== 'undefined' && process.release?.name === 'node' && typeof globalThis.caches === 'undefined';
if (isNode) {
    initDb();
}

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// ── Security middleware ────────────────────────────────────
app.use(helmet({
    // CSP relaxed for inline styles/scripts used by the frontend
    contentSecurityPolicy: false,
}));

app.use(cors({
    origin: process.env.CORS_ORIGIN ?? ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// ── Rate limiting (API only - Node.js local mode only) ─────
if (isNode) {
    const apiLimiter = rateLimit({
        windowMs: 60_000,       // 1 minute
        max: 200,          // 200 requests / minute
        standardHeaders: true,
        legacyHeaders: false,
        message: { error: 'Too many requests, please slow down.' },
    });
    app.use('/api/', apiLimiter);
}

// ── Request parsing & logging ─────────────────────────────
app.use(express.json({ limit: '128kb' }));
if (isNode) {
    app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Environment & Tenant detection middleware for Express
app.use((req, _res, next) => {
    req.environment = getEnvironment(req);
    next();
});

// ── Static files ──────────────────────────────────────────
app.use(express.static(path.join(process.cwd(), 'public')));

// ── API Routes ─────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);

app.get('/api/users', requireAuth, (req, res) => {
    const db = readDb(req);
    const publicUsers = db.users.map(u => ({
        id: u.id,
        username: u.username,
        name: u.name,
        avatarColor: u.avatarColor
    }));
    res.json(publicUsers);
});

app.use('/api/labels', requireAuth, labelsRouter);
app.use('/api/notifications', requireAuth, notificationsRouter);

app.use('/api/cards', requireAuth, cardRouter);
app.use('/api/epics', requireAuth, epicRouter);
app.use('/api/sprints', requireAuth, sprintRouter);

// ── Serve HTML Pages ──────────────────────────────────────
app.get('/', (_req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});
app.get('/demo', (_req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'demo.html'));
});
app.get('/board', (_req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'board.html'));
});
app.get('/login', (_req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'board.html'));
});
app.get('/register', (_req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'register.html'));
});

// ── 404 catch-all (API) ───────────────────────────────────
app.all('/api/*', (_req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});

// ── Global error handler (must be last) ───────────────────
app.use(errorHandler);

// ── Cloudflare Workers Export ──────────────────────────────
let server: any = null;

export default {
    async fetch(request: Request, env: any, ctx: any) {
        if (!server) {
            // @ts-ignore
            const { httpServerHandler } = await import('cloudflare:node');
            server = httpServerHandler({
                port: PORT
            });
        }

        const url = new URL(request.url);
        // Serve static assets directly from Cloudflare Pages CDN
        if (!url.pathname.startsWith('/api/')) {
            if (url.pathname === '/demo') {
                return env.ASSETS.fetch(new Request(new URL('/demo.html', request.url), request));
            }
            if (url.pathname === '/board' || url.pathname === '/login') {
                return env.ASSETS.fetch(new Request(new URL('/board.html', request.url), request));
            }
            if (url.pathname === '/register') {
                return env.ASSETS.fetch(new Request(new URL('/register.html', request.url), request));
            }
            return env.ASSETS.fetch(request);
        }

        const envName = getEnvironment(request, env);

        // Resolve active tenant from token or header
        const authHeader = request.headers.get('authorization');
        let initialTenantId = 'personal';
        const isDemoReq = request.headers.get('x-workspace') === 'demo' || 
                          request.headers.get('x-tenant-id') === 'demo' || 
                          url.searchParams.get('workspace') === 'demo';

        if (isDemoReq) {
            initialTenantId = 'demo';
        } else if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            if (token.includes(':')) {
                initialTenantId = token.split(':')[0];
            }
        } else if (request.headers.get('x-tenant-id')) {
            initialTenantId = request.headers.get('x-tenant-id')!;
        } else if (request.headers.get('x-workspace')) {
            initialTenantId = request.headers.get('x-workspace')!;
        }

        const tenantsMap = new Map<string, { db: any; dirty: boolean; key: string }>();
        let tenantIndex: any = undefined;

        if (env.DB) {
            try {
                // Ensure json_store table exists
                await env.DB.prepare("CREATE TABLE IF NOT EXISTS json_store (key TEXT PRIMARY KEY, value TEXT)").run();

                // Batch preload all keys from D1 in a single query
                const rows = await env.DB.prepare("SELECT key, value FROM json_store").all();
                if (rows && rows.results) {
                    const indexKey = envName === 'test' ? 'test:tenants_index' : 'tenants_index';
                    const dbKey = envName === 'test' ? 'test:db' : 'db';
                    const demoKey = envName === 'test' ? 'test:demo' : 'demo';
                    const tenantPrefix = envName === 'test' ? 'test:tenant:' : 'tenant:';

                    for (const row of rows.results as any[]) {
                        if (!row.key || typeof row.value !== 'string') continue;
                        if (row.key === indexKey) {
                            try { tenantIndex = JSON.parse(row.value); } catch {}
                        } else if (row.key === dbKey) {
                            try {
                                const parsed = JSON.parse(row.value);
                                const changed = (envName === 'production' && (!parsed.cards || parsed.cards.length === 0)) ? ensurePersonalDbIntegrity(parsed) : false;
                                tenantsMap.set('personal', { db: parsed, dirty: changed, key: dbKey });
                            } catch {}
                        } else if (row.key === demoKey) {
                            try {
                                let parsed = JSON.parse(row.value);
                                let changed = false;
                                if (!parsed.users || parsed.users.length < 10 || !parsed.sprints || parsed.sprints.length < 104 || !parsed.cards || parsed.cards.length < 1000) {
                                    parsed = createDefaultDemoDb();
                                    changed = true;
                                }
                                tenantsMap.set('demo', { db: parsed, dirty: changed, key: demoKey });
                            } catch {}
                        } else if (row.key.startsWith(tenantPrefix)) {
                            const tId = row.key.slice(tenantPrefix.length);
                            try {
                                const parsed = JSON.parse(row.value);
                                tenantsMap.set(tId, { db: parsed, dirty: false, key: row.key });
                            } catch {}
                        }
                    }
                }
            } catch (err) {
                console.error("D1 batch preload failed:", err);
            }
        }

        // Ensure activeTenantId is loaded
        if (!tenantsMap.has(initialTenantId)) {
            const tenantDb = await loadTenantDbFromD1(env.DB, initialTenantId, envName);
            tenantsMap.set(initialTenantId, {
                db: tenantDb,
                dirty: false,
                key: resolveStorageKey(envName, initialTenantId)
            });
        }

        // Always ensure 'personal' is loaded (for auth and personal tickets)
        if (!tenantsMap.has('personal')) {
            const personalDb = await loadTenantDbFromD1(env.DB, 'personal', envName);
            tenantsMap.set('personal', {
                db: personalDb,
                dirty: false,
                key: resolveStorageKey(envName, 'personal')
            });
        }

        // Always ensure 'demo' is loaded
        if (!tenantsMap.has('demo')) {
            const demoDb = await loadTenantDbFromD1(env.DB, 'demo', envName);
            tenantsMap.set('demo', {
                db: demoDb,
                dirty: false,
                key: resolveStorageKey(envName, 'demo')
            });
        }

        // Ensure tenant index is loaded
        if (!tenantIndex) {
            tenantIndex = await getTenantIndex(envName, env.DB);
        }

        const contextStore: RequestContext = {
            envName,
            d1Binding: env.DB,
            activeTenantId: initialTenantId,
            tenants: tenantsMap,
            index: tenantIndex,
            indexDirty: false
        };

        return dbContext.run(contextStore, async () => {
            const response = await server.fetch(request, env, ctx);
            const store = dbContext.getStore();
            if (store && store.d1Binding) {
                for (const item of store.tenants.values()) {
                    if (item.dirty) {
                        await saveTenantDbToD1(store.d1Binding, item.key, item.db);
                    }
                }
                if (store.index && store.indexDirty) {
                    await saveTenantIndex(store.index, store.envName, store.d1Binding);
                }
            }
            return response;
        });
    }
};

// ── Server Start ───────────────────────────────────────────
const isRunningTests = process.env.NODE_ENV === 'test' || process.argv.some(arg => arg.includes('test'));
if (!isRunningTests) {
    app.listen(PORT, () => {
        console.log(`\n  🟣 Kanban v1.3.0\n`);
        console.log(`     My Board  → http://localhost:${PORT}/board.html`);
        console.log(`     Demo      → http://localhost:${PORT}/demo.html`);
        console.log(`     API       → http://localhost:${PORT}/api/cards\n`);
    });
}

export { app };
