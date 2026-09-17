// ============================================================
//  Card Routes
// ============================================================
import { Router } from 'express';
import { readDb, writeDbSync, uid, logActivity, getEnvironment } from '../lib/db.js';
import { validate } from '../middleware/validate.js';
import { NotFoundError, AppError } from '../middleware/error.js';
import { createCardSchema, updateCardSchema } from '../lib/schemas.js';
import type { Card } from '../types/index.js';

export const cardRouter = Router();

function notifyAssignee(db: any, cardId: string, cardTitle: string, assigneeName: string, sender: any) {
    if (!assigneeName || !sender) return;
    const recipient = db.users.find((u: any) => u.name.toLowerCase() === assigneeName.toLowerCase());
    if (recipient && recipient.id !== sender.id) {
        const notification = {
            id: 'ntf-' + uid(),
            userId: recipient.id,
            senderId: sender.id,
            senderName: sender.name,
            cardId,
            cardTitle,
            text: `${sender.name} size '${cardTitle}' görevini atadı.`,
            read: false,
            createdAt: Date.now()
        };
        db.notifications = db.notifications || [];
        db.notifications.push(notification);
    }
}

/** GET /api/cards */
cardRouter.get('/', (req, res) => {
    res.json(readDb(req).cards);
});

/** GET /api/cards/:id */
cardRouter.get('/:id', (req, res) => {
    const card = readDb(req).cards.find(c => c.id === req.params.id);
    if (!card) throw new NotFoundError('Card not found');
    res.json(card);
});

/** POST /api/cards/:id/view - Record user card read/inspection event */
cardRouter.post('/:id/view', (req, res) => {
    const db = readDb(req);
    const card = db.cards.find(c => c.id === req.params.id);
    if (!card) throw new NotFoundError('Card not found');

    const userId = req.user?.id || 'guest';
    const username = req.user?.username || 'misafir';
    const name = req.user?.name || 'Misafir Kullanıcı';
    const role = req.user?.role || 'user';

    // Throttling: If same user viewed this card within last 2 minutes, avoid logging duplicate spam
    const lastActivity = (card.activity || []).find(a => a.userId === userId && (a.action === 'CARD_VIEW' || a.action === 'VIEW'));
    const twoMinutesAgo = Date.now() - 2 * 60 * 1000;
    let logged = false;
    if (!lastActivity || lastActivity.createdAt < twoMinutesAgo) {
        logActivity({
            userId,
            username,
            name,
            userRole: role,
            action: 'CARD_VIEW',
            entityType: 'card',
            entityId: card.id,
            details: `'${card.title}' (${card.key}) biletini açtı ve inceledi.`,
            workspaceId: req.tenantId || 'personal',
            environment: req.environment || getEnvironment(req)
        }, req);
        logged = true;
    }

    const freshDb = readDb(req);
    const freshCard = freshDb.cards.find(c => c.id === req.params.id) || card;

    res.json({ success: true, logged, throttled: !logged, activity: freshCard.activity || [] });
});

/** GET /api/cards/:id/activity - Get card activity history */
cardRouter.get('/:id/activity', (req, res) => {
    const db = readDb(req);
    const card = db.cards.find(c => c.id === req.params.id);
    if (!card) throw new NotFoundError('Card not found');
    res.json({ activity: card.activity || [] });
});

/** POST /api/cards/:id/comments - Add comment directly with activity logging */
cardRouter.post('/:id/comments', (req, res) => {
    const db = readDb(req);
    const card = db.cards.find(c => c.id === req.params.id);
    if (!card) throw new NotFoundError('Card not found');

    const text = String(req.body.text || '').trim();
    if (!text) throw new AppError('Yorum metni boş olamaz', 400);

    const authorName = req.user?.name || req.body.author || 'Misafir';
    const authorId = req.user?.id || req.body.authorId || '';

    const newComment = {
        id: 'comm-' + uid(),
        text,
        createdAt: Date.now(),
        author: authorName,
        authorId
    };

    card.comments = card.comments || [];
    card.comments.push(newComment);
    writeDbSync(db, req);

    logActivity({
        userId: req.user?.id || 'guest',
        username: req.user?.username || 'misafir',
        name: authorName,
        userRole: req.user?.role || 'user',
        action: 'CARD_COMMENT',
        entityType: 'card',
        entityId: card.id,
        details: `'${card.title}' (${card.key}) biletine yorum ekledi: "${text.length > 60 ? text.slice(0, 57) + '…' : text}"`,
        workspaceId: req.tenantId || 'personal',
        environment: req.environment || getEnvironment(req)
    }, req);

    res.status(201).json({ comment: newComment, comments: card.comments, activity: card.activity || [] });
});

