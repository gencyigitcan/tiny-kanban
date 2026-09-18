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

export const DEMO_USERNAMES = new Set([
    'admin',
    'zeynep',
    'mehmet',
    'selin',
    'caner',
    'burcu',
    'emre',
    'gamze',
    'tolga',
    'derya'
]);

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

    // Guard: Demo usernames are strictly reserved for the sandbox demo workspace
    if (DEMO_USERNAMES.has(normalizedUsername)) {
        throw new AppError('Bu kullanıcı adı demo sistemi için ayrılmıştır, yeni kayıt yapılamaz', 400);
    }

    const personalDb = readDb({ tenantId: 'personal', environment: env });
    const existingSuperAdmin = personalDb.users.find(u =>
        u.role === 'superadmin' &&
        u.status === 'approved' &&
        !DEMO_USERNAMES.has(u.username?.toLowerCase() || '')
    );
    const isFirstSuperAdmin = !existingSuperAdmin;

    // Existing superadmin updating profile or password
    const isExistingSuperUpdating = Boolean(existingSuperAdmin && (
        existingSuperAdmin.username.toLowerCase() === normalizedUsername ||
        (existingSuperAdmin.email && existingSuperAdmin.email.toLowerCase() === normalizedUsername)
    ));

    const isSuperAdminRegister = isFirstSuperAdmin || isExistingSuperUpdating;

    // Check if user already exists in index (if not superadmin resetting/registering)
    if (index.userToTenants[normalizedUsername] && !isSuperAdminRegister) {
        throw new AppError('Kullanıcı adı veya e-posta zaten kullanımda', 400);
    }

    const randomColor = PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)];
    const userId = isSuperAdminRegister ? (existingSuperAdmin?.id || 'usr-superadmin') : ('usr-' + uid());

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
        email: normalizedUsername.includes('@') ? normalizedUsername : undefined,
        name: name.trim(),
        passwordHash: hashPassword(password),
        avatarColor: randomColor,
        role: isSuperAdminRegister ? 'superadmin' : 'user',
        status: isSuperAdminRegister ? 'approved' : 'pending',
        tenantId,
        workspaces: isSuperAdminRegister ? ['personal', tenantId] : [tenantId],
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

    // If super admin registration, update/insert usr-superadmin in personal DB and link workspaces
    if (isSuperAdminRegister) {
        const superIdx = personalDb.users.findIndex(u =>
            u.username.toLowerCase() === normalizedUsername ||
            (u.email && u.email.toLowerCase() === normalizedUsername) ||
            (isFirstSuperAdmin && u.id === 'usr-superadmin')
        );
        if (superIdx >= 0) {
            personalDb.users[superIdx].passwordHash = newUser.passwordHash;
            personalDb.users[superIdx].username = normalizedUsername;
            personalDb.users[superIdx].name = name.trim();
            if (newUser.email) personalDb.users[superIdx].email = newUser.email;
            personalDb.users[superIdx].status = 'approved';
            personalDb.users[superIdx].role = 'superadmin';
            personalDb.users[superIdx].workspaces = Array.from(new Set([...(personalDb.users[superIdx].workspaces || []), 'personal', tenantId]));
        } else {
            personalDb.users.unshift(newUser);
        }
        writeDbSync(personalDb, { tenantId: 'personal', environment: env });

        index.userToTenants[normalizedUsername] = Array.from(new Set([...(index.userToTenants[normalizedUsername] || []), 'personal', tenantId]));
        if (newUser.email) {
            index.userToTenants[newUser.email.toLowerCase()] = Array.from(new Set([...(index.userToTenants[newUser.email.toLowerCase()] || []), 'personal', tenantId]));
        }
        await saveTenantIndex(index, env);

        // Create session token scoped to this workspace
        const randomBytes = crypto.randomBytes(32).toString('hex');
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
                tenantId: newUser.tenantId,
                company: newUser.company,
                workspaces: accessibleWorkspaces
            },
            workspaces: accessibleWorkspaces,
            activeWorkspaceId: tenantId
        });
        return;
    }

    // NON-SUPERADMIN USER: Requires Super Admin Approval!
    // Send notification to Super Admin
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

    if (!index.userToTenants[normalizedUsername]) {
        index.userToTenants[normalizedUsername] = [];
    }
    if (!index.userToTenants[normalizedUsername].includes(tenantId)) {
        index.userToTenants[normalizedUsername].push(tenantId);
    }
    if (!index.workspaces.some(w => w.id === tenantId)) {
        index.workspaces.push({
            id: tenantId,
            name: `${newUser.name} Çalışma Alanı`,
            type: 'personal',
            ownerId: newUser.id,
            createdAt: Date.now()
        });
    }
    await saveTenantIndex(index, env);

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
        userId: newUser.id,
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
        return uName === normalizedUsername || uEmail === normalizedUsername;
    };

    let activeTenantId = '';
    let db: any = null;
    let user: User | undefined;

    // ── 1. DEMO PERSONA STRICT QUARANTINE ─────────────────────────
    // If logging in with ANY demo username (e.g. 'admin' for Ali Yılmaz, 'zeynep', etc.),
    // they MUST ONLY connect to the demo workspace and NEVER touch personalDb or private user tickets!
    if (DEMO_USERNAMES.has(normalizedUsername)) {
        const demoDb = readDb({ tenantId: 'demo', environment: env });
        const candidate = demoDb.users.find(userMatches);
        if (candidate) {
            const isValid = candidate.passwordHash 
                ? verifyPassword(password, candidate.passwordHash)
                : (password === 'password' || password === 'admin');
            if (isValid || password === 'password') {
                user = candidate;
                activeTenantId = 'demo';
                db = demoDb;
            }
        }
        if (!user) {
            throw new AppError('Kullanıcı adı veya şifre hatalı', 401);
        }
    }

    // ── 2. NON-DEMO USERS (Corporate / Personal Accounts) ─────────
    if (!user) {
        // A. Check user's assigned workspaces from index (excluding demo)
        const userWsIds = (index.userToTenants[normalizedUsername] || []).filter(id => id !== 'demo');
        for (const wsId of userWsIds) {
            const wsDb = readDb({ tenantId: wsId, environment: env });
            const candidate = wsDb.users.find(userMatches);
            if (candidate && candidate.passwordHash && verifyPassword(password, candidate.passwordHash)) {
                user = candidate;
                activeTenantId = wsId;
                db = wsDb;
                break;
            }
        }
    }

    // B. Check company / shared team workspace if explicitly provided
    if (!user && company && company.trim()) {
        const companyWs = index.workspaces.find(w =>
            (w.name.toLowerCase() === company.toLowerCase().trim() || w.id === company.trim()) && w.id !== 'demo'
        );
        if (companyWs) {
            const companyDb = readDb({ tenantId: companyWs.id, environment: env });
            const candidate = companyDb.users.find(userMatches);
            if (candidate && candidate.passwordHash && verifyPassword(password, candidate.passwordHash)) {
                user = candidate;
                activeTenantId = companyWs.id;
                db = companyDb;
            }
        }
    }

    // C. Check master personal DB ONLY for legitimate non-demo personal accounts
    if (!user) {
        const personalDb = readDb({ tenantId: 'personal', environment: env });
        const personalCandidate = personalDb.users.find(u =>
            userMatches(u) && !DEMO_USERNAMES.has(u.username?.toLowerCase() || '')
        );
        if (personalCandidate && personalCandidate.passwordHash && verifyPassword(password, personalCandidate.passwordHash)) {
            user = personalCandidate;
            activeTenantId = 'personal';
            db = personalDb;
        }
    }

    const isPasswordValid = Boolean(user && (
        (activeTenantId === 'demo' && (password === 'password' || verifyPassword(password, user.passwordHash))) ||
        (user.passwordHash && verifyPassword(password, user.passwordHash))
    ));
    if (!user || !isPasswordValid) {
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

    // Calculate accessible workspaces strictly by role and tenant assignment
    let accessibleWorkspaces: Array<{ id: string; name: string }>;
    if (activeTenantId === 'demo' || user.tenantId === 'demo') {
        user.workspaces = ['demo'];
        user.tenantId = 'demo';
        accessibleWorkspaces = [{ id: 'demo', name: 'Demo Panosu' }];
    } else {
        if (user.role === 'superadmin') {
            const wsMap = new Map<string, string>();
            wsMap.set('personal', 'Kişisel Çalışma Alanı');
            for (const w of index.workspaces) {
                if (w.id !== 'demo') {
                    wsMap.set(w.id, w.name || w.id);
                }
            }
            accessibleWorkspaces = Array.from(wsMap.entries()).map(([id, name]) => ({ id, name }));
            user.workspaces = accessibleWorkspaces.map(w => w.id);
        } else {
            const directWsIds = (index.userToTenants[normalizedUsername] || []).filter(id => id !== 'demo');
            const userWsSet = new Set<string>([...directWsIds, activeTenantId, ...(user.workspaces || []).filter(id => id !== 'demo')]);

            // Add workspaces where user is in members or is owner
            for (const w of index.workspaces) {
                if (w.members?.some(m => m.userId === user.id || m.username?.toLowerCase() === normalizedUsername) || w.ownerId === user.id) {
                    userWsSet.add(w.id);
                }
            }

            const wsNameMap = Object.fromEntries(index.workspaces.map(w => [w.id, w.name]));
            accessibleWorkspaces = Array.from(userWsSet).map(id => ({
                id,
                name: wsNameMap[id] || (id === 'personal' ? 'Kişisel Çalışma Alanı' : id)
            }));
        }
    }

    // Create session token prefixed with active workspace ID
    const randomToken = crypto.randomBytes(32).toString('hex');
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
        details: `${user.name} (${user.username}) sisteme giriş yaptı (${activeTenantId}).`,
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
            role: user.role,
            status: user.status,
            tenantId: activeTenantId,
            company: user.company,
            workspaces: accessibleWorkspaces
        },
        workspaces: accessibleWorkspaces,
        activeWorkspaceId: activeTenantId
    });
}));

