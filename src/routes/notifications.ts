// ============================================================
//  Notifications Routes
// ============================================================
import { Router } from 'express';
import { readDb, writeDbSync, getEnvironment } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';
import { NotFoundError } from '../middleware/error.js';

export const notificationsRouter = Router();

// Secure all notification routes
notificationsRouter.use(requireAuth);

/** GET /api/notifications */
notificationsRouter.get('/', (req, res) => {
    const isSuperAdmin = req.user?.role === 'superadmin';
    const currentDb = readDb(req);
    let allNotifs = [...(currentDb.notifications || [])];

    if (req.tenantId !== 'personal') {
        const env = req.environment || getEnvironment(req);
        try {
            const personalDb = readDb({ tenantId: 'personal', environment: env });
            for (const n of personalDb.notifications || []) {
                if (!allNotifs.some(existing => existing.id === n.id)) {
                    allNotifs.push(n);
                }
            }
        } catch {}
    }

    const myNotifications = allNotifs
        .filter(n =>
            n.userId === req.user!.id ||
            (isSuperAdmin && (n.userId === 'usr-superadmin' || n.type === 'user-signup-request' || n.type === 'demo-request'))
        )
        .sort((a, b) => b.createdAt - a.createdAt);

    res.json(myNotifications);
});

/** POST /api/notifications/:id/read */
notificationsRouter.post('/:id/read', (req, res) => {
    const isSuperAdmin = req.user?.role === 'superadmin';
    const env = req.environment || getEnvironment(req);
    const db = readDb(req);
    db.notifications = db.notifications || [];
    
    let notification = db.notifications.find(n => n.id === req.params.id && (n.userId === req.user!.id || isSuperAdmin));
    if (notification) {
        notification.read = true;
        writeDbSync(db, req);
    }

    try {
        const personalDb = readDb({ tenantId: 'personal', environment: env });
        const pNotif = personalDb.notifications?.find(n => n.id === req.params.id && (n.userId === req.user!.id || isSuperAdmin));
        if (pNotif) {
            pNotif.read = true;
            writeDbSync(personalDb, { tenantId: 'personal', environment: env });
            if (!notification) notification = pNotif;
        }
    } catch {}

    if (!notification) {
        throw new NotFoundError('Notification not found');
    }
    
    res.json({ ok: true, notification });
});

/** POST /api/notifications/read-all */
notificationsRouter.post('/read-all', (req, res) => {
    const isSuperAdmin = req.user?.role === 'superadmin';
    const env = req.environment || getEnvironment(req);
    const db = readDb(req);
    db.notifications = db.notifications || [];
    
    let updatedCount = 0;
    db.notifications.forEach(n => {
        if ((n.userId === req.user!.id || isSuperAdmin) && !n.read) {
            n.read = true;
            updatedCount++;
        }
    });
    
    if (updatedCount > 0) {
        writeDbSync(db, req);
    }

    if (isSuperAdmin) {
        try {
            const personalDb = readDb({ tenantId: 'personal', environment: env });
            let pUpdated = 0;
            personalDb.notifications?.forEach(n => {
                if (!n.read) {
                    n.read = true;
                    pUpdated++;
                }
            });
            if (pUpdated > 0) {
                writeDbSync(personalDb, { tenantId: 'personal', environment: env });
                updatedCount += pUpdated;
            }
        } catch {}
    }

    res.json({ ok: true, markedCount: updatedCount });
});
