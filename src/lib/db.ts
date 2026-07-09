// ============================================================
//  Atomic JSON Database Service
// ============================================================
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import writeFileAtomic from 'write-file-atomic';
import type { DbSchema, User } from '../types/index.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

const EMPTY_DB: DbSchema = { cards: [], epics: [], sprints: [], users: [], sessions: [], labels: [], notifications: [], taskCounter: 0 };

function hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
}

/** Ensure data directory and db.json exist on startup */
export function initDb(): void {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    
    let db: DbSchema;
    if (!fs.existsSync(DATA_FILE)) {
        db = structuredClone(EMPTY_DB);
    } else {
        try {
            const raw = fs.readFileSync(DATA_FILE, 'utf8');
            const parsed = JSON.parse(raw) as Partial<DbSchema>;
            db = {
                cards: Array.isArray(parsed.cards) ? parsed.cards : [],
                epics: Array.isArray(parsed.epics) ? parsed.epics : [],
                sprints: Array.isArray(parsed.sprints) ? parsed.sprints : [],
                users: Array.isArray(parsed.users) ? parsed.users : [],
                sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
                labels: Array.isArray(parsed.labels) ? parsed.labels : [],
                notifications: Array.isArray(parsed.notifications) ? parsed.notifications : [],
                taskCounter: typeof parsed.taskCounter === 'number' ? parsed.taskCounter : 0
            };
        } catch {
            db = structuredClone(EMPTY_DB);
        }
    }

    // Seed mock team users if empty
    if (db.users.length === 0) {
        const seededUsers: User[] = [
            {
                id: 'usr-1',
                username: 'admin',
                name: 'Ali Yılmaz',
                passwordHash: hashPassword('password'),
                avatarColor: '#4f46e5',
                createdAt: Date.now()
            },
            {
                id: 'usr-2',
                username: 'zeynep',
                name: 'Zeynep Kaya',
                passwordHash: hashPassword('password'),
                avatarColor: '#0ea5e9',
                createdAt: Date.now()
            },
            {
                id: 'usr-3',
                username: 'mehmet',
                name: 'Mehmet Demir',
                passwordHash: hashPassword('password'),
                avatarColor: '#10b981',
                createdAt: Date.now()
            }
        ];
        db.users = seededUsers;
    }

    // Seed standard labels if empty
    if (!db.labels || db.labels.length === 0) {
        db.labels = [
            { id: 'bug', name: 'Bug', color: '#ef4444', bg: '#fef2f2', createdAt: Date.now() },
            { id: 'feature', name: 'Özellik', color: '#6366f1', bg: '#eef2ff', createdAt: Date.now() },
            { id: 'task', name: 'Görev', color: '#3b82f6', bg: '#eff6ff', createdAt: Date.now() },
            { id: 'design', name: 'Tasarım', color: '#8b5cf6', bg: '#f5f3ff', createdAt: Date.now() },
            { id: 'devops', name: 'DevOps', color: '#0891b2', bg: '#ecfeff', createdAt: Date.now() },
            { id: 'test', name: 'Test', color: '#16a34a', bg: '#f0fdf4', createdAt: Date.now() },
            { id: 'docs', name: 'Belge', color: '#ca8a04', bg: '#fefce8', createdAt: Date.now() },
            { id: 'urgent', name: 'Acil', color: '#dc2626', bg: '#fff1f2', createdAt: Date.now() }
        ];
    }

    // Retroactively assign keys if missing, and sync taskCounter
    let maxNum = db.taskCounter || 0;
    db.cards.forEach(c => {
        if (c.key) {
            const num = parseInt(c.key.replace('TK-', ''), 10);
            if (!isNaN(num) && num > maxNum) maxNum = num;
        }
    });
    db.cards.forEach(c => {
        if (!c.key) {
            maxNum++;
            c.key = `TK-${maxNum}`;
        }
    });
    db.taskCounter = maxNum;

    writeDbSync(db);
}

// ── Cloudflare Workers & AsyncLocalStorage Context ────────
import { AsyncLocalStorage } from 'node:async_hooks';

export const dbContext = new AsyncLocalStorage<DbSchema & { _dirty?: boolean }>();

