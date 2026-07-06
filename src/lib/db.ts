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

const EMPTY_DB: DbSchema = { cards: [], epics: [], sprints: [], users: [], sessions: [], labels: [], notifications: [] };

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

    writeDbSync(db);
}

/** Read entire DB synchronously, always returns a valid shape */
export function readDb(): DbSchema {
    try {
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
        };
    } catch {
        return structuredClone(EMPTY_DB);
    }
}

/** Write DB atomically — prevents partial writes on crash */
export async function writeDb(data: DbSchema): Promise<void> {
    await writeFileAtomic(DATA_FILE, JSON.stringify(data, null, 2), { encoding: 'utf8' });
}

/** Synchronous write (for route handlers returning sync responses) */
export function writeDbSync(data: DbSchema): void {
    writeFileAtomic.sync(DATA_FILE, JSON.stringify(data, null, 2));
}

/** Generate a short collision-resistant ID */
export function uid(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

