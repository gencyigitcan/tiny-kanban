// ============================================================
//  Atomic JSON Database Service (Multi-Environment & Multi-Tenant)
// ============================================================
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import writeFileAtomic from 'write-file-atomic';
import { AsyncLocalStorage } from 'node:async_hooks';
import type { DbSchema, Workspace, TenantIndex, ActivityLog } from '../types/index.js';
import { createDefaultDemoDb, YIGITCAN_USER_CARDS } from './demo_data.js';

export type Environment = 'production' | 'test' | 'development';
export type DbScope = 'personal' | 'demo' | string;

const DATA_DIR = path.join(process.cwd(), 'data');
const TENANTS_DIR = path.join(DATA_DIR, 'tenants');
const PERSONAL_DATA_FILE = path.join(DATA_DIR, 'db.json');
const DEMO_DATA_FILE = path.join(DATA_DIR, 'demo_db.json');

export const EMPTY_DB: DbSchema = {
    cards: [],
    epics: [],
    sprints: [],
    users: [],
    sessions: [],
    labels: [],
    notifications: [],
    taskCounter: 0,
    workspaces: [],
    logs: []
};

// ── Cloudflare Workers Runtime Detection ─────────────────────
export function isNodeRuntime(): boolean {
    return typeof process !== 'undefined' && process.release?.name === 'node' && typeof (globalThis as any).caches === 'undefined';
}

// ── Password Hashing Helpers ─────────────────────────────────
export function hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
    if (!password || !stored) return false;
    const [salt, hash] = stored.split(':');
    if (!salt || !hash) return false;
    try {
        const testHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
        const hashBuf = Buffer.from(hash, 'hex');
        const testBuf = Buffer.from(testHash, 'hex');
        if (hashBuf.length !== testBuf.length) return false;
        return crypto.timingSafeEqual(hashBuf, testBuf);
    } catch {
        return false;
    }
}

// ── Environment Detection ────────────────────────────────────
export function getEnvironment(reqOrScope?: any, envBinding?: any): Environment {
    // 1. Cloudflare Workers env variable
    if (envBinding?.APP_ENV) {
        const val = String(envBinding.APP_ENV).toLowerCase();
        if (val === 'test' || val === 'preview') return 'test';
        if (val === 'production') return 'production';
        if (val === 'development') return 'development';
    }

    // 2. Node.js process environment
    if (typeof process !== 'undefined' && process.env?.APP_ENV) {
        const val = String(process.env.APP_ENV).toLowerCase();
        if (val === 'test' || val === 'preview') return 'test';
        if (val === 'production') return 'production';
        if (val === 'development') return 'development';
    }

    // 3. Check request headers / host / query
    if (reqOrScope && typeof reqOrScope === 'object') {
        let host = '';
        let xEnv = '';

        if (typeof reqOrScope.headers?.get === 'function') {
            host = reqOrScope.headers.get('host') || '';
            xEnv = reqOrScope.headers.get('x-environment') || '';
        } else if (reqOrScope.headers) {
            host = reqOrScope.headers['host'] || '';
            xEnv = reqOrScope.headers['x-environment'] || '';
        }

        if (xEnv.toLowerCase() === 'test' || xEnv.toLowerCase() === 'preview') return 'test';
        if (xEnv.toLowerCase() === 'production') return 'production';

        if (host.includes('test') || host.includes('preview') || host.includes('staging') || host.startsWith('test.')) {
            return 'test';
        }

        if ('environment' in reqOrScope && reqOrScope.environment) {
            return reqOrScope.environment;
        }
    }

    return (process.env.NODE_ENV === 'development') ? 'development' : 'production';
}

// ── Storage Key & File Path Resolution ───────────────────────
export function resolveStorageKey(env: Environment, tenantId: string = 'personal'): string {
    const tId = tenantId || 'personal';
    if (env === 'production' || env === 'development') {
        if (tId === 'personal') return 'db'; // Preserves existing Cloudflare D1 key
        if (tId === 'demo') return 'demo';
        return `tenant:${tId}`;
    } else {
        // Test environment is strictly isolated
        if (tId === 'personal' || tId === 'default') return 'test:db';
        if (tId === 'demo') return 'test:demo';
        return `test:tenant:${tId}`;
    }
}

