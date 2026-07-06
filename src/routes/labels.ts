// ============================================================
//  Labels Routes
// ============================================================
import { Router } from 'express';
import { readDb, writeDbSync, uid } from '../lib/db.js';
import { validate } from '../middleware/validate.js';
import { NotFoundError } from '../middleware/error.js';
import { createLabelSchema } from '../lib/schemas.js';

export const labelsRouter = Router();

/** GET /api/labels */
labelsRouter.get('/', (_req, res) => {
    res.json(readDb().labels || []);
});

/** POST /api/labels */
labelsRouter.post('/', validate(createLabelSchema), (req, res) => {
    const db = readDb();
    
    const name = (req.body.name as string).trim();
    const color = (req.body.color as string) || '#6366f1';
    
    // Generate soft background using color with 10% opacity alpha (hex 1a)
    const bg = color.startsWith('#') && color.length === 7 ? `${color}1a` : 'rgba(99,102,241,0.1)';

    // Verify if label already exists
    db.labels = db.labels || [];
    if (db.labels.some(l => l.name.toLowerCase() === name.toLowerCase())) {
        res.status(400).json({ error: 'Bu etiket zaten mevcut' });
        return;
    }

    const label = {
        id: 'lbl-' + uid(),
        name,
        color,
        bg,
        createdAt: Date.now(),
    };

    db.labels.push(label);
    writeDbSync(db);
    res.status(201).json(label);
});

/** DELETE /api/labels/:id — also unlinks from cards */
labelsRouter.delete('/:id', (req, res) => {
    const db = readDb();
    db.labels = db.labels || [];
    
    const labelToDelete = db.labels.find(l => l.id === req.params.id);
    if (!labelToDelete) {
        throw new NotFoundError('Label not found');
    }

    // Remove from labels table
    db.labels = db.labels.filter(l => l.id !== req.params.id);

    // Unlink from cards (remove matching label id/name from card.labels list)
    db.cards.forEach(c => {
        if (c.labels) {
            c.labels = c.labels.filter(l => l !== labelToDelete.id && l !== labelToDelete.name);
        }
    });

    writeDbSync(db);
    res.json({ ok: true });
});
