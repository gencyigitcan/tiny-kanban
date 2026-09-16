// ============================================================
//  Authentication and User Routes (Multi-Tenant & Multi-Environment)
// ============================================================
import { Router } from 'express';
import crypto from 'crypto';
import {
    readDb,
    writeDbSync,
    uid,
    hashPassword,
    verifyPassword,
    getEnvironment,
    getTenantIndex,
    createWorkspace
} from '../lib/db.js';
import { validate } from '../middleware/validate.js';
import { AppError, asyncHandler } from '../middleware/error.js';
import { requireAuth } from '../middleware/auth.js';
import { registerSchema, loginSchema, requestDemoSchema } from '../lib/schemas.js';
import type { User, Session } from '../types/index.js';

export const authRouter = Router();

const PASTEL_COLORS = [
    '#4f46e5', // Indigo
    '#0ea5e9', // Sky
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#f97316', // Orange
    '#14b8a6', // Teal
    '#06b6d4'  // Cyan
];

/** POST /api/auth/register */
authRouter.post('/register', validate(registerSchema), asyncHandler(async (req, res) => {
    const { username, password, name, company } = req.body;
    const normalizedUsername = username.toLowerCase().trim();
    const env = req.environment || getEnvironment(req);
    const index = await getTenantIndex(env);

    // Check if user already exists
    if (index.userToTenants[normalizedUsername]) {
        throw new AppError('Kullanıcı adı zaten kullanımda', 400);
    }

    const randomColor = PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)];
    const userId = 'usr-' + uid();

    let tenantId: string;
    let workspaceName: string;

    if (company && company.trim()) {
        workspaceName = company.trim();
        const ws = await createWorkspace(workspaceName, 'team', { id: userId, username: normalizedUsername }, env);
        tenantId = ws.id;
    } else {
        workspaceName = `${name.trim()} (Bireysel)`;
        tenantId = `user_${normalizedUsername}`;
        await createWorkspace(workspaceName, 'user', { id: userId, username: normalizedUsername }, env, undefined, tenantId);
    }

    const newUser: User = {
        id: userId,
        username: normalizedUsername,
        name: name.trim(),
        passwordHash: hashPassword(password),
        avatarColor: randomColor,
        role: 'admin',
        tenantId,
        workspaces: [tenantId],
        company: company ? company.trim() : undefined,
        createdAt: Date.now()
    };

    // Add user to their newly created workspace DB
    const db = readDb({ tenantId, environment: env });
    db.users.push(newUser);

    // Create session token scoped to this workspace
    const randomBytes = crypto.randomBytes(24).toString('hex');
    const token = `${tenantId}:${randomBytes}`;
    const newSession: Session = {
        token,
        userId: newUser.id,
        tenantId,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    };
    db.sessions.push(newSession);
    writeDbSync(db, { tenantId, environment: env });

    res.status(201).json({
        token,
        user: {
            id: newUser.id,
            username: newUser.username,
            name: newUser.name,
            avatarColor: newUser.avatarColor,
            role: newUser.role,
            tenantId,
            workspaces: [{ id: tenantId, name: workspaceName }]
        },
        workspaces: [{ id: tenantId, name: workspaceName }],
        activeWorkspaceId: tenantId
    });
}));