/** POST /api/cards */
cardRouter.post('/', validate(createCardSchema), (req, res) => {
    const body = req.body as Omit<Card, 'id' | 'key' | 'comments' | 'createdAt'>;
    const db = readDb(req);

    // Validate that assignee belongs to the active workspace / team
    if (body.assignee && body.assignee.trim()) {
        const trimmed = body.assignee.trim().toLowerCase();
        const availableUsers = (db.users && db.users.length > 0) ? db.users : (req.user ? [req.user] : []);
        const exists = availableUsers.some((u: any) => 
            (u.name && u.name.toLowerCase() === trimmed) ||
            (u.username && u.username.toLowerCase() === trimmed)
        );
        if (!exists) {
            throw new AppError('Atanan kullanıcı bu çalışma alanında veya takımda bulunmuyor', 400);
        }
    }

    db.taskCounter = (db.taskCounter ?? 0) + 1;
    const key = `TK-${db.taskCounter}`;
    const card: Card = {
        id: uid(),
        key,
        title: body.title,
        desc: body.desc ?? '',
        assignee: body.assignee,
        priority: body.priority ?? 'medium',
        col: body.col ?? 'todo',
        startDate: body.startDate ?? null,
        dueDate: body.dueDate ?? null,
        labels: body.labels ?? [],
        storyPoints: body.storyPoints ?? null,
        estimatedEffort: body.estimatedEffort ?? null,
        spentEffort: body.spentEffort ?? null,
        subtasks: body.subtasks ?? [],
        comments: [],
        epicId: body.epicId ?? null,
        sprintId: body.sprintId ?? null,
        createdAt: Date.now(),
        activity: []
    };
    db.cards.push(card);
    notifyAssignee(db, card.id, card.title, card.assignee, req.user);
    writeDbSync(db, req);

    logActivity({
        userId: req.user?.id || 'unknown',
        username: req.user?.username || 'unknown',
        name: req.user?.name || 'Kullanıcı',
        userRole: req.user?.role || 'user',
        action: 'CARD_CREATE',
        entityType: 'card',
        entityId: card.id,
        details: `'${card.title}' (${card.key}) kartı oluşturuldu. Kolon: ${card.col}, Öncelik: ${card.priority}`,
        workspaceId: req.tenantId || 'personal',
        environment: req.environment || getEnvironment(req)
    }, req);

    res.status(201).json(card);
});

