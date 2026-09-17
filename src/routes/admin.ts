// ============================================================
//  Admin, User Management & Team/Workspace Routes
// ============================================================
import { Router } from 'express';
import { z } from 'zod';
import {
    readDb,
    writeDbSync,
    uid,
    hashPassword,
    getEnvironment,
    getTenantIndex,
    saveTenantIndex,
    createWorkspace,
    logActivity,
    type Environment
} from '../lib/db.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { AppError, asyncHandler } from '../middleware/error.js';
import type { User, ActivityLog } from '../types/index.js';

export const adminRouter = Router();
adminRouter.use(requireAuth);

// Helper to check admin permission
function checkAdminPermission(req: any) {
    const role = req.user?.role;
    if (role !== 'superadmin' && role !== 'admin') {
        throw new AppError('Bu işlem için yönetici yetkisi gereklidir', 403);
    }
}

// Helper to gather all users across all workspace DBs, personal DB, and isolated user DBs
function getAllUsersAcrossTenants(env: Environment, index: any): User[] {
    const userMap = new Map<string, User>();

    // 1. Personal DB
    try {
        const personalDb = readDb({ tenantId: 'personal', environment: env });
        for (const u of personalDb.users || []) {
            userMap.set(u.id, { ...u });
        }
    } catch {}

    // Collect all tenant IDs from workspaces and userToTenants
    const allTenantIds = new Set<string>();
    for (const ws of index.workspaces || []) {
        allTenantIds.add(ws.id);
    }
    for (const wsList of Object.values(index.userToTenants || {})) {
        if (Array.isArray(wsList)) {
            for (const wsId of wsList) allTenantIds.add(wsId);
        }
    }

    // 2. All Workspaces & User DBs
    for (const tId of allTenantIds) {
        if (tId === 'personal') continue;
        try {
            const wsDb = readDb({ tenantId: tId, environment: env });
            for (const u of wsDb.users || []) {
                if (!userMap.has(u.id)) {
                    userMap.set(u.id, { ...u });
                } else {
                    const existing = userMap.get(u.id)!;
                    if (u.status && !existing.status) existing.status = u.status;
                    if (u.lastLoginAt && !existing.lastLoginAt) existing.lastLoginAt = u.lastLoginAt;
                }
            }
        } catch {}
    }

    return Array.from(userMap.values());
}

// Helper to update a user across all tenant DBs where they reside
function updateUserAcrossTenants(userId: string, updater: (u: User) => void, env: Environment, index: any): User | null {
    let targetUser: User | null = null;

    // 1. Personal DB
    try {
        const personalDb = readDb({ tenantId: 'personal', environment: env });
        const u = personalDb.users?.find(u => u.id === userId);
        if (u) {
            updater(u);
            targetUser = { ...u };
            writeDbSync(personalDb, { tenantId: 'personal', environment: env });
        }
    } catch {}

    // Collect all tenant IDs
    const allTenantIds = new Set<string>();
    for (const ws of index.workspaces || []) {
        allTenantIds.add(ws.id);
    }
    for (const wsList of Object.values(index.userToTenants || {})) {
        if (Array.isArray(wsList)) {
            for (const wsId of wsList) allTenantIds.add(wsId);
        }
    }

    // 2. All Workspaces & User DBs
    for (const tId of allTenantIds) {
        if (tId === 'personal') continue;
        try {
            const wsDb = readDb({ tenantId: tId, environment: env });
            const u = wsDb.users?.find(u => u.id === userId);
            if (u) {
                updater(u);
                if (!targetUser) targetUser = { ...u };
                writeDbSync(wsDb, { tenantId: tId, environment: env });
            }
        } catch {}
    }

    return targetUser;
}

// ── GET /api/admin/workspaces ────────────────────────────────
adminRouter.get('/workspaces', asyncHandler(async (req, res) => {
    const env = req.environment || getEnvironment(req);
    const index = await getTenantIndex(env);
    const username = req.user!.username.toLowerCase();
    const isSuperAdmin = req.user!.role === 'superadmin';

    // Super Admin sees all workspaces; others see their authorized workspaces
    const userWorkspaceIds = index.userToTenants[username] || [req.tenantId || 'personal'];
    
    const accessible = index.workspaces.filter(w =>
        isSuperAdmin || userWorkspaceIds.includes(w.id) || w.ownerId === req.user!.id
    );

    res.json({
        workspaces: accessible,
        activeWorkspaceId: req.tenantId || 'personal'
    });
}));

