// ============================================================
//  Tiny Kanban — Server Entry Point
//  Stack: Express 4 · TypeScript · Zod · helmet · morgan
// ============================================================
import express from 'express';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { initDb, readDb, dbContext, loadDbFromD1, saveDbToD1 } from './lib/db.js';
import { cardRouter } from './routes/cards.js';
import { epicRouter } from './routes/epics.js';
import { sprintRouter } from './routes/sprints.js';
import { authRouter } from './routes/auth.js';
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

// ── Static files ──────────────────────────────────────────
app.use(express.static(path.join(process.cwd(), 'public')));

// ── API Routes ─────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.get('/api/users', requireAuth, (_req, res) => {
    const db = readDb();
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

// ── Serve Landing Page at Root ────────────────────────────
app.get('/', (_req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// ── 404 catch-all (API) ───────────────────────────────────
app.use('/api/*path', (_req, res) => {
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
        const db = await loadDbFromD1(env.DB);
        return dbContext.run(db, async () => {
            const response = await server.fetch(request, env, ctx);
            const store = dbContext.getStore();
            if (store && store._dirty) {
                await saveDbToD1(env.DB, store);
            }
            return response;
        });
    }
};

// ── Server Start ───────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n  🟣 Tiny Kanban v1.3.0\n`);
    console.log(`     My Board  → http://localhost:${PORT}/board.html`);
    console.log(`     Demo      → http://localhost:${PORT}/demo.html`);
    console.log(`     API       → http://localhost:${PORT}/api/cards\n`);
});