/** GET /api/auth/demo-users - Returns demo personas for quick 1-click selection */
authRouter.get('/demo-users', asyncHandler(async (req, res) => {
    const env = req.environment || getEnvironment(req);
    const demoDb = readDb({ tenantId: 'demo', environment: env });
    
    // Professional member titles for Nova Engineering Team
    const titles: Record<string, string> = {
        'admin': 'Proje Yöneticisi & Takım Lideri',
        'zeynep': 'Kıdemli UI/UX Tasarımcısı',
        'mehmet': 'Backend & Bulut Mühendisi',
        'selin': 'Mobil Uygulama Geliştiricisi',
        'caner': 'DevOps & Sistem Mimarı',
        'burcu': 'QA & Test Otomasyon Mühendisi',
        'emre': 'Veri Analisti & Raporlama',
        'gamze': 'Scrum Master & Çevik Koç',
        'tolga': 'Siber Güvenlik Uzmanı',
        'derya': 'Product Owner (Ürün Yöneticisi)'
    };

    const users = (demoDb.users || []).map(u => ({
        id: u.id,
        username: u.username,
        name: u.name,
        avatarColor: u.avatarColor,
        role: u.role || 'user',
        title: titles[u.username.toLowerCase()] || (u.role === 'admin' ? 'Yönetici' : 'Ekip Üyesi')
    }));

    res.json({ users });
}));

