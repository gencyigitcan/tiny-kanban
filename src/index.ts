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

import { initDb } from './lib/db.js';
import { cardRouter } from './routes/cards.js';
import { epicRouter } from './routes/epics.js';
import { sprintRouter } from './routes/sprints.js';
import { errorHandler } from './middleware/error.js';

// ── Init ───────────────────────────────────────────────────
initDb();

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

// ── Rate limiting (API only) ───────────────────────────────
const apiLimiter = rateLimit({
    windowMs: 60_000,       // 1 minute
    max: 200,          // 200 requests / minute
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please slow down.' },
});
app.use('/api/', apiLimiter);

// ── Request parsing & logging ─────────────────────────────
app.use(express.json({ limit: '128kb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ── Static files ──────────────────────────────────────────
app.use(express.static(path.join(process.cwd(), 'public')));

// ── API Routes ─────────────────────────────────────────────
app.use('/api/cards', cardRouter);
app.use('/api/epics', epicRouter);
app.use('/api/sprints', sprintRouter);

// ── Root redirect ─────────────────────────────────────────
app.get('/', (_req, res) => res.redirect('/board.html'));

// ── 404 catch-all (API) ───────────────────────────────────
app.use('/api/*path', (_req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});

// ── Global error handler (must be last) ───────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n  🟣 Tiny Kanban v1.2.0\n`);
    console.log(`     My Board  → http://localhost:${PORT}/board.html`);
    console.log(`     Demo      → http://localhost:${PORT}/demo.html`);
    console.log(`     API       → http://localhost:${PORT}/api/cards\n`);
});
