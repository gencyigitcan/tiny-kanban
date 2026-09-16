// ============================================================
//  Card Routes
// ============================================================
import { Router } from 'express';
import { readDb, writeDbSync, uid, logActivity, getEnvironment } from '../lib/db.js';
import { validate } from '../middleware/validate.js';
import { NotFoundError } from '../middleware/error.js';
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

/** POST /api/cards */
cardRouter.post('/', validate(createCardSchema), (req, res) => {
    const body = req.body as Omit<Card, 'id' | 'key' | 'comments' | 'createdAt'>;
    const db = readDb(req);
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

    const oldAssignee = db.cards[idx].assignee;
    const oldCol = db.cards[idx].col;
    const newAssignee = req.body.assignee;
    const title = req.body.title || db.cards[idx].title;

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

    const isMove = req.body.col && req.body.col !== oldCol;
    logActivity({
        userId: req.user?.id || 'unknown',
        username: req.user?.username || 'unknown',
        name: req.user?.name || 'Kullanıcı',
        userRole: req.user?.role || 'user',
        action: isMove ? 'CARD_MOVE' : 'CARD_UPDATE',
        entityType: 'card',
        entityId: db.cards[idx].id,
        details: isMove
            ? `'${db.cards[idx].title}' (${db.cards[idx].key}) kartı '${oldCol}' kolonundan '${db.cards[idx].col}' kolonuna taşındı.`
            : `'${db.cards[idx].title}' (${db.cards[idx].key}) kartı güncellendi.`,
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