export function resolveFilePath(scopeOrReq?: DbScope | { dbScope?: DbScope; tenantId?: string } | string, env: Environment = 'production'): string {
    let tId = 'personal';
    if (typeof scopeOrReq === 'object' && scopeOrReq !== null) {
        if ('tenantId' in scopeOrReq && scopeOrReq.tenantId) {
            tId = scopeOrReq.tenantId;
        } else if ('dbScope' in scopeOrReq && scopeOrReq.dbScope) {
            tId = scopeOrReq.dbScope;
        }
    } else if (typeof scopeOrReq === 'string' && scopeOrReq.trim()) {
        tId = scopeOrReq.trim();
    }

    if (env === 'production' || env === 'development') {
        if (tId === 'personal') return PERSONAL_DATA_FILE; // Preserves data/db.json
        if (tId === 'demo') return DEMO_DATA_FILE;         // Preserves data/demo_db.json
        return path.join(TENANTS_DIR, `${tId}.json`);
    } else {
        // Test environment
        if (tId === 'personal' || tId === 'default') return path.join(DATA_DIR, 'test_db.json');
        if (tId === 'demo') return path.join(DATA_DIR, 'test_demo_db.json');
        return path.join(TENANTS_DIR, `test_${tId}.json`);
    }
}

export function resolveTenantId(scopeOrReq?: any): string {
    if (typeof scopeOrReq === 'object' && scopeOrReq !== null) {
        if (scopeOrReq.tenantId) return scopeOrReq.tenantId;
        if (scopeOrReq.dbScope) return scopeOrReq.dbScope;
        if (scopeOrReq.headers) {
            const h = typeof scopeOrReq.headers.get === 'function'
                ? (scopeOrReq.headers.get('x-workspace') || scopeOrReq.headers.get('x-tenant-id'))
                : (scopeOrReq.headers['x-workspace'] || scopeOrReq.headers['x-tenant-id']);
            if (h) return String(h).trim();
        }
        if (scopeOrReq.query?.workspace) return String(scopeOrReq.query.workspace).trim();
        if (scopeOrReq.query?.tenantId) return String(scopeOrReq.query.tenantId).trim();
    } else if (typeof scopeOrReq === 'string' && scopeOrReq.trim()) {
        return scopeOrReq.trim();
    }
    return 'personal';
}

// ── Default Labels ───────────────────────────────────────────
export const DEFAULT_LABELS = [
    { id: 'bug', name: 'Bug', color: '#ef4444', bg: '#fef2f2', createdAt: Date.now() },
    { id: 'feature', name: 'Özellik', color: '#6366f1', bg: '#eef2ff', createdAt: Date.now() },
    { id: 'task', name: 'Görev', color: '#3b82f6', bg: '#eff6ff', createdAt: Date.now() },
    { id: 'design', name: 'Tasarım', color: '#8b5cf6', bg: '#f5f3ff', createdAt: Date.now() },
    { id: 'devops', name: 'DevOps', color: '#0891b2', bg: '#ecfeff', createdAt: Date.now() },
    { id: 'test', name: 'Test', color: '#16a34a', bg: '#f0fdf4', createdAt: Date.now() },
    { id: 'docs', name: 'Belge', color: '#ca8a04', bg: '#fefce8', createdAt: Date.now() },
    { id: 'urgent', name: 'Acil', color: '#dc2626', bg: '#fff1f2', createdAt: Date.now() }
];

// ── Ensure Personal DB Integrity (Yiğitcan Genç Cards Preservation) ──
export function ensurePersonalDbIntegrity(db: DbSchema): boolean {
    let changed = false;
    if (!Array.isArray(db.cards)) {
        db.cards = [];
        changed = true;
    }
    if (!Array.isArray(db.labels)) {
        db.labels = [...DEFAULT_LABELS];
        changed = true;
    }

    // Ensure label 'lbl-websiteleri' exists
    if (!db.labels.some(l => l.id === 'lbl-websiteleri')) {
        db.labels.push({
            id: 'lbl-websiteleri',
            name: 'Web Siteleri',
            color: '#6366f1',
            bg: '#eef2ff',
            createdAt: 1789555200000
        });
        changed = true;
    }

    // Ensure all 5 cards for Yiğitcan Genç exist
    for (const uCard of YIGITCAN_USER_CARDS) {
        const exists = db.cards.some(c =>
            c.id === uCard.id ||
            (c.title && c.title.trim().toLowerCase() === uCard.title.trim().toLowerCase())
        );
        if (!exists) {
            db.cards.push(structuredClone(uCard));
            changed = true;
        }
    }

    if ((db.taskCounter ?? 0) < 15) {
        db.taskCounter = 15;
        changed = true;
    }

    return changed;
}

