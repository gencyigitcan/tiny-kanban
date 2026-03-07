// ============================================================
//  Atomic JSON Database Service
// ============================================================
import fs from 'fs';
import path from 'path';
import writeFileAtomic from 'write-file-atomic';
import type { DbSchema } from '../types/index.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

const EMPTY_DB: DbSchema = { cards: [], epics: [], sprints: [] };

/** Ensure data directory and db.json exist on startup */
export function initDb(): void {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify(EMPTY_DB, null, 2), 'utf8');
    }
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
