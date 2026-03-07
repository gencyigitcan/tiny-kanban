// ============================================================
//  Epic Routes
// ============================================================
import { Router } from 'express';
import { readDb, writeDbSync, uid } from '../lib/db.js';
import { validate } from '../middleware/validate.js';
import { NotFoundError } from '../middleware/error.js';
import { createEpicSchema, updateEpicSchema } from '../lib/schemas.js';

export const epicRouter = Router();

/** GET /api/epics */
epicRouter.get('/', (_req, res) => {
    res.json(readDb().epics);
});

/** POST /api/epics */
epicRouter.post('/', validate(createEpicSchema), (req, res) => {
    const db = readDb();
    const epic = {
        id: uid(),
        name: req.body.name as string,
        color: (req.body.color as string | undefined) ?? '#6366f1',
        createdAt: Date.now(),
    };
    db.epics.push(epic);
    writeDbSync(db);
    res.status(201).json(epic);
});

/** PUT /api/epics/:id */
epicRouter.put('/:id', validate(updateEpicSchema), (req, res) => {
    const db = readDb();
    const idx = db.epics.findIndex(e => e.id === req.params.id);
    if (idx === -1) throw new NotFoundError('Epic not found');

    if (req.body.name !== undefined) db.epics[idx].name = req.body.name;
    if (req.body.color !== undefined) db.epics[idx].color = req.body.color;
    writeDbSync(db);
    res.json(db.epics[idx]);
});

/** DELETE /api/epics/:id  — also unlinks cards */
epicRouter.delete('/:id', (req, res) => {
    const db = readDb();
    db.epics = db.epics.filter(e => e.id !== req.params.id);
    db.cards.forEach(c => { if (c.epicId === req.params.id) c.epicId = null; });
    writeDbSync(db);
    res.json({ ok: true });
});