// ── Sample Test Environment Database ─────────────────────────
export function createDefaultTestDb(): DbSchema {
    return {
        cards: [
            {
                id: 'test-card-1',
                key: 'TK-1',
                title: 'Test Ortamı Doğrulaması',
                desc: 'Bu kart sadece TEST ortamında görüntülenir. Kişisel kartlardan tamamen izoledir.',
                assignee: 'Test Kullanıcısı',
                priority: 'high',
                col: 'doing',
                startDate: '2026-03-10',
                dueDate: '2026-03-25',
                labels: ['test', 'devops'],
                storyPoints: 3,
                estimatedEffort: 4,
                spentEffort: 2,
                subtasks: [{ id: 'sub-1', text: 'İzolasyon kontrolü', done: true }],
                comments: [{ id: 'comm-1', text: 'Test ortamı başarıyla ayrıştırıldı.', createdAt: Date.now(), author: 'Test Yöneticisi' }],
                epicId: null,
                sprintId: 'sprint-test-1',
                createdAt: Date.now() - 3600000
            },
            {
                id: 'test-card-2',
                key: 'TK-2',
                title: 'Kullanıcı İzinleri Testi',
                desc: 'Farklı rollerin ve takım yetkilendirmelerinin doğrulanması.',
                assignee: 'Test Kullanıcısı',
                priority: 'medium',
                col: 'todo',
                startDate: '2026-03-15',
                dueDate: '2026-03-30',
                labels: ['feature'],
                storyPoints: 5,
                estimatedEffort: 8,
                spentEffort: 0,
                subtasks: [],
                comments: [],
                epicId: null,
                sprintId: 'sprint-test-1',
                createdAt: Date.now() - 1800000
            }
        ],
        epics: [
            { id: 'epic-test-1', name: 'Ortam İzolasyonu', color: '#6366f1', createdAt: Date.now() }
        ],
        sprints: [
            { id: 'sprint-test-1', name: 'Test Sprint 1', startDate: '2026-03-01', endDate: '2026-03-31', active: true, createdAt: Date.now() }
        ],
        users: [
            {
                id: 'usr-testadmin',
                username: 'testadmin',
                name: 'Test Yöneticisi',
                passwordHash: hashPassword('password'),
                avatarColor: '#4f46e5',
                role: 'admin',
                tenantId: 'personal',
                workspaces: ['personal'],
                createdAt: Date.now()
            },
            {
                id: 'usr-tester',
                username: 'tester',
                name: 'Test Kullanıcısı',
                passwordHash: hashPassword('password'),
                avatarColor: '#10b981',
                role: 'user',
                tenantId: 'personal',
                workspaces: ['personal'],
                createdAt: Date.now()
            }
        ],
        sessions: [],
        labels: DEFAULT_LABELS,
        notifications: [],
        taskCounter: 2,
        workspaces: [
            { id: 'personal', name: 'Test Ortamı Panosu', type: 'team', ownerId: 'usr-testadmin', createdAt: Date.now() }
        ]
    };
}

