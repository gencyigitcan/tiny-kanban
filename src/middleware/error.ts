// ============================================================
//  Global Error Handler Middleware
// ============================================================
import type { Request, Response, NextFunction } from 'express';

/** Base class for typed application errors */
export class AppError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number = 500,
    ) {
        super(message);
        this.name = 'AppError';
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundError extends AppError { constructor(m = 'Not found') { super(m, 404); } }
export class ValidationError extends AppError { constructor(m = 'Validation failed') { super(m, 400); } }

export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
    (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

/**
 * Express 4-argument error handler — must be registered last.
 */
export function errorHandler(
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
): void {
    const status = err instanceof AppError ? err.statusCode : ((err as any).status || (err as any).statusCode || 500);
    const isProd = process.env.NODE_ENV === 'production';
    const message = (status >= 500 && isProd)
        ? 'Sunucu tarafında beklenmeyen bir hata oluştu.'
        : (err.message || 'Internal server error');

    if (status >= 500) {
        console.error('[ERROR]', err);
    }

    res.status(status).json({ error: message });
}