/** POST /api/auth/demo-login - 1-click quick persona login for Nova Demo team */
authRouter.post('/demo-login', asyncHandler(async (req, res) => {
    const { username } = req.body || {};
    const normalizedUsername = (username || 'admin').toLowerCase().trim();
    const env = req.environment || getEnvironment(req);
    const demoDb = readDb({ tenantId: 'demo', environment: env });

    let user = demoDb.users.find(u => u.username.toLowerCase() === normalizedUsername);
    if (!user) {
        user = demoDb.users[0];
    }

    if (!user) {
        throw new AppError('Demo kullanıcısı bulunamadı', 404);
    }

    user.lastLoginAt = Date.now();

    const randomToken = crypto.randomBytes(32).toString('hex');
    const token = `demo:${randomToken}`;
    const newSession: Session = {
        token,
        userId: user.id,
        tenantId: 'demo',
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
    };
    demoDb.sessions.push(newSession);
    writeDbSync(demoDb, { tenantId: 'demo', environment: env });

    logActivity({
        userId: user.id,
        username: user.username,
        name: user.name,
        userRole: user.role || 'user',
        action: 'LOGIN',
        entityType: 'auth',
        entityId: user.id,
        details: `[DEMO GİRİŞİ] ${user.name} (@${user.username}) Nova Demo ortamına hızlı giriş yaptı.`,
        workspaceId: 'demo',
        environment: env
    }, req);

    res.json({
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email || `${user.username}@novateam.demo`,
            name: user.name,
            avatarColor: user.avatarColor,
            role: user.role || 'user',
            workspaces: [{ id: 'demo', name: 'Nova Demo Panosu' }]
        },
        workspaces: [{ id: 'demo', name: 'Nova Demo Panosu' }],
        activeWorkspaceId: 'demo',
        environment: env
    });
}));