// ── Startup Initialization (Local Node.js) ───────────────────
export function initDb(): void {
    if (!isNodeRuntime()) return;
    try {
        if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
        if (!fs.existsSync(TENANTS_DIR)) fs.mkdirSync(TENANTS_DIR, { recursive: true });

        // ── 1. PERSONAL DATABASE (db.json) - MUST PRESERVE EXISTING DATA ──
        let personalDb: DbSchema;
        if (!fs.existsSync(PERSONAL_DATA_FILE)) {
            personalDb = structuredClone(EMPTY_DB);
        } else {
            try {
                const raw = fs.readFileSync(PERSONAL_DATA_FILE, 'utf8');
                personalDb = JSON.parse(raw);
            } catch {
                personalDb = structuredClone(EMPTY_DB);
            }
        }

        if (!personalDb.labels || personalDb.labels.length === 0) {
            personalDb.labels = DEFAULT_LABELS;
        }

        if (!personalDb.workspaces || personalDb.workspaces.length === 0) {
            personalDb.workspaces = [
                { id: 'personal', name: 'Kişisel Çalışma Alanı', type: 'personal', ownerId: 'usr-superadmin', createdAt: Date.now() }
            ];
        }
        if (personalDb.cards.length === 0) {
            ensurePersonalDbIntegrity(personalDb);
        }
        writeTenantDbFileSync('personal', 'production', personalDb);

        // ── 2. DEMO DATABASE (demo_db.json) ──────────────────────
        let demoDb: DbSchema;
        if (!fs.existsSync(DEMO_DATA_FILE)) {
            demoDb = structuredClone(EMPTY_DB);
        } else {
            try {
                const raw = fs.readFileSync(DEMO_DATA_FILE, 'utf8');
                demoDb = JSON.parse(raw);
            } catch {
                demoDb = structuredClone(EMPTY_DB);
            }
        }

        if (!demoDb.cards || demoDb.cards.length < 500 || !demoDb.sprints || demoDb.sprints.length < 52) {
            demoDb = createDefaultDemoDb();
        }

        if (demoDb.users.length < 10) {
            demoDb.users = [
                { id: 'usr-1', username: 'admin', name: 'Ali Yılmaz', passwordHash: hashPassword('password'), avatarColor: '#4f46e5', role: 'admin', tenantId: 'demo', workspaces: ['demo'], createdAt: Date.now() },
                { id: 'usr-2', username: 'zeynep', name: 'Zeynep Kaya', passwordHash: hashPassword('password'), avatarColor: '#0ea5e9', role: 'user', tenantId: 'demo', workspaces: ['demo'], createdAt: Date.now() },
                { id: 'usr-3', username: 'mehmet', name: 'Mehmet Demir', passwordHash: hashPassword('password'), avatarColor: '#10b981', role: 'user', tenantId: 'demo', workspaces: ['demo'], createdAt: Date.now() },
                { id: 'usr-4', username: 'selin', name: 'Selin Yıldız', passwordHash: hashPassword('password'), avatarColor: '#f59e0b', role: 'user', tenantId: 'demo', workspaces: ['demo'], createdAt: Date.now() },
                { id: 'usr-5', username: 'caner', name: 'Caner Öztürk', passwordHash: hashPassword('password'), avatarColor: '#8b5cf6', role: 'user', tenantId: 'demo', workspaces: ['demo'], createdAt: Date.now() },
                { id: 'usr-6', username: 'burcu', name: 'Burcu Çelik', passwordHash: hashPassword('password'), avatarColor: '#ec4899', role: 'user', tenantId: 'demo', workspaces: ['demo'], createdAt: Date.now() },
                { id: 'usr-7', username: 'emre', name: 'Emre Aydın', passwordHash: hashPassword('password'), avatarColor: '#06b6d4', role: 'user', tenantId: 'demo', workspaces: ['demo'], createdAt: Date.now() },
                { id: 'usr-8', username: 'gamze', name: 'Gamze Şahin', passwordHash: hashPassword('password'), avatarColor: '#14b8a6', role: 'user', tenantId: 'demo', workspaces: ['demo'], createdAt: Date.now() },
                { id: 'usr-9', username: 'tolga', name: 'Tolga Kurt', passwordHash: hashPassword('password'), avatarColor: '#f97316', role: 'user', tenantId: 'demo', workspaces: ['demo'], createdAt: Date.now() },
                { id: 'usr-10', username: 'derya', name: 'Derya Arslan', passwordHash: hashPassword('password'), avatarColor: '#64748b', role: 'user', tenantId: 'demo', workspaces: ['demo'], createdAt: Date.now() }
            ];
        }
        if (!demoDb.labels || demoDb.labels.length === 0) {
            demoDb.labels = DEFAULT_LABELS;
        }
        if (!demoDb.workspaces || demoDb.workspaces.length === 0) {
            demoDb.workspaces = [
                { id: 'demo', name: 'Demo Panosu (Nova Takımı)', type: 'team', ownerId: 'usr-1', createdAt: Date.now() }
            ];
        }
        writeTenantDbFileSync('demo', 'production', demoDb);

        // ── 3. TEST DATABASE (test_db.json) ──────────────────────
        const testDbPath = path.join(DATA_DIR, 'test_db.json');
        if (!fs.existsSync(testDbPath)) {
            writeTenantDbFileSync('personal', 'test', createDefaultTestDb());
        }

        // Initialize Tenant Index files
        initTenantIndexFiles();
    } catch (e) {
        console.warn('initDb skipped:', e);
    }
}