// ── POST /api/admin/workspaces ───────────────────────────────
const createWorkspaceSchema = z.object({
    name: z.string().min(2, 'Takım/Çalışma alanı adı en az 2 karakter olmalıdır').max(100).trim(),
    description: z.string().max(300).optional()
});

adminRouter.post('/workspaces', validate(createWorkspaceSchema), asyncHandler(async (req, res) => {
    checkAdminPermission(req);
    const env = req.environment || getEnvironment(req);
    const { name, description } = req.body;

    const workspace = await createWorkspace(
        name,
        'team',
        { id: req.user!.id, username: req.user!.username },
        env
    );
    if (description) {
        workspace.description = description;
    }

    logActivity({
        userId: req.user!.id,
        username: req.user!.username,
        name: req.user!.name,
        userRole: req.user!.role || 'admin',
        action: 'WORKSPACE_CREATE',
        entityType: 'workspace',
        entityId: workspace.id,
        details: `'${workspace.name}' isimli yeni çalışma alanı oluşturuldu.`,
        workspaceId: workspace.id,
        environment: env
    }, req);

    res.status(201).json({
        ok: true,
        workspace
    });
}));

// ── GET /api/admin/users ─────────────────────────────────────
adminRouter.get('/users', asyncHandler(async (req, res) => {
    checkAdminPermission(req);
    const env = req.environment || getEnvironment(req);
    const index = await getTenantIndex(env);
    const db = readDb(req);

    // Map of workspace id -> name
    const wsNameMap = Object.fromEntries(index.workspaces.map(w => [w.id, w.name]));

    // Return users from active workspace and any known users
    const userList = db.users.map(u => ({
        id: u.id,
        username: u.username,
        name: u.name,
        avatarColor: u.avatarColor,
        role: u.role || 'user',
        status: u.status || 'approved',
        tenantId: u.tenantId || req.tenantId || 'personal',
        workspaces: (index.userToTenants[u.username.toLowerCase()] || [u.tenantId || 'personal']).map(id => ({
            id,
            name: wsNameMap[id] || id
        })),
        createdAt: u.createdAt,
        lastLoginAt: u.lastLoginAt,
        expiresAt: u.expiresAt
    }));

    res.json(userList);
}));

// ── GET /api/admin/users/detailed ────────────────────────────
adminRouter.get('/users/detailed', asyncHandler(async (req, res) => {
    checkAdminPermission(req);
    const env = req.environment || getEnvironment(req);
    const index = await getTenantIndex(env);
    const wsNameMap = Object.fromEntries(index.workspaces.map(w => [w.id, w.name]));
    const allUsers = getAllUsersAcrossTenants(env, index);

    const detailed = allUsers.map(u => ({
        id: u.id,
        username: u.username,
        name: u.name,
        email: u.email,
        avatarColor: u.avatarColor,
        role: u.role || 'user',
        status: u.status || 'approved',
        tenantId: u.tenantId || 'personal',
        workspaces: (index.userToTenants[u.username.toLowerCase()] || u.workspaces || [u.tenantId || 'personal']).map(id => ({
            id,
            name: wsNameMap[id] || (id === 'personal' ? 'Kişisel Çalışma Alanı' : id)
        })),
        createdAt: u.createdAt,
        lastLoginAt: u.lastLoginAt,
        expiresAt: u.expiresAt
    }));

    res.json({ users: detailed });
}));

// ── GET /api/admin/pending-users ─────────────────────────────
adminRouter.get('/pending-users', asyncHandler(async (req, res) => {
    checkAdminPermission(req);
    const env = req.environment || getEnvironment(req);
    const index = await getTenantIndex(env);
    const allUsers = getAllUsersAcrossTenants(env, index);
    const pendingUsers = allUsers.filter(u => u.status === 'pending');
    res.json(pendingUsers);
}));