/** POST /api/auth/switch-workspace */
authRouter.post('/switch-workspace', requireAuth, asyncHandler(async (req, res) => {
    const { workspaceId } = req.body;
    if (!workspaceId) {
        throw new AppError('Çalışma alanı ID gereklidir', 400);
    }

    const username = req.user!.username.toLowerCase();
    const isSuperAdmin = req.user!.role === 'superadmin';
    const isDemoUser = !isSuperAdmin && (req.user?.tenantId === 'demo' || req.tenantId === 'demo' || DEMO_USERNAMES.has(username));

    // Strictly deny demo users from switching to any workspace other than 'demo'
    if (isDemoUser && workspaceId !== 'demo') {
        throw new AppError('Demo kullanıcıları kişisel veya kurumsal çalışma alanlarına geçiş yapamaz', 403);
    }

    const env = req.environment || getEnvironment(req);
    const index = await getTenantIndex(env);

    const exists = index.workspaces.some(w => w.id === workspaceId) || workspaceId === 'personal' || workspaceId === 'demo';
    if (!exists) {
        throw new AppError('Çalışma alanı bulunamadı', 404);
    }

    const directWsIds = index.userToTenants[username] || [];
    const userWsSet = new Set([...directWsIds, ...(req.user!.workspaces || [])]);

    const targetWsObj = index.workspaces.find(w => w.id === workspaceId);
    const isMemberOfTarget = targetWsObj?.members?.some(m => m.userId === req.user!.id || m.username?.toLowerCase() === username);
    const isOwnerOfTarget = targetWsObj?.ownerId === req.user!.id;

    // Super Admin has unrestricted access to all workspaces in the system.
    // For non-superadmin users, verify workspace membership, ownership, or userToTenants mapping.
    if (!isSuperAdmin && !userWsSet.has(workspaceId) && !isMemberOfTarget && !isOwnerOfTarget) {
        if (workspaceId === 'personal') {
            throw new AppError('Kişisel çalışma alanına yetkisiz erişim', 403);
        }
        throw new AppError('Bu çalışma alanına erişim yetkiniz bulunmamaktadır', 403);
    }

    const targetDb = readDb({ tenantId: workspaceId, environment: env });

    // CRITICAL: Ensure the switching user exists in targetDb.users so subsequent requireAuth requests succeed!
    let targetUser: User | undefined = targetDb.users.find(u => u.id === req.user!.id || u.username.toLowerCase() === username);
    if (!targetUser) {
        const newUserRecord: User = {
            id: req.user!.id,
            username: req.user!.username,
            name: req.user!.name,
            email: req.user!.email,
            avatarColor: req.user!.avatarColor,
            passwordHash: req.user!.passwordHash || '',
            role: isSuperAdmin ? 'superadmin' : (req.user!.role || 'user'),
            status: 'approved',
            tenantId: workspaceId,
            company: req.user!.company,
            workspaces: [workspaceId],
            createdAt: req.user!.createdAt || Date.now(),
            lastLoginAt: Date.now()
        };
        targetDb.users.push(newUserRecord);
    } else {
        if (isSuperAdmin) {
            targetUser.role = 'superadmin';
        }
        targetUser.status = 'approved';
    }

    // Generate new token for the target workspace
    const randomToken = crypto.randomBytes(32).toString('hex');
    const newToken = `${workspaceId}:${randomToken}`;
    const newSession: Session = {
        token: newToken,
        userId: req.user!.id,
        tenantId: workspaceId,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
    };
    targetDb.sessions.push(newSession);
    writeDbSync(targetDb, { tenantId: workspaceId, environment: env });

    // Ensure index.userToTenants maintains this workspace mapping for the user
    let indexDirty = false;
    if (!index.userToTenants[username]) {
        index.userToTenants[username] = [];
        indexDirty = true;
    }
    if (!index.userToTenants[username].includes(workspaceId)) {
        index.userToTenants[username].push(workspaceId);
        indexDirty = true;
    }
    if (req.user!.email) {
        const normEmail = req.user!.email.toLowerCase();
        if (!index.userToTenants[normEmail]) {
            index.userToTenants[normEmail] = [];
            indexDirty = true;
        }
        if (!index.userToTenants[normEmail].includes(workspaceId)) {
            index.userToTenants[normEmail].push(workspaceId);
            indexDirty = true;
        }
    }
    if (indexDirty) {
        await saveTenantIndex(index, env);
    }

    logActivity({
        userId: req.user!.id,
        username: req.user!.username,
        name: req.user!.name,
        userRole: req.user!.role || 'user',
        action: 'LOGIN',
        entityType: 'auth',
        entityId: req.user!.id,
        details: `${req.user!.name} (${req.user!.username}) '${workspaceId}' çalışma alanına geçiş yaptı.`,
        workspaceId,
        environment: env
    }, req);

    res.json({
        ok: true,
        token: newToken,
        activeWorkspaceId: workspaceId
    });
}));