// ── Tenant Index Helpers ─────────────────────────────────────
function initTenantIndexFiles(): void {
    if (!isNodeRuntime()) return;
    try {
        const prodIndexPath = path.join(DATA_DIR, 'tenants_index.json');
        if (!fs.existsSync(prodIndexPath)) {
            const prodIndex: TenantIndex = {
                workspaces: [
                    { id: 'personal', name: 'Kişisel Çalışma Alanı', type: 'personal', ownerId: 'usr-superadmin', createdAt: Date.now() },
                    { id: 'demo', name: 'Demo Panosu', type: 'team', ownerId: 'usr-1', createdAt: Date.now() }
                ],
                userToTenants: {
                    'admin': ['demo'],
                    'zeynep': ['demo'],
                    'mehmet': ['demo'],
                    'selin': ['demo'],
                    'caner': ['demo'],
                    'burcu': ['demo'],
                    'emre': ['demo'],
                    'gamze': ['demo'],
                    'tolga': ['demo'],
                    'derya': ['demo']
                }
            };
            writeFileAtomic.sync(prodIndexPath, JSON.stringify(prodIndex, null, 2));
        }

        const testIndexPath = path.join(DATA_DIR, 'test_tenants_index.json');
        if (!fs.existsSync(testIndexPath)) {
            const testIndex: TenantIndex = {
                workspaces: [
                    { id: 'personal', name: 'Test Ortamı Panosu', type: 'team', ownerId: 'usr-testadmin', createdAt: Date.now() }
                ],
                userToTenants: {
                    'testadmin': ['personal'],
                    'tester': ['personal']
                }
            };
            writeFileAtomic.sync(testIndexPath, JSON.stringify(testIndex, null, 2));
        }
    } catch {}
}

export async function getTenantIndex(env: Environment, d1Binding?: any): Promise<TenantIndex> {
    const store = dbContext.getStore();
    const binding = d1Binding || store?.d1Binding;

    if (store && store.index) {
        return store.index;
    }

    const indexKey = env === 'test' ? 'test:tenants_index' : 'tenants_index';
    const filePath = path.join(DATA_DIR, `${env === 'test' ? 'test_' : ''}tenants_index.json`);

    if (binding) {
        try {
            const row = await binding.prepare("SELECT value FROM json_store WHERE key = ?").bind(indexKey).first();
            if (row && typeof row.value === 'string') {
                const parsed = JSON.parse(row.value);
                if (store) store.index = parsed;
                return parsed;
            }
        } catch (e) {
            console.error("D1 getTenantIndex failed:", e);
        }
    }

    // Local file fallback
    try {
        if (fs.existsSync(filePath)) {
            const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            if (store) store.index = parsed;
            return parsed;
        }
    } catch { }

    const fallback: TenantIndex = env === 'test' ? {
        workspaces: [{ id: 'personal', name: 'Test Ortamı Panosu', type: 'team', ownerId: 'usr-testadmin', createdAt: Date.now() }],
        userToTenants: { 'testadmin': ['personal'], 'tester': ['personal'] }
    } : {
        workspaces: [
            { id: 'personal', name: 'Kişisel Çalışma Alanı', type: 'personal', ownerId: 'usr-superadmin', createdAt: Date.now() },
            { id: 'demo', name: 'Demo Panosu', type: 'team', ownerId: 'usr-1', createdAt: Date.now() }
        ],
        userToTenants: {
            'gencyigitcan': ['personal'],
            'yigitcangenc@gmail.com': ['personal'],
            'admin': ['demo'],
            'zeynep': ['demo'],
            'mehmet': ['demo']
        }
    };

    if (store) {
        store.index = fallback;
    }
    if (binding) {
        await saveTenantIndex(fallback, env, binding);
    }
    return fallback;
}