// ── POST /api/admin/users/:id/approve ────────────────────────
adminRouter.post('/users/:id/approve', asyncHandler(async (req, res) => {
    checkAdminPermission(req);
    const env = req.environment || getEnvironment(req);
    const index = await getTenantIndex(env);

    const targetUserId = String(req.params.id);
    const updatedUser = updateUserAcrossTenants(targetUserId, (u) => {
        u.status = 'approved';
    }, env, index);

    if (!updatedUser) {
        throw new AppError('Onaylanacak kullanıcı bulunamadı', 404);
    }

    // Update notifications in personalDb
    const personalDb = readDb({ tenantId: 'personal', environment: env });
    if (personalDb.notifications) {
        let changed = false;
        for (const n of personalDb.notifications) {
            if (n.pendingUserId === req.params.id || n.senderId === req.params.id) {
                n.requestStatus = 'approved';
                n.read = true;
                changed = true;
            }
        }
        if (changed) {
            writeDbSync(personalDb, { tenantId: 'personal', environment: env });
        }
    }

    logActivity({
        userId: req.user!.id,
        username: req.user!.username,
        name: req.user!.name,
        userRole: req.user!.role || 'superadmin',
        action: 'USER_APPROVED',
        entityType: 'user',
        entityId: updatedUser.id,
        details: `${updatedUser.name} (${updatedUser.username}) adlı kullanıcının kaydı Super Admin tarafından onaylandı.`,
        workspaceId: req.tenantId || 'personal',
        environment: env
    }, req);

    res.json({
        ok: true,
        message: `${updatedUser.name} başarıyla onaylandı. Artık sisteme giriş yapabilir.`,
        user: updatedUser
    });
}));

// ── POST /api/admin/users/:id/reject ─────────────────────────
adminRouter.post('/users/:id/reject', asyncHandler(async (req, res) => {
    checkAdminPermission(req);
    const env = req.environment || getEnvironment(req);
    const index = await getTenantIndex(env);

    const targetUserId = String(req.params.id);
    const updatedUser = updateUserAcrossTenants(targetUserId, (u) => {
        u.status = 'rejected';
    }, env, index);

    if (!updatedUser) {
        throw new AppError('Reddedilecek kullanıcı bulunamadı', 404);
    }

    // Update notifications in personalDb
    const personalDb = readDb({ tenantId: 'personal', environment: env });
    if (personalDb.notifications) {
        let changed = false;
        for (const n of personalDb.notifications) {
            if (n.pendingUserId === req.params.id || n.senderId === req.params.id) {
                n.requestStatus = 'rejected';
                n.read = true;
                changed = true;
            }
        }
        if (changed) {
            writeDbSync(personalDb, { tenantId: 'personal', environment: env });
        }
    }

    logActivity({
        userId: req.user!.id,
        username: req.user!.username,
        name: req.user!.name,
        userRole: req.user!.role || 'superadmin',
        action: 'USER_REJECTED',
        entityType: 'user',
        entityId: updatedUser.id,
        details: `${updatedUser.name} (${updatedUser.username}) adlı kullanıcının kayıt başvurusu Super Admin tarafından reddedildi.`,
        workspaceId: req.tenantId || 'personal',
        environment: env
    }, req);

    res.json({
        ok: true,
        message: `${updatedUser.name} başvurusu reddedildi.`,
        user: updatedUser
    });
}));

