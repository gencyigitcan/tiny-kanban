// ============================================================
//  Zod Validation Middleware
// ============================================================
import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';

/**
 * Returns an Express middleware that validates `req.body` against a Zod schema.
 * On failure → 400 with structured error list.
 * On success → parsed & coerced value is written back to `req.body`.
 */
export function validate<T>(schema: ZodSchema<T>) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const errors = result.error.issues.map(e => ({
                field: e.path.map(String).join('.'),
                message: e.message,
            }));
            res.status(400).json({ error: 'Validation failed', errors });
            return;
        }
        req.body = result.data;
        next();
    };
}