export async function saveTenantIndex(index: TenantIndex, env: Environment, d1Binding?: any): Promise<void> {
    const store = dbContext.getStore();
    const binding = d1Binding || store?.d1Binding;
    if (store) {
        store.index = index;
        store.indexDirty = true;
    }

    const indexKey = env === 'test' ? 'test:tenants_index' : 'tenants_index';
    const filePath = path.join(DATA_DIR, `${env === 'test' ? 'test_' : ''}tenants_index.json`);

    if (binding) {
        try {
            const val = JSON.stringify(index);
            await binding.prepare(
                "INSERT INTO json_store (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
            ).bind(indexKey, val).run();
        } catch (e) {
            console.error("D1 saveTenantIndex failed:", e);
        }
    }

    if (isNodeRuntime()) {
        try {
            if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
            await writeFileAtomic(filePath, JSON.stringify(index, null, 2));
        } catch { }
    }
}

// ── AsyncLocalStorage Request Context ────────────────────────
export interface RequestContext {
    envName: Environment;
    d1Binding?: any;
    activeTenantId: string;
    tenants: Map<string, { db: DbSchema; dirty: boolean; key: string }>;
    index?: TenantIndex;
    indexDirty?: boolean;
}

export const dbContext = new AsyncLocalStorage<RequestContext>();

// ── Read & Write Functions (Used by all routes) ───────────────
export function readDb(scopeOrReq?: DbScope | { dbScope?: DbScope; tenantId?: string; environment?: Environment } | string): DbSchema {
    const store = dbContext.getStore();
    const tId = resolveTenantId(scopeOrReq);
    const env = store?.envName || getEnvironment(scopeOrReq);

    if (store) {
        // Check if tenant is cached in this request
        const cached = store.tenants.get(tId);
        if (cached) {
            return cached.db;
        }
        // If not cached, load sync from disk fallback
        const diskDb = readTenantDbFileSync(tId, env);
        store.tenants.set(tId, { db: diskDb, dirty: false, key: resolveStorageKey(env, tId) });
        return diskDb;
    }

    return readTenantDbFileSync(tId, env);
}

export function writeDbSync(data: DbSchema, scopeOrReq?: DbScope | { dbScope?: DbScope; tenantId?: string; environment?: Environment } | string): void {
    const store = dbContext.getStore();
    const tId = resolveTenantId(scopeOrReq);
    const env = store?.envName || getEnvironment(scopeOrReq);

    if (store) {
        const key = resolveStorageKey(env, tId);
        const existing = store.tenants.get(tId);
        if (existing) {
            Object.assign(existing.db, data);
            existing.dirty = true;
        } else {
            store.tenants.set(tId, { db: data, dirty: true, key });
        }

        // If not running on Cloudflare (native node), also write to disk
        if (isNodeRuntime() && !store.d1Binding) {
            writeTenantDbFileSync(tId, env, data);
        }
        return;
    }

    if (isNodeRuntime()) {
        writeTenantDbFileSync(tId, env, data);
    }
}

export async function writeDb(data: DbSchema, scopeOrReq?: DbScope | { dbScope?: DbScope; tenantId?: string; environment?: Environment } | string): Promise<void> {
    writeDbSync(data, scopeOrReq);
}

// ── File System Helpers ──────────────────────────────────────
export function readTenantDbFileSync(tenantId: string, env: Environment): DbSchema {
    if (!isNodeRuntime()) {
        if (env === 'test') return createDefaultTestDb();
        if (tenantId === 'demo') return createDefaultDemoDb();
        return structuredClone(EMPTY_DB);
    }
    const filePath = resolveFilePath(tenantId, env);
    try {
        if (!fs.existsSync(filePath)) {
            if (env === 'test') return createDefaultTestDb();
            if (tenantId === 'demo') return createDefaultDemoDb();
            return structuredClone(EMPTY_DB);
        }
        const raw = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(raw) as Partial<DbSchema>;
        return {
            cards: Array.isArray(parsed.cards) ? parsed.cards : [],
            epics: Array.isArray(parsed.epics) ? parsed.epics : [],
            sprints: Array.isArray(parsed.sprints) ? parsed.sprints : [],
            users: Array.isArray(parsed.users) ? parsed.users : [],
            sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
            labels: Array.isArray(parsed.labels) ? parsed.labels : DEFAULT_LABELS,
            notifications: Array.isArray(parsed.notifications) ? parsed.notifications : [],
            taskCounter: typeof parsed.taskCounter === 'number' ? parsed.taskCounter : 0,
            workspaces: Array.isArray(parsed.workspaces) ? parsed.workspaces : [],
            logs: Array.isArray(parsed.logs) ? parsed.logs : []
        };
    } catch {
        if (env === 'test') return createDefaultTestDb();
        return structuredClone(EMPTY_DB);
    }
}

