// ============================================================
//  Authentication Middleware (Multi-Tenant & Multi-Environment)
// ============================================================
import type { Request, Response, NextFunction } from 'express';
import { readDb, getEnvironment, Environment } from '../lib/db.js';
import { AppError } from './error.js';
import type { User } from '../types/index.js';

// Extend Express Request interface to include authenticated user & workspace context
declare global {
    namespace Express {
        interface Request {
            user?: User;
            tenantId?: string;
            dbScope?: string;
            environment?: Environment;
        }
    }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
    const env = req.environment || getEnvironment(req);
    req.environment = env;

    const isDemoReq = (
        req.headers['x-workspace'] === 'demo' ||
        req.headers['x-tenant-id'] === 'demo' ||
        req.query?.workspace === 'demo'
    );

    const authHeader = req.headers.authorization;

    // Public demo workspace access: automatically assign demo session without requiring login
    if (isDemoReq && (!authHeader || !authHeader.startsWith('Bearer '))) {
        const db = readDb({ tenantId: 'demo', environment: env });
        const demoUser = db.users[0] || {
            id: 'usr-1',
            username: 'admin',
            name: 'Ali Yılmaz',
            avatarColor: '#4f46e5',
            role: 'admin',
            tenantId: 'demo',
            workspaces: ['demo']
        };
        req.user = demoUser;
        req.tenantId = 'demo';
        req.dbScope = 'demo';
        return next();
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError('Unauthorized: Token missing', 401);
    }

    const token = authHeader.split(' ')[1];

    // 1. Resolve tenant from token prefix (e.g. "team_123:abc..." or "user_ahmet:xyz...")
    let tenantId = isDemoReq ? 'demo' : 'personal';
    if (token.includes(':')) {
        tenantId = token.split(':')[0];
    }

    // 2. Check the tenant DB for active session
    let db = readDb({ tenantId, environment: env });
    let session = db.sessions.find(s => s.token === token);
    let sessionTenantId = tenantId;

    // 3. Fallback search across standard tenants if not found (for legacy tokens or cross-tenant)
    if (!session) {
        const fallbacks = tenantId === 'personal' ? ['demo'] : ['personal', 'demo'];
        for (const fbTenant of fallbacks) {
            const fbDb = readDb({ tenantId: fbTenant, environment: env });
            const s = fbDb.sessions.find(item => item.token === token);
            if (s) {
                session = s;
                db = fbDb;
                sessionTenantId = fbTenant;
                break;
            }
        }
    }

    if (!session) {
        throw new AppError('Unauthorized: Invalid session token', 401);
    }

    if (session.expiresAt < Date.now()) {
        throw new AppError('Unauthorized: Session expired', 401);
    }

    const user = db.users.find(u => u.id === session!.userId);
    if (!user) {
        throw new AppError('Unauthorized: User not found', 401);
    }

    if (user.status === 'pending') {
        throw new AppError('Forbidden: Hesabınız henüz onaylanmamıştır', 403);
    }

    if (user.status === 'rejected') {
        throw new AppError('Forbidden: Hesap başvurunuz reddedilmiştir', 403);
    }

    if (user.expiresAt && Date.now() > user.expiresAt) {
        throw new AppError('Unauthorized: Account expired', 401);
    }

    // Cross-tenant workspace validation (BOLA / IDOR mitigation)
    const isDemoUser = sessionTenantId === 'demo' || user.tenantId === 'demo' || user.username?.toLowerCase() === 'admin';
    const requestedWorkspace = (req.headers['x-workspace'] || req.headers['x-tenant-id'] || req.query?.workspace) as string | undefined;

    if (isDemoUser) {
        if (requestedWorkspace && requestedWorkspace !== 'demo') {
            throw new AppError('Forbidden: Demo kullanıcıları kişisel veya kurumsal çalışma alanlarına erişemez', 403);
        }
        req.tenantId = 'demo';
        req.dbScope = 'demo';
    } else if (requestedWorkspace && requestedWorkspace !== 'demo') {
        const userWorkspaces = user.workspaces || (user.tenantId ? [user.tenantId] : []);
        // Personal workspace can ONLY be accessed if user explicitly has 'personal' in userWorkspaces or is personal owner
        if (requestedWorkspace === 'personal' && !userWorkspaces.includes('personal') && user.tenantId !== 'personal') {
            throw new AppError('Forbidden: Kişisel çalışma alanına yetkisiz erişim', 403);
        }
        if (user.role === 'superadmin' || userWorkspaces.includes(requestedWorkspace)) {
            req.tenantId = requestedWorkspace;
            req.dbScope = requestedWorkspace;
        } else {
            throw new AppError('Forbidden: Yetkisiz çalışma alanı erişimi', 403);
        }
    } else {
        req.tenantId = isDemoReq ? 'demo' : sessionTenantId;
        req.dbScope = req.tenantId;
    }

    req.user = user;
    return next();
}
