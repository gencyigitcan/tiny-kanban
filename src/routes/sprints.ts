// ============================================================
//  Sprint Routes
// ============================================================
import { Router } from 'express';
import { readDb, writeDbSync, uid } from '../lib/db.js';
import { validate } from '../middleware/validate.js';
import { NotFoundError } from '../middleware/error.js';
import { createSprintSchema, updateSprintSchema } from '../lib/schemas.js';

export const sprintRouter = Router();

/** GET /api/sprints */
sprintRouter.get('/', (_req, res) => {
    res.json(readDb().sprints);
});

/** POST /api/sprints */
sprintRouter.post('/', validate(createSprintSchema), (req, res) => {
    const db = readDb();
    const sprint = {
        id: uid(),
        name: req.body.name as string,
        startDate: (req.body.startDate as string | undefined) ?? null,
        endDate: (req.body.endDate as string | undefined) ?? null,
        active: false,
        createdAt: Date.now(),
    };
    db.sprints.push(sprint);
    writeDbSync(db);
    res.status(201).json(sprint);
});

/** PUT /api/sprints/:id  — activating a sprint deactivates all others */
sprintRouter.put('/:id', validate(updateSprintSchema), (req, res) => {
    const db = readDb();
    const idx = db.sprints.findIndex(s => s.id === req.params.id);
    if (idx === -1) throw new NotFoundError('Sprint not found');

    if (req.body.active === true) {
        db.sprints.forEach(s => { s.active = false; });
    }

    const allowed = ['name', 'startDate', 'endDate', 'active'] as const;
    for (const key of allowed) {
        if (req.body[key] !== undefined) {
            (db.sprints[idx] as unknown as Record<string, unknown>)[key] = req.body[key];
        }
    }
    writeDbSync(db);
    res.json(db.sprints[idx]);
});

/** DELETE /api/sprints/:id  — also unlinks cards */
sprintRouter.delete('/:id', (req, res) => {
    const db = readDb();
    db.sprints = db.sprints.filter(s => s.id !== req.params.id);
    db.cards.forEach(c => { if (c.sprintId === req.params.id) c.sprintId = null; });
    writeDbSync(db);
    res.json({ ok: true });
});
