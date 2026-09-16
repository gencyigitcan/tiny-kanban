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
    createWorkspace
} from '../lib/db.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { AppError, asyncHandler } from '../middleware/error.js';
import type { User } from '../types/index.js';

export const adminRouter = Router();
adminRouter.use(requireAuth);

// Helper to check admin permission
function checkAdminPermission(req: any) {
    const role = req.user?.role;
    if (role !== 'superadmin' && role !== 'admin') {
        throw new AppError('Bu işlem için yönetici yetkisi gereklidir', 403);
    }
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
        tenantId: u.tenantId || req.tenantId || 'personal',
        workspaces: (index.userToTenants[u.username.toLowerCase()] || [u.tenantId || 'personal']).map(id => ({
            id,
            name: wsNameMap[id] || id
        })),
        createdAt: u.createdAt,
        expiresAt: u.expiresAt
    }));

    res.json(userList);
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

    res.status(201).json({
        ok: true,
        user: {
            id: newUser.id,
            username: newUser.username,
            name: newUser.name,
            role: newUser.role,
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

    res.json({ ok: true });
}));