// ── GET /api/admin/logs ──────────────────────────────────────
adminRouter.get('/logs', asyncHandler(async (req, res) => {
    if (req.user?.role !== 'superadmin' && req.user?.role !== 'admin') {
        throw new AppError('Aktivite günlüğünü görüntüleme yetkisi sadece yönetici ve Super Admin kullanıcılara aittir', 403);
    }
    const env = req.environment || getEnvironment(req);
    const isSuperAdmin = req.user?.role === 'superadmin';

    // Query parameters filtering: user, action, cardKey, q, workspace
    const { user, action, cardKey, q, workspace } = req.query as {
        user?: string;
        action?: string;
        cardKey?: string;
        q?: string;
        workspace?: string;
    };

    let rawLogs: ActivityLog[] = [];

    if (isSuperAdmin) {
        if (workspace === 'demo') {
            const demoDb = readDb({ tenantId: 'demo', environment: env });
            rawLogs = (demoDb.logs || []).slice();
        } else if (workspace === 'personal' || workspace === 'production') {
            const personalDb = readDb({ tenantId: 'personal', environment: env });
            rawLogs = (personalDb.logs || []).filter(l => l.workspaceId !== 'demo');
        } else {
            // workspace === 'all' or default: combine personal + demo, deduplicate by ID
            const personalDb = readDb({ tenantId: 'personal', environment: env });
            const demoDb = readDb({ tenantId: 'demo', environment: env });
            const logMap = new Map<string, ActivityLog>();
            for (const l of personalDb.logs || []) logMap.set(l.id, l);
            for (const l of demoDb.logs || []) logMap.set(l.id, l);
            rawLogs = Array.from(logMap.values());
        }
    } else {
        // Regular admin: scoped to their tenant
        const tId = req.tenantId || 'personal';
        const targetDb = readDb({ tenantId: tId, environment: env });
        rawLogs = (targetDb.logs || []).slice();
    }

    // Sort newest first
    rawLogs.sort((a, b) => b.createdAt - a.createdAt);
    let logs = rawLogs;

    // Filter by user
    if (user && user !== 'all') {
        const uLower = user.toLowerCase();
        logs = logs.filter(l => (l.username && l.username.toLowerCase() === uLower) || (l.name && l.name.toLowerCase().includes(uLower)) || l.userId === user);
    }
    // Filter by action
    if (action && action !== 'all') {
        logs = logs.filter(l => l.action === action);
    }
    // Filter by cardKey
    if (cardKey) {
        const ckLower = cardKey.toLowerCase();
        logs = logs.filter(l => (l.details && l.details.toLowerCase().includes(ckLower)) || l.entityId === cardKey);
    }
    // Filter by keyword query
    if (q) {
        const qLower = q.toLowerCase();
        logs = logs.filter(l =>
            (l.details && l.details.toLowerCase().includes(qLower)) ||
            (l.username && l.username.toLowerCase().includes(qLower)) ||
            (l.name && l.name.toLowerCase().includes(qLower)) ||
            (l.action && l.action.toLowerCase().includes(qLower))
        );
    }

    res.json({ logs });
}));

// ── POST /api/admin/users ────────────────────────────────────
const createUserSchema = z.object({
    name: z.string().min(2, 'İsim en az 2 karakter olmalıdır').max(100).trim(),
    username: z.string().min(3, 'Kullanıcı adı veya e-posta en az 3 karakter olmalıdır').max(100).regex(/^[a-zA-Z0-9_.@+-]+$/, 'Geçersiz kullanıcı adı veya e-posta'),
    password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır').max(100),
    role: z.enum(['admin', 'user']).default('user'),
    workspaceMode: z.enum(['personal', 'team']),
    targetWorkspaceId: z.string().optional()
});

adminRouter.post('/users', validate(createUserSchema), asyncHandler(async (req, res) => {
    checkAdminPermission(req);
    const env = req.environment || getEnvironment(req);
    const { name, username, password, role, workspaceMode, targetWorkspaceId } = req.body;
    const normalizedUser = username.toLowerCase().trim();

    // Check if user already exists in index or active DB
    const index = await getTenantIndex(env);
    if (index.userToTenants[normalizedUser]) {
        throw new AppError('Bu kullanıcı adı zaten kullanılmaktadır', 400);
    }

    const currentDb = readDb(req);
    if (currentDb.users.some(u => u.username.toLowerCase() === normalizedUser)) {
        throw new AppError('Bu kullanıcı adı mevcut çalışma alanında zaten kayıtlı', 400);
    }

    const userId = 'usr-' + uid();
    const newUser: User = {
        id: userId,
        username: normalizedUser,
        email: normalizedUser.includes('@') ? normalizedUser : undefined,
        name: name.trim(),
        passwordHash: hashPassword(password),
        avatarColor: '#4f46e5',
        role,
        status: 'approved', // Admin-created users are directly approved
        createdAt: Date.now()
    };

    let assignedWorkspaceId = req.tenantId || 'personal';

    if (workspaceMode === 'personal') {
        // Option 1: Create an isolated personal DB for this user
        assignedWorkspaceId = `user_${normalizedUser}`;
        newUser.tenantId = assignedWorkspaceId;
        newUser.workspaces = [assignedWorkspaceId];

        await createWorkspace(
            `${name.trim()} (Bireysel)`,
            'user',
            { id: userId, username: normalizedUser },
            env,
            undefined,
            assignedWorkspaceId
        );

        // Also add the user into their own new DB
        const userDb = readDb({ tenantId: assignedWorkspaceId, environment: env });
        userDb.users.push(newUser);
        writeDbSync(userDb, { tenantId: assignedWorkspaceId, environment: env });
    } else {
        // Option 2: Add user to a team/shared DB
        assignedWorkspaceId = targetWorkspaceId || req.tenantId || 'personal';
        newUser.tenantId = assignedWorkspaceId;
        newUser.workspaces = [assignedWorkspaceId];

        // Add user to the target team DB
        const targetDb = readDb({ tenantId: assignedWorkspaceId, environment: env });
        targetDb.users.push(newUser);
        writeDbSync(targetDb, { tenantId: assignedWorkspaceId, environment: env });

        // Update Tenant Index
        if (!index.userToTenants[normalizedUser]) {
            index.userToTenants[normalizedUser] = [];
        }
        if (!index.userToTenants[normalizedUser].includes(assignedWorkspaceId)) {
            index.userToTenants[normalizedUser].push(assignedWorkspaceId);
        }

        // Add to workspace member list in index
        const ws = index.workspaces.find(w => w.id === assignedWorkspaceId);
        if (ws) {
            ws.members = ws.members || [];
            if (!ws.members.some(m => m.username === normalizedUser)) {
                ws.members.push({ userId, username: normalizedUser, role });
            }
        }
        await saveTenantIndex(index, env);
    }

    logActivity({
        userId: req.user!.id,
        username: req.user!.username,
        name: req.user!.name,
        userRole: req.user!.role || 'admin',
        action: 'USER_CREATED',
        entityType: 'user',
        entityId: newUser.id,
        details: `${newUser.name} (${newUser.username}) adlı kullanıcı oluşturuldu. Rol: ${newUser.role}`,
        workspaceId: assignedWorkspaceId,
        environment: env
    }, req);

    res.status(201).json({
        ok: true,
        user: {
            id: newUser.id,
            username: newUser.username,
            name: newUser.name,
            role: newUser.role,
            status: newUser.status,
            tenantId: assignedWorkspaceId,
            workspaces: [assignedWorkspaceId]
        }
    });
}));

