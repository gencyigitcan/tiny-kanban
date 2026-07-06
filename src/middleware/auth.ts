// ============================================================
//  Authentication Middleware
// ============================================================
import type { Request, Response, NextFunction } from 'express';
import { readDb } from '../lib/db.js';
import { AppError } from './error.js';
import type { User } from '../types/index.js';

// Extend Express Request interface to include authenticated user
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError('Unauthorized: Token missing', 401);
    }

    const token = authHeader.split(' ')[1];
    const db = readDb();

    const session = db.sessions.find(s => s.token === token);
    if (!session) {
        throw new AppError('Unauthorized: Invalid session token', 401);
    }

    if (session.expiresAt < Date.now()) {
        throw new AppError('Unauthorized: Session expired', 401);
    }

    const user = db.users.find(u => u.id === session.userId);
    if (!user) {
        throw new AppError('Unauthorized: User not found', 401);
    }

    req.user = user;
    next();
}