/** POST /api/auth/logout */
authRouter.post('/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    const env = req.environment || getEnvironment(req);
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const tenantId = token.includes(':') ? token.split(':')[0] : 'personal';
        const db = readDb({ tenantId, environment: env });
        const session = db.sessions.find(s => s.token === token);
        if (session) {
            const user = db.users.find(u => u.id === session.userId);
            if (user) {
                logActivity({
                    userId: user.id,
                    username: user.username,
                    name: user.name,
                    userRole: user.role || 'user',
                    action: 'LOGOUT',
                    entityType: 'auth',
                    entityId: user.id,
                    details: `${user.name} (${user.username}) oturumu başarıyla sonlandırıldı.`,
                    workspaceId: tenantId,
                    environment: env
                }, req);
            }
            db.sessions = db.sessions.filter(s => s.token !== token);
            writeDbSync(db, { tenantId, environment: env });
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

    const directWsIds = index.userToTenants[username] || [];
    const userWsSet = new Set([...directWsIds, ...(user.workspaces || []), req.tenantId || 'personal']);
    if (isSuperAdmin) {
        userWsSet.add('personal');
    }

    let accessible = index.workspaces.filter(w =>
        isSuperAdmin || userWsSet.has(w.id) || w.ownerId === user.id || w.members?.some(m => m.userId === user.id || m.username?.toLowerCase() === username)
    );

    if (isSuperAdmin || userWsSet.has('personal') || req.tenantId === 'personal') {
        if (!accessible.some(w => w.id === 'personal')) {
            accessible.unshift({
                id: 'personal',
                name: 'Kişisel Çalışma Alanı',
                type: 'personal' as any,
                ownerId: user.id,
                createdAt: Date.now()
            });
        }
    }

    if (req.tenantId === 'demo') {
        if (!accessible.some(w => w.id === 'demo')) {
            accessible = [{
                id: 'demo',
                name: 'Demo Panosu (Nova Takımı)',
                type: 'team' as any,
                ownerId: 'admin',
                createdAt: Date.now()
            }, ...accessible];
        }
    }

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

    // Create notification in personal DB for Super Admin
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