export function writeTenantDbFileSync(tenantId: string, env: Environment, data: DbSchema): void {
    if (!isNodeRuntime()) return;
    try {
        const filePath = resolveFilePath(tenantId, env);
        const parentDir = path.dirname(filePath);
        if (!fs.existsSync(parentDir)) fs.mkdirSync(parentDir, { recursive: true });
        writeFileAtomic.sync(filePath, JSON.stringify(data, null, 2));
    } catch { }
}

// ── Cloudflare D1 Load & Save Helpers ────────────────────────
export async function loadTenantDbFromD1(dbBinding: any, tenantId: string, env: Environment): Promise<DbSchema> {
    const key = resolveStorageKey(env, tenantId);
    if (!dbBinding) {
        return readTenantDbFileSync(tenantId, env);
    }

    try {
        const row = await dbBinding.prepare("SELECT value FROM json_store WHERE key = ?").bind(key).first();
        if (row && typeof row.value === 'string') {
            const parsed = JSON.parse(row.value) as Partial<DbSchema>;
            let db: DbSchema = {
                cards: Array.isArray(parsed.cards) ? parsed.cards : [],
                epics: Array.isArray(parsed.epics) ? parsed.epics : [],
                sprints: Array.isArray(parsed.sprints) ? parsed.sprints : [],
                users: Array.isArray(parsed.users) ? parsed.users : [],
                sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
                labels: Array.isArray(parsed.labels) ? parsed.labels : DEFAULT_LABELS,
                notifications: Array.isArray(parsed.notifications) ? parsed.notifications : [],
                taskCounter: typeof parsed.taskCounter === 'number' ? parsed.taskCounter : 0,
                workspaces: Array.isArray(parsed.workspaces) ? parsed.workspaces : [],
                logs: Array.isArray(parsed.logs) ? parsed.logs : []
            };

            // In production personal DB, if superUser exists, ensure email & workspaces
            if (env === 'production' && tenantId === 'personal') {
                let changed = false;
                if (db.cards.length === 0) {
                    changed = ensurePersonalDbIntegrity(db) || changed;
                }
                let superUser = db.users.find(u =>
                    u.username.toLowerCase() === 'gencyigitcan' ||
                    (u.email && u.email.toLowerCase() === 'yigitcangenc@gmail.com') ||
                    u.id === 'usr-superadmin'
                );
                if (superUser) {
                    if (superUser.email !== 'yigitcangenc@gmail.com' || superUser.status !== 'approved') {
                        superUser.email = 'yigitcangenc@gmail.com';
                        superUser.status = 'approved';
                        changed = true;
                    }
                    if (!superUser.workspaces || !superUser.workspaces.includes('personal')) {
                        superUser.workspaces = ['personal', ...(superUser.workspaces || [])];
                        changed = true;
                    }
                }
                if (changed && dbBinding) {
                    await saveTenantDbToD1(dbBinding, key, db);
                }
            }

            // In demo DB, ensure all 10 users and 2026-2027 weekly data exist (at least 520 cards)
            if (tenantId === 'demo' && (db.users.length < 10 || db.sprints.length < 52 || db.cards.length < 500)) {
                db = createDefaultDemoDb();
                if (dbBinding) {
                    await saveTenantDbToD1(dbBinding, key, db);
                }
            }

            return db;
        }
    } catch (e) {
        console.error(`D1 load failed for key '${key}':`, e);
    }

    // Seed if empty or not found
    let initialDb: DbSchema;
    if (env === 'test') {
        initialDb = createDefaultTestDb();
    } else if (tenantId === 'demo') {
        initialDb = isNodeRuntime() ? readTenantDbFileSync('demo', 'production') : createDefaultDemoDb();
    } else {
        initialDb = readTenantDbFileSync(tenantId, env);
        if (tenantId === 'personal' && env === 'production') {
            ensurePersonalDbIntegrity(initialDb);
        }
    }

    if (dbBinding) {
        await saveTenantDbToD1(dbBinding, key, initialDb);
    }
    return initialDb;
}