/** Read entire DB synchronously, always returns a valid shape */
export function readDb(): DbSchema {
    const store = dbContext.getStore();
    if (store) {
        return store;
    }

    try {
        if (!fs.existsSync(DATA_FILE)) {
            return structuredClone(EMPTY_DB);
        }
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        const parsed = JSON.parse(raw) as Partial<DbSchema>;
        return {
            cards: Array.isArray(parsed.cards) ? parsed.cards : [],
            epics: Array.isArray(parsed.epics) ? parsed.epics : [],
            sprints: Array.isArray(parsed.sprints) ? parsed.sprints : [],
            users: Array.isArray(parsed.users) ? parsed.users : [],
            sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
            labels: Array.isArray(parsed.labels) ? parsed.labels : [],
            notifications: Array.isArray(parsed.notifications) ? parsed.notifications : [],
            taskCounter: typeof parsed.taskCounter === 'number' ? parsed.taskCounter : 0
        };
    } catch {
        return structuredClone(EMPTY_DB);
    }
}

/** Write DB atomically — prevents partial writes on crash */
export async function writeDb(data: DbSchema): Promise<void> {
    const store = dbContext.getStore();
    if (store) {
        Object.assign(store, data);
        store._dirty = true;
        return;
    }

    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    await writeFileAtomic(DATA_FILE, JSON.stringify(data, null, 2), { encoding: 'utf8' });
}

/** Synchronous write (for route handlers returning sync responses) */
export function writeDbSync(data: DbSchema): void {
    const store = dbContext.getStore();
    if (store) {
        Object.assign(store, data);
        store._dirty = true;
        return;
    }

    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    writeFileAtomic.sync(DATA_FILE, JSON.stringify(data, null, 2));
}

/** Load database state from Cloudflare D1 */
export async function loadDbFromD1(dbBinding: any): Promise<DbSchema> {
    try {
        const row = await dbBinding.prepare("SELECT value FROM json_store WHERE key = 'db'").first();
        if (row && typeof row.value === 'string') {
            const parsed = JSON.parse(row.value) as Partial<DbSchema>;
            return {
                cards: Array.isArray(parsed.cards) ? parsed.cards : [],
                epics: Array.isArray(parsed.epics) ? parsed.epics : [],
                sprints: Array.isArray(parsed.sprints) ? parsed.sprints : [],
                users: Array.isArray(parsed.users) ? parsed.users : [],
                sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
                labels: Array.isArray(parsed.labels) ? parsed.labels : [],
                notifications: Array.isArray(parsed.notifications) ? parsed.notifications : [],
                taskCounter: typeof parsed.taskCounter === 'number' ? parsed.taskCounter : 0
            };
        }
    } catch (e) {
        console.error("D1 database load failed, fallback to seeding initial data:", e);
    }

    // Seed default data if empty or query failed
    const db = structuredClone(EMPTY_DB);
    db.users = [
        {
            id: 'usr-1',
            username: 'admin',
            name: 'Ali Yılmaz',
            passwordHash: hashPassword('password'),
            avatarColor: '#4f46e5',
            createdAt: Date.now()
        },
        {
            id: 'usr-2',
            username: 'zeynep',
            name: 'Zeynep Kaya',
            passwordHash: hashPassword('password'),
            avatarColor: '#0ea5e9',
            createdAt: Date.now()
        },
        {
            id: 'usr-3',
            username: 'mehmet',
            name: 'Mehmet Demir',
            passwordHash: hashPassword('password'),
            avatarColor: '#10b981',
            createdAt: Date.now()
        }
    ];
    db.labels = [
        { id: 'bug', name: 'Bug', color: '#ef4444', bg: '#fef2f2', createdAt: Date.now() },
        { id: 'feature', name: 'Özellik', color: '#6366f1', bg: '#eef2ff', createdAt: Date.now() },
        { id: 'task', name: 'Görev', color: '#3b82f6', bg: '#eff6ff', createdAt: Date.now() },
        { id: 'design', name: 'Tasarım', color: '#8b5cf6', bg: '#f5f3ff', createdAt: Date.now() },
        { id: 'devops', name: 'DevOps', color: '#0891b2', bg: '#ecfeff', createdAt: Date.now() },
        { id: 'test', name: 'Test', color: '#16a34a', bg: '#f0fdf4', createdAt: Date.now() },
        { id: 'docs', name: 'Belge', color: '#ca8a04', bg: '#fefce8', createdAt: Date.now() },
        { id: 'urgent', name: 'Acil', color: '#dc2626', bg: '#fff1f2', createdAt: Date.now() }
    ];

    await saveDbToD1(dbBinding, db);
    return db;
}

/** Save database state to Cloudflare D1 */
export async function saveDbToD1(dbBinding: any, data: DbSchema): Promise<void> {
    const dataToSave = { ...data };
    delete (dataToSave as any)._dirty;
    const value = JSON.stringify(dataToSave);
    await dbBinding.prepare(
        "INSERT INTO json_store (key, value) VALUES ('db', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
    ).bind(value).run();
}

/** Generate a short collision-resistant ID */
export function uid(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}