/** PUT /api/cards/:id */
cardRouter.put('/:id', validate(updateCardSchema), (req, res) => {
    const db = readDb(req);
    const idx = db.cards.findIndex(c => c.id === req.params.id);
    if (idx === -1) throw new NotFoundError('Card not found');

    // Validate that new assignee belongs to the active workspace / team
    if (req.body.assignee !== undefined && req.body.assignee && String(req.body.assignee).trim()) {
        const trimmed = String(req.body.assignee).trim().toLowerCase();
        const availableUsers = (db.users && db.users.length > 0) ? db.users : (req.user ? [req.user] : []);
        const exists = availableUsers.some((u: any) => 
            (u.name && u.name.toLowerCase() === trimmed) ||
            (u.username && u.username.toLowerCase() === trimmed)
        );
        if (!exists) {
            throw new AppError('Atanan kullanıcı bu çalışma alanında veya takımda bulunmuyor', 400);
        }
    }

    const target = db.cards[idx];
    const oldAssignee = target.assignee;
    const oldCol = target.col;
    const oldPriority = target.priority;
    const oldDue = target.dueDate;
    const oldSpent = target.spentEffort;
    const newAssignee = req.body.assignee;
    const title = req.body.title || target.title;

    const allowed: (keyof Card)[] = [
        'title', 'desc', 'assignee', 'priority', 'col',
        'startDate', 'dueDate', 'labels', 'storyPoints',
        'estimatedEffort', 'spentEffort',
        'subtasks', 'comments', 'epicId', 'sprintId',
    ];
    for (const key of allowed) {
        if (req.body[key] !== undefined) {
            (db.cards[idx] as unknown as Record<string, unknown>)[key] = req.body[key];
        }
    }

    if (newAssignee && newAssignee !== oldAssignee) {
        notifyAssignee(db, db.cards[idx].id, title, newAssignee, req.user);
    }

    writeDbSync(db, req);

    let action: any = 'CARD_UPDATE';
    let details = `'${db.cards[idx].title}' (${db.cards[idx].key}) kartı güncellendi.`;

    if (req.body.col && req.body.col !== oldCol) {
        action = 'CARD_MOVE';
        details = `'${db.cards[idx].title}' (${db.cards[idx].key}) kartı '${oldCol}' kolonundan '${db.cards[idx].col}' kolonuna taşındı.`;
    } else if (req.body.spentEffort !== undefined && req.body.spentEffort !== oldSpent) {
        action = 'CARD_EFFORT';
        details = `'${db.cards[idx].title}' (${db.cards[idx].key}) harcanan efor güncellendi: ${req.body.spentEffort} sa (önceki: ${oldSpent || 0} sa).`;
    } else if (newAssignee !== undefined && newAssignee !== oldAssignee) {
        action = 'CARD_UPDATE';
        details = `'${db.cards[idx].title}' (${db.cards[idx].key}) ataması değiştirildi: ${oldAssignee || 'Atanmamış'} → ${newAssignee || 'Atanmamış'}.`;
    } else if (req.body.dueDate !== undefined && req.body.dueDate !== oldDue) {
        action = 'CARD_UPDATE';
        details = `'${db.cards[idx].title}' (${db.cards[idx].key}) bitiş tarihi değiştirildi: ${req.body.dueDate || 'Kaldırıldı'}.`;
    } else if (req.body.priority !== undefined && req.body.priority !== oldPriority) {
        action = 'CARD_UPDATE';
        details = `'${db.cards[idx].title}' (${db.cards[idx].key}) önceliği '${oldPriority}' → '${req.body.priority}' olarak değiştirildi.`;
    }

    logActivity({
        userId: req.user?.id || 'unknown',
        username: req.user?.username || 'unknown',
        name: req.user?.name || 'Kullanıcı',
        userRole: req.user?.role || 'user',
        action,
        entityType: 'card',
        entityId: db.cards[idx].id,
        details,
        workspaceId: req.tenantId || 'personal',
        environment: req.environment || getEnvironment(req)
    }, req);

    res.json(db.cards[idx]);
});

/** DELETE /api/cards/:id */
cardRouter.delete('/:id', (req, res) => {
    const db = readDb(req);
    const cardToDelete = db.cards.find(c => c.id === req.params.id);
    const before = db.cards.length;
    db.cards = db.cards.filter(c => c.id !== req.params.id);
    if (db.cards.length === before) throw new NotFoundError('Card not found');
    writeDbSync(db, req);

    logActivity({
        userId: req.user?.id || 'unknown',
        username: req.user?.username || 'unknown',
        name: req.user?.name || 'Kullanıcı',
        userRole: req.user?.role || 'user',
        action: 'CARD_DELETE',
        entityType: 'card',
        entityId: req.params.id,
        details: `'${cardToDelete?.title || req.params.id}' (${cardToDelete?.key || ''}) kartı silindi.`,
        workspaceId: req.tenantId || 'personal',
        environment: req.environment || getEnvironment(req)
    }, req);

    res.json({ ok: true });
});

