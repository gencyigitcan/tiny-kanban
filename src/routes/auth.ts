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
    saveTenantIndex,
    createWorkspace,
    logActivity
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

    const isOwnerUser = normalizedUsername === 'yigitcangenc@gmail.com' || normalizedUsername === 'gencyigitcan';

    // Check if user already exists in index (if not owner resetting/registering)
    if (index.userToTenants[normalizedUsername] && !isOwnerUser) {
        throw new AppError('Kullanıcı adı veya e-posta zaten kullanımda', 400);
    }

    const randomColor = PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)];
    const userId = isOwnerUser ? 'usr-superadmin' : ('usr-' + uid());

    let tenantId: string;
    let workspaceName: string;

    if (company && company.trim()) {
        workspaceName = company.trim();
        const ws = await createWorkspace(workspaceName, 'team', { id: userId, username: normalizedUsername }, env);
        tenantId = ws.id;
    } else {
        workspaceName = `${name.trim()} (Bireysel)`;
        tenantId = `user_${normalizedUsername.replace(/[^a-zA-Z0-9_]/g, '_')}`;
        await createWorkspace(workspaceName, 'user', { id: userId, username: normalizedUsername }, env, undefined, tenantId);
    }

    const newUser: User = {
        id: userId,
        username: normalizedUsername,
        email: normalizedUsername.includes('@') ? normalizedUsername : (isOwnerUser ? 'yigitcangenc@gmail.com' : undefined),
        name: name.trim(),
        passwordHash: hashPassword(password),
        avatarColor: randomColor,
        role: isOwnerUser ? 'superadmin' : 'user',
        status: isOwnerUser ? 'approved' : 'pending',
        tenantId,
        workspaces: isOwnerUser ? ['personal', tenantId] : [tenantId],
        company: company ? company.trim() : undefined,
        createdAt: Date.now()
    };

    // Add user to their newly created workspace DB
    const db = readDb({ tenantId, environment: env });
    const existingIdx = db.users.findIndex(u => u.username.toLowerCase() === normalizedUsername || u.id === userId);
    if (existingIdx >= 0) {
        db.users[existingIdx] = newUser;
    } else {
        db.users.push(newUser);
    }
    writeDbSync(db, { tenantId, environment: env });

    // If owner user, also update usr-superadmin in personal DB and link workspaces
    if (isOwnerUser) {
        const personalDb = readDb({ tenantId: 'personal', environment: env });
        const superIdx = personalDb.users.findIndex(u => u.id === 'usr-superadmin' || u.username.toLowerCase() === 'gencyigitcan');
        if (superIdx >= 0) {
            personalDb.users[superIdx].passwordHash = newUser.passwordHash;
            personalDb.users[superIdx].email = 'yigitcangenc@gmail.com';
            personalDb.users[superIdx].status = 'approved';
            personalDb.users[superIdx].workspaces = Array.from(new Set([...(personalDb.users[superIdx].workspaces || []), 'personal', tenantId]));
        } else {
            personalDb.users.unshift(newUser);
        }
        writeDbSync(personalDb, { tenantId: 'personal', environment: env });

        index.userToTenants['yigitcangenc@gmail.com'] = Array.from(new Set([...(index.userToTenants['yigitcangenc@gmail.com'] || []), 'personal', tenantId]));
        index.userToTenants['gencyigitcan'] = Array.from(new Set([...(index.userToTenants['gencyigitcan'] || []), 'personal', tenantId]));
        await saveTenantIndex(index, env);

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

        logActivity({
            userId: newUser.id,
            username: newUser.username,
            name: newUser.name,
            userRole: 'superadmin',
            action: 'REGISTER_REQUEST',
            entityType: 'auth',
            entityId: newUser.id,
            details: `Super Admin hesabı oluşturuldu: ${newUser.name} (${newUser.username})`,
            workspaceId: tenantId,
            environment: env
        }, req);

        const wsNameMap = Object.fromEntries(index.workspaces.map(w => [w.id, w.name]));
        const accessibleWorkspaces = (newUser.workspaces || [tenantId]).map(id => ({
            id,
            name: wsNameMap[id] || (id === 'personal' ? 'Kişisel Çalışma Alanı' : id)
        }));

        res.status(201).json({
            token,
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                name: newUser.name,
                avatarColor: newUser.avatarColor,
                role: newUser.role,
                status: newUser.status,
                tenantId,
                workspaces: accessibleWorkspaces
            },
            workspaces: accessibleWorkspaces,
            activeWorkspaceId: tenantId
        });
        return;
    }

    // NON-SUPERADMIN USER: Requires Super Admin Approval!
    // Send notification to Super Admin
    const personalDb = readDb({ tenantId: 'personal', environment: env });
    personalDb.notifications = personalDb.notifications || [];
    personalDb.notifications.push({
        id: 'ntf-' + uid(),
        userId: 'usr-superadmin',
        senderId: newUser.id,
        senderName: newUser.name,
        cardId: '',
        cardTitle: '',
        text: `${newUser.name} (${newUser.username}) sisteme kayıt oldu ve Super Admin onayınızı bekliyor.`,
        read: false,
        createdAt: Date.now(),
        type: 'user-signup-request',
        email: newUser.email || newUser.username,
        name: newUser.name,
        pendingUserId: newUser.id,
        requestStatus: 'pending'
    });
    writeDbSync(personalDb, { tenantId: 'personal', environment: env });

    logActivity({
        userId: newUser.id,
        username: newUser.username,
        name: newUser.name,
        userRole: 'user',
        action: 'REGISTER_REQUEST',
        entityType: 'auth',
        entityId: newUser.id,
        details: `${newUser.name} (${newUser.username}) sisteme kayıt talebinde bulundu. Super Admin onayı bekleniyor.`,
        workspaceId: tenantId,
        environment: env
    }, req);

    res.status(202).json({
        pending: true,
        message: 'Kayıt talebiniz Super Admin onayına iletildi. Onaylandıktan sonra giriş yapabilirsiniz.',
        user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            name: newUser.name,
            status: 'pending'
        }
    });
}));

