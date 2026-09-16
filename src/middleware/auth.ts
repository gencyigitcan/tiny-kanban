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
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError('Unauthorized: Token missing', 401);
    }

    const token = authHeader.split(' ')[1];
    const env = req.environment || getEnvironment(req);
    req.environment = env;

    // 1. Resolve tenant from token prefix (e.g. "team_123:abc..." or "user_ahmet:xyz...")
    let tenantId = 'personal';
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

    if (user.expiresAt && Date.now() > user.expiresAt) {
        throw new AppError('Unauthorized: Account expired', 401);
    }

    req.user = user;
    req.tenantId = sessionTenantId;
    req.dbScope = sessionTenantId;
    return next();
}
