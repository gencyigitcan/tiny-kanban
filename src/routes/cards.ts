// ============================================================
//  Card Routes
// ============================================================
import { Router } from 'express';
import { readDb, writeDbSync, uid } from '../lib/db.js';
import { validate } from '../middleware/validate.js';
import { NotFoundError } from '../middleware/error.js';
import { createCardSchema, updateCardSchema } from '../lib/schemas.js';
import type { Card } from '../types/index.js';

export const cardRouter = Router();

/** GET /api/cards */
cardRouter.get('/', (_req, res) => {
    res.json(readDb().cards);
});

/** POST /api/cards */
cardRouter.post('/', validate(createCardSchema), (req, res) => {
    const body = req.body as Omit<Card, 'id' | 'comments' | 'createdAt'>;
    const db = readDb();
    const card: Card = {
        id: uid(),
        title: body.title,
        desc: body.desc ?? '',
        assignee: body.assignee ?? '',
        priority: body.priority ?? 'medium',
        col: body.col ?? 'todo',
        startDate: body.startDate ?? null,
        dueDate: body.dueDate ?? null,
        labels: body.labels ?? [],
        storyPoints: body.storyPoints ?? null,
        subtasks: body.subtasks ?? [],
        comments: [],
        epicId: body.epicId ?? null,
        sprintId: body.sprintId ?? null,
        createdAt: Date.now(),
    };
    db.cards.push(card);
    writeDbSync(db);
    res.status(201).json(card);
});

/** PUT /api/cards/:id */
cardRouter.put('/:id', validate(updateCardSchema), (req, res) => {
    const db = readDb();
    const idx = db.cards.findIndex(c => c.id === req.params.id);
    if (idx === -1) throw new NotFoundError('Card not found');

    const allowed: (keyof Card)[] = [
        'title', 'desc', 'assignee', 'priority', 'col',
        'startDate', 'dueDate', 'labels', 'storyPoints',
        'subtasks', 'comments', 'epicId', 'sprintId',
    ];
    for (const key of allowed) {
        if (req.body[key] !== undefined) {
            (db.cards[idx] as unknown as Record<string, unknown>)[key] = req.body[key];
        }
    }
    writeDbSync(db);
    res.json(db.cards[idx]);
});

/** DELETE /api/cards/:id */
cardRouter.delete('/:id', (req, res) => {
    const db = readDb();
    const before = db.cards.length;
    db.cards = db.cards.filter(c => c.id !== req.params.id);
    if (db.cards.length === before) throw new NotFoundError('Card not found');
    writeDbSync(db);
    res.json({ ok: true });
});