// ── Activity Logging Helper ──────────────────────────────────
export function logActivity(
    entry: Omit<ActivityLog, 'id' | 'createdAt'>,
    reqOrScope?: any
): ActivityLog {
    const store = dbContext.getStore();
    const env = store?.envName || getEnvironment(reqOrScope);
    const personalDb = readDb({ tenantId: 'personal', environment: env });
    personalDb.logs = personalDb.logs || [];

    const newLog: ActivityLog = {
        id: 'log-' + uid(),
        ...entry,
        createdAt: Date.now()
    };

    personalDb.logs.unshift(newLog);
    // Retain maximum of 1000 latest logs
    if (personalDb.logs.length > 1000) {
        personalDb.logs.length = 1000;
    }

    writeDbSync(personalDb, { tenantId: 'personal', environment: env });
    return newLog;
}

export async function saveTenantDbToD1(dbBinding: any, key: string, data: DbSchema): Promise<void> {
    if (!dbBinding) return;
    try {
        const dataToSave = { ...data };
        delete (dataToSave as any)._dirty;
        const value = JSON.stringify(dataToSave);
        await dbBinding.prepare(
            "INSERT INTO json_store (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
        ).bind(key, value).run();
    } catch (e) {
        console.error(`D1 save failed for key '${key}':`, e);
    }
}

// ── Backward-compatible exports for loadDbFromD1 / saveDbToD1 ──
export async function loadDbFromD1(dbBinding: any): Promise<DbSchema> {
    return loadTenantDbFromD1(dbBinding, 'personal', 'production');
}

export async function saveDbToD1(dbBinding: any, data: DbSchema): Promise<void> {
    return saveTenantDbToD1(dbBinding, 'db', data);
}

// ── Workspace Creation Helper ────────────────────────────────
export async function createWorkspace(
    name: string,
    type: 'personal' | 'team' | 'user',
    owner: { id: string; username: string },
    env: Environment,
    d1Binding?: any,
    customId?: string
): Promise<Workspace> {
    const store = dbContext.getStore();
    const binding = d1Binding || store?.d1Binding;
    const cleanUsername = owner.username.toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
    const wsId = customId || (type === 'user' ? `user_${cleanUsername}` : `team_${uid()}`);
    const workspace: Workspace = {
        id: wsId,
        name: name.trim(),
        type,
        ownerId: owner.id,
        members: [{ userId: owner.id, username: owner.username, role: 'admin' }],
        createdAt: Date.now()
    };

    // Initialize new DB for this workspace
    const newDb: DbSchema = {
        cards: [],
        epics: [],
        sprints: [],
        users: [],
        sessions: [],
        labels: DEFAULT_LABELS,
        notifications: [],
        taskCounter: 0,
        workspaces: [workspace]
    };

    // Save workspace DB
    const key = resolveStorageKey(env, wsId);
    if (store) {
        store.tenants.set(wsId, { db: newDb, dirty: true, key });
    }
    if (binding) {
        await saveTenantDbToD1(binding, key, newDb);
    }
    if (isNodeRuntime()) {
        writeTenantDbFileSync(wsId, env, newDb);
    }

    // Update Tenant Index
    const index = await getTenantIndex(env, binding);
    if (!index.workspaces.some(w => w.id === wsId)) {
        index.workspaces.push(workspace);
    }
    const normOwner = owner.username.toLowerCase();
    if (!index.userToTenants[normOwner]) {
        index.userToTenants[normOwner] = [];
    }
    if (!index.userToTenants[normOwner].includes(wsId)) {
        index.userToTenants[normOwner].push(wsId);
    }
    await saveTenantIndex(index, env, binding);

    return workspace;
}

// ── Short ID Generator ───────────────────────────────────────
export function uid(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
