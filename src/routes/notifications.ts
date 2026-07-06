// ============================================================
//  Notifications Routes
// ============================================================
import { Router } from 'express';
import { readDb, writeDbSync } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';
import { NotFoundError } from '../middleware/error.js';

export const notificationsRouter = Router();

// Secure all notification routes
notificationsRouter.use(requireAuth);

/** GET /api/notifications */
notificationsRouter.get('/', (req, res) => {
    const db = readDb();
    const myNotifications = (db.notifications || [])
        .filter(n => n.userId === req.user!.id)
        .sort((a, b) => b.createdAt - a.createdAt); // Newest first
    res.json(myNotifications);
});

/** POST /api/notifications/:id/read */
notificationsRouter.post('/:id/read', (req, res) => {
    const db = readDb();
    db.notifications = db.notifications || [];
    
    const notification = db.notifications.find(n => n.id === req.params.id && n.userId === req.user!.id);
    if (!notification) {
        throw new NotFoundError('Notification not found');
    }
    
    notification.read = true;
    writeDbSync(db);
    res.json({ ok: true, notification });
});

/** POST /api/notifications/read-all */
notificationsRouter.post('/read-all', (req, res) => {
    const db = readDb();
    db.notifications = db.notifications || [];
    
    let updatedCount = 0;
    db.notifications.forEach(n => {
        if (n.userId === req.user!.id && !n.read) {
            n.read = true;
            updatedCount++;
        }
    });
    
    if (updatedCount > 0) {
        writeDbSync(db);
    }
    res.json({ ok: true, markedCount: updatedCount });
});