/** POST /api/auth/login */
authRouter.post('/login', validate(loginSchema), asyncHandler(async (req, res) => {
    const { username, password, company } = req.body;
    const normalizedUsername = username.toLowerCase().trim();
    const env = req.environment || getEnvironment(req);
    const index = await getTenantIndex(env);

    let activeTenantId = 'personal';
    let db = readDb({ tenantId: 'personal', environment: env });
    let user = db.users.find(u => u.username.toLowerCase() === normalizedUsername);

    if (user && verifyPassword(password, user.passwordHash)) {
        activeTenantId = 'personal';
    } else {
        // Check company if explicitly provided
        if (company && company.trim()) {
            const companyWs = index.workspaces.find(w => w.name.toLowerCase() === company.toLowerCase().trim() || w.id === company.trim());
            if (companyWs) {
                activeTenantId = companyWs.id;
                db = readDb({ tenantId: activeTenantId, environment: env });
                user = db.users.find(u => u.username.toLowerCase() === normalizedUsername);
            }
        }

        // Check index for user's assigned workspaces
        if (!user || !verifyPassword(password, user.passwordHash)) {
            const userWsIds = index.userToTenants[normalizedUsername];
            if (userWsIds && userWsIds.length > 0) {
                for (const wsId of userWsIds) {
                    const testDb = readDb({ tenantId: wsId, environment: env });
                    const candidate = testDb.users.find(u => u.username.toLowerCase() === normalizedUsername);
                    if (candidate && verifyPassword(password, candidate.passwordHash)) {
                        user = candidate;
                        activeTenantId = wsId;
                        db = testDb;
                        break;
                    }
                }
            }
        }

        // Fallback: check Demo DB
        if (!user || !verifyPassword(password, user.passwordHash)) {
            const demoDb = readDb({ tenantId: 'demo', environment: env });
            const candidate = demoDb.users.find(u => u.username.toLowerCase() === normalizedUsername);
            if (candidate && verifyPassword(password, candidate.passwordHash)) {
                user = candidate;
                activeTenantId = 'demo';
                db = demoDb;
            }
        }
    }

    if (!user || !verifyPassword(password, user.passwordHash)) {
        throw new AppError('Kullanıcı adı veya şifre hatalı', 401);
    }

    if (user.expiresAt && Date.now() > user.expiresAt) {
        throw new AppError('Bu hesabın kullanım süresi dolmuştur.', 401);
    }

    // Get all workspaces accessible by this user
    const userWorkspaceIds = index.userToTenants[normalizedUsername] || [activeTenantId];
    if (!userWorkspaceIds.includes(activeTenantId)) {
        userWorkspaceIds.unshift(activeTenantId);
    }
    const wsNameMap = Object.fromEntries(index.workspaces.map(w => [w.id, w.name]));
    const accessibleWorkspaces = userWorkspaceIds.map(id => ({
        id,
        name: wsNameMap[id] || (id === 'personal' ? 'Kişisel Çalışma Alanı' : id === 'demo' ? 'Demo Panosu' : id)
    }));

    // Create session token prefixed with active workspace ID
    const randomToken = crypto.randomBytes(24).toString('hex');
    const token = `${activeTenantId}:${randomToken}`;
    const newSession: Session = {
        token,
        userId: user.id,
        tenantId: activeTenantId,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    };
    db.sessions.push(newSession);
    writeDbSync(db, { tenantId: activeTenantId, environment: env });

    res.json({
        token,
        user: {
            id: user.id,
            username: user.username,
            name: user.name,
            avatarColor: user.avatarColor,
            role: user.role || 'user',
            tenantId: activeTenantId,
            workspaces: accessibleWorkspaces
        },
        workspaces: accessibleWorkspaces,
        activeWorkspaceId: activeTenantId,
        environment: env
    });
}));

/** POST /api/auth/switch-workspace */
authRouter.post('/switch-workspace', requireAuth, asyncHandler(async (req, res) => {
    const { workspaceId } = req.body;
    if (!workspaceId) {
        throw new AppError('Çalışma alanı ID gereklidir', 400);
    }

    const env = req.environment || getEnvironment(req);
    const index = await getTenantIndex(env);
    const username = req.user!.username.toLowerCase();
    const isSuperAdmin = req.user!.role === 'superadmin';

    const userWsIds = index.userToTenants[username] || [req.tenantId || 'personal'];
    if (!isSuperAdmin && !userWsIds.includes(workspaceId)) {
        throw new AppError('Bu çalışma alanına erişim yetkiniz bulunmamaktadır', 403);
    }

    const targetDb = readDb({ tenantId: workspaceId, environment: env });

    // Generate new token for the target workspace
    const randomToken = crypto.randomBytes(24).toString('hex');
    const newToken = `${workspaceId}:${randomToken}`;
    const newSession: Session = {
        token: newToken,
        userId: req.user!.id,
        tenantId: workspaceId,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
    };
    targetDb.sessions.push(newSession);
    writeDbSync(targetDb, { tenantId: workspaceId, environment: env });

    res.json({
        ok: true,
        token: newToken,
        activeWorkspaceId: workspaceId
    });
}));

/** POST /api/auth/logout */
authRouter.post('/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const tenantId = token.includes(':') ? token.split(':')[0] : 'personal';
        const db = readDb(tenantId);
        if (db.sessions.some(s => s.token === token)) {
            db.sessions = db.sessions.filter(s => s.token !== token);
            writeDbSync(db, tenantId);
        }
    }
    res.json({ ok: true });
});