/** POST /api/auth/login */
authRouter.post('/login', validate(loginSchema), asyncHandler(async (req, res) => {
    const { username, password, company } = req.body;
    const normalizedUsername = username.toLowerCase().trim();
    const env = req.environment || getEnvironment(req);
    const index = await getTenantIndex(env);

    const userMatches = (u: User) => {
        const uName = (u.username || '').toLowerCase();
        const uEmail = (u.email || '').toLowerCase();
        return uName === normalizedUsername ||
               uEmail === normalizedUsername ||
               (normalizedUsername === 'yigitcangenc@gmail.com' && uName === 'gencyigitcan') ||
               (normalizedUsername === 'gencyigitcan' && uEmail === 'yigitcangenc@gmail.com');
    };

    let activeTenantId = 'personal';
    let db = readDb({ tenantId: 'personal', environment: env });
    let user = db.users.find(userMatches);

    if (user && verifyPassword(password, user.passwordHash)) {
        activeTenantId = 'personal';
    } else {
        // Check company if explicitly provided
        if (company && company.trim()) {
            const companyWs = index.workspaces.find(w => w.name.toLowerCase() === company.toLowerCase().trim() || w.id === company.trim());
            if (companyWs) {
                activeTenantId = companyWs.id;
                db = readDb({ tenantId: activeTenantId, environment: env });
                user = db.users.find(userMatches);
            }
        }

        // Check index for user's assigned workspaces
        if (!user || !verifyPassword(password, user.passwordHash)) {
            const userWsIds = index.userToTenants[normalizedUsername] ||
                             (normalizedUsername === 'yigitcangenc@gmail.com' ? index.userToTenants['gencyigitcan'] : undefined) ||
                             (normalizedUsername === 'gencyigitcan' ? index.userToTenants['yigitcangenc@gmail.com'] : undefined);
            if (userWsIds && userWsIds.length > 0) {
                for (const wsId of userWsIds) {
                    const testDb = readDb({ tenantId: wsId, environment: env });
                    const candidate = testDb.users.find(userMatches);
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
            const candidate = demoDb.users.find(userMatches);
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

    // CHECK APPROVAL STATUS
    if (user.status === 'pending') {
        throw new AppError('Hesabınız Super Admin onayını beklemektedir. Onaylandıktan sonra giriş yapabilirsiniz.', 403);
    }
    if (user.status === 'rejected') {
        throw new AppError('Hesap başvurunuz Super Admin tarafından reddedilmiştir.', 403);
    }

    // Update lastLoginAt
    user.lastLoginAt = Date.now();
    writeDbSync(db, { tenantId: activeTenantId, environment: env });

    // Get all workspaces accessible by this user
    const directWsIds = index.userToTenants[normalizedUsername] || [];
    const aliasWsIds = (normalizedUsername === 'yigitcangenc@gmail.com' ? index.userToTenants['gencyigitcan'] : 
                       (normalizedUsername === 'gencyigitcan' ? index.userToTenants['yigitcangenc@gmail.com'] : [])) || [];
    const allWsSet = new Set<string>([...directWsIds, ...aliasWsIds, activeTenantId, ...(user.workspaces || [])]);

    // Superadmin or Yiğitcan always has access to 'personal'
    if (user.role === 'superadmin' || normalizedUsername === 'yigitcangenc@gmail.com' || normalizedUsername === 'gencyigitcan') {
        allWsSet.add('personal');
    }
    const userWorkspaceIds = Array.from(allWsSet);

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

    logActivity({
        userId: user.id,
        username: user.username,
        name: user.name,
        userRole: user.role || 'user',
        action: 'LOGIN',
        entityType: 'auth',
        entityId: user.id,
        details: `${user.name} (${user.username}) sisteme giriş yaptı.`,
        workspaceId: activeTenantId,
        environment: env
    }, req);

    res.json({
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
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
    const isOwner = username === 'yigitcangenc@gmail.com' || username === 'gencyigitcan' || isSuperAdmin;

    const directWsIds = index.userToTenants[username] || [];
    const aliasWsIds = (username === 'yigitcangenc@gmail.com' ? index.userToTenants['gencyigitcan'] : 
                       (username === 'gencyigitcan' ? index.userToTenants['yigitcangenc@gmail.com'] : [])) || [];
    const userWsSet = new Set([...directWsIds, ...aliasWsIds, ...(req.user!.workspaces || [])]);
    if (isOwner) userWsSet.add('personal');

    if (!isOwner && !userWsSet.has(workspaceId)) {
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
    const isOwner = username === 'yigitcangenc@gmail.com' || username === 'gencyigitcan' || isSuperAdmin;

    const directWsIds = index.userToTenants[username] || [];
    const aliasWsIds = (username === 'yigitcangenc@gmail.com' ? index.userToTenants['gencyigitcan'] : 
                       (username === 'gencyigitcan' ? index.userToTenants['yigitcangenc@gmail.com'] : [])) || [];
    const userWsSet = new Set([...directWsIds, ...aliasWsIds, ...(user.workspaces || []), req.tenantId || 'personal']);
    if (isOwner) {
        userWsSet.add('personal');
    }

    const accessible = index.workspaces.filter(w =>
        isSuperAdmin || userWsSet.has(w.id) || w.ownerId === user.id
    );

    res.json({
        id: user.id,
        username: user.username,
        email: user.email,
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