// ── PUT /api/admin/users/:id/workspaces ──────────────────────
const updateWorkspacesSchema = z.object({
    workspaces: z.array(z.string()).min(1, 'En az bir çalışma alanı seçilmelidir')
});

adminRouter.put('/users/:id/workspaces', validate(updateWorkspacesSchema), asyncHandler(async (req, res) => {
    checkAdminPermission(req);
    const env = req.environment || getEnvironment(req);
    const { workspaces } = req.body;
    const db = readDb(req);

    const user = db.users.find(u => u.id === req.params.id);
    if (!user) {
        throw new AppError('Kullanıcı bulunamadı', 404);
    }

    user.workspaces = workspaces;
    writeDbSync(db, req);

    // Update index
    const index = await getTenantIndex(env);
    index.userToTenants[user.username.toLowerCase()] = workspaces;
    await saveTenantIndex(index, env);

    res.json({ ok: true, user: { id: user.id, username: user.username, workspaces } });
}));

// ── DELETE /api/admin/users/:id ──────────────────────────────
adminRouter.delete('/users/:id', asyncHandler(async (req, res) => {
    checkAdminPermission(req);
    if (req.params.id === req.user!.id) {
        throw new AppError('Kendi hesabınızı silemezsiniz', 400);
    }

    const env = req.environment || getEnvironment(req);
    const db = readDb(req);
    const userIndex = db.users.findIndex(u => u.id === req.params.id);
    if (userIndex === -1) {
        throw new AppError('Kullanıcı bulunamadı', 404);
    }

    const removedUser = db.users[userIndex];
    if (removedUser.role === 'superadmin') {
        throw new AppError('Süper Admin hesabı silinemez', 403);
    }

    db.users.splice(userIndex, 1);
    // Remove active sessions
    db.sessions = db.sessions.filter(s => s.userId !== req.params.id);
    writeDbSync(db, req);

    // Clean from index
    const index = await getTenantIndex(env);
    delete index.userToTenants[removedUser.username.toLowerCase()];
    await saveTenantIndex(index, env);

    logActivity({
        userId: req.user!.id,
        username: req.user!.username,
        name: req.user!.name,
        userRole: req.user!.role || 'admin',
        action: 'USER_DELETED',
        entityType: 'user',
        entityId: String(req.params.id),
        details: `${removedUser.name} (${removedUser.username}) adlı kullanıcı silindi.`,
        workspaceId: req.tenantId || 'personal',
        environment: env
    }, req);

    res.json({ ok: true });
}));