/** GET /api/auth/me */
authRouter.get('/me', requireAuth, asyncHandler(async (req, res) => {
    const user = req.user!;
    const env = req.environment || getEnvironment(req);
    const index = await getTenantIndex(env);
    const username = user.username.toLowerCase();
    const isSuperAdmin = user.role === 'superadmin';

    const userWsIds = index.userToTenants[username] || [req.tenantId || 'personal'];
    const accessible = index.workspaces.filter(w =>
        isSuperAdmin || userWsIds.includes(w.id) || w.ownerId === user.id
    );

    res.json({
        id: user.id,
        username: user.username,
        name: user.name,
        avatarColor: user.avatarColor,
        role: user.role || 'user',
        tenantId: req.tenantId || 'personal',
        workspaces: accessible,
        activeWorkspaceId: req.tenantId || 'personal',
        environment: env
    });
}));

/** GET /api/users/list */
authRouter.get('/list', requireAuth, (req, res) => {
    const db = readDb(req);
    const publicUsers = db.users.map(u => ({
        id: u.id,
        username: u.username,
        name: u.name,
        avatarColor: u.avatarColor
    }));
    res.json(publicUsers);
});

/** POST /api/auth/request-demo */
authRouter.post('/request-demo', validate(requestDemoSchema), (req, res) => {
    const { name, email } = req.body;
    const emailLower = email.toLowerCase().trim();
    
    // Check in demo DB
    const demoDb = readDb('demo');
    if (demoDb.users.some(u => u.username.toLowerCase() === emailLower)) {
        throw new AppError('Bu e-posta adresiyle kayıtlı bir kullanıcı zaten mevcut', 400);
    }

    // Create notification in personal DB for Super Admin (usr-superadmin / gencyigitcan)
    const personalDb = readDb('personal');
    personalDb.notifications = personalDb.notifications || [];
    const hasPending = personalDb.notifications.some(n => n.type === 'demo-request' && n.email === emailLower && n.demoStatus === 'pending');
    if (hasPending) {
        throw new AppError('Bu e-posta adresiyle yapılmış bekleyen bir demo talebi zaten mevcut', 400);
    }

    const newNotif = {
        id: 'ntf-' + uid(),
        userId: 'usr-superadmin',
        senderId: 'visitor',
        senderName: name.trim(),
        cardId: '',
        cardTitle: '',
        text: `${name.trim()} (${email.trim()}) yeni bir demo hesabı talep etti.`,
        read: false,
        createdAt: Date.now(),
        type: 'demo-request',
        email: emailLower,
        name: name.trim(),
        demoStatus: 'pending' as const
    };

    personalDb.notifications.push(newNotif);
    writeDbSync(personalDb, 'personal');

    res.status(201).json({ ok: true, message: 'Demo talebi başarıyla oluşturuldu.' });
});

/** POST /api/auth/approve-demo */
authRouter.post('/approve-demo', requireAuth, (req, res) => {
    const { notificationId } = req.body;
    const personalDb = readDb('personal');

    // Only admin or superadmin can approve
    if (req.user!.role !== 'superadmin' && req.user!.role !== 'admin' && req.user!.id !== 'usr-1') {
        throw new AppError('Yetkisiz işlem: Sadece yönetici demo taleplerini onaylayabilir', 403);
    }

    personalDb.notifications = personalDb.notifications || [];
    const notification = personalDb.notifications.find(n => n.id === notificationId);
    if (!notification || notification.type !== 'demo-request') {
        throw new AppError('Talep bulunamadı', 404);
    }

    if (notification.demoStatus === 'approved') {
        throw new AppError('Bu talep zaten onaylanmış', 400);
    }

    // Create user inside DEMO DB
    const tempPassword = Math.random().toString(36).substring(2, 8).toUpperCase();
    const randomColor = PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)];

    const demoDb = readDb('demo');
    const newUser: User = {
        id: 'usr-' + uid(),
        username: notification.email!,
        name: notification.name!,
        passwordHash: hashPassword(tempPassword),
        avatarColor: randomColor,
        role: 'user',
        tenantId: 'demo',
        workspaces: ['demo'],
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
    };

    demoDb.users.push(newUser);
    writeDbSync(demoDb, 'demo');

    // Update notification status in personal DB
    notification.demoStatus = 'approved' as const;
    notification.text = `${notification.name} (${notification.email}) demo talebi onaylandı. Giriş: ${notification.email} (Şifre: ${tempPassword})`;
    writeDbSync(personalDb, 'personal');

    res.json({
        ok: true,
        username: newUser.username,
        password: tempPassword,
        expiresAt: newUser.expiresAt
    });
});
